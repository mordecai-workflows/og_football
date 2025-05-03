import React, { useState, useEffect } from "react";
import styles from "./search.module.css"; // Ensure CSS is imported as a module
import Sidebar from "../components/Sidebar";

const PlayerSearch = () => {
  const [age, setAge] = useState(18);
  const [endorsements, setEndorsements] = useState(0);
  const [videoViews, setVideoViews] = useState(0);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/api/scout/players");
        const data = await response.json();
        setPlayers(data.players); // Assuming the API returns a `players` array
      } catch (error) {
        console.error("Error fetching players:", error);
        setPlayers([]);
      }
    };

    fetchPlayers();
  }, []);

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
          <button className={styles.filterButton}>Apply</button>
        </div>

        <div className={styles.playerList}>
          <h1>Players</h1>
          {players.length > 0 ? (
            players.map((player, index) => (
              <div key={index} className={styles.playerTile}>
                <span className={styles.playerName}>{player.name}</span>
                <span className={styles.playerPosition}>{player.position}</span>
                <button className={styles.endorseButton}>Endorse</button>
              </div>
            ))
          ) : (
            <p>No players found.</p>
          )}
        </div>

        <div className={styles.additionalTiles}>
          <h2>Additional Info</h2>
          <div className={styles.infoTile}>
            <span className={styles.infoTitle}>Top Scorer</span>
            <p>John Doe</p>
          </div>
          <div className={styles.infoTile}>
            <span className={styles.infoTitle}>Most Endorsed</span>
            <p>Jane Smith</p>
          </div>
          <div className={styles.infoTile}>
            <span className={styles.infoTitle}>Best Goalkeeper</span>
            <p>Chris Johnson</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayerSearch;
