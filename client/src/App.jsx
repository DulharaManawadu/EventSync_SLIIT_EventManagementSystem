import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import About from './About';
import OurServices from './OurServices';
import ContactUs from './ContactUs';
import CreateEvent from './CreateEvent';
import Events from './Events';
import Analytics from './Analytics';
import AdminDashboardAnalytics from './AdminDashboardAnalytics';
import EventApproval from './EventApproval';
import QRGeneration from './QRGeneration';
import SponsorshipManagement from './SponsorshipManagement';
import VendorManagement from './VendorManagement';
import UserManagement from './UserManagement';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<OurServices />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/events" element={<Events />} />
        <Route path="/analytics" element={<Analytics />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboardAnalytics />} />
        <Route path="/event-approval" element={<EventApproval />} />
        <Route path="/qr-generation" element={<QRGeneration />} />
        <Route path="/sponsorship-management" element={<SponsorshipManagement />} />
        <Route path="/vendor-management" element={<VendorManagement />} />
        <Route path="/user-management" element={<UserManagement />} />
        
        {/* additional routes */}
      </Routes>
    </Router>
  );
}

export default App;
