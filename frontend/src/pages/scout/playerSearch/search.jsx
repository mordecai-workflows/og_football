import React, { useState } from 'react';
import './search.module.css';
import Sidebar from '../components/Sidebar';

const PlayerSearch = () => {
  const [age, setAge] = useState(18);
  const [endorsements, setEndorsements] = useState(0);
  const [videoViews, setVideoViews] = useState(0);

  return (
    <div className="player-search-container">
        <div className="player-search-container">
        <aside className="sidebar">
            <Sidebar active="search" />
        </aside>
        <main className="search-content">
            <h1>Player Search</h1>
            <div className="filters">
            <label>Age Range: {age}</label>
            <input type="range" min="18" max="30" value={age} onChange={(e) => setAge(e.target.value)} />

            <label>Position:</label>
            <select>
                <option value="midfielder">Midfielder</option>
                <option value="forward">Forward</option>
                <option value="goalkeeper">Goalkeeper</option>
            </select>

            <label>Club:</label>
            <input type="text" placeholder="Enter club name" />

            <label>Endorsements: {endorsements}</label>
            <input type="range" min="0" max="100" value={endorsements} onChange={(e) => setEndorsements(e.target.value)} />

            <label>Video Views: {videoViews}</label>
            <input type="range" min="0" max="100000" value={videoViews} onChange={(e) => setVideoViews(e.target.value)} />
            </div>

            <div className="player-list">
            <h2>Players</h2>
            <div className="player-item">
                <span>Jacob Hall - Midfielder</span>
                <button>Endorse</button>
            </div>
            <div className="player-item">
                <span>Sam King - Forward</span>
                <button>Endorse</button>
            </div>
            <div className="player-item">
                <span>Liam Robert - Goalkeeper</span>
                <button>Endorse</button>
            </div>
            <div className="player-item">
                <span>Nathan Baker - Forward</span>
                <button>Endorse</button>
            </div>
            <div className="player-item">
                <span>Alex Hughes - Midfielder</span>
                <button>Endorse</button>
            </div>
            </div>
        </main>
        </div>
    </div>
  );
};

export default PlayerSearch;
