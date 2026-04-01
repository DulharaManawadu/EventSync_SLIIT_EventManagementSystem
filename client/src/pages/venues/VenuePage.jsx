import { useEffect, useState } from "react";
import { getVenues } from "../../services/venueService";
import VenueForm from "../../components/venues/VenueForm";
import VenueList from "../../components/venues/VenueList";

const VenuePage = () => {
  const [venues, setVenues] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null); // 🔥 important

  const fetchVenues = async () => {
    try {
      const res = await getVenues();
      setVenues(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <div>
      {/* HEADER */}
      <div style={styles.header}>
        <h2>Venue Management</h2>

        <button
          style={styles.addBtn}
          onClick={() => {
            setSelectedVenue(null); // reset for create
            setOpen(true);
          }}
        >
          + Add Venue
        </button>
      </div>

      {/* TABLE */}
      <div style={styles.card}>
        <VenueList
          venues={venues}
          refresh={fetchVenues}
          onEdit={(venue) => {
            setSelectedVenue(venue); // 🔥 pass data
            setOpen(true);
          }}
        />
      </div>

      {/* MODAL */}
      {open && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <VenueForm
              refresh={fetchVenues}
              close={() => setOpen(false)}
              initialData={selectedVenue} // 🔥 important
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
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
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

export default VenuePage;
