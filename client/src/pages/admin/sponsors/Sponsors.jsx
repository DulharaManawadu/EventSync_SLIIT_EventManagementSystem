import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../AdminSidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [activeTab, setActiveTab] = useState("Pending");

  const [viewSponsor, setViewSponsor] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/sponsors");
      setSponsors(res.data);
    } catch {
      toast.error("Failed to fetch sponsors");
    }
  };

  // APPROVE
  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/sponsors/approve/${id}`);
      toast.success("Approved");
      fetchSponsors();
    } catch {
      toast.error("Failed");
    }
  };

  // REJECT
  const handleReject = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/sponsors/reject/${rejectId}`,
        { rejectionReason: rejectReason }
      );

      toast.success("Rejected");
      setRejectId(null);
      setRejectReason("");
      fetchSponsors();
    } catch {
      toast.error("Reject failed");
    }
  };

  const filteredSponsors = sponsors.filter(
    (s) => s.status === activeTab
  );

  return (
    <>
      <AdminSidebar />
      

      {/* HEADER */}
      <div style={S.topHeader}>
        <h1 style={S.headerTitle}>Sponsor Management</h1>
        <p style={S.headerSub}>Manage sponsorship approvals and tracking</p>
      </div>

      <div style={S.page}>
        {/* TABS */}
        <div style={S.tabs}>
          {["Pending", "Approved", "Rejected"].map((tab) => (
            <button
              key={tab}
              style={S.tab(activeTab === tab)}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TABLE */}
        <div style={S.panel}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>#</th>
                <th style={S.th}>Event</th>
                <th style={S.th}>Company</th>
                <th style={S.th}>Email</th>
                <th style={S.th}>Tier</th>
                <th style={S.th}>Amount</th>
                <th style={S.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSponsors.map((s, i) => (
                <tr key={s._id} style={S.row}>
                  <td style={S.td}>{i + 1}</td>
                  <td style={S.td}>
                    {s.event?.title || "N/A"}
                  </td>
                  <td style={S.td}>{s.companyName}</td>
                  <td style={S.td}>{s.contactEmail}</td>
                  <td style={S.td}>{s.tier}</td>
                  <td style={S.td}>LKR {s.contributionAmount}</td>

                  <td style={S.td}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      style={S.viewBtn}
                      onClick={() => {
                        setViewSponsor(s);
                        setShowViewModal(true);
                      }}
                    >
                      View
                    </button>

                    {activeTab === "Pending" && (
                      <>
                        <button
                          style={S.approveBtn}
                          onClick={() => handleApprove(s._id)}
                        >
                          Approve
                        </button>

                        <button
                          style={S.rejectBtn}
                          onClick={() => setRejectId(s._id)}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW MODAL */}
      {showViewModal && viewSponsor && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h3>Sponsor Details</h3>

            <p><b>Company:</b> {viewSponsor.companyName}</p>
            <p><b>Email:</b> {viewSponsor.contactEmail}</p>
            <p><b>Phone:</b> {viewSponsor.contactPhone}</p>
            <p><b>Tier:</b> {viewSponsor.tier}</p>
            <p><b>Amount:</b> {viewSponsor.contributionAmount}</p>
            <p><b>Status:</b> {viewSponsor.status}</p>
            <p><b>Website:</b> {viewSponsor.website}</p>
            <p><b>Description:</b> {viewSponsor.description}</p>

            {viewSponsor.status === "Rejected" && (
              <p><b>Reason:</b> {viewSponsor.rejectionReason}</p>
            )}

            <button onClick={() => setShowViewModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectId && (
        <div style={S.overlay}>
          <div style={S.modal}>
            <h3>Reject Sponsor</h3>

            <textarea
              placeholder="Enter rejection reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleReject}>Submit</button>
              <button onClick={() => setRejectId(null)}>Cancel</button>
            </div>
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
    tabs:{display:"flex",gap:"10px",marginBottom:"20px"},
    tab:(active)=>({
      padding:"8px 16px",
      background:active?"#4f46e5":"#e2e8f0",
      color:active?"#fff":"#000",
      border:"none",
      borderRadius:"8px"
    }),
    approveBtn:{
        background: "#e0e7ff",
        color: "#3730a3",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600"
    },
    rejectBtn:{
        background: "#fee2e2",
        color: "#b91c1c",
        border: "none",
        padding: "6px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600"
    },
   
  
  };