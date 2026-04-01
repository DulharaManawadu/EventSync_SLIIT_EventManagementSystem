import { useEffect, useState } from "react";
import {
  getResources,
  deleteResource
} from "../../services/resourceService";
import ResourceForm from "../../components/resources/ResourceForm";

const ResourcePage = () => {
  const [resources, setResources] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  // FETCH DATA
  const fetchResources = async () => {
    try {
      const res = await getResources();
      setResources(res.data);
    } catch (err) {
      console.error("Error fetching resources:", err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this resource?");
    if (!confirmDelete) return;

    try {
      await deleteResource(id);
      fetchResources();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // OPEN CREATE
  const handleCreate = () => {
    setSelectedResource(null);
    setOpen(true);
  };

  // OPEN EDIT
  const handleEdit = (resource) => {
    setSelectedResource(resource);
    setOpen(true);
  };

  // CLOSE MODAL
  const handleClose = () => {
    setOpen(false);
    setSelectedResource(null);
  };

  return (
    <div>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>Resource Management</h2>
        <button style={styles.addBtn} onClick={handleCreate}>
          + Add Resource
        </button>
      </div>

      {/* TABLE CARD */}
      <div style={styles.card}>
        {resources.length === 0 ? (
          <p style={styles.empty}>No resources available</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Available</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {resources.map((resource) => (
                <tr key={resource._id}>
                  <td style={styles.td}>{resource.name}</td>
                  <td style={styles.td}>{resource.category}</td>
                  <td style={styles.td}>{resource.totalQuantity}</td>
                  <td style={styles.td}>{resource.availableQuantity}</td>

                  {/* STATUS */}
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.status,
                        background:
                          resource.availableQuantity > 0
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          resource.availableQuantity > 0
                            ? "#166534"
                            : "#991b1b"
                      }}
                    >
                      {resource.availableQuantity > 0
                        ? "Available"
                        : "Out of Stock"}
                    </span>
                  </td>

                  {/* ACTION BUTTONS */}
                  <td style={styles.td}>
                    <button
                      style={styles.editBtn}
                      onClick={() => handleEdit(resource)}
                    >
                      Edit
                    </button>

                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(resource._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <ResourceForm
              resource={selectedResource}
              refresh={fetchResources}
              close={handleClose}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  addBtn: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  card: {
    background: "white",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  th: {
    textAlign: "left",
    padding: "12px",
    borderBottom: "2px solid #e5e7eb",
    fontSize: "14px",
    color: "#475569"
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px"
  },

  editBtn: {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px"
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  status: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "500"
  },

  empty: {
    textAlign: "center",
    padding: "20px",
    color: "#64748b"
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    width: "400px"
  }
};

export default ResourcePage;