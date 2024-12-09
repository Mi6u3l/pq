import { useQueries, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { fetchPokemonDetails, fetchPokemons } from "../services/pokemonApi";
import { CaughtPokemon, PokemonResponse, PokemonResult } from "../types/pokemon";
import { localStorageUtil } from "../utils/localStorageUtil";
import useIsPokemonCaught from "../hooks/useIsPokemonCaught";
import ToggleCatch from "../components/ToggleCatch";

const usePokemonDetails = (pokemonList: PokemonResponse | undefined) => {
  return useQueries({
    queries: pokemonList?.results?.map((pokemon: PokemonResult) => ({
      queryKey: ['pokemonDetail', pokemon.name],
      queryFn: () => fetchPokemonDetails(pokemon.name),
      enabled: !!pokemonList,
    })) || []
  });
};

function PokemonList({ setCaughtPokemons, caughtPokemons }:
  {
    setCaughtPokemons: React.Dispatch<React.SetStateAction<CaughtPokemon[]>>,
    caughtPokemons: CaughtPokemon[],
  }) {
  const [page, setPage] = useState<number>(1);

  const { data: pokemonList, isLoading: isListLoading, isFetching } = useQuery(
    {
      queryKey: ['pokemonList', page],
      queryFn: () => fetchPokemons(page),
    }
  );

  const pokemonDetailsQueries = usePokemonDetails(pokemonList);

  const isDetailsLoading = pokemonDetailsQueries.some((query) => query.isLoading);

  const toggleCatch = (pokemonName: string) => {
    const caughtPokemon = caughtPokemons.find(pokemon => pokemon.name === pokemonName);
    let newCaughtPokemons: CaughtPokemon[] = [];

    if (caughtPokemon) {
      newCaughtPokemons = caughtPokemons.filter(pokemon => pokemon.name !== pokemonName);
    } else {
      const pokemonDetails = pokemonDetailsQueries.find((query) => query.data?.name === pokemonName)?.data;
      if (!pokemonDetails) return;
      newCaughtPokemons = [...caughtPokemons, { ...pokemonDetails, date: new Date() }];
    }

    setCaughtPokemons(newCaughtPokemons);
    if (localStorageUtil.isAvailable()) {
      localStorageUtil.removeItem('caughtPokemons');
      localStorageUtil.setItem('caughtPokemons', JSON.stringify(newCaughtPokemons));
    }
  };

  const getPokemonImage = (pokemonName: string) =>
    pokemonDetailsQueries.find((query) => query.data?.name === pokemonName)?.data?.sprites.front_default;

  if (isListLoading) return <p>Loading Pokémons...</p>;
  if (isDetailsLoading) return <p>Loading Pokémons details...</p>;

  return (
    <main className="h-100 bg-gray-100 p-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Pokémon List</h1>
      </header>

      <div className="max-w-7xl mx-auto px-4 h-[calc(100%-theme(spacing.8))]">
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" role="list">
          {pokemonList?.results.map((pokemon) => {
            const caughtPokemon = useIsPokemonCaught(caughtPokemons, pokemon.name);
            return (
              <li key={pokemon.name} className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                <Link
                  to={`/pokemon/${pokemon.name}`}
                  className="flex flex-col items-center w-full h-full"
                  aria-label={`View ${pokemon.name} details`}
                >
                  <img
                    src={getPokemonImage(pokemon.name)}
                    alt={`${pokemon.name} sprite`}
                    className="w-24 h-24 object-contain"
                  />
                  <span className="text-blue-600 hover:text-blue-800 font-medium capitalize mb-2">
                    {pokemon.name}
                  </span>
                </Link>
                <ToggleCatch
                  caughtPokemon={caughtPokemon}
                  pokemonName={pokemon.name}
                  toggleCatch={toggleCatch}
                />
              </li>
            );
          })}
        </ul>

        <nav aria-label="Pagination" className="flex justify-center items-center gap-4 mt-8 mb-4">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1 || isFetching}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
            aria-label="Go to previous page"
          >
            Previous
          </button>
          <span className="text-gray-700 font-medium" aria-current="page">Page {page}</span>
          <button
            onClick={() => setPage((old) => (pokemonList?.next ? old + 1 : old))}
            disabled={!pokemonList?.next || isFetching}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600"
            aria-label="Go to next page"
          >
            Next
          </button>
        </nav>
      </div>
    </main>
  );
}

export default PokemonList;