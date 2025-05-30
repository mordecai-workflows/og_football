import { useState, useEffect } from "react";
import styles from "./matches.module.css";
import Sidebar from "../components/Sidebar";

const API_URL = import.meta.env.VITE_API_URL;

export default function Matches() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    matchDate: "",
    awayTeamId: "",
    homeTeamScore: "",
    awayTeamScore: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [matches, setMatches] = useState([]);
  const [roster, setRoster] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [teams, setTeams] = useState([]);
  const [selected, setSelected] = useState({ id: "", name: "" });

  useEffect(() => {
    fetchMatches();
    fetchOpponents();
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
      const res = await fetch(`${API_URL}/api/stats/team/summary`, {
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

  const fetchOpponents = async () => {
    try {
      const res = await fetch(`${API_URL}/api/team/opponents`, {
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

    const match = matches[index];
    console.log(match);
    setFormData({
      matchDate: match.matchDate.split("T")[0], // format to yyyy-mm-dd if needed
      awayTeamId: match.awayTeamId,
      homeTeamScore: match.homeTeamScore,
      awayTeamScore: match.awayTeamScore,
    });

    setSelected({ id: match.awayTeam.id, name: match.awayTeam.name }); // sync selected opponent dropdown
    setIsPopupVisible(true);
  };

  const handleDelete = async (index) => {
    const match = matches[index];

    if (!window.confirm(`Delete match against ${match.awayTeam.name}?`)) return;

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/match/delete/${match.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Failed to delete match: ${res.statusText}`);

      setMatches(matches.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting match:", err);
      setError("Failed to delete match");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const { matchDate, awayTeamId, homeTeamScore, awayTeamScore } = formData;
    console.log(formData);

    if (
      !matchDate ||
      !awayTeamId ||
      isNaN(homeTeamScore) ||
      isNaN(awayTeamScore)
    ) {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      setLoading(true);

      const matchData = { matchDate, awayTeamId, homeTeamScore, awayTeamScore };
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

      // Reset form
      setFormData({
        matchDate: "",
        awayTeamId: "",
        homeTeamScore: "",
        awayTeamScore: "",
      });
      setEditIndex(null);
      setIsPopupVisible(false);
    } catch (err) {
      console.error("Error saving match:", err);
      setError(`Failed to ${editIndex !== null ? "update" : "add"} match`);
    } finally {
      setLoading(false);
      fetchMatches();
    }
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setFormData({
      matchDate: "",
      awayTeamId: "",
      homeTeamScore: "",
      awayTeamScore: "",
    });
    setEditIndex(null);
    setError(null);
  };

  const handleChange = (e) => {
    const selectedId = parseInt(e.target.value);
    const selectedTeam = teams.find((team) => team.id === selectedId);
    if (selectedTeam) {
      setSelected({ id: selectedTeam.id, name: selectedTeam.name });
      setFormData((prev) => ({ ...prev, awayTeamId: selectedTeam.id })); // store id or name here consistently
    }
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
                          awayTeamId: "",
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
                    <tr key={match.id}>
                      <td>{new Date(match.matchDate).toLocaleDateString()}</td>
                      <td>
                        {match.awayTeam?.name ||
                          teams.find((t) => t.id === match.awayTeamId)?.name ||
                          "Unknown Opponent"}
                      </td>

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
                      <select
                        name="awayTeamId"
                        value={selected.id}
                        onChange={handleChange}
                      >
                        <option value="" disabled>
                          — Please select —
                        </option>
                        {teams.map((team) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
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
                      <td>{player.averageRating || "N/A"}</td>
                      <td>{player.totalGoals || 0}</td>
                      <td>{player.totalAssists || 0}</td>
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
