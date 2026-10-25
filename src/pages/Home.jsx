// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

const Home = () => (
  <section className="home">
    <h1>DecentraEscrow</h1>
    <p>Secure freelance payments with blockchain escrow.</p>
    <div className="home__actions">
      <Link to="/marketplace" className="button primary">Explore Marketplace</Link>
      <Link to="#" className="button secondary">Learn More</Link>
    </div>
    <section className="home__steps">
      <h2>How escrow works</h2>
      <ol>
        <li>Client creates a job.</li>
        <li>Freelancer is selected.</li>
        <li>Client deposits ETH into the contract.</li>
        <li>Freelancer submits work.</li>
        <li>Client approves – payment released.</li>
      </ol>
    </section>
  </section>
);

export default Home;
