import { CaughtPokemon } from "../types/pokemon";

function ToggleCatch({ caughtPokemon, pokemonName, toggleCatch }:
    { caughtPokemon: CaughtPokemon | undefined, pokemonName: string, toggleCatch: (pokemonName: string) => void }) {
    return <button
        onClick={() => toggleCatch(pokemonName)}
        className={`px-4 py-1 rounded-full text-sm font-medium ${caughtPokemon
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-green-500 hover:bg-green-600 text-white"
            }`}
        aria-label={caughtPokemon ? "Release" : "Catch"}
        data-testid={`toggle-catch-button-${pokemonName}-${caughtPokemon ? "release" : "catch"}`}
    >
        {caughtPokemon ? "Release" : "Catch"}
    </button>
}

export default ToggleCatch;