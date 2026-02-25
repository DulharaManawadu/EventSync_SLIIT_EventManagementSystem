import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>CampusSync</div>

      <div>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/admin/venues" style={styles.link}>Admin</Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    background: "#0f172a",
    color: "white",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "600",
  },
  link: {
    marginLeft: "20px",
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  }
};

export default Navbar;