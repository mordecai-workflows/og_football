import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Roster.module.css';
import Sidebar from '../components/Sidebar';

const players = [
  { name: 'Jacob Hall', position: 'Forward', number: 19 },
  { name: 'Ryan Clark', position: 'Midfielder', number: 15 },
  { name: 'Ethan Scott', position: 'Defender', number: 4 },
  { name: 'Luke Wright', position: 'Goalkeeper', number: 1 },
  { name: 'Owen Martinez', position: 'Midfielder', number: 23 },
  { name: 'Caleb Green', position: 'Forward', number: 11 },
];

const Roster = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [roster, setRoster] = useState(players);

  const handleAddPlayerClick = () => {
    // Mock data for demonstration; replace with API call if needed
    const mockPlayers = [
      { name: 'James Brown', position: 'Forward' },
      { name: 'Michael Lee', position: 'Defender' },
      { name: 'Chris Evans', position: 'Midfielder' },
    ];
    setAvailablePlayers(mockPlayers);
    setShowPopup(true);
  };

  const handleRemovePlayerClick = () => {
    setShowRemovePopup(true);
  };

  const handleAddToRoster = (player) => {
    setRoster((prevRoster) => [...prevRoster, { ...player, number: 'N/A' }]);
  };

  const handleRemoveFromRoster = (player) => {
    if (window.confirm("Are you sure you want to remove this player from the team?")) {
      setRoster((prevRoster) => prevRoster.filter((p) => p.name !== player.name));
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar active="roster" />
      <div className={styles.main}>
        <button className={styles.addPlayer} onClick={handleAddPlayerClick}>Add Player</button>
        <button className={styles.removePlayer} onClick={handleRemovePlayerClick}>Remove Player</button>
        {showPopup && (
          <div className={styles.popup}>
            <div 
              className={styles.popupContent} 
              style={{ maxHeight: '400px', width: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', boxSizing: 'border-box' }}
            >
              <h2>Available Players</h2>
              <ul>
                {availablePlayers.map((player, index) => (
                  <li key={index} className={styles.popupPlayer}>
                    {player.name} - {player.position}
                    <button 
                      className={styles.addButton} 
                      onClick={() => handleAddToRoster(player)}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
              <button className={styles.addButton} onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
        {showRemovePopup && (
          <div className={styles.popup}>
            <div 
              className={styles.popupContent} 
              style={{ maxHeight: '400px', width: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', boxSizing: 'border-box' }}
            >
              <h2>Roster Players</h2>
              <ul>
                {roster.map((player, index) => (
                  <li key={index} className={styles.popupPlayer}>
                    {player.name} - {player.position}
                    <button 
                      className={styles.removeButton} 
                      onClick={() => handleRemoveFromRoster(player)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button onClick={() => setShowRemovePopup(false)}>Close</button>
            </div>
          </div>
        )}
        <div className={styles.roster}>
          {roster.map((player, index) => (
            <Link to={`/stats/${player.name}`} key={index} className={styles.playerCard}>
              <div className={styles.profilePic}></div>
              <div className={styles.playerInfo}>
                <p className={styles.playerName}>{player.name}</p>
                <p className={styles.playerPosition}>{player.position}</p>
                <hr />
                <p className={styles.playerNumber}>{player.number}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roster;
