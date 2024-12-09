import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import PokemonDetail from '../../components/PokemonDetail';

const mockPokemon = {
    name: 'pikachu',
    id: 25,
    height: 4,
    weight: 60,
    abilities: [{ ability: { name: 'static' } }],
    types: [
        { type: { name: 'electric' } },
        { type: { name: 'normal' } }
    ],
    sprites: {
        front_default: 'https://example.com/pikachu.png'
    },
    stats: [
        { base_stat: 35, stat: { name: 'hp' } },
        { base_stat: 55, stat: { name: 'attack' } },
    ]
};

describe('PokemonDetail', () => {
    it('renders pokemon name correctly', () => {
        render(<PokemonDetail pokemon={mockPokemon} />);
        expect(screen.getByRole('heading', { name: /pikachu/i })).toBeInTheDocument();
    });

    it('renders pokemon sprite with correct alt text', () => {
        render(<PokemonDetail pokemon={mockPokemon} />);
        const image = screen.getByRole('img');
        expect(image).toHaveAttribute('src', 'https://example.com/pikachu.png');
        expect(image).toHaveAttribute('alt', 'pikachu sprite');
    });

    it('displays correct stats', () => {
        render(<PokemonDetail pokemon={mockPokemon} />);

        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('60')).toBeInTheDocument();

        expect(screen.getByText('35')).toBeInTheDocument();
        expect(screen.getByText('55')).toBeInTheDocument();
    });


    it('has correct accessibility attributes', () => {
        render(<PokemonDetail pokemon={mockPokemon} />);

        expect(screen.getByRole('article')).toHaveAttribute('aria-labelledby', 'pokemon-name');
        expect(screen.getByLabelText(/pokemon stats/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/pokemon types/i)).toBeInTheDocument();
    });
});