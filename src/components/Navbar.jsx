// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import WalletButton from './WalletButton.jsx';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">🔒</div>
          DecentraEscrow
        </Link>
        <ul className={`navbar__links${menuOpen ? ' open' : ''}`}>
          <li><NavLink to="/marketplace" onClick={() => setMenuOpen(false)}>Browse Jobs</NavLink></li>
          <li><NavLink to="/create-job" onClick={() => setMenuOpen(false)}>Create Job</NavLink></li>
          <li><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a></li>
          <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
        </ul>
        <div className="navbar__right">
          <WalletButton />
          <button
            className="navbar__hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
