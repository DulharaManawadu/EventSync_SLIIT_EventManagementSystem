import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div style={styles.container}>
      <AdminSidebar />

      <div style={styles.content}>
        <div style={styles.header}>
          <h1>Admin Dashboard</h1>
        </div>

        <div style={styles.main}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
  },
  content: {
    flex: 1,
    background: "#f1f5f9",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    padding: "20px 30px",
    background: "white",
    borderBottom: "1px solid #e2e8f0",
    fontWeight: "bold"
  },
  main: {
    padding: "30px"
  }
};



export default AdminLayout;