import styles from "./createPopup.module.css";

const CreateShortlistPopup = ({ shortlist, setShortlist, onAdd, onCancel }) => {
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Create New Shortlist</h2>
        <label>
          Name:
          <input
            type="text"
            value={shortlist.name}
            onChange={(e) =>
              setShortlist({ ...shortlist, name: e.target.value })
            }
            placeholder="Enter shortlist name"
          />
        </label>
        <div className={styles.popupButtons}>
          <button onClick={onAdd}>Add</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CreateShortlistPopup;
