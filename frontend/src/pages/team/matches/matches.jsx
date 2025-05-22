import { useState, useEffect } from "react";
import styles from "./matches.module.css";
import Sidebar from "../components/Sidebar";

const API_URL = import.meta.env.VITE_API_URL;

export default function Matches() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    matchDate: "",
    opponent: "",
    homeTeamScore: "",
    awayTeamScore: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [matches, setMatches] = useState([]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    fetchMatches();
    fetchRoster();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch(`${API_URL}/api/match/all`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok)
        throw new Error(`Failed to fetch matches: ${res.statusText}`);

      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Error fetching matches:", err);
      setError("Failed to load matches");
    }
  };

  const fetchRoster = async () => {
    try {
      const res = await fetch(`${API_URL}/api/players/stats`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Failed to fetch roster: ${res.statusText}`);

      const data = await res.json();
      setRoster(data);
    } catch (err) {
      console.error("Error fetching roster:", err);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${API_URL}/api/teams`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Failed to fetch teams: ${res.statusText}`);

      const data = await res.json();
      setTeams(data);
    } catch (err) {
      console.error("Error fetching teams:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "homeTeamScore" || name === "awayTeamScore"
          ? parseInt(value) || 0
          : value,
    });
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(matches[index]);
    setIsPopupVisible(true);
  };

  const handleDelete = async (index) => {
    const match = matches[index];

    if (!window.confirm(`Delete match against ${match.opponent}?`)) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/match/delete/${match.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Failed to delete match: ${res.statusText}`);

      setMatches(matches.filter((_, i) => i !== index));
      fetchRoster(); // Refresh player stats
    } catch (err) {
      console.error("Error deleting match:", err);
      setError("Failed to delete match");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const { matchDate, opponent, homeTeamScore, awayTeamScore } = formData;

    if (
      !matchDate ||
      !opponent ||
      isNaN(homeTeamScore) ||
      isNaN(awayTeamScore)
    ) {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      setLoading(true);

      const matchData = { matchDate, opponent, homeTeamScore, awayTeamScore };
      const isEdit = editIndex !== null;
      const url = isEdit
        ? `${API_URL}/api/match/edit/${matches[editIndex].id}`
        : `${API_URL}/api/match/add`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(matchData),
      });

      if (!res.ok)
        throw new Error(
          `Failed to ${isEdit ? "update" : "create"} match: ${res.statusText}`
        );

      const savedMatch = await res.json();

      if (isEdit) {
        const updatedMatches = [...matches];
        updatedMatches[editIndex] = savedMatch;
        setMatches(updatedMatches);
      } else {
        setMatches([savedMatch, ...matches]);
      }

      // Reset form
      setFormData({
        matchDate: "",
        opponent: "",
        homeTeamScore: "",
        awayTeamScore: "",
      });
      setEditIndex(null);
      setIsPopupVisible(false);
      fetchRoster(); // Refresh player stats
    } catch (err) {
      console.error("Error saving match:", err);
      setError(`Failed to ${editIndex !== null ? "update" : "add"} match`);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setFormData({
      matchDate: "",
      opponent: "",
      homeTeamScore: "",
      awayTeamScore: "",
    });
    setEditIndex(null);
    setError(null);
  };

  return (
    <div className={styles.matchesPage}>
      <div className={styles.sidebarWrapper}>
        <Sidebar active="matches" />
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.matchesContainer}>
          <h1>Match History & Performance</h1>

          {error && (
            <div className={styles.error}>
              {error}
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}

          <div className={styles.matchSummary}>
            <h2>Match Summary</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Opponent</th>
                  <th>Home Score</th>
                  <th>Away Score</th>
                  <th>
                    <button
                      className={styles.addButton}
                      onClick={() => {
                        setFormData({
                          matchDate: "",
                          opponent: "",
                          homeTeamScore: "",
                          awayTeamScore: "",
                        });
                        setEditIndex(null);
                        setIsPopupVisible(true);
                      }}
                      disabled={loading}
                    >
                      ➕
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {matches.length > 0 ? (
                  matches.map((match, index) => (
                    <tr
                      key={match.id || `${match.matchDate}-${match.opponent}`}
                    >
                      <td>{new Date(match.matchDate).toLocaleDateString()}</td>
                      <td>{match.opponent}</td>
                      <td>{match.homeTeamScore}</td>
                      <td>{match.awayTeamScore}</td>
                      <td className={styles.actions}>
                        <button
                          onClick={() => handleEdit(index)}
                          disabled={loading}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(index)}
                          disabled={loading}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.empty}>
                      No matches found. Add your first match!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {isPopupVisible && (
              <div className={styles.popup} onClick={closePopup}>
                <div
                  className={styles.popupContent}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className={styles.popupHeader}>
                    <h3>{editIndex !== null ? "Edit Match" : "Add Match"}</h3>
                    <button onClick={closePopup}>×</button>
                  </div>

                  <div className={styles.popupBody}>
                    <label>
                      Date:
                      <input
                        type="date"
                        name="matchDate"
                        value={formData.matchDate}
                        onChange={handleInputChange}
                        required
                      />
                    </label>

                    <label>
                      Opponent:
                      <input
                        type="text"
                        name="opponent"
                        value={formData.opponent}
                        onChange={handleInputChange}
                        placeholder="Enter opponent name"
                        required
                      />
                    </label>

                    <label>
                      Home Score:
                      <input
                        type="number"
                        name="homeTeamScore"
                        value={formData.homeTeamScore}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </label>

                    <label>
                      Away Score:
                      <input
                        type="number"
                        name="awayTeamScore"
                        value={formData.awayTeamScore}
                        onChange={handleInputChange}
                        min="0"
                        required
                      />
                    </label>
                  </div>

                  <div className={styles.popupButtons}>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={styles.submitButton}
                    >
                      {loading
                        ? "Saving..."
                        : editIndex !== null
                        ? "Update"
                        : "Add"}
                    </button>
                    <button onClick={closePopup} disabled={loading}>
                      Cancel
                    </button>
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
                {roster.length > 0 ? (
                  roster.map((player, index) => (
                    <tr key={player.id || index}>
                      <td>{player.name}</td>
                      <td>{player.rating || "N/A"}</td>
                      <td>{player.goals || 0}</td>
                      <td>{player.assists || 0}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className={styles.empty}>
                      No player statistics available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
