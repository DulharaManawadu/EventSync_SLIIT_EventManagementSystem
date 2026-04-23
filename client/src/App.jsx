import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/staticpages/Home';
import About from './pages/staticpages/About';
import OurServices from './pages/staticpages/OurServices';
import ContactUs from './pages/staticpages/ContactUs';
import CreateEvent from './pages/events/CreateEvent';
import Events from './pages/events/Events';
import Analytics from './pages/admin/adminAnalytics/Analytics';
import AdminDashboardAnalytics from './pages/admin/adminAnalytics/AdminDashboardAnalytics';
import EventApproval from './pages/admin/adminEventDash/EventApproval';
import Sponserpage from './pages/staticpages/sponserpage.jsx';
import Login from './pages/auth/Login';
import RegisterSelection from './pages/auth/RegisterSelection';
import RegisterForm from './pages/auth/RegisterForm';
import VendorDashboard from './pages/auth/VendorDashboard';
import VendorProfile from './pages/auth/VendorProfile';
import VendorEditProfile from './pages/auth/VendorEditProfile';
import VendorEventApply from './pages/auth/VendorEventApply';
import VendorApplicationDetails from './pages/auth/VendorApplicationDetails';
import QrCheckin from './pages/auth/QrCheckin';
import ProtectedRoute from './components/ProtectedRoute';

import Venues from './pages/admin/venues/Venues';
import Resources from './pages/admin/resources/Resources';
import Sponsors from './pages/admin/sponsors/Sponsors';
import EventAllocation from './pages/admin/allocation/EventAllocation.jsx';
import QrGeneration from './pages/admin/qrGeneration/QrGeneration';
import VendorManagement from './pages/admin/VendorManagement';
import VendorApplicationDetailsAdmin from './pages/admin/VendorApplicationDetailsAdmin';
import UserManagement from './pages/admin/UserManagement';
import MyRegistrations from './pages/events/MyRegistrations';
import ApprovedSponsors from './pages/admin/sponsors/SponserList.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<OurServices />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterSelection />} />
        <Route path="/register/:userType" element={<RegisterForm />} />
        <Route path="/vendor-dashboard" element={<ProtectedRoute roles={['Vendor']}><VendorDashboard /></ProtectedRoute>} />
        <Route path="/vendor-profile" element={<ProtectedRoute roles={['Vendor']}><VendorProfile /></ProtectedRoute>} />
        <Route path="/vendor-profile/edit" element={<ProtectedRoute roles={['Vendor']}><VendorEditProfile /></ProtectedRoute>} />
        <Route path="/vendor-events/apply/:eventId" element={<ProtectedRoute roles={['Vendor']}><VendorEventApply /></ProtectedRoute>} />
        <Route path="/vendor-applications/:id" element={<ProtectedRoute roles={['Vendor']}><VendorApplicationDetails /></ProtectedRoute>} />
        <Route path="/qr-checkin" element={<QrCheckin />} />
        <Route path="/create-event" element={<ProtectedRoute roles={['Admin', 'Student']}><CreateEvent /></ProtectedRoute>} />
        <Route path="/events" element={<Events />} />
        <Route path="/my-registrations" element={<ProtectedRoute roles={['Student']}><MyRegistrations /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute roles={['Admin']}><Analytics /></ProtectedRoute>} />
        <Route path="/sponsers-events" element={<Sponserpage />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<ProtectedRoute roles={['Admin']}><AdminDashboardAnalytics /></ProtectedRoute>} />
        <Route path="/event-approval" element={<ProtectedRoute roles={['Admin']}><EventApproval /></ProtectedRoute>} />
        <Route path="/venues" element={<ProtectedRoute roles={['Admin']}><Venues /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute roles={['Admin']}><Resources /></ProtectedRoute>} />
        <Route path="/sponsors" element={<ProtectedRoute roles={['Admin']}><Sponsors /></ProtectedRoute>} />
        <Route path="/approved-sponsors" element={<ProtectedRoute roles={['Admin']}><ApprovedSponsors /></ProtectedRoute>} />
        <Route path="/event-allocation" element={<ProtectedRoute roles={['Admin']}><EventAllocation /></ProtectedRoute>} />
        <Route path="/qr-generation" element={<ProtectedRoute roles={['Admin']}><QrGeneration /></ProtectedRoute>} />
        <Route path="/vendor-management" element={<ProtectedRoute roles={['Admin']}><VendorManagement /></ProtectedRoute>} />
        <Route path="/vendor-application-admin/:id" element={<ProtectedRoute roles={['Admin']}><VendorApplicationDetailsAdmin /></ProtectedRoute>} />
        <Route path="/user-management" element={<ProtectedRoute roles={['Admin']}><UserManagement /></ProtectedRoute>} />
        
        {/* additional routes */}
      </Routes>
    </Router>
  );
}

export default App;
