import { useEffect, useState } from "react";
import { getVenues } from "../../services/venueService";
import VenueForm from "../../components/venues/VenueForm";
import VenueList from "../../components/venues/VenueList";

const VenuePage = () => {
  const [venues, setVenues] = useState([]);

  const fetchVenues = async () => {
    const res = await getVenues();
    setVenues(res.data);
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Venue Management</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <VenueForm refresh={fetchVenues} />
        </div>

        <div style={styles.card}>
          <VenueList venues={venues} refresh={fetchVenues} />
        </div>
      </div>
    </div>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr",
    gap: "20px"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  }
};

export default VenuePage;