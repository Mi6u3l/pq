
interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  types: { type: { name: string } }[];
  sprites: { front_default: string };
}

interface CaughtPokemon extends PokemonDetails {
  date: Date;
  note?: string;
}

interface PokemonResult {
  name: string;
  url: string;
}

interface PokemonResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonResult[];
}

interface PokemonTypeResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonType[];
}

interface PokemonType {
  name: string;
}

interface FilterState {
  name: string;
  height: string;
  types: string;
  sortBy: 'name' | 'height' | 'types' | 'timestamp';
}

export type {
  PokemonDetails,
  CaughtPokemon, 
  PokemonResponse, 
  PokemonResult, 
  PokemonTypeResponse, 
  PokemonType, 
  FilterState
};
