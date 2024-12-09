import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import PokemonList from '../../pages/PokemonListPage';
import { fetchPokemons, fetchPokemonDetails } from '../../services/pokemonApi';
import { CaughtPokemon } from '../../types/pokemon';

jest.mock('../../services/pokemonApi');
jest.mock('../../utils/localStorageUtil', () => ({
    localStorageUtil: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        isAvailable: jest.fn(),
    }
}));

const mockPokemonList = {
    results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' }
    ],
    next: 'https://pokeapi.co/api/v2/pokemon?offset=20',
    previous: null
};

const mockPokemonDetails = {
    name: 'bulbasaur',
    sprites: {
        front_default: 'bulbasaur.png'
    }
};

const setupComponent = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

    const mockSetCaughtPokemons = jest.fn();
    const mockCaughtPokemons: CaughtPokemon[] = [];

    const utils = render(
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <PokemonList
                    setCaughtPokemons={mockSetCaughtPokemons}
                    caughtPokemons={mockCaughtPokemons}
                />
            </BrowserRouter>
        </QueryClientProvider>
    );

    return {
        ...utils,
        mockSetCaughtPokemons,  
    };
};

describe('PokemonList', () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (fetchPokemons as jest.Mock).mockResolvedValue(mockPokemonList);
        (fetchPokemonDetails as jest.Mock).mockResolvedValue(mockPokemonDetails);
    });

    it('renders loading state initially', () => {
        setupComponent();
        expect(screen.getByText('Loading Pokémons...')).toBeInTheDocument();
    });

    it('renders pokemon list after loading', async () => {
        setupComponent();

        await waitFor(() => {
            expect(screen.getByText('bulbasaur')).toBeInTheDocument();
            expect(screen.getByText('charmander')).toBeInTheDocument();
        });
    });

    it('handles pagination correctly', async () => {
        setupComponent();

        await waitFor(() => {
            expect(screen.getByText('Page 1')).toBeInTheDocument();
        });

        const nextButton = screen.getByLabelText('Go to next page');
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(screen.getByText('Page 2')).toBeInTheDocument();
            expect(fetchPokemons).toHaveBeenCalledWith(2);
        });
    });

    it('handles catching pokemon', async () => {
        const { mockSetCaughtPokemons } = setupComponent();

        await waitFor(() => {
            expect(screen.getByTestId('toggle-catch-button-bulbasaur-catch')).toBeInTheDocument();
        });

        const catchButton = screen.getByTestId('toggle-catch-button-bulbasaur-catch');
        fireEvent.click(catchButton);

        await waitFor(() => {
            expect(mockSetCaughtPokemons).toHaveBeenCalled();
        });
    });

    it('disables previous button on first page', async () => {
        setupComponent();

        await waitFor(() => {
            const prevButton = screen.getByLabelText('Go to previous page');
            expect(prevButton).toBeDisabled();
        });
    });
});