import React, { useState, useEffect } from "react";
import axios from "axios";
import PokemonCard from "./PokemonCard/PokemonCard";
import SearchBox from "./SearchBox/SearchBox";
import "./App.css";

const App = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const [searchField, setSearchField] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20");
        const data = response.data.results;

        const pokemonWithImages = await Promise.all(
          data.map(async (pokemon) => {
            const details = await axios.get(pokemon.url);
            return {
              name: pokemon.name,
              id: details.data.id,
              image: details.data.sprites.front_default,
            };
          })
        );

        setPokemonData(pokemonWithImages);
        setFilteredPokemon(pokemonWithImages);
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchField === "") {
      setFilteredPokemon(pokemonData);
    } else {
      setFilteredPokemon(
        pokemonData.filter((pokemon) =>
          pokemon.name.toLowerCase().includes(searchField.toLowerCase())
        )
      );
    }
  }, [searchField, pokemonData]);

  return (
    <div className="App">
      <h1>Pokémon Search</h1>
      <SearchBox placeholder="Search Pokémon" handleChange={(e) => setSearchField(e.target.value)} />
      <div className="card-container">
        {filteredPokemon.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default App;
