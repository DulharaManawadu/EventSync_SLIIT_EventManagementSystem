import { useEffect, useState } from "react";
import { getSponsors } from "../../services/sponsorService";
import SponsorList from "../../components/sponsors/SponsorList";

const SponsorPage = () => {
  const [sponsors, setSponsors] = useState([]);

  const fetchSponsors = async () => {
    const res = await getSponsors();
    setSponsors(res.data);
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Sponsor Management</h1>

      <div style={styles.card}>
        <SponsorList sponsors={sponsors} refresh={fetchSponsors} />
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  }
};

export default SponsorPage;