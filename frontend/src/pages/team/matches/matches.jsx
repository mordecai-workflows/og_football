import React, { useState, useEffect } from "react";
import styles from './matches.module.css';
import Sidebar from '../components/Sidebar';

export default function Matches() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState({ date: "", opponent: "", result: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [matches, setMatches] = useState([
    { date: "Apr 20, 2024", opponent: "FC Dynamo", result: "2 – 1" },
    { date: "Apr 14, 2024", opponent: "United SC", result: "2 – 1" },
    { date: "Apr 8, 2024", opponent: "Riverside FC", result: "L 1" },
    { date: "Mar 30, 2024", opponent: "Northside FC", result: "4 – 0" },
  ]);
  const [roster, setRoster] = useState([]);

  useEffect(() => {
    // Fetch player data from the roster page (mocked here as an example)
    fetch('/api/roster') // Replace with the actual API endpoint for the roster
      .then((response) => response.json())
      .then((data) => setRoster(data))
      .catch((error) => console.error("Error fetching roster:", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(matches[index]);
    setIsPopupVisible(true);
  };

  const handleDelete = (index) => {
    setMatches(matches.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const updatedMatches = [...matches];
    if (editIndex !== null) {
      updatedMatches[editIndex] = formData;
    } else {
      updatedMatches.push(formData);
    }
    setMatches(updatedMatches);
    setFormData({ date: "", opponent: "", result: "" });
    setEditIndex(null);
    setIsPopupVisible(false);
  };

  return (
    <div className={styles.matchesPage}>
      <div className={styles.sidebarWrapper}>
        <Sidebar active="matches" />
      </div>      
      <div className={styles.contentWrapper}>
        <div className={styles.matchesContainer}>
          <h1>Match History & Performance</h1>

          <div className={styles.matchSummary}>
            <h2>Match Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Opponent</th>
                  <th>Result</th>
                  <th>
                    <button
                      className={styles.editIcon}
                      onClick={() => {
                        setFormData({ date: "", opponent: "", result: "" });
                        setEditIndex(null);
                        setIsPopupVisible(true);
                      }}
                    >
                      ➕
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, index) => (
                  <tr key={index}>
                    <td>{match.date}</td>
                    <td>{match.opponent}</td>
                    <td >{match.result}</td>
                    <td>
                      <button onClick={() => handleEdit(index)}>✏️</button>
                      <button className={styles.deleteButton} onClick={() => handleDelete(index)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {isPopupVisible && (
              <div className={styles.popup}>
                <div className={styles.popupContent}>
                  <h3>{editIndex !== null ? "Edit Match" : "Add Match"}</h3>
                  <label>
                    Date:
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Opponent:
                    <input
                      type="text"
                      name="opponent"
                      value={formData.opponent}
                      onChange={handleInputChange}
                    />
                  </label>
                  <label>
                    Result:
                    <input
                      type="text"
                      name="result"
                      value={formData.result}
                      onChange={handleInputChange}
                    />
                  </label>
                  <div className={styles.popupButtons}>
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={() => setIsPopupVisible(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.playerSummary}>
            <h2>Player Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Rating</th>
                  <th>Goals</th>
                  <th>Assists</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((player, index) => (
                  <tr key={index}>
                    <td>{player.name}</td>
                    <td>{player.rating}</td>
                    <td>{player.goals}</td>
                    <td>{player.assists}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}