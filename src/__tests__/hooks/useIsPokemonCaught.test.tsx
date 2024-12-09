import { renderHook } from '@testing-library/react';
import useIsPokemonCaught from '../../hooks/useIsPokemonCaught';
import { CaughtPokemon } from '../../types/pokemon';

describe('useIsPokemonCaught', () => {
  const mockCaughtPokemons: CaughtPokemon[] = [
    {
      name: 'pikachu',
      date: new Date(),
      id: 25,
      height: 4,
      weight: 60,
      abilities: [],
      stats: [],
      types: [],
      sprites: { front_default: '' }
    },
    {
      name: 'charmander',
      date: new Date(),
      id: 4,
      height: 6,
      weight: 85,
      abilities: [],
      stats: [],
      types: [],
      sprites: { front_default: '' }
    }
  ];

  it('should return the pokemon if it exists in caught list', () => {
    const { result } = renderHook(() =>
      useIsPokemonCaught(mockCaughtPokemons, 'pikachu')
    );

    expect(result.current).toBeTruthy();
    expect(result.current?.name).toBe('pikachu');
  });

  it('should return undefined if pokemon is not in caught list', () => {
    const { result } = renderHook(() =>
      useIsPokemonCaught(mockCaughtPokemons, 'bulbasaur')
    );

    expect(result.current).toBeUndefined();
  });
}); 