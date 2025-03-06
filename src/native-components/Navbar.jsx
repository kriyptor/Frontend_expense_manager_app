import React, { useState } from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <h1>Expense Manager</h1>
        </div>

        {/* Hamburger menu for mobile */}
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation links */}
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <button className="premium-btn">Buy Premium</button>
          <button className="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;