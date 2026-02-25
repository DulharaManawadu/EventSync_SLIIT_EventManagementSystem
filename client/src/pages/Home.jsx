const Home = () => {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>CampusSync</h1>
          <p style={styles.subtitle}>
            Smart Campus Event & Sponsorship Management Platform
          </p>
  
          <div style={styles.features}>
            <div style={styles.featureBox}>
              <h3>📅 Event Management</h3>
              <p>Create, approve, and manage university events efficiently.</p>
            </div>
  
            <div style={styles.featureBox}>
              <h3>🏢 Venue & Resources</h3>
              <p>Allocate venues and prevent resource conflicts seamlessly.</p>
            </div>
  
            <div style={styles.featureBox}>
              <h3>🤝 Sponsorship</h3>
              <p>Manage sponsor applications and approval workflows.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "85vh",
      background: "linear-gradient(to right, #e0f2fe, #f1f5f9)",
      padding: "20px"
    },
    card: {
      textAlign: "center",
      maxWidth: "900px"
    },
    title: {
      fontSize: "42px",
      fontWeight: "700",
      color: "#0f172a",
      marginBottom: "10px"
    },
    subtitle: {
      fontSize: "18px",
      color: "#334155",
      marginBottom: "40px"
    },
    features: {
      display: "flex",
      justifyContent: "space-between",
      gap: "20px",
      flexWrap: "wrap"
    },
    featureBox: {
      background: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
      flex: "1",
      minWidth: "250px"
    }
  };
  
  export default Home;