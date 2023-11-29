import Row from "react-bootstrap/esm/Row";
import { useEffect, useState } from "react";
import axios from "axios";
import { PokemonItem } from "../components/PokemonItem";

export const Pokemon = () => {
  const [pokemon, setPokemon] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState(0);
  const [captured, setCaptured] = useState(false);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  // Function to get all Pokemon
  const getAllPokemon = async () => {
    try {
      let response = await axios.get("http://127.0.0.1:8000/api/v1/pokemon/");
      setPokemon(response.data);
    } catch (err) {
      console.error("Error fetching Pokémon:", err);
      alert("Something went wrong while fetching Pokémon");
    }
  };

  // Function to delete a Pokemon
  const deleteAPokemon = async (pokemonId) => {
    try {
      let response = await axios.delete(`http://127.0.0.1:8000/api/v1/pokemon/${pokemonId}`);
      if (response.status === 204) {
        getAllPokemon();  // Refresh the list of Pokemon
      }
    } catch (err) {
      console.error("Error deleting Pokémon:", err);
      alert("Could not delete Pokémon");
    }
  };

  // Function to create a new Pokemon
  const createAPokemon = async (e) => {
    e.preventDefault();
    let data = {
      name,
      level,
      description,
      captured,
      type,
    };

    try {
      let response = await axios.post("http://127.0.0.1:8000/api/v1/pokemon/", data);
      if (response.status === 201) {
        getAllPokemon();  // Refresh the list of Pokemon
      }
    } catch (err) {
      console.error("Error creating Pokémon:", err);
      alert("Could not create Pokémon");
    }
  };

  useEffect(() => {
    getAllPokemon();
  }, []);

  return (
    <Row style={{ padding: "0 10vmin" }}>
      <h1 style={{ textAlign: "center" }}>Pokemon</h1>

      {/* Form to create a new Pokemon */}
      <form onSubmit={createAPokemon}>
        <h2>Create a Pokemon</h2>
        <input type="text" placeholder="Pokemon Name" onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Pokemon Type" onChange={(e) => setType(e.target.value)} />
        <input type="number" placeholder="Pokemon Level" onChange={(e) => setLevel(e.target.value)} />
        <textarea placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
        <label>
          Captured
          <input type="checkbox" onChange={(e) => setCaptured(e.target.checked)} />
        </label>
        <input type="submit" value="Create" />
      </form>

      {/* List of Pokemon */}
      <ul>
        {pokemon.map((poke) => (
          <PokemonItem key={poke.id} pokemon={poke} deletePokemon={deleteAPokemon} />
        ))}
      </ul>
    </Row>
  );
};
