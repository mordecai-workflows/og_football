import React, { useState, useEffect } from "react";
import styles from "./stats.module.css";
import Sidebar from '../components/Sidebar';

export default function Stats() {
  const [formData, setFormData] = useState({
    match: "",
    minutesPlayed: "",
    goals: "",
    assists: "",
    rating: "",
  });

  const [statHistory, setStatHistory] = useState([
    { match: "Match 5", minutes: 85, goals: 1, assists: 1, cards: 0, rating: "7.5" },
    { match: "Match 4", minutes: 90, goals: 0, assists: 2, cards: 0, rating: "8.0" },
  ]);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    // Fetch roster data (mocked here as an example)
    fetch('/api/roster') // Replace with the actual API endpoint
      .then((response) => response.json())
      .then((data) => setRoster(data))
      .catch((error) => console.error("Error fetching roster:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlayerSelect = (player) => {
    setFormData({
      match: "",
      minutesPlayed: player.minutesPlayed || "",
      goals: player.goals || "",
      assists: player.assists || "",
      rating: player.rating || "",
    });
    setIsPopupVisible(false);
  };

  const handleSave = () => {
    setStatHistory([
      ...statHistory,
      {
        match: formData.match,
        minutes: formData.minutesPlayed,
        goals: formData.goals,
        assists: formData.assists,
        cards: 0,
        rating: formData.rating,
      },
    ]);
    setFormData({ match: "", minutesPlayed: "", goals: "", assists: "", rating: "" });
  };

  const handleCancel = () => {
    setFormData({ match: "", minutesPlayed: "", goals: "", assists: "", rating: "" });
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebarWrapper}>
        <Sidebar active="stats" />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>Player Statistics Entry</h1>
        <button
          className={styles.editPlayerButton}
          onClick={() => setIsPopupVisible(true)}
        >
          Edit Player
        </button>
        {isPopupVisible && (
          <div className={styles.popup}>
            <div className={styles.popupContent}>
              <h3>Select a Player</h3>
              <ul className={styles.playerList}>
                {roster.map((player, index) => (
                  <li
                    key={index}
                    className={styles.playerItem}
                    onClick={() => handlePlayerSelect(player)}
                  >
                    {player.name}
                  </li>
                ))}
              </ul>
              <button
                className={styles.cancelButton}
                onClick={() => setIsPopupVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
        <div className={styles.formWrapper}>
          <div className={styles.form}>
            <label className={styles.label}>
              Match
              <select
                name="match"
                value={formData.match}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="">Select match</option>
                <option value="Match 5">Match 5</option>
                <option value="Match 4">Match 4</option>
              </select>
            </label>
            <label className={styles.label}>
              Minutes Played
              <input
                type="number"
                name="minutesPlayed"
                value={formData.minutesPlayed}
                onChange={handleInputChange}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Goals
              <input
                type="number"
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Assists
              <input
                type="number"
                name="assists"
                value={formData.assists}
                onChange={handleInputChange}
                className={styles.input}
              />
            </label>
            <label className={styles.label}>
              Rating
              <input
                type="text"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className={styles.input}
              />
            </label>
            <div className={styles.buttonGroup}>
              <button onClick={handleSave} className={styles.saveButton}>
                Save
              </button>
              <button onClick={handleCancel} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
        <h2 className={styles.subtitle}>Stat History</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Match</th>
              <th>Minutes</th>
              <th>Goals</th>
              <th>Assists</th>
              <th>Cards</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {statHistory.map((stat, index) => (
              <tr key={index}>
                <td>{stat.match}</td>
                <td>{stat.minutes}</td>
                <td>{stat.goals}</td>
                <td>{stat.assists}</td>
                <td>{stat.cards}</td>
                <td>{stat.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}