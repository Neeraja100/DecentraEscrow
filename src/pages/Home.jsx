// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  { icon: '🔒', title: 'Secure Payments', desc: 'Funds are locked in smart contracts and only released when work is approved.' },
  { icon: '🔍', title: 'Transparent', desc: 'Verify every transaction and contract state on-chain, anytime.' },
  { icon: '⚡', title: 'No Intermediaries', desc: 'Direct client-to-freelancer transactions with zero middleman fees.' },
  { icon: '⚖️', title: 'Dispute Resolution', desc: 'Fair, predefined dispute rules built directly into the smart contract.' },
];

const Home = () => (
  <main className="page-wrapper">
    <div className="container">
      {/* Hero */}
      <section className="hero">
        <div className="hero__content">
          <div className="hero__eyebrow">Powered by Ethereum</div>
          <h1 className="hero__title">
            Secure Freelancing Payments with{' '}
            <span>Decentralized Escrow</span>
          </h1>
          <p className="hero__sub">
            Lock payments, ensure fair work delivery, and transact with transparency using blockchain smart contracts.
          </p>
          <div className="hero__actions">
            <Link to="/marketplace" className="btn btn-primary">Get Started →</Link>
            <a href="#how-it-works" className="btn btn-outline">How It Works</a>
          </div>
        </div>
        <div className="hero__illustration">
          <div className="hero__visual">
            <div className="hero__orb" />
            <div className="hero__orb" />
            <div className="hero__shield">🛡️</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="how-it-works">
        <h2 className="features__title">Why DecentraEscrow?</h2>
        <p className="features__sub">Everything you need for safe, transparent freelance transactions</p>
        <div className="features__grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-card__icon">{f.icon}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  </main>
);

export default Home;
