// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    title: 'Secure Payments',
    desc: 'Funds locked in smart contracts',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: 'Transparent',
    desc: 'Verify all transactions on-chain',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    title: 'No Intermediaries',
    desc: 'Direct client-freelancer transactions',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
        <path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/>
        <path d="M7 21h10"/>
        <path d="M12 3v18"/>
        <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
      </svg>
    ),
    title: 'Dispute Resolution',
    desc: 'Fair and predefined rules',
  },
];

const Home = () => (
  <main className="page-wrapper">
    <div className="container">
      {/* Hero (Screen 1) */}
      <section className="home-hero">
        <div className="home-hero__content">
          <h1 className="home-hero__title">
            Secure Freelancing Payments with{' '}
            <span className="home-hero__title-gradient">Decentralized Escrow</span>
          </h1>
          <p className="home-hero__sub">
            Lock payments, ensure fair work delivery, and transact with transparency using blockchain smart contracts.
          </p>
          <div className="home-hero__actions">
            <Link to="/marketplace" className="btn btn-primary">
              Get Started
            </Link>
            <a href="#how-it-works" className="btn-how-it-works">
              <span style={{ fontSize: '0.8rem', color: 'var(--purple-primary)' }}>▶</span> How It Works
            </a>
          </div>
        </div>

        {/* 3D Isometric Web3 Graphic */}
        <div className="home-hero__illustration">
          <div className="isometric-graphic">
            {/* Ethereum Shield */}
            <div className="isometric-shield">
              <div className="isometric-shield__eth">
                <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11.999 1.5L4.5 13.875L11.999 18.25L19.5 13.875L11.999 1.5Z" fill="rgba(255,255,255,0.2)"/>
                  <path d="M11.999 18.25L4.5 13.875L11.999 22.5L19.5 13.875L11.999 18.25Z" fill="rgba(255,255,255,0.1)"/>
                  <path d="M11.999 1.5V18.25V22.5" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>

            {/* Gold Ethereum Coin */}
            <div className="isometric-coin">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L4 13L12 18L20 13L12 2Z" fill="rgba(255,255,255,0.3)"/>
                <path d="M12 18L4 13L12 22L20 13L12 18Z"/>
              </svg>
            </div>

            {/* Floating Contract Card */}
            <div className="isometric-doc">
              <div className="isometric-doc__line" style={{ width: '45%', background: '#6366f1' }} />
              <div className="isometric-doc__line" />
              <div className="isometric-doc__line" />
              <div className="isometric-doc__line short" />
              <div className="isometric-doc__line highlight" style={{ marginTop: 'auto' }} />
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Boxes (Screen 1 Bottom) */}
      <section className="features-section" id="how-it-works">
        <div className="features-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-box">
              <div className="feature-box__icon-wrap">{f.icon}</div>
              <h3 className="feature-box__title">{f.title}</h3>
              <p className="feature-box__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  </main>
);

export default Home;
