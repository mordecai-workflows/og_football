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
        <h1>Player Search</h1>
        <div className={styles.filters}>
          <label>Age Range: {age}</label>
          <input
            type="range"
            min="18"
            max="30"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />

          <label>Position:</label>
          <select>
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
        </div>

        <div className={styles.playerList}>
          <h2>Players</h2>
          <div className={styles.playerItem}>
            <span>Jacob Hall - Midfielder</span>
            <button>Endorse</button>
          </div>
          <div className={styles.playerItem}>
            <span>Sam King - Forward</span>
            <button>Endorse</button>
          </div>
          <div className={styles.playerItem}>
            <span>Liam Robert - Goalkeeper</span>
            <button>Endorse</button>
          </div>
          <div className={styles.playerItem}>
            <span>Nathan Baker - Forward</span>
            <button>Endorse</button>
          </div>
          <div className={styles.playerItem}>
            <span>Alex Hughes - Midfielder</span>
            <button>Endorse</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlayerSearch;
