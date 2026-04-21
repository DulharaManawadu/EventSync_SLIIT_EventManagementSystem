import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../AdminSidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function EventAllocation() {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [resources, setResources] = useState([]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedResources, setSelectedResources] = useState([]);

  const [viewEvent, setViewEvent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const e = await axios.get("http://localhost:5000/api/events");
      const v = await axios.get("http://localhost:5000/api/venues");
      const r = await axios.get("http://localhost:5000/api/resources");

      const eventData = e.data.data || e.data;

      setEvents(eventData.filter(ev => ev.status === "Approved"));
      setVenues(v.data);
      setResources(r.data);

    } catch {
      toast.error("Failed to load data");
    }
  };

  // OPEN MODAL
  const openModal = (event, edit = false) => {
    setSelectedEvent(event);
    setIsEditMode(edit);
  
    if (edit) {
      // Pre-fill existing allocation
      setSelectedVenue(event.venueRef?._id || event.venueRef || "");
  
      setSelectedResources(
        (event.resources || []).map(r => ({
          resource: r.resource?._id || r.resource,
          quantity: r.quantity
        }))
      );
    } else {
      // Fresh allocation
      setSelectedVenue("");
      setSelectedResources([]);
    }
  
    setShowModal(true);
  };

  // RESOURCE HANDLING
  const addResource = () => {
    setSelectedResources([...selectedResources, { resource: "", quantity: 1 }]);
  };

  const updateResource = (i, field, value) => {
    const updated = [...selectedResources];
    updated[i][field] = value;
    setSelectedResources(updated);
  };

  const removeResource = (i) => {
    setSelectedResources(selectedResources.filter((_, index) => index !== i));
  };

  // SUBMIT
  const handleSubmit = async () => {
    // ===== VALIDATION =====
    if (!selectedVenue) {
      toast.error("Please select a venue");
      return;
    }
  
    if (selectedResources.length === 0) {
      toast.error("Please add at least one resource");
      return;
    }
  
    for (let i = 0; i < selectedResources.length; i++) {
      const r = selectedResources[i];
  
      if (!r.resource) {
        toast.error(`Please select a resource in row ${i + 1}`);
        return;
      }
  
      if (!r.quantity || r.quantity <= 0) {
        toast.error(`Invalid quantity in row ${i + 1}`);
        return;
      }
  
      const resObj = resources.find(x => x._id === r.resource);
  
      if (!resObj) {
        toast.error(`Invalid resource selected`);
        return;
      }
  
      if (Number(r.quantity) > resObj.availableQuantity) {
        toast.error(
          `${resObj.name} only has ${resObj.availableQuantity} available`
        );
        return;
      }
    }
  
    // Prevent duplicates
    const ids = selectedResources.map(r => r.resource);
    if (ids.length !== new Set(ids).size) {
      toast.error("Duplicate resources are not allowed");
      return;
    }
  
    // ===== CLEAN PAYLOAD =====
    const payload = {
      venueId: selectedVenue,
      resources: selectedResources.map(r => ({
        resource: r.resource,
        quantity: Number(r.quantity)
      }))
    };
  
    try {
      const url = isEditMode
        ? `http://localhost:5000/api/allocations/event/${selectedEvent._id}/update`
        : `http://localhost:5000/api/allocations/event/${selectedEvent._id}`;
  
      await axios.put(url, payload);
  
      toast.success(
        isEditMode
          ? "Allocation updated successfully"
          : "Allocated successfully"
      );
  
      setShowModal(false);
      setSelectedResources([]);
      setSelectedVenue("");
      setIsEditMode(false);
  
      fetchData();
  
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  return (
    <>
      <AdminSidebar />

      <div style={S.topHeader}>
        <h1 style={S.headerTitle}>Venue Management</h1>
        <p style={S.headerSub}>
          Manage, edit, and organize all available venues in the system.
        </p>
      </div>
      

      <div style={S.page}>
        
      

        {/* TABLE */}
        <div style={S.card}>
          <table style={S.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Event</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {events.map((e, i) => (
                <tr key={e._id}>
                  <td>{i + 1}</td>
                  <td>{e.title}</td>
                  <td>{new Date(e.date).toDateString()}</td>

                  <td>
                    <span style={S.status(e.isAllocated)}>
                      {e.isAllocated ? "Allocated" : "Pending"}
                    </span>
                  </td>

                  <td style={S.td}>
                    {!e.isAllocated ? (
                      <button style={S.assignBtn} onClick={() => openModal(e)}>
                        Assign
                      </button>
                    ) : (
                      <>
                        
                        <button
                          style={S.viewBtn}
                          onClick={() => {
                            setViewEvent(e);
                            setShowViewModal(true);
                          }}
                        >
                          View
                        </button>
                        <button
                          style={S.assignBtn}
                          onClick={() => openModal(e, true)}
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedEvent && (
        <div style={S.overlay}>
          <div style={S.modal}>

            <h3>
              {isEditMode ? "Update Allocation" : "Assign"}: {selectedEvent.title}
            </h3>

            <label>Venue</label>
            <select
                style={S.input}
                value={selectedVenue}
                onChange={(e) => setSelectedVenue(e.target.value)}
              >
                <option value="">Select Venue</option>
                {venues.map(v => (
                  <option key={v._id} value={v._id}>
                    {v.name}
                  </option>
                ))}
              </select>

            <h4>Resources</h4>

            {selectedResources.map((r, i) => (
              <div key={i} style={S.row}>
                <select style={S.input}
                  onChange={(e)=>updateResource(i,"resource",e.target.value)}
                >

                  <option>Select Resource</option>
                  {resources.map(res=>(
                    <option key={res._id} value={res._id}>
                      {res.name} ({res.availableQuantity})
                    </option>
                  ))}
                </select>

                
                <input style={S.input}
                  type="number"
                  min="1"
                  value={r.quantity}
                  onChange={(e)=>updateResource(i,"quantity", Number(e.target.value))}
                />

                <button onClick={()=>removeResource(i)}>X</button>
              </div>
            ))}

            <button onClick={addResource}>+ Add Resource</button>

            <div style={S.actions}>
              <button style={S.primaryBtn} onClick={handleSubmit}>Submit</button>
              <button style={S.secondaryBtn} onClick={()=>setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showViewModal && viewEvent && (
        <div style={S.overlay}>
          <div style={S.modal}>
            
            <h3 style={S.modalTitle}>Allocation Details</h3>

            {/* VENUE */}
            <div>
              <p style={S.label}>Venue</p>
              <p>
                {viewEvent.venueRef?.name || viewEvent.venue || "Not assigned"}
              </p>
            </div>

            {/* RESOURCES */}
            <div>
              <p style={S.label}>Resources</p>

              {viewEvent.resources?.length > 0 ? (
                viewEvent.resources.map((r, i) => (
                  <div key={i} style={S.resourceItem}>
                    <span>
                      {r.resource?.name || r.resource}
                    </span>

                    <span style={S.qty}>
                      Qty: {r.quantity}
                    </span>
                  </div>
                ))
              ) : (
                <p>No resources assigned</p>
              )}
            </div>

            <div style={S.actionRow}>
              <button
                style={S.secondaryBtn}
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
      <ToastContainer />
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
      padding: "40px",
      background: "#f1f5f9",
      minHeight: "100vh"
    },
  
    // ===== CARD =====
    card: {
      background: "#ffffff",
      padding: "25px",
      borderRadius: "16px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.06)"
    },
  
    // ===== TABLE =====
    table: {
      width: "100%",
      borderCollapse: "separate",
      borderSpacing: "0 10px"
    },
  
    th: {
      textAlign: "left",
      padding: "10px",
      color: "#64748b",
      fontSize: "13px",
      fontWeight: "600"
    },
  
    tr: {
      background: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.03)"
    },
  
    td: {
      padding: "14px 10px",
      fontSize: "14px",
      color: "#334155"
    },
  
    // ===== STATUS =====
    status: (allocated) => ({
      padding: "5px 12px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "600",
      background: allocated ? "#dcfce7" : "#fee2e2",
      color: allocated ? "#166534" : "#991b1b"
    }),
  
    // ===== BUTTONS =====
    assignBtn: {
      background: "linear-gradient(135deg,#4f46e5,#2563eb)",
      color: "#fff",
      border: "none",
      padding: "8px 14px",
      borderRadius: "8px",
      fontSize: "13px",
      cursor: "pointer",
      fontWeight: "600",
      transition: "0.2s"
    },
  
    doneText: {
      color: "#16a34a",
      fontWeight: "600"
    },
  
    // ===== MODAL =====
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
      fontSize: "20px",
      fontWeight: "700",
      marginBottom: "5px"
    },
    
    actions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px"
    },
  
    label: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#475569"
    },
  
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      fontSize: "14px"
    },
  
    select: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #e2e8f0",
      fontSize: "14px"
    },
  
    // ===== RESOURCE ROW =====
    row: {
      display: "flex",
      gap: "10px",
      alignItems: "center"
    },
  
    resourceBox: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      padding: "12px",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      background: "#f8fafc"
    },
  
    removeBtn: {
      background: "#fee2e2",
      color: "#991b1b",
      border: "none",
      padding: "6px 10px",
      borderRadius: "6px",
      cursor: "pointer"
    },
  
    addBtn: {
      marginTop: "10px",
      background: "#e0e7ff",
      color: "#3730a3",
      border: "none",
      padding: "8px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600"
    },
  
    // ===== ACTION BUTTONS =====
    actionRow: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "10px",
      marginTop: "15px"
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
      marginLeft: "10px",
      background: "#e0f2fe",
      color: "#0369a1",
      border: "none",
      padding: "6px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600"
    },
    
    resourceItem: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px",
      borderBottom: "1px solid #e2e8f0"
    },
    
    qty: {
      fontWeight: "600",
      color: "#475569"
    }
  };