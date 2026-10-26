// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="footer" id="about">
    <div className="container">
      <div className="footer__inner">
        <div className="footer__brand">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 22V12" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 7L12 12L3 7" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>DecentraEscrow</span>
        </div>

        <p className="footer__copy">
          Decentralized freelancing payments powered by Ethereum Sepolia smart contracts.
        </p>

        <p className="footer__team">
          Team: Tejas • Harshit • Nupur • Neeraja
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
