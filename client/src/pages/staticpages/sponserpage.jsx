import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthToken } from "../../utils/auth";


export default function SponsorRegister() {

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    tier: "Gold",
    contributionAmount: ""
  });

  const token = getAuthToken();

  useEffect(() => {
    fetchEvents();
  }, []);

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");

      const data = res.data.data || res.data;

      const filtered = data.filter(
        (e) =>
          e.status === "Approved" &&
          new Date(e.date) >= new Date() &&
          e.sponsorshipEnabled
      );

      setEvents(filtered);

    } catch {
      toast.error("Failed to load events");
    }
  };

  // ================= OPEN MODAL =================
  const openModal = (event) => {
    setSelectedEvent(event);
    setForm({
      tier: "Gold",
      contributionAmount: ""
    });
    setShowModal(true);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {

    if (!form.contributionAmount) {
      return toast.error("Contribution amount required");
    }

    try {
      await axios.post(
        "http://localhost:5000/api/sponsors",
        {
          tier: form.tier,
          contributionAmount: Number(form.contributionAmount),
          event: selectedEvent._id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast.success("Application submitted successfully!");
      setShowModal(false);

    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />

      {/* HERO */}
      <div style={S.hero}>
        <div style={S.overlay} />
        <div style={S.heroContent}>
          <h1 style={S.heroContenth1}>Sponsor Events</h1>
          <p style={S.heroContentp1}>Partner with events and grow your brand visibility</p>
        </div>
      </div>

      {/* EVENTS SECTION */}
      <div style={S.section}>

        <h2>Available Sponsorship Opportunities</h2>
        <p>Select an event to apply as a sponsor</p>

        <div style={S.grid}>
          {events.map((e) => (
            <div key={e._id} style={S.card}>

              <div style={S.cardTop}>
                <span style={S.badge}>{e.category}</span>
                <span style={S.date}>
                  {new Date(e.date).toLocaleDateString()}
                </span>
              </div>

              <h3>{e.title}</h3>

              <p style={S.desc}>
                {e.description.slice(0, 120)}...
              </p>

              <div style={S.meta}>
                <p><b>Venue:</b> {e.venue}</p>
                <p><b>Faculty:</b> {e.faculty}</p>
              </div>

              <button style={S.btn} onClick={() => openModal(e)}>
                Apply as Sponsor
              </button>

            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {showModal && selectedEvent && (
        <div style={S.modalOverlay}>
          <div style={S.modal}>

            <h2>{selectedEvent.title}</h2>
            <p style={S.sub}>Choose your sponsorship tier and contribution</p>

            <div style={S.form}>

              <select
                style={S.input}
                value={form.tier}
                onChange={(e) =>
                  setForm({ ...form, tier: e.target.value })
                }
              >
                <option>Gold</option>
                <option>Silver</option>
                <option>Bronze</option>
              </select>

              <input
                type="number"
                style={S.input}
                placeholder="Contribution Amount (LKR)"
                value={form.contributionAmount}
                onChange={(e) =>
                  setForm({ ...form, contributionAmount: e.target.value })
                }
              />

            </div>

            <div style={S.actions}>
              <button style={S.primary} onClick={handleSubmit}>
                Submit
              </button>

              <button style={S.secondary} onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

const S = {

  hero: {
    height: "220px",
    background: "linear-gradient(90deg,#0f172a,#1e293b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    position: "relative",
    top:"-120px",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(0,0,0,0.4)"
  },

  heroContent: {
    position: "relative",
    textAlign: "center",
    color: "#fff",
  },

  heroContenth1: {
    position: "relative",
    textAlign: "center",
    color: "#fff",
  },

  heroContentp1: {
    position: "relative",
    textAlign: "center",
    color: "#fff",
  },

  section: {
    padding: "40px 200px 40px",
    background: "#f1f5f9"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(380px,1fr))",
    gap: "20px",
    marginTop: "20px"
  },

  card: {
    background: "#fff",
    padding: "18px",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },

  badge: {
    background: "#e0e7ff",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px"
  },

  date: {
    fontSize: "12px",
    color: "#64748b"
  },

  desc: {
    fontSize: "13px",
    color: "#475569"
  },

  meta: {
    fontSize: "13px",
    marginTop: "10px"
  },

  btn: {
    marginTop: "12px",
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    cursor: "pointer"
  },

  modalOverlay: {
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
    width: "400px"
  },

  sub: {
    fontSize: "13px",
    color: "#64748b"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "15px"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0"
  },

  actions: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px"
  },

  primary: {
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer"
  },

  secondary: {
    background: "#e2e8f0",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer"
  }
};