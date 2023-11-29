import { useState, useEffect } from "react"
import axios from 'axios'

export const PokemonItem = ({pokemon}) => {
    const [nounProjectIcon, setNounProjectIcon] = useState(null)
    
    const getIcon = async () => {
      try {
          let response = await axios.get(`http://127.0.0.1:8000/api/v1/noun/${pokemon.type}/`);
          if (response.data && response.data.thumbnails && response.data.thumbnails.length > 0) {
              // Set the first thumbnail URL from the thumbnails array
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
}, [pokemon.type]); // Add pokemon.type to the dependency array

    return (
        <li
            style={{
              margin: "3vmin",
              display: "flex",
              flexDirection: "column",
            }}
          >
            Name: {pokemon.name} 
            <br /> Level: {pokemon.level}
            <ul>
            {nounProjectIcon ? <img style={{height:"5vmin", width:"5vmin"}} src={nounProjectIcon} alt="Icon"/> : null}

              Moves
              {pokemon.moves.map((move, idx) => (
                <li key={`${pokemon.id}${idx}`}>{move}</li>
              ))}
            </ul>
          </li>
    )
}