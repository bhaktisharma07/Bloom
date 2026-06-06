import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Landing from './pages/Landing';
import Home from './pages/Home';
import { FlowerLogoSVG } from './components/SVGAssets';

function App() {
  return (
    <Router>
      <div className="app-container">
        
        {/* Brand Header */}
        <header className="top-header">
          <Link to="/" className="top-logo">
            <FlowerLogoSVG />
            <span>Bloom</span>
          </Link>
        </header>

        {/* Dynamic Route Pages */}
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;
