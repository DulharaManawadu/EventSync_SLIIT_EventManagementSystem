import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../AdminSidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Resources() {
  const [resources, setResources] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [viewResource, setViewResource] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "Audio",
    totalQuantity: "",
    availableQuantity: "",
    conditionStatus: "Good",
    lastMaintenanceDate: "",
    description: ""
  });

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/resources");
      setResources(res.data);
    } catch {
      toast.error("Failed to fetch resources");
    }
  };

  // VALIDATION
  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.totalQuantity || form.totalQuantity <= 0)
      return "Total quantity must be > 0";
    if (form.availableQuantity < 0)
      return "Available quantity cannot be negative";
    if (form.availableQuantity > form.totalQuantity)
      return "Available cannot exceed total";

    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) return toast.error(error);

    const payload = {
      ...form,
      totalQuantity: Number(form.totalQuantity),
      availableQuantity: Number(form.availableQuantity)
    };

    try {
      if (isEdit) {
        await axios.put(
          `http://localhost:5000/api/resources/${selectedResource._id}`,
          payload
        );
        toast.success("Resource updated");
      } else {
        await axios.post(
          "http://localhost:5000/api/resources",
          payload
        );
        toast.success("Resource created");
      }

      setShowModal(false);
      fetchResources();
    } catch {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resource?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/resources/${id}`);
      toast.success("Deleted");
      fetchResources();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (r) => {
    setIsEdit(true);
    setSelectedResource(r);

    setForm({
      name: r.name || "",
      category: r.category || "Audio",
      totalQuantity: r.totalQuantity || "",
      availableQuantity: r.availableQuantity || "",
      conditionStatus: r.conditionStatus || "Good",
      lastMaintenanceDate: r.lastMaintenanceDate?.split("T")[0] || "",
      description: r.description || ""
    });

    setShowModal(true);
  };

  const handleAdd = () => {
    setIsEdit(false);
    setForm({
      name: "",
      category: "Audio",
      totalQuantity: "",
      availableQuantity: "",
      conditionStatus: "Good",
      lastMaintenanceDate: "",
      description: ""
    });
    setShowModal(true);
  };

  return (
    <>
      <AdminSidebar />
     

      {/* HEADER */}
      <div style={S.topHeader}>
        <h1 style={S.headerTitle}>Resource Management</h1>
        <p style={S.headerSub} >Manage all available resources</p>
      </div>

      <div style={S.page}>
        <div style={S.header}>
          <h2 style={{ margin: 0 }}>All Resources</h2>
          <button style={S.addBtn} onClick={handleAdd}>
            + Add Resource
          </button>
        </div>

        {/* TABLE */}
        <div style={S.panel}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>#</th>
                <th style={S.th}>Name</th>
                <th style={S.th}>Category</th>
                <th style={S.th}>Total</th>
                <th style={S.th}>Available</th>
                <th style={S.th}>Status</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {resources.map((r, i) => (
                <tr key={r._id} style={S.row}>
                  <td style={S.td}>{i + 1}</td>
                  <td style={S.td}>{r.name}</td>
                  <td style={S.td}>{r.category}</td>
                  <td style={S.td}>{r.totalQuantity}</td>
                  <td style={S.td}>{r.availableQuantity}</td>

                  <td>
                    <span style={S.badge(r.conditionStatus)}>
                      {r.conditionStatus}
                    </span>
                  </td>

                  <td style={S.td}>
                    <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={S.viewBtn}
                      onClick={() => {
                        setViewResource(r);
                        setShowViewModal(true);
                      }}
                    >
                      View
                    </button>

                    <button style={S.editBtn}  onClick={() => handleEdit(r)}>
                      Edit
                    </button>

                    <button
                      style={S.deleteBtn}
                      onClick={() => handleDelete(r._id)}
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

      {/* CREATE / EDIT MODAL */}
      {showModal && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h3 style={S.modalTitle}>{isEdit ? "Edit Resource" : "Add Resource"}</h3>

            <div style={S.grid}>

            <input placeholder="Name"
              value={form.name} style={S.input}
              onChange={(e)=>setForm({...form,name:e.target.value})} />

            <select value={form.category} style={S.input}
              onChange={(e)=>setForm({...form,category:e.target.value})}>
              <option>Audio</option>
              <option>Visual</option>
              <option>Furniture</option>
              <option>IT Equipment</option>
            </select>

            <input type="number" placeholder="Total Quantity"
              value={form.totalQuantity} style={S.input}
              onChange={(e)=>setForm({...form,totalQuantity:e.target.value})} />

            <input type="number" placeholder="Available Quantity"
              value={form.availableQuantity} style={S.input}
              onChange={(e)=>setForm({...form,availableQuantity:e.target.value})} />

            <select value={form.conditionStatus} style={S.input}
              onChange={(e)=>setForm({...form,conditionStatus:e.target.value})}>
              <option>Good</option>
              <option>Needs Repair</option>
              <option>Under Maintenance</option>
            </select>

            <input type="date"
              style={S.input} value={form.lastMaintenanceDate}
              onChange={(e)=>setForm({...form,lastMaintenanceDate:e.target.value})} />

            </div>

            <textarea placeholder="Description"
              style={S.textarea} value={form.description}
              onChange={(e)=>setForm({...form,description:e.target.value})} />

            

            <div style={S.actions}>
              <button style={S.primaryBtn} onClick={handleSubmit}>
                {isEdit ? "Update" : "Create"}
              </button>
              <button style={S.secondaryBtn} onClick={()=>setShowModal(false)}>Cancel</button>
            </div>
            
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {showViewModal && viewResource && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h3>Resource Details</h3>

            <p><b>Name:</b> {viewResource.name}</p>
            <p><b>Category:</b> {viewResource.category}</p>
            <p><b>Total:</b> {viewResource.totalQuantity}</p>
            <p><b>Available:</b> {viewResource.availableQuantity}</p>
            <p><b>Status:</b> {viewResource.conditionStatus}</p>
            <p><b>Last Maintenance:</b> {viewResource.lastMaintenanceDate}</p>
            <p><b>Description:</b> {viewResource.description}</p>

            <button onClick={()=>setShowViewModal(false)}>Close</button>
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