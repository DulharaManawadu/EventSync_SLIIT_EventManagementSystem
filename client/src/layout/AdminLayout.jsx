import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = () => {
  return (
    <div style={styles.container}>
      <AdminSidebar />
      <div style={styles.content}>
        <Outlet />
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
    padding: "30px",
    background: "#f8fafc"
  }
};

export default AdminLayout;