import { useQuery } from "@tanstack/react-query";
import { fetchPokemons } from "../services/pokemonApi";
import { CaughtPokemon } from "../types/pokemon";

function Progress({ caughtPokemons }: { caughtPokemons: CaughtPokemon[] }) {
    const { data: pokemonList, isLoading: isListLoading } = useQuery(
        {
          queryKey: ['pokemonList'],
          queryFn: () => fetchPokemons(0),
        }
    );

    if (isListLoading) return <p>Loading Pokémons...</p>;

    const totalNumberOfPokemons = pokemonList?.count || 0;

    return (
        <section className="flex justify-center items-center" aria-label="Progress tracker">
            <p className="text-gray-600 text-lg mb-4" role="status">
                <b>{caughtPokemons.length}</b> Pokemons caught out of <b>{totalNumberOfPokemons}</b> in total
            </p>
        </section>
    );
}

export default Progress;