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
          <div className="navbar__logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 22V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 7L12 12L3 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 7L16.5 9.5M7.5 9.5L12 12" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          DecentraEscrow
        </Link>

        <ul className={`navbar__links${menuOpen ? ' open' : ''}`}>
          <li>
            <NavLink
              to="/marketplace"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setMenuOpen(false)}
            >
              Browse Jobs
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/create-job"
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={() => setMenuOpen(false)}
            >
              Create Job
            </NavLink>
          </li>
          <li>
            <a href="/#how-it-works" onClick={() => setMenuOpen(false)}>
              How It Works
            </a>
          </li>
          <li>
            <a href="/#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
          </li>
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
