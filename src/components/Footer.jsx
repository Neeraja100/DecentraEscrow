// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer">
    <div className="footer__inner">
      <div className="footer__brand">
        <div className="footer__logo">🔒 DecentraEscrow</div>
        <p className="footer__desc">
          Secure freelance payments powered by Ethereum smart contracts. Work with confidence.
        </p>
      </div>
      <nav className="footer__links">
        <Link to="/marketplace">Browse Jobs</Link>
        <Link to="/create-job">Create Job</Link>
        <a href="#how-it-works">How It Works</a>
      </nav>
    </div>
    <p className="footer__bottom">© 2026 DecentraEscrow. All rights reserved.</p>
  </footer>
);

export default Footer;
