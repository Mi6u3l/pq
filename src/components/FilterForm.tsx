import React, { useReducer } from 'react';
import { FilterState, PokemonType } from '../types/pokemon';
import { fetchPokemonTypes } from '../services/pokemonApi';
import { useQuery } from '@tanstack/react-query';

const initialState: FilterState = {
    name: '',
    height: '',
    types: '',
    sortBy: 'name',
};

type FilterAction =
    | { type: 'SET_NAME'; payload: string }
    | { type: 'SET_HEIGHT'; payload: string }
    | { type: 'SET_TYPES'; payload: string }
    | { type: 'SET_SORT'; payload: 'name' | 'height' | 'types' | 'timestamp' }
    | { type: 'RESET'; payload: undefined };

function filterReducer(state: FilterState, action: FilterAction): FilterState {
    switch (action.type) {
        case 'SET_NAME':
            return { ...state, name: action.payload };
        case 'SET_HEIGHT':
            return { ...state, height: action.payload };
        case 'SET_TYPES':
            return { ...state, types: action.payload };
        case 'SET_SORT':
            return { ...state, sortBy: action.payload };
        case 'RESET':
            return initialState;
        default: {
            throw new Error(`Unhandled action type`);
        }
    }
}

const FilterForm: React.FC<{ applyFilters: (state: FilterState) => void }>
    = ({ applyFilters }) => {
        const { data, isLoading, error } = useQuery({ queryKey: ["pokemonTypes"], queryFn: fetchPokemonTypes });
        const [state, dispatch] = useReducer(filterReducer, initialState);
        const { name, height, types, sortBy } = state;

        if (isLoading) return <div>Loading...</div>;
        if (error) return <div>Error: {error.message}</div>;

        return (
            <div className="mb-4 p-4 bg-white rounded-lg shadow-md" role="region" aria-labelledby="filter-heading">
                <form
                    className="space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        applyFilters(state);
                    }}
                    aria-label="Pokemon filter and sort form"
                >
                    <fieldset>
                        <legend id="filter-heading" className="text-lg font-semibold mb-4">Filter Pokemon</legend>

                        <div className="space-y-4">
                            <div className="flex flex-col" role="group" aria-labelledby="name-label">
                                <label id="name-label" htmlFor="name" className="mb-1 text-sm font-medium text-gray-700">
                                    Pokemon Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={name}
                                    onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
                                    aria-invalid={false}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="height" className="mb-1 text-sm font-medium text-gray-700">
                                    Pokemon Height
                                </label>
                                <input
                                    id="height"
                                    type="number"
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={height}
                                    onChange={(e) => dispatch({ type: 'SET_HEIGHT', payload: e.target.value })}
                                    min="0"
                                    step="1"
                                />
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="types" className="mb-1 text-sm font-medium text-gray-700">
                                    Pokemon Types
                                </label>
                                <select
                                    id="types"
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={types}
                                    onChange={(e) => dispatch({ type: 'SET_TYPES', payload: e.target.value })}
                                >
                                    <option value="">All</option>
                                    {data?.results?.sort((a, b) => a.name.localeCompare(b.name)).map((type: PokemonType) => (
                                        <option key={type.name} value={type.name}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex flex-col">
                                <label htmlFor="sort" className="mb-1 text-sm font-medium text-gray-700">
                                    Sort Pokemon By
                                </label>
                                <select
                                    id="sort"
                                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={sortBy}
                                    onChange={(e) => dispatch({
                                        type: 'SET_SORT',
                                        payload: e.target.value as 'name' | 'height' | 'types' | 'timestamp'
                                    })}
                                >
                                    <option value="name">Name</option>
                                    <option value="height">Height</option>
                                    <option value="timestamp">Timestamp</option>
                                </select>
                            </div>
                        </div>
                    </fieldset>

                    <div className="flex space-x-4 mt-6">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Apply filters"
                        >
                            Apply
                        </button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            aria-label="Reset all filters"
                            onClick={() => {
                                dispatch({ type: 'RESET', payload: undefined });
                                applyFilters(initialState);
                            }}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        );
    };

export default FilterForm;