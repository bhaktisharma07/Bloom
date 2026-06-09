import React from 'react';
import { HashRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import { TodayIconSVG, DashboardIconSVG, ProgressIconSVG } from './components/SVGAssets';

function NavigationBar() {
  const location = useLocation();
  
  // Show navigation bar on /home, /dashboard, and /progress routes
  const showNav = 
    location.pathname === '/home' || 
    location.pathname === '/dashboard' || 
    location.pathname === '/progress';
  
  if (!showNav) return null;

  return (
    <nav className="floating-nav">
      <NavLink 
        to="/home" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <TodayIconSVG />
        <span>Today</span>
      </NavLink>
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <DashboardIconSVG />
        <span>Dashboard</span>
      </NavLink>
      <NavLink 
        to="/progress" 
        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
      >
        <ProgressIconSVG />
        <span>Progress</span>
      </NavLink>
    </nav>
  );
}

function AppContent() {
  return (
    <div className="app-container">
      
      {/* Brand Header */}
      <header className="top-header">
        <Link to="/" className="top-logo">
          <span>Bloom</span>
        </Link>
      </header>

      {/* Dynamic Route Pages */}
      <main>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/progress" element={<Progress />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <NavigationBar />

    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
