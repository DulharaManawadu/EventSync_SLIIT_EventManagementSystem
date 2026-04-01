import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>CampusSync</h2>

      <NavLink to="/admin" style={styles.link}>
        Dashboard
      </NavLink>

      <NavLink to="/admin/venues" style={styles.link}>
        Venues
      </NavLink>

      <NavLink to="/admin/resources" style={styles.link}>
        Resources
      </NavLink>

      <NavLink to="/admin/sponsors" style={styles.link}>
        Sponsors
      </NavLink>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "240px",
    background: "#0f172a",
    color: "white",
    padding: "25px 20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 10px rgba(0,0,0,0.1)"
  },
  title: {
    marginBottom: "40px",
    fontSize: "20px",
    fontWeight: "bold",
    letterSpacing: "1px"
  },
  link: ({ isActive }) => ({
    color: isActive ? "#38bdf8" : "#cbd5f5",
    textDecoration: "none",
    marginBottom: "15px",
    padding: "10px 12px",
    borderRadius: "8px",
    background: isActive ? "rgba(56,189,248,0.15)" : "transparent",
    transition: "0.3s"
  })
};

export default AdminSidebar;