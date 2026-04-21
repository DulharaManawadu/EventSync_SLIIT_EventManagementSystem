import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header";
import Footer from "../Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SponsorRegister() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    logoUrl: "",
    tier: "Gold",
    contributionAmount: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const openModal = (event) => {
    setSelectedEvent(event);
  
    setForm({
      companyName: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      logoUrl: "",
      tier: "Gold",
      contributionAmount: ""
    });
  
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.companyName) return toast.error("Company required");
    if (!form.contactEmail.includes("@")) return toast.error("Valid email required");
    if (!form.contributionAmount) return toast.error("Amount required");
  
    try {
      await axios.post("http://localhost:5000/api/sponsors", {
        ...form,
        contributionAmount: Number(form.contributionAmount),
        event: selectedEvent._id
      });
  
      toast.success("Application submitted!");
      setShowModal(false);
  
    } catch {
      toast.error("Submission failed");
    }
  };

  return (
    <>
      <Header />
      <ToastContainer />

      {/* HERO */}
      <div style={S.hero}>
        <div style={S.heroOverlay} />
        <div style={S.heroContent}>
          <h1 style={S.headerTitle}>Sponsor Events</h1>
          <p style={S.headerSub}>Partner with us and grow your brand through impactful events</p>
        </div>
      </div>

      {/* SECTION */}
      <div style={S.section}>
        <h2>Available Sponsorship Events</h2>
        <p>Select an event and apply as a sponsor</p>

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

              <button
                style={S.btn}
                onClick={() => {
                  setSelectedEvent(e);
                  setShowModal(true);
                }}
              >
                Become a Sponsor
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && selectedEvent && (
  <div style={S.overlay}>
    <div style={S.modal}>
      
      <h2 style={{ marginBottom: "5px" }}>
        Sponsor: {selectedEvent.title}
      </h2>
      <p style={{ fontSize: "13px", color: "#64748b" }}>
        Submit your sponsorship request
      </p>

      <div style={S.formGrid}>
        
        <input
          
          style={S.input}
          placeholder="Company Name"
          value={form.companyName}
          onChange={(e)=>setForm({...form,companyName:e.target.value})}
        />

        <input
          placeholder="Email"
          style={S.input}
          value={form.contactEmail}
          onChange={(e)=>setForm({...form,contactEmail:e.target.value})}
        />

        <input
          placeholder="Phone"
          style={S.input}
          value={form.contactPhone}
          onChange={(e)=>setForm({...form,contactPhone:e.target.value})}
        />

        <input
          placeholder="Website"
          style={S.input}
          value={form.website}
          onChange={(e)=>setForm({...form,website:e.target.value})}
        />

        <select
          value={form.tier}
          style={S.input}
          onChange={(e)=>setForm({...form,tier:e.target.value})}
        >
          <option>Gold</option>
          <option>Silver</option>
          <option>Bronze</option>
        </select>

        <input
          type="number"
          style={S.input}
          placeholder="Contribution Amount"
          value={form.contributionAmount}
          onChange={(e)=>setForm({...form,contributionAmount:e.target.value})}
        />

      </div>

      <div style={S.modalActions}>
        <button style={S.primaryBtn} onClick={handleSubmit}>
          Submit Application
        </button>

        <button
          style={S.secondaryBtn}
          onClick={()=>setShowModal(false)}
        >
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
    position: "relative",
    height: "300px",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1552664730-d307ca884978')",
    backgroundSize: "cover",
    backgroundPosition: "center"
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

  heroOverlay: {
    position: "absolute",
    inset: 0,
    background: "rgba(15,23,42,0.75)"
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    textAlign: "center"
  },

  section: {
    padding: "200px 200px",
    background: "#f8fafc",
    textAlign: "center"
  },

  grid: {
    marginTop: "80px",
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)", 
    gap: "40px"
  },

  card: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "25px",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "320px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
    transition: "all 0.25s ease"
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px"
  },

  badge: {
    background: "linear-gradient(135deg,#6366f1,#3b82f6)",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600"
  },

  date: {
    fontSize: "12px",
    color: "#64748b"
  },

  desc: {
    fontSize: "14px",
    color: "#475569",
    margin: "10px 0"
  },

  meta: {
    fontSize: "13px",
    color: "#334155",
    marginBottom: "15px"
  },

  btn: {
    marginTop: "auto",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg,#4f46e5,#2563eb)",
    color: "#fff",
    fontWeight: "600",
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
    padding: "30px",
    borderRadius: "18px",
    width: "700px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
  },
  
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px"
  },
  
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px"
  },
  
  primaryBtn: {
    background: "linear-gradient(135deg,#4f46e5,#2563eb)",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer"
  },
  
  secondaryBtn: {
    background: "#e2e8f0",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer"
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
};