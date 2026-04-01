import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../AdminSidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Venues() {
  const [venues, setVenues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewVenue, setViewVenue] = useState(null);

  const [form, setForm] = useState({
    name: "",
    venueType: "Hall",
    capacity: "",
    location: "",
    facilities: "",
    availabilityStatus: "Available",
    contactPerson: "",
    contactPhone: "",
    description: ""
  });

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/venues");
      setVenues(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // VALIDATION
  const validate = () => {
    if (!form.name.trim()) return "Venue name is required";
    if (!form.capacity || form.capacity <= 0) return "Capacity must be greater than 0";
    if (!form.location.trim()) return "Location is required";
  
    if (form.contactPhone && !/^[0-9]{10}$/.test(form.contactPhone)) {
      return "Phone must be 10 digits";
    }
  
    if (form.description.length > 500) {
      return "Description too long (max 500 chars)";
    }
  
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) return toast.error(error);
  
    const payload = {
      ...form,
      capacity: Number(form.capacity),
      facilities: form.facilities
        ? form.facilities.split(",").map(f => f.trim())
        : []
    };
  
    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:5000/api/venues/${selectedVenue._id}`,
          payload
        );
        toast.success("Venue updated");
      } else {
        await axios.post(
          "http://localhost:5000/api/venues",
          payload
        );
        toast.success("Venue created");
      }
  
      setShowModal(false);
      fetchVenues();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this venue?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/venues/${id}`);
      toast.success("Venue deleted");
      fetchVenues();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (v) => {
    setIsEdit(true);
    setSelectedVenue(v);
    setForm({
        name: v.name || "",
        venueType: v.venueType || "Hall",
        capacity: v.capacity || "",
        location: v.location || "",
        facilities: v.facilities?.join(", ") || "",
        availabilityStatus: v.availabilityStatus || "Available",
        contactPerson: v.contactPerson || "",
        contactPhone: v.contactPhone || "",
        description: v.description || ""
      });
    setShowModal(true);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setForm({
        name: "",
        venueType: "Hall",
        capacity: "",
        location: "",
        facilities: "",
        availabilityStatus: "Available",
        contactPerson: "",
        contactPhone: "",
        description: ""
      });
    setShowModal(true);
  };

  return (
    <>
      
      <AdminSidebar />
      
      

      {/* TOP HEADER */}
      <div style={S.topHeader}>
        <h1 style={S.headerTitle}>Venue Management</h1>
        <p style={S.headerSub}>
          Manage, edit, and organize all available venues in the system.
        </p>
      </div>
      

      <div style={S.page}>
        {/* ACTION BAR */}
        <div style={S.header}>
          <h2 style={{ margin: 0 }}>All Venues</h2>

          <button style={S.addBtn} onClick={handleAdd}>
            + Add Venue
          </button>
        </div>

        {/* TABLE */}
        <div style={S.panel}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>ID</th>
                <th style={S.th}>Name</th>
                <th style={S.th}>Type</th>
                <th style={S.th}>Capacity</th>
                <th style={S.th}>Location</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
                {venues.map((v, index) => (
                    <tr
                        key={v._id}
                        style={S.row}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                        }}
                        >
                <td style={S.td}>{index + 1}</td>
                  <td style={S.td}>{v.name}</td>
                  <td style={S.td}>{v.venueType}</td>
                  <td style={S.td}>{v.capacity}</td>
                  <td style={S.td}>{v.location}</td>

                  <td style={S.td}>
                    <span style={S.badge(v.availabilityStatus)}>
                      {v.availabilityStatus}
                    </span>
                  </td>

                  {/* ACTION BUTTONS */}
                  <td style={S.td}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      
                    <button
                        style={S.viewBtn}
                        onClick={() => {
                            setViewVenue(v);
                            setShowViewModal(true);
                        }}
                        >
                        View
                    </button>

                    <button style={S.editBtn} onClick={() => handleEdit(v)}>
                        Edit
                    </button>

                    <button
                    style={S.deleteBtn}
                    onClick={() => handleDelete(v._id)}
                    >
                    Delete
                    </button>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={S.overlay}>
            <div style={S.modal}>
            <h3 style={S.modalTitle}>
                {isEdit ? "Edit Venue" : "Add New Venue"}
            </h3>

            <div style={S.grid}>

                <input
                placeholder="Venue Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={S.input}
                />

                <select
                value={form.venueType}
                onChange={(e) => setForm({ ...form, venueType: e.target.value })}
                style={S.input}
                >
                <option>Hall</option>
                <option>Auditorium</option>
                <option>Ground</option>
                <option>Lab</option>
                <option>Classroom</option>
                </select>

                <input
                type="number"
                placeholder="Capacity"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                style={S.input}
                />

                <input
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                style={S.input}
                />

                <input
                placeholder="Facilities (comma separated)"
                value={form.facilities}
                onChange={(e) => setForm({ ...form, facilities: e.target.value })}
                style={S.input}
                />

                <select
                value={form.availabilityStatus}
                onChange={(e) =>
                    setForm({ ...form, availabilityStatus: e.target.value })
                }
                style={S.input}
                >
                <option>Available</option>
                <option>Under Maintenance</option>
                </select>

                <input
                placeholder="Contact Person"
                value={form.contactPerson}
                onChange={(e) =>
                    setForm({ ...form, contactPerson: e.target.value })
                }
                style={S.input}
                />

                <input
                placeholder="Contact Phone"
                value={form.contactPhone}
                onChange={(e) =>
                    setForm({ ...form, contactPhone: e.target.value })
                }
                style={S.input}
                />

            </div>

            <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                setForm({ ...form, description: e.target.value })
                }
                style={S.textarea}
            />

            <div style={S.actions}>
                <button style={S.primaryBtn} onClick={handleSubmit}>
                {isEdit ? "Update" : "Create"}
                </button>

                <button style={S.secondaryBtn} onClick={() => setShowModal(false)}>
                Cancel
                </button>
            </div>
            </div>
        </div>
      )}


      {showViewModal && viewVenue && (
        <div style={S.overlay}>
            <div style={S.modal}>
            <h3>Venue Details</h3>

            <p><strong>Name:</strong> {viewVenue.name}</p>
            <p><strong>Type:</strong> {viewVenue.venueType}</p>
            <p><strong>Capacity:</strong> {viewVenue.capacity}</p>
            <p><strong>Location:</strong> {viewVenue.location}</p>
            <p><strong>Status:</strong> {viewVenue.availabilityStatus}</p>

            <p><strong>Facilities:</strong> {viewVenue.facilities?.join(", ")}</p>
            <p><strong>Contact Person:</strong> {viewVenue.contactPerson}</p>
            <p><strong>Phone:</strong> {viewVenue.contactPhone}</p>
            <p><strong>Description:</strong> {viewVenue.description}</p>

            <button onClick={() => setShowViewModal(false)}>
                Close
            </button>
            </div>
        </div>
        )}
        <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

const S = {
  topHeader: {
    marginLeft: 260,
    background: "linear-gradient(90deg, #0f172a, #1e293b)",
    color: "#fff",
    padding: "30px 40px"
  },

  headerTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    color: "#fff",
  },

  headerSub: {
    marginTop: "8px",
    color: "#cbd5f5",
    fontSize: "14px"
  },

  page: {
    marginLeft: 260,
    padding: "30px 40px",
    background: "#f8fafc",
    minHeight: "100vh"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  addBtn: {
    background: "linear-gradient(135deg,#4f46e5,#2563eb)",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer"
  },

  panel: {
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(12px)",
    borderRadius: "16px",
    padding: "20px",
    border: "1px solid rgba(226,232,240,0.8)",
    boxShadow: "0 8px 24px rgba(15,23,42,0.08)"
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px" // 🔥 row spacing
  },

  th: {
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "12px",
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.04em"
  },

  td: {
    padding: "14px 16px",
    fontSize: "14px",
    color: "#334155"
  },

  row: {
    background: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    borderRadius: "10px",
    transition: "all 0.2s ease"
  },

  badge: (status) => ({
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    background:
      status === "Available"
        ? "rgba(34,197,94,0.15)"
        : "rgba(239,68,68,0.15)",
    color:
      status === "Available"
        ? "#16a34a"
        : "#dc2626"
  }),

  editBtn: {
    background: "#e0e7ff",
    color: "#3730a3",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
  },

  deleteBtn: {
    background: "#fee2e2",
    color: "#b91c1c",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  modal: {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    width: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
  },
  
  modalTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: "700"
  },
  
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px"
  },
  
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px"
  },
  
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    minHeight: "80px"
  },
  
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  },
  
  primaryBtn: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  
  secondaryBtn: {
    background: "#e2e8f0",
    border: "none",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  viewBtn: {
    background: "#ecfeff",
    color: "#0e7490",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
  },

};