import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Admin Panel</h2>

      <Link to="/admin" style={styles.link}>Dashboard</Link>
      <Link to="/admin/venues" style={styles.link}>Venues</Link>
      <Link to="/admin/resources" style={styles.link}>Resources</Link>
      <Link to="/admin/sponsors" style={styles.link}>Sponsors</Link>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "220px",
    background: "#0f172a",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    marginBottom: "30px"
  },
  link: {
    color: "white",
    textDecoration: "none",
    marginBottom: "15px"
  }
};

export default AdminSidebar;