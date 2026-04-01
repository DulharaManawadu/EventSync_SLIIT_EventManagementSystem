import { useState, useEffect } from "react";
import {
  createResource,
  updateResource
} from "../../services/resourceService";

const ResourceForm = ({ resource, refresh, close }) => {
  const isEdit = !!resource;

  const [form, setForm] = useState({
    name: "",
    category: "",
    totalQuantity: "",
    availableQuantity: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // PREFILL WHEN EDITING
  useEffect(() => {
    if (resource) {
      setForm({
        name: resource.name || "",
        category: resource.category || "",
        totalQuantity: resource.totalQuantity || "",
        availableQuantity: resource.availableQuantity || ""
      });
    }
  }, [resource]);

  // VALIDATION
  const validate = () => {
    let err = {};

    if (!form.name.trim() || form.name.length < 3)
      err.name = "Minimum 3 characters required";

    if (!form.category)
      err.category = "Please select a category";

    if (form.totalQuantity === "" || Number(form.totalQuantity) < 1)
      err.totalQuantity = "Total must be greater than 0";

    if (
      form.availableQuantity === "" ||
      Number(form.availableQuantity) < 0
    )
      err.availableQuantity = "Available cannot be negative";

    if (
      Number(form.availableQuantity) > Number(form.totalQuantity)
    )
      err.availableQuantity = "Available cannot exceed total";

    return err;
  };

  // HANDLE CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors({ ...errors, [e.target.name]: "" });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        await updateResource(resource._id, form);
      } else {
        await createResource(form);
      }

      refresh();

      // RESET FORM
      setForm({
        name: "",
        category: "",
        totalQuantity: "",
        availableQuantity: ""
      });

      close && close();
    } catch (err) {
      console.error(err);
      alert(isEdit ? "Error updating resource" : "Error creating resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {/* HEADER */}
      <div style={styles.header}>
        <h3>{isEdit ? "Edit Resource" : "Create Resource"}</h3>
        {close && (
          <button type="button" onClick={close} style={styles.closeBtn}>
            ✕
          </button>
        )}
      </div>

      {/* NAME */}
      <div style={styles.field}>
        <label style={styles.label}>Resource Name</label>
        <input
          name="name"
          placeholder="e.g. Projector"
          value={form.name}
          onChange={handleChange}
          style={styles.input(errors.name)}
        />
        {errors.name && <span style={styles.error}>{errors.name}</span>}
      </div>

      {/* CATEGORY */}
      <div style={styles.field}>
        <label style={styles.label}>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          style={styles.input(errors.category)}
        >
          <option value="">Select Category</option>
          <option value="Audio">Audio</option>
          <option value="Visual">Visual</option>
          <option value="Furniture">Furniture</option>
          <option value="IT Equipment">IT Equipment</option>
        </select>
        {errors.category && (
          <span style={styles.error}>{errors.category}</span>
        )}
      </div>

      {/* TOTAL */}
      <div style={styles.field}>
        <label style={styles.label}>Total Quantity</label>
        <input
          type="number"
          name="totalQuantity"
          placeholder="e.g. 10"
          value={form.totalQuantity}
          onChange={handleChange}
          style={styles.input(errors.totalQuantity)}
        />
        {errors.totalQuantity && (
          <span style={styles.error}>{errors.totalQuantity}</span>
        )}
      </div>

      {/* AVAILABLE */}
      <div style={styles.field}>
        <label style={styles.label}>Available Quantity</label>
        <input
          type="number"
          name="availableQuantity"
          placeholder="e.g. 5"
          value={form.availableQuantity}
          onChange={handleChange}
          style={styles.input(errors.availableQuantity)}
        />
        {errors.availableQuantity && (
          <span style={styles.error}>{errors.availableQuantity}</span>
        )}
      </div>

      {/* ACTIONS */}
      <div style={styles.actions}>
        {close && (
          <button type="button" onClick={close} style={styles.cancelBtn}>
            Cancel
          </button>
        )}

        <button type="submit" disabled={loading} style={styles.submitBtn}>
          {loading
            ? isEdit
              ? "Updating..."
              : "Creating..."
            : isEdit
            ? "Update Resource"
            : "Create Resource"}
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

export default ResourceForm;