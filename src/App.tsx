import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PokemonList from "./pages/PokemonListPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import PokemonDetailsPage from "./pages/PokemonDetailsPage";
import { useState } from "react";
import Pokedex from "./pages/PokedexPage";
import Navigation from "./components/Navigation";
import { CaughtPokemon } from "./types/pokemon";
import { localStorageUtil } from "./utils/localStorageUtil";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 60 * 1000,
    },
  },
});

function App() {
  const [caughtPokemons, setCaughtPokemons] = useState<CaughtPokemon[]>(() => {
    const loadedCaughtPokemons = localStorageUtil.isAvailable()
      ? localStorageUtil.getItem('caughtPokemons')
      : '[]';
    return loadedCaughtPokemons ? JSON.parse(loadedCaughtPokemons) : [];
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<PokemonList caughtPokemons={caughtPokemons}
            setCaughtPokemons={setCaughtPokemons} />} />
          <Route path="/pokedex" element={<Pokedex caughtPokemons={caughtPokemons}
            setCaughtPokemons={setCaughtPokemons} />} />
          <Route path="/pokemon/:id" element={<PokemonDetailsPage
            caughtPokemons={caughtPokemons} setCaughtPokemons={setCaughtPokemons} />} />
        </Routes>
        <ReactQueryDevtools initialIsOpen={false} />
      </Router>
    </QueryClientProvider>

  );
}

export default App;
