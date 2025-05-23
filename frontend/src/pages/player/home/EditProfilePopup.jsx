import { useState, useEffect } from "react";
import styles from "./EditProfilePopup.module.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function EditProfilePopup({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    yob: "",
    height: "",
    weight: "",
    preferred_foot: "",
    position: "",
    club_team: "",
    county: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch current player info
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch(`${API_URL}/api/player`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          yob: data.yob || "",
          height: data.height || "",
          weight: data.weight || "",
          preferred_foot: data.preferred_foot || "",
          position: data.position || "",
          club_team: data.club_team || "",
          county: data.county || "",
        });
        setError("");
      })
      .catch(() => setError("Failed to load profile"))
      .finally(() => setLoading(false));
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/edit`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={e => e.stopPropagation()}>
        <div className={styles.popupHeader}>
          <span className={styles.popupTitle}>Edit Profile</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className={styles.formSection}>
          {loading ? (
            <div style={{ textAlign: "center", width: "100%" }}>Loading...</div>
          ) : (
            <>
              {error && <div className={styles.error}>{error}</div>}
             
<form onSubmit={handleSubmit} className={styles.form}>
  <label>
    First Name
    <input
      name="first_name"
      value={form.first_name}
      onChange={handleChange}
      required
      placeholder={"Claire" || ""}
    />
  </label>
  <label>
    Last Name
    <input
      name="last_name"
      value={form.last_name}
      onChange={handleChange}
      required
      placeholder={form.last_name || ""}
    />
  </label>
  <label>
    Email
    <input
      name="email"
      value={form.email}
      onChange={handleChange}
      type="email"
      required
      placeholder={form.email || ""}
    />
  </label>
  <label>
    Date of Birth
    <input
      name="yob"
      value={form.yob}
      onChange={handleChange}
      type="date"
      required
      placeholder={form.yob || ""}
    />
  </label>
  <label>
    Height
    <input
      name="height"
      value={form.height}
      onChange={handleChange}
      placeholder={form.height || ""}
    />
  </label>
  <label>
    Weight
    <input
      name="weight"
      value={form.weight}
      onChange={handleChange}
      placeholder={form.weight || ""}
    />
  </label>
  <label>
    Preferred Foot
    <input
      name="preferred_foot"
      value={form.preferred_foot}
      onChange={handleChange}
      placeholder={form.preferred_foot || ""}
    />
  </label>
  <label>
    Position
    <input
      name="position"
      value={form.position}
      onChange={handleChange}
      placeholder={form.position || ""}
    />
  </label>
  <label>
    Club Team
    <input
      name="club_team"
      value={form.club_team}
      onChange={handleChange}
      placeholder={form.club_team || ""}
    />
  </label>
  <label>
    County
    <input
      name="county"
      value={form.county}
      onChange={handleChange}
      placeholder={form.county || ""}
    />
  </label>
  <div className={styles.buttonRow}>
    <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
    <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save"}</button>
  </div>
</form>

            </>
          )}
        </div>
      </div>
    </div>
  );
}


