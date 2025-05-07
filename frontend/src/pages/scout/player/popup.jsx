import React from "react";
import styles from "./popup.module.css";

function ShortlistPopup({
  shortlists, // Array of [id, name]
  selected, // { id: string, name: string }
  setSelected, // setter for selected
  onAdd, // callback when “Add” is clicked
  onCancel, // callback when “Cancel” is clicked
}) {
  const handleChange = (e) => {
    const selectedId = e.target.value;
    const selectedName =
      shortlists.find(([id]) => id === selectedId)?.[1] ?? "";
    setSelected({ id: selectedId, name: selectedName });
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Select Shortlist</h2>
        <label htmlFor="shortlist-select">
          Shortlist:
          <select
            id="shortlist-select"
            value={selected.id}
            onChange={handleChange}
          >
            <option value="" disabled>
              — Please select —
            </option>
            {shortlists.map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.buttons}>
          <button type="button" onClick={onAdd} disabled={!selected.id}>
            Add
          </button>
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ShortlistPopup;
