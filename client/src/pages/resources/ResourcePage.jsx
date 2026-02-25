import { useEffect, useState } from "react";
import { getResources } from "../../services/resourceService";
import ResourceForm from "../../components/resources/ResourceForm";
import ResourceList from "../../components/resources/ResourceList";

const ResourcePage = () => {
  const [resources, setResources] = useState([]);

  const fetchResources = async () => {
    const res = await getResources();
    setResources(res.data);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Resource Management</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <ResourceForm refresh={fetchResources} />
        </div>

        <div style={styles.card}>
          <ResourceList resources={resources} refresh={fetchResources} />
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

export default ResourcePage;