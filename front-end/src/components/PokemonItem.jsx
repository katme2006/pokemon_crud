import { useState, useEffect } from "react";
import axios from 'axios';

export const PokemonItem = ({ pokemon }) => {
    const [nounProjectIcon, setNounProjectIcon] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [newType, setNewType] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [captured, setCaptured] = useState(pokemon.captured);
    const [levelUp, setLevelUp] = useState(false);

    // Fetch icon based on Pokemon type
    const getIcon = async () => {
        try {
            let response = await axios.get(`http://127.0.0.1:8000/api/v1/noun/${pokemon.type}/`);
            if (response.data && response.data.thumbnails && response.data.thumbnails.length > 0) {
                setNounProjectIcon(response.data.thumbnails[0]);
            } else {
                console.log('No thumbnails found in response:', response.data);
            }
        } catch (err) {
            console.error('Error fetching icon:', err);
            alert("Problems getting Icon");
        }
    };

    useEffect(() => {
        getIcon();
    }, [pokemon.type]); // Re-fetch icon if Pokemon type changes

    // Update Pokemon details
    const updatePokemon = async (e) => {
        e.preventDefault();
        let data = {
            type: newType || pokemon.type,
            captured: captured,
            level_up: levelUp,
            description: newDescription || pokemon.description,
        };

        try {
            let response = await axios.put(`http://127.0.0.1:8000/api/v1/pokemon/${pokemon.id}/`, data);
            if (response.status === 204) {
                window.location.reload(); // Reload the page to reflect changes
            }
        } catch (err) {
            alert("couldn't update pokemon");
            console.error(err);
        }
    };

    return (
        <li style={{ margin: "3vmin", display: "flex", flexDirection: "column" }}>
            Name: {pokemon.name}
            <br /> Level: {pokemon.level}
            {nounProjectIcon && (
                <img style={{ height: "5vmin", width: "5vmin" }} src={nounProjectIcon} alt="Icon" />
            )}
            <ul>
                Moves
                {pokemon.moves.map((move, idx) => (
                    <li key={`${pokemon.id}-${idx}`}>{move}</li>
                ))}
            </ul>
            {showForm ? (
                <form onSubmit={updatePokemon}>
                    <input
                        type="text"
                        placeholder={pokemon.type}
                        onChange={(e) => setNewType(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder={pokemon.description}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={captured}
                            onChange={(e) => setCaptured(e.target.checked)}
                        />
                        Caught
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={levelUp}
                            onChange={(e) => setLevelUp(e.target.checked)}
                        />
                        Level Up
                    </label>
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                    <input type="submit" value="Submit" />
                </form>
            ) : (
                <button onClick={() => setShowForm(true)}>Edit Pokémon</button>
            )}
        </li>
    );
};
