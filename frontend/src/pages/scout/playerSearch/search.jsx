import React, { useState } from "react";
import styles from "./search.module.css"; // Ensure CSS is imported as a module
import Sidebar from "../components/Sidebar";

const PlayerSearch = () => {
  const [age, setAge] = useState(18);
  const [endorsements, setEndorsements] = useState(0);
  const [videoViews, setVideoViews] = useState(0);

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
          <div className={styles.playerTile}>
            <span className={styles.playerName}>Jacob Hall</span>
            <span className={styles.playerPosition}>Midfielder</span>
            <button className={styles.endorseButton}>Endorse</button>
          </div>
          <div className={styles.playerTile}>
            <span className={styles.playerName}>Sam King</span>
            <span className={styles.playerPosition}>Forward</span>
            <button className={styles.endorseButton}>Endorse</button>
          </div>
          <div className={styles.playerTile}>
            <span className={styles.playerName}>Liam Robert</span>
            <span className={styles.playerPosition}>Goalkeeper</span>
            <button className={styles.endorseButton}>Endorse</button>
          </div>
          <div className={styles.playerTile}>
            <span className={styles.playerName}>Nathan Baker</span>
            <span className={styles.playerPosition}>Forward</span>
            <button className={styles.endorseButton}>Endorse</button>
          </div>
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
