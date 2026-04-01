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

import Venues from './pages/admin/venues/Venues';
import Resources from './pages/admin/resources/Resources';
import Sponsors from './pages/admin/sponsors/Sponsors';

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
        <Route path="/sponsers-events" element={<Sponserpage />} />
        
        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<AdminDashboardAnalytics />} />
        <Route path="/event-approval" element={<EventApproval />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/sponsors" element={<Sponsors />} />
        
        {/* additional routes */}
      </Routes>
    </Router>
  );
}

export default App;
