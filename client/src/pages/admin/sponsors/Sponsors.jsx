import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../AdminSidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken } from "../../../utils/auth";

export default function SponsorDashboard() {

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [tier, setTier] = useState("Gold");

  const [sponsors, setSponsors] = useState([]);
  const [summary, setSummary] = useState([]);

  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const [viewSponsor, setViewSponsor] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const token = getAuthToken();

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const TIER_LIMITS = {
    Gold: 2,
    Silver: 3,
    Bronze: 5
  };

  // ================= INIT =================
  useEffect(() => {
    if (!token) {
      toast.error("Please login as Admin");
      return;
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      fetchSponsors();
      fetchSummary();
    }
  }, [selectedEvent, tier]);

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      const eventData = res.data.data || res.data;
      setEvents(Array.isArray(eventData) ? eventData : []);
    } catch {
      toast.error("Failed to load events");
    }
  };

  // ================= FETCH SPONSORS =================
  const fetchSponsors = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/sponsors/filter?eventId=${selectedEvent}&tier=${tier}&sortBy=amount`,
        authConfig
      );

      setSponsors(res.data);

    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to load sponsors");
    }
  };

  // ================= FETCH SUMMARY =================
  const fetchSummary = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/sponsors/summary/${selectedEvent}`,
        authConfig
      );

      setSummary(res.data);

    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to load summary");
    }
  };

  // ================= APPROVE =================
  const handleApprove = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/sponsors/approve/${id}`,
        {},
        authConfig
      );

      toast.success("Approved");
      fetchSponsors();
      fetchSummary();

    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed");
    }
  };

  // ================= REJECT =================
  const handleReject = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/sponsors/reject/${rejectId}`,
        { reason: rejectReason },
        authConfig
      );

      toast.success("Rejected");
      setRejectId(null);
      setRejectReason("");

      fetchSponsors();
      fetchSummary();

    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Reject failed");
    }
  };

  // ================= CALCULATIONS =================
  const currentTierData = summary.find(s => s._id === tier);
  const approvedCount = currentTierData?.approved || 0;
  const limit = TIER_LIMITS[tier];

  // ================= UI =================
  return (
    <>
  <AdminSidebar />
  <ToastContainer />

  {/* HEADER */}
  <div style={S.topHeader}>
    <h1 style={S.headerTitle}>Sponsor Management</h1>
    <p style={S.headerSub}>Review and approve sponsor applications</p>
  </div>

  <div style={S.page}>

    {/* CONTROLS */}
    <div style={S.controlRow}>
      <select
        style={S.input}
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
      >
        <option value="">Select Event</option>
        {events.map(e => (
          <option key={e._id} value={e._id}>
            {e.title}
          </option>
        ))}
      </select>
    </div>

    {/* TABS */}
    <div style={S.tabs}>
      {["Gold", "Silver", "Bronze"].map(t => (
        <button
          key={t}
          style={S.tab(tier === t)}
          onClick={() => setTier(t)}
        >
          {t}
        </button>
      ))}
    </div>

    {/* LIMIT BOX */}
    {selectedEvent && (
      <div style={S.limitBox}>
        {approvedCount} / {limit} {tier} Selected
      </div>
    )}

    {/* CARD */}
    <div style={S.card}>

      <table style={S.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {sponsors.map((s, i) => (
            <tr key={s._id} style={{ background: "#fff" }}>
              <td>{i + 1}</td>

              <td>
                {`${s.createdBy?.firstName} ${s.createdBy?.lastName}`}
              </td>

              <td>{s.createdBy?.email}</td>

              <td>LKR {s.contributionAmount}</td>

              <td>
                <span style={S.status(s.status)}>
                  {s.status}
                </span>
              </td>

              <td>
                <div style={S.actionGroup}>

                  <button
                    style={S.viewBtn}
                    onClick={() => {
                      setViewSponsor(s);
                      setShowViewModal(true);
                    }}
                  >
                    View
                  </button>

                  <button
                    style={S.primaryBtn}
                    disabled={approvedCount >= limit || s.status === "Approved"}
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

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  </div>

  {/* ================= VIEW MODAL ================= */}
  {showViewModal && viewSponsor && (
    <div style={S.overlay}>
      <div style={S.modalLarge}>

        <h2 style={S.modalTitle}>Sponsor Details</h2>

        <div style={S.detailGrid}>

          <div>
            <p style={S.label}>Company</p>
            <p>{viewSponsor.createdBy?.companyName || "N/A"}</p>
          </div>

          <div>
            <p style={S.label}>Email</p>
            <p>{viewSponsor.createdBy?.email}</p>
          </div>

          <div>
            <p style={S.label}>Contact</p>
            <p>{viewSponsor.createdBy?.contactNumber || "N/A"}</p>
          </div>

          <div>
            <p style={S.label}>Tier</p>
            <p>{viewSponsor.tier}</p>
          </div>

          <div>
            <p style={S.label}>Contribution</p>
            <p>LKR {viewSponsor.contributionAmount}</p>
          </div>

          <div>
            <p style={S.label}>Status</p>
            <p>{viewSponsor.status}</p>
          </div>

        </div>

        <div style={S.actions}>
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

  {/* ================= REJECT MODAL ================= */}
  {rejectId && (
    <div style={S.overlay}>
      <div style={S.modal}>

        <h3>Reject Sponsor</h3>

        <textarea
          style={S.textarea}
          placeholder="Enter rejection reason..."
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />

        <div style={S.actions}>
          <button style={S.secondaryBtn} onClick={() => setRejectId(null)}>
            Cancel
          </button>

          <button style={S.rejectBtn} onClick={handleReject}>
            Confirm Reject
          </button>
        </div>

      </div>
    </div>
  )}

</>
  );
}

// ================= STYLES =================
const S = {

  topHeader: {
    marginLeft: 260,
    background: "linear-gradient(90deg, #0f172a, #1e293b)",
    color: "#fff",
    padding: "30px 40px",
    marginTop:"-7%"

  },

  headerTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    color: "#fff",

  },

  headerSub: {
    marginTop: "8px",
    color: "#cbd5f5"
  },

  page: {
    marginLeft: 260,
    padding: "40px",
    background: "#f1f5f9",
    minHeight: "100vh"
  },

  controlRow: {
    marginBottom: "20px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0"
  },

  tabs: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px"
  },

  tab: (active) => ({
    padding: "8px 16px",
    borderRadius: "999px",
    border: "none",
    background: active ? "#4f46e5" : "#e2e8f0",
    color: active ? "#fff" : "#334155",
    cursor: "pointer",
    fontWeight: "600"
  }),

  limitBox: {
    marginBottom: "15px",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#fef3c7",
    color: "#92400e",
    fontWeight: "600",
    display: "inline-block"
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "16px"
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 10px"
  },

  status: (s) => ({
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    background:
      s === "Approved" ? "#dcfce7" :
      s === "Rejected" ? "#fee2e2" :
      "#e0f2fe",
    color:
      s === "Approved" ? "#166534" :
      s === "Rejected" ? "#991b1b" :
      "#075985"
  }),

  actionGroup: {
    display: "flex",
    gap: "8px"
  },

  primaryBtn: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  rejectBtn: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  secondaryBtn: {
    background: "#e2e8f0",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer"
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
    padding: "20px",
    borderRadius: "12px",
    width: "400px"
  },

  textarea: {
    width: "100%",
    minHeight: "80px",
    marginTop: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0"
  },

  actions: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  },


  viewBtn: {
    background: "#e0f2fe",
    color: "#0369a1",
    border: "none",
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600"
  },
  
  modalLarge: {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    width: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "16px"
  },
  
  modalTitle: {
    fontSize: "20px",
    fontWeight: "700"
  },
  
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px"
  },
  
  label: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600"
  },
}; 