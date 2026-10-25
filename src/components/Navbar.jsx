// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import WalletButton from './WalletButton.jsx';
import './../styles/components.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar__logo">DecentraEscrow</div>
      <ul className="navbar__links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/marketplace">Marketplace</Link></li>
        <li><Link to="/create-job">Create Job</Link></li>
        <li><Link to="/buyer-dashboard">Buyer Dashboard</Link></li>
        <li><Link to="/freelancer-dashboard">Freelancer Dashboard</Link></li>
      </ul>
      <WalletButton />
    </nav>
  );
};

export default Navbar;
