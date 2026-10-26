// src/pages/TransactionSuccess.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const TransactionSuccess = () => {
  const navigate = useNavigate();

  return (
    <main className="page-wrapper">
      <div className="container success-page">
        <div className="success-icon">✓</div>
        <h1 className="success-title">Payment Released!</h1>
        <p className="success-sub">
          The escrow payment has been successfully transferred to the freelancer.
        </p>

        <div className="card tx-card">
          <div className="tx-row">
            <span className="tx-label">Transaction Hash</span>
            <a
              href="https://sepolia.etherscan.io/tx/0x2e9c"
              target="_blank"
              rel="noopener noreferrer"
              className="tx-hash-link"
            >
              0x2e9c...c1e2 ↗
            </a>
          </div>
          <div className="tx-row">
            <span className="tx-label">Amount</span>
            <span className="tx-value purple">0.05 ETH</span>
          </div>
          <div className="tx-row">
            <span className="tx-label">To (Freelancer)</span>
            <span className="tx-value">0x5C...8e3F</span>
          </div>
          <div className="tx-row">
            <span className="tx-label">Status</span>
            <span className="badge badge-green">✓ Success</span>
          </div>
          <div className="tx-row">
            <span className="tx-label">Network</span>
            <span className="tx-value" style={{fontFamily: 'inherit', fontWeight: 500}}>Sepolia Testnet</span>
          </div>
          <div className="tx-row">
            <span className="tx-label">Date</span>
            <span className="tx-value" style={{fontFamily: 'inherit', fontWeight: 400}}>Oct 23, 2026, 5:14 PM</span>
          </div>
        </div>

        <div className="success-actions">
          <a
            href="https://sepolia.etherscan.io/tx/0x2e9c"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline btn-full"
          >
            View on Etherscan ↗
          </a>
          <button className="success-back" onClick={() => navigate('/marketplace')}>
            ← Back to Jobs
          </button>
        </div>
      </div>
    </main>
  );
};

export default TransactionSuccess;
