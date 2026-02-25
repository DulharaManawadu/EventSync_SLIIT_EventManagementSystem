import { useState } from "react";
import { createVenue } from "../../services/venueService";

const VenueForm = ({ refresh }) => {
  const [form, setForm] = useState({
    name: "",
    venueType: "",
    capacity: "",
    location: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createVenue(form);
    refresh();
    setForm({ name: "", venueType: "", capacity: "", location: "" });
  };

  return (
    <div>
      <h3 style={{ marginBottom: "15px" }}>Create New Venue</h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Venue Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="venueType"
          value={form.venueType}
          onChange={handleChange}
          required
        >
          <option value="">Select Type</option>
          <option value="Hall">Hall</option>
          <option value="Auditorium">Auditorium</option>
          <option value="Ground">Ground</option>
          <option value="Lab">Lab</option>
        </select>

        <input
          type="number"
          name="capacity"
          placeholder="Capacity"
          value={form.capacity}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Venue</button>
      </form>
    </div>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  }
};

export default VenueForm;