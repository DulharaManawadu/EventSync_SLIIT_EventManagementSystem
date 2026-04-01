import { useState, useEffect } from "react";
import { createVenue, updateVenue } from "../../services/venueService";

const VenueForm = ({ refresh, close, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    venueType: "",
    capacity: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔥 PREFILL DATA (EDIT MODE)
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        venueType: initialData.venueType || "",
        capacity: initialData.capacity || "",
        location: initialData.location || ""
      });
    }
  }, [initialData]);

  const validate = () => {
    let err = {};

    if (!form.name.trim() || form.name.length < 3)
      err.name = "Minimum 3 characters required";

    if (!form.venueType)
      err.venueType = "Please select a venue type";

    if (!form.capacity || Number(form.capacity) < 1)
      err.capacity = "Capacity must be greater than 0";

    if (!form.location.trim())
      err.location = "Location is required";

    return err;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // clear error while typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      if (initialData) {
        // 🔥 UPDATE
        await updateVenue(initialData._id, form);
      } else {
        // CREATE
        await createVenue(form);
      }

      refresh();
      close();
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.header}>
        <h3>{initialData ? "Edit Venue" : "Create Venue"}</h3>
        <button type="button" onClick={close} style={styles.closeBtn}>
          ✕
        </button>
      </div>

      {/* NAME */}
      <div style={styles.field}>
        <label style={styles.label}>Venue Name</label>
        <input
          name="name"
          placeholder="e.g. Main Hall"
          value={form.name}
          onChange={handleChange}
          style={styles.input(errors.name)}
        />
        {errors.name && <span style={styles.error}>{errors.name}</span>}
      </div>

      {/* TYPE */}
      <div style={styles.field}>
        <label style={styles.label}>Venue Type</label>
        <select
          name="venueType"
          value={form.venueType}
          onChange={handleChange}
          style={styles.input(errors.venueType)}
        >
          <option value="">Select Type</option>
          <option value="Hall">Hall</option>
          <option value="Auditorium">Auditorium</option>
          <option value="Ground">Ground</option>
          <option value="Lab">Lab</option>
          <option value="Classroom">Classroom</option>
        </select>
        {errors.venueType && <span style={styles.error}>{errors.venueType}</span>}
      </div>

      {/* CAPACITY */}
      <div style={styles.field}>
        <label style={styles.label}>Capacity</label>
        <input
          type="number"
          name="capacity"
          placeholder="e.g. 100"
          value={form.capacity}
          onChange={handleChange}
          style={styles.input(errors.capacity)}
        />
        {errors.capacity && <span style={styles.error}>{errors.capacity}</span>}
      </div>

      {/* LOCATION */}
      <div style={styles.field}>
        <label style={styles.label}>Location</label>
        <input
          name="location"
          placeholder="e.g. Building A"
          value={form.location}
          onChange={handleChange}
          style={styles.input(errors.location)}
        />
        {errors.location && <span style={styles.error}>{errors.location}</span>}
      </div>

      {/* BUTTONS */}
      <div style={styles.actions}>
        <button type="button" onClick={close} style={styles.cancelBtn}>
          Cancel
        </button>

        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading
            ? "Saving..."
            : initialData
            ? "Update Venue"
            : "Create Venue"}
        </button>
      </div>
    </form>
  );
};
const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer"
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: "5px"
  },

  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#475569"
  },

  input: (error) => ({
    padding: "10px",
    borderRadius: "6px",
    border: error ? "1px solid #ef4444" : "1px solid #cbd5f5",
    outline: "none",
    fontSize: "14px"
  }),

  error: {
    color: "#ef4444",
    fontSize: "12px"
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px"
  },

  cancelBtn: {
    padding: "8px 14px",
    background: "#e2e8f0",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  },

  submitBtn: {
    padding: "8px 14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default VenueForm;