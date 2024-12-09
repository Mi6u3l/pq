import { useState, useEffect } from "react";
import PokemonDetail from "../components/PokemonDetail";
import ShareModal from "../components/ShareModal";
import { CaughtPokemon, FilterState } from "../types/pokemon";
import FilterForm from "../components/FilterForm";
import { localStorageUtil } from "../utils/localStorageUtil";
import useDebounce from "../hooks/useDebounce";
import Progress from "../components/Progress";

function Pokedex({ caughtPokemons, setCaughtPokemons }:
  {
    caughtPokemons: CaughtPokemon[],
    setCaughtPokemons: React.Dispatch<React.SetStateAction<CaughtPokemon[]>>,
  }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSharePokemon, setSelectedSharePokemon] = useState<string>('');
  const [selectedPokemons, setSelectedPokemons] = useState<string[]>([]);
  const [note, setNote] = useState<string>('');
  const [filteredState, setFilteredState] = useState<FilterState>();
  const debouncedNote = useDebounce(note, 500);

  // Filtering the caught pokemons based on the filter state - derived state
  let filteredCaughtPokemons: CaughtPokemon[] = [...caughtPokemons].sort((a, b) => a.name.localeCompare(b.name));

  if (filteredState?.name) {
    filteredCaughtPokemons = filteredCaughtPokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(filteredState.name.toLowerCase())
    );
  }
  if (filteredState?.height) {
    filteredCaughtPokemons = filteredCaughtPokemons.filter((pokemon) => pokemon.height.toString() === filteredState.height.toString());
  }
  if (filteredState?.types) {
    filteredCaughtPokemons = filteredCaughtPokemons.filter((pokemon) =>
      pokemon.types.some((type) => type.type.name?.toLowerCase().includes(filteredState.types.toLowerCase()))
    );
  }

  filteredCaughtPokemons.sort((a, b) => {
    if (filteredState?.sortBy === 'name') return a.name.localeCompare(b.name);
    if (filteredState?.sortBy === 'height') return Number(a.height) - Number(b.height);
    if (filteredState?.sortBy === 'timestamp') return new Date(a.date).getTime() - new Date(b.date).getTime();
    return 0;
  });


  const removeMultiplePokemons = () => {
    const newCaughtPokemons = caughtPokemons.filter((pokemon) => !selectedPokemons.includes(pokemon.name));
    setCaughtPokemons(newCaughtPokemons);
    if (localStorageUtil.isAvailable()) {
      localStorageUtil.setItem('caughtPokemons', JSON.stringify(newCaughtPokemons));
    }
    setSelectedPokemons([]);
  };

  const removePokemon = (name: string) => {
    const newCaughtPokemons = caughtPokemons.filter((pokemon) => pokemon.name !== name);
    setCaughtPokemons(newCaughtPokemons);
    if (localStorageUtil.isAvailable()) {
      localStorageUtil.setItem('caughtPokemons', JSON.stringify(newCaughtPokemons));
    }
  };

  const toggleSelectPokemon = (name: string) => {
    setSelectedPokemons((prevSelectedPokemons) =>
      prevSelectedPokemons.includes(name)
        ? prevSelectedPokemons.filter((pokemonName) => pokemonName !== name)
        : [...prevSelectedPokemons, name]
    );
  };

  const openModal = (pokemonName: string) => {
    setSelectedSharePokemon(pokemonName);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSharePokemon('');
  };


  const updateNote = (name: string, note: string) => {
    setNote(note);
    setCaughtPokemons((prevCaughtPokemons: CaughtPokemon[]) =>
      prevCaughtPokemons.map((pokemon: CaughtPokemon) =>
        pokemon.name === name ? { ...pokemon, note } : pokemon
      )
    );
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Date Caught', 'Notes'];
    const csvData = filteredCaughtPokemons.map(pokemon => [
      pokemon.name,
      new Date(pokemon.date).toLocaleString(),
      pokemon.note || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'my-filtered-pokedex.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (debouncedNote && localStorageUtil.isAvailable()) {
      localStorageUtil.setItem('caughtPokemons', JSON.stringify(caughtPokemons));
    }
  }, [debouncedNote]);

  const pokemonList = () => (
    <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="list">
      {filteredCaughtPokemons.map((pokemon) => (
        <li
          key={pokemon.name}
          className="bg-white rounded-lg shadow-md p-4 flex flex-col space-y-2 items-center"
        >
          <article aria-label={`${pokemon.name} details`}>
            <header className="flex mb-4 items-start justify-between">
              <PokemonDetail pokemon={pokemon} />
              <input
                type="checkbox"
                checked={selectedPokemons.includes(pokemon.name)}
                onChange={() => toggleSelectPokemon(pokemon.name)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                aria-label={`Select ${pokemon.name}`}
              />
            </header>

            <div className="flex flex-col space-y-2 items-center justify-between mb-4">
              <textarea
                name="note"
                id="note"
                onChange={(e) => updateNote(pokemon.name, e.target.value)}
                className="w-full h-24 border border-gray-300 rounded-md p-2"
                placeholder="Notes about this Pokemon"
                value={pokemon.note}
                aria-label={`Notes for ${pokemon.name}`}
              ></textarea>
              <time
                dateTime={new Date(pokemon.date).toISOString()}
                className="block text-sm text-gray-500 mt-1"
              >
                Caught on {new Date(pokemon.date).toLocaleDateString() + " at " + new Date(pokemon.date).toLocaleTimeString()}
              </time>
              <button
                className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 transition-colors"
                onClick={() => openModal(pokemon.name)}
                aria-label={`Share ${pokemon.name}`}
              >
                Share Pokemon
              </button>
              <button
                className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
                onClick={() => removePokemon(pokemon.name)}
                aria-label={`Release ${pokemon.name}`}
              >
                Release
              </button>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );

  return (
    <main className="h-100 bg-gray-100 p-4">
      <section>
        <FilterForm applyFilters={setFilteredState} />
        <button
          className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors ml-4"
          onClick={exportToCSV}
          aria-label="Export to CSV"
        >
          Export to CSV
        </button>
      </section>

      <Progress caughtPokemons={caughtPokemons} />

      <section aria-label="Pokemon list">
        {filteredCaughtPokemons.length === 0 ? (
          <p className="text-center text-gray-600 my-8" role="status">
            No Pokemóns found, try a different filter
          </p>
        ) : pokemonList()}

        <div className="flex justify-center mt-5">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
            disabled={selectedPokemons.length === 0}
            onClick={removeMultiplePokemons}
            aria-label="Release all selected Pokemon"
          >
            Release all selected
          </button>
        </div>
      </section>

      <ShareModal
        isOpen={isModalOpen}
        onClose={closeModal}
        pokemonName={selectedSharePokemon}
      />
    </main>
  );
}

export default Pokedex;