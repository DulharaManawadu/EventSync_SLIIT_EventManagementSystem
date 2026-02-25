import { useState } from "react";
import { createResource } from "../../services/resourceService";

const ResourceForm = ({ refresh }) => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    totalQuantity: "",
    availableQuantity: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createResource(form);
    refresh();
    setForm({
      name: "",
      category: "",
      totalQuantity: "",
      availableQuantity: ""
    });
  };

  return (
    <div>
      <h3 style={{ marginBottom: "15px" }}>Create New Resource</h3>

      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Resource Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Audio">Audio</option>
          <option value="Visual">Visual</option>
          <option value="Furniture">Furniture</option>
          <option value="IT Equipment">IT Equipment</option>
        </select>

        <input
          type="number"
          name="totalQuantity"
          placeholder="Total Quantity"
          value={form.totalQuantity}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="availableQuantity"
          placeholder="Available Quantity"
          value={form.availableQuantity}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Resource</button>
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

export default ResourceForm;