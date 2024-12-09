import axios from "axios";
import { PokemonDetails, PokemonResponse, PokemonTypeResponse } from "../types/pokemon";


export const fetchPokemonDetails = async (id: string): Promise<PokemonDetails> => {
    const response = await axios.get<PokemonDetails>(`https://pokeapi.co/api/v2/pokemon/${id}`);
    return response.data;
};

export const fetchPokemonTypes = async (): Promise<PokemonTypeResponse> => {
  const response = await axios.get<PokemonTypeResponse>('https://pokeapi.co/api/v2/type');
  return response.data;
};


export const fetchPokemons = async (page: number): Promise<PokemonResponse> => {
    const limit = 20;
    const offset = (page - 1) * limit;
    const response = await axios.get<PokemonResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    return response.data;
  };

