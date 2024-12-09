import { CaughtPokemon } from "../types/pokemon";

function useIsPokemonCaught(caughtPokemons: CaughtPokemon[], pokemonName: string) {
    const existingPokemon = caughtPokemons.find(pokemon => pokemon.name === pokemonName);
    return existingPokemon;
}

export default useIsPokemonCaught;