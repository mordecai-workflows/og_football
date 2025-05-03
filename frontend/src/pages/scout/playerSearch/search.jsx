import React, { useState, useEffect } from "react";
import styles from "./search.module.css"; // Ensure CSS is imported as a module
import Sidebar from "../components/Sidebar";

const API_URL = import.meta.env.VITE_API_URL;

const PlayerSearch = () => {
  const [age, setAge] = useState(15);
  const [endorsements, setEndorsements] = useState(0);
  const [videoViews, setVideoViews] = useState(0);
  const [player, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch(`${API_URL}/api/scout/players`);
        const data = await response.json();
        console.log("Initial API Response:", data); // Log the API response for debugging
        setPlayers(data.player || []); // Ensure players is set to an array even if undefined
      } catch (error) {
        console.error("Error fetching players:", error);
        setPlayers([]);
      }
    };

    fetchPlayers();
  }, []);

  const applyFilters = async () => {
    setIsLoading(true);
    const position = document.querySelector("select").value;
    const club_team = document.querySelector("input[type='text']").value.toLowerCase();

    try {
      const response = await fetch(
        `${API_URL}/api/scout/players?age=${age}&position=${position}&club=${club_team}&endorsements=${endorsements}&videoViews=${videoViews}`
      );
      const data = await response.json();
      console.log("API Response:", data); // Log the API response for debugging

      const filteredPlayers = data.player.filter(
        (player) =>
          player.endorsements <= endorsements &&
          player.videoViews <= videoViews &&
          player.club_team.toLowerCase().includes(club_team) // Ensure `club_team` matches the API response
      );
      setPlayers(filteredPlayers);
    } catch (error) {
      console.error("Error fetching filtered players:", error);
      setPlayers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.playerSearchContainer}>
      <Sidebar active="search" />
      <main className={styles.searchContent}>
        
        <div className={styles.filters}>
          <h2 className={styles.filterHeader}>Search</h2>
          <label>Age Range: {age}</label>
          
          <input
            type="range"
            min="15"
            max="30"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <label>Position:</label>
          <select>
            <option>select position</option>
            <option value="defender">Defender</option>
            <option value="midfielder">Midfielder</option>
            <option value="forward">Forward</option>
            <option value="goalkeeper">Goalkeeper</option>
          </select>

          <label>Club:</label>
          <input type="text" placeholder="Enter club name" />

          <label>Endorsements: {endorsements}</label>
          <input
            type="range"
            min="0"
            max="100"
            value={endorsements}
            onChange={(e) => setEndorsements(e.target.value)}
          />

          <label>Video Views: {videoViews}</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={videoViews}
            onChange={(e) => setVideoViews(e.target.value)}
          />
          <button className={styles.filterButton} onClick={applyFilters} disabled={isLoading}>
            {isLoading ? "Loading..." : "Apply"}
          </button>
        </div>

        <div className={styles.playerList}>
          <h1>Players</h1>
          {player.length > 0 ? (
            <div className={styles.playerGrid}>
              {player.map((player, index) => (
                <div key={index} className={styles.playerTile}>
                  <span className={styles.playerName}>
                    {player.first_name} {player.last_name}
                  </span>
                  <span className={styles.playerPosition}>{player.position}</span>
                  <button className={styles.endorseButton}>Endorse</button>
                </div>
              ))}
            </div>
          ) : (
            <p>No players found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default PlayerSearch;
