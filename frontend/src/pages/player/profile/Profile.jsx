import { useEffect, useState } from "react";
import styles from "./ProfilePage.module.css";
import Spinner from "../../../components/spinner/Spinner";
import profilesvg from "../../../assets/profile.svg";
import Sidebar from "../components/Sidebar";

const API_URL = import.meta.env.VITE_API_URL;

export default function PlayerProfilePage() {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlayer, setEditedPlayer] = useState({});

  // Format date helper
  const formatDate = (isoDate) =>
    isoDate ? new Date(isoDate).toLocaleDateString("en-GB") : "";

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_URL}/api/player`, {
          credentials: "include", // include cookies if needed
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch profile: ${res.statusText}`);
        }
        const data = await res.json();
        setPlayer(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedPlayer(player); // Initialize editedPlayer with current player data
  };

  const handleInputChange = (field, value) => {
    setEditedPlayer({ ...editedPlayer, [field]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/player`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editedPlayer),
      });
      if (!res.ok) {
        throw new Error(`Failed to save profile: ${res.statusText}`);
      }
      const updatedPlayer = await res.json();
      setPlayer(updatedPlayer);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar active="profile" />
      {loading ? (
        <div className={styles.loading}>
          <Spinner />
          <br />
          Loading profile...
        </div>
      ) : error ? (
        <div className={styles.error}>Error loading profile: {error}</div>
      ) : (
        <div className={styles.main}>
          <h1 className={styles.title}>
            {player.first_name} {player.last_name}
          </h1>

          <div className={styles.avatarContainer}>
            <img
              src={player.profile_picture || profilesvg}
              alt={`${player.first_name} ${player.last_name} avatar`}
              className={styles.avatar}
            />
          </div>

          <div className={styles.profileCard}>
            <div className={styles.infoGrid}>
              <div>
                <span className={styles.label}>Email:</span>
                {isEditing ? (
                  <input
                    type="email"
                    className={styles.editInput}
                    value={editedPlayer.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  <span>{player.email}</span>
                )}
              </div>
              <div>
                <span className={styles.label}>User Type:</span>
                <span>{player.user_type}</span>
              </div>
              <div>
                <span className={styles.label}>Date of Birth:</span>
                <span>{formatDate(player.yob)}</span>
              </div>
              <div>
                <span className={styles.label}>Height:</span>
                {isEditing ? (
                  <input
                    type="number"
                    className={styles.editInput}
                    value={editedPlayer.height}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                  />
                ) : (
                  <span>{player.height} cm</span>
                )}
              </div>
              <div>
                <span className={styles.label}>Weight:</span>
                {isEditing ? (
                  <input
                    type="number"
                    className={styles.editInput}
                    value={editedPlayer.weight}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                  />
                ) : (
                  <span>{player.weight} kg</span>
                )}
              </div>
              <div>
                <span className={styles.label}>Preferred Foot:</span>
                <span style={{ textTransform: "capitalize" }}>
                  {player.preferred_foot}
                </span>
              </div>
              <div>
                <span className={styles.label}>Position:</span>
                <span>{player.position}</span>
              </div>
              <div>
                <span className={styles.label}>Club Team:</span>
                <span>{player.club_team}</span>
              </div>
              <div>
                <span className={styles.label}>County:</span>
                {isEditing ? (
                  <select
                    className={styles.editInput}
                    value={editedPlayer.county}
                    onChange={(e) => handleInputChange("county", e.target.value)}
                  >
                    <option value="">Select county</option>
                    <option value="Mom">Mombasa</option>
                    <option value="Kwa">Kwale</option>
                    <option value="Kil">Kilifi</option>
                    <option value="Trv">Tana River</option>
                    <option value="Lamu">Lamu</option>
                    <option value="Ttv">Taita-Taveta</option>
                    <option value="Gar">Garissa</option>
                    <option value="Wjr">Wajir</option>
                    <option value="Man">Mandera</option>
                    <option value="Mar">Marsabit</option>
                    <option value="Isi">Isiolo</option>
                    <option value="Mru">Meru</option>
                    <option value="Thr">Tharaka-Nithi</option>
                    <option value="Emb">Embu</option>
                    <option value="Kit">Kitui</option>
                    <option value="Mch">Machakos</option>
                    <option value="Mak">Makueni</option>
                    <option value="Nyn">Nyandarua</option>
                    <option value="Nyr">Nyeri</option>
                    <option value="Kir">Kirinyaga</option>
                    <option value="Mur">Murang'a</option>
                    <option value="Kia">Kiambu</option>
                    <option value="Tur">Turkana</option>
                    <option value="Pkt">West Pokot</option>
                    <option value="Sbr">Samburu</option>
                    <option value="Trn">Trans Nzoia</option>
                    <option value="Uas">Uasin Gishu</option>
                    <option value="Ema">Elgeyo-Marakwet</option>
                    <option value="Nan">Nandi</option>
                    <option value="Bar">Baringo</option>
                    <option value="Lai">Laikipia</option>
                    <option value="Nkr">Nakuru</option>
                    <option value="Nar">Narok</option>
                    <option value="Kaj">Kajiado</option>
                    <option value="Ker">Kericho</option>
                    <option value="Bom">Bomet</option>
                    <option value="Kak">Kakamega</option>
                    <option value="Vih">Vihiga</option>
                    <option value="Bun">Bungoma</option>
                    <option value="Bus">Busia</option>
                    <option value="Sia">Siaya</option>
                    <option value="Ksu">Kisumu</option>
                    <option value="Hba">Hom Bay</option>
                    <option value="Mig">Migori</option>
                    <option value="Ksi">Kisii</option>
                    <option value="Nym">Nyamira</option>
                    <option value="Nrb">Nairobi</option>
                  </select>
                ) : (
                  <span>{player.county}</span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            {isEditing ? (
              <>
                <button className={styles.saveButton} onClick={handleSave}>
                  Save
                </button>
                <button className={styles.cancelButton} onClick={handleEditToggle}>
                  Cancel
                </button>
              </>
            ) : (
              <button className={styles.editButton} onClick={handleEditToggle}>
                Edit
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
