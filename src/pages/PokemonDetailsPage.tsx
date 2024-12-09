import { useParams, useNavigate } from "react-router-dom";
import { fetchPokemonDetails } from "../services/pokemonApi";
import { useQuery } from "@tanstack/react-query";
import PokemonDetail from "../components/PokemonDetail";
import { CaughtPokemon } from "../types/pokemon";
import useIsPokemonCaught from "../hooks/useIsPokemonCaught";
import { localStorageUtil } from "../utils/localStorageUtil";
import ToggleCatch from "../components/ToggleCatch";

function PokemonDetailsPage({ caughtPokemons, setCaughtPokemons }:
    { caughtPokemons: CaughtPokemon[], setCaughtPokemons: React.Dispatch<React.SetStateAction<CaughtPokemon[]>> }) {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: pokemonDetails, isLoading, isError, error } = useQuery({
        queryKey: ["pokemonDetail", id],
        queryFn: () => fetchPokemonDetails(id!),
        enabled: !!id
    });


    if (isLoading) return <p>Loading Pokémon #{id}...</p>;

    if (isError) return <p>Error loading Pokémon details: {error?.message}. Please try again later.</p>;

    if (!pokemonDetails) return null;

    const toggleCatch = (pokemonName: string) => {
        const caughtPokemon = caughtPokemons.find(p => p.name === pokemonName);
        let newCaughtPokemons: CaughtPokemon[] = [];

        if (caughtPokemon) {
            newCaughtPokemons = caughtPokemons.filter(p => p.name !== pokemonName);
        } else {
            if (!pokemonDetails) return;
            newCaughtPokemons = [...caughtPokemons, { ...pokemonDetails, date: new Date() }];
        }

        setCaughtPokemons(newCaughtPokemons);
        if (localStorageUtil.isAvailable()) {
            localStorageUtil.removeItem('caughtPokemons');
            localStorageUtil.setItem('caughtPokemons', JSON.stringify(newCaughtPokemons));
        }
    };

    const caughtPokemon = useIsPokemonCaught(caughtPokemons, pokemonDetails.name);

    return (
        <main className="pokemon-details-container">
            <button
                onClick={() => navigate(-1)}
                className="back-button"
                aria-label="Back"
            >
                Back
            </button>
            <div className="flex justify-center items-center">
                <ToggleCatch
                    caughtPokemon={caughtPokemon}
                    pokemonName={pokemonDetails.name}
                    toggleCatch={toggleCatch}
                />
            </div>
            <PokemonDetail pokemon={pokemonDetails} />
        </main>
    );
}

export default PokemonDetailsPage;
