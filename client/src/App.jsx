import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

/* Admin Side Pages */
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VenuePage from "./pages/venues/VenuePage";
import ResourcePage from "./pages/resources/ResourcePage";
import SponsorPage from "./pages/sponsors/SponsorPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="venues" element={<VenuePage />} />
          <Route path="resources" element={<ResourcePage />} />
          <Route path="sponsors" element={<SponsorPage />} />
        </Route>
      </Routes>
    </Router>
  );
}


export default App;