import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../AdminSidebar";
import { toast, ToastContainer } from "react-toastify";
import { getAuthToken } from "../../../utils/auth";

export default function ApprovedSponsors() {

  const [sponsors, setSponsors] = useState([]);

  const token = getAuthToken();

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please login as Admin");
      return;
    }
    fetchApproved();
  }, []);

  // ================= FETCH =================
  const fetchApproved = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/sponsors/approved/all",
        authConfig
      );

      setSponsors(res.data.data || res.data);

    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to load approved sponsors");
    }
  };

  // ================= GROUP BY EVENT =================
  const grouped = sponsors.reduce((acc, s) => {
    const eventName = s.event?.title || "Unknown Event";

    if (!acc[eventName]) {
      acc[eventName] = [];
    }

    acc[eventName].push(s);
    return acc;

  }, {});

  return (
    <>
      <AdminSidebar />
      <ToastContainer />

      {/* HEADER */}
      <div style={S.header}>
        <h1 style={S.headerh1}>Approved Sponsors Report</h1>
        <p style={S.headerp1}>
          Overview of all approved sponsors by event
        </p>
      </div>

      <div style={S.page}>

        {Object.keys(grouped).map((eventName, i) => {

          const eventSponsors = grouped[eventName];

          const total = eventSponsors.reduce(
            (sum, s) => sum + s.contributionAmount,
            0
          );

          return (
            <div key={i} style={S.card}>

              <h2 style={S.eventTitle}>{eventName}</h2>

              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Name</th>
                    <th style={S.th}>Tier</th>
                    <th style={S.th}>Amount</th>
                    <th style={S.th}>Email</th>
                  </tr>
                </thead>

                <tbody>
                  {eventSponsors.map(s => (
                    <tr key={s._id} style={S.row}>

                      <td style={{ ...S.td, ...S.company }}>
                        {
                         `${s.createdBy?.firstName} ${s.createdBy?.lastName}`}
                      </td>

                      <td style={S.td}>
                        <span style={S.tier(s.tier)}>
                          {s.tier}
                        </span>
                      </td>

                      <td style={{ ...S.td, ...S.amount }}>
                        LKR {s.contributionAmount}
                      </td>

                      <td style={S.td}>
                        {s.createdBy?.email || "N/A"}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={S.totalBox}>
                <span style={S.totalLabel}>Total Sponsorship</span>
                <span style={S.totalValue}>LKR {total}</span>
              </div>

            </div>
          );
        })}

      </div>
    </>
  );
}

const S = {

    // ===== HEADER =====
    header: {
      marginLeft: 260,
      background: "linear-gradient(90deg, #0f172a, #1e293b)",
      color: "#fff",
      padding: "30px 40px",
      marginTop:"-6.5%"
    },
  
    headerTitle: {
      margin: 0,
      fontSize: "28px",
      fontWeight: "800",
      color: "#fff",
    },
  
    headerSub: {
      marginTop: "6px",
      color: "#cbd5f5",
      fontSize: "14px"
    },

    headerh1 :{
        fontSize: "28px",
        fontWeight: "800",
        color: "#fff",
    },

    headerp1 :{
        marginTop: "8px",
        color: "#cbd5f5"
    },
  
    // ===== PAGE =====
    page: {
      marginLeft: 260,
      padding: "40px",
      background: "#f1f5f9",
      minHeight: "100vh"
    },
  
    // ===== EVENT CARD =====
    card: {
      background: "#ffffff",
      padding: "24px",
      borderRadius: "16px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.06)",
      marginBottom: "25px"
    },
  
    eventHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px"
    },
  
    eventTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#0f172a"
    },
  
    sponsorCount: {
      fontSize: "12px",
      background: "#e0e7ff",
      color: "#3730a3",
      padding: "4px 10px",
      borderRadius: "999px",
      fontWeight: "600"
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
      fontSize: "12px",
      color: "#64748b",
      fontWeight: "600"
    },
  
    row: {
      background: "#f8fafc",
      borderRadius: "12px"
    },
  
    td: {
      padding: "12px 10px",
      fontSize: "14px",
      color: "#334155"
    },
  
    company: {
      fontWeight: "600",
      color: "#0f172a"
    },
  
    amount: {
      fontWeight: "700",
      color: "#16a34a"
    },
  
    // ===== TIER BADGES =====
    tier: (tier) => ({
      padding: "4px 10px",
      borderRadius: "999px",
      fontSize: "12px",
      fontWeight: "600",
      background:
        tier === "Gold" ? "#fef3c7" :
        tier === "Silver" ? "#e2e8f0" :
        "#fde68a",
      color:
        tier === "Gold" ? "#92400e" :
        tier === "Silver" ? "#334155" :
        "#78350f"
    }),
  
    // ===== TOTAL BOX =====
    totalBox: {
      marginTop: "15px",
      padding: "12px 16px",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
  
    totalLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#166534"
    },
  
    totalValue: {
      fontSize: "18px",
      fontWeight: "800",
      color: "#065f46"
    }
  };