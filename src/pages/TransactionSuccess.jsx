// src/pages/TransactionSuccess.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEscrow } from '../context/EscrowContext.jsx';
import { getExplorerTxUrl } from '../utils/contract.js';

const TransactionSuccess = () => {
  const navigate = useNavigate();
  const { lastTx } = useEscrow();

  const txData = lastTx || {
    hash: '0x7a9c8f2b1d3e4a5c6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7bc3d2',
    amount: '0.05 ETH',
    recipient: '0x5C...8a3F',
    status: 'Success',
    network: 'Sepolia Testnet',
    date: 'Oct 23, 2026, 5:14 PM',
  };

  const shortHash = `${txData.hash.slice(0, 6)}...${txData.hash.slice(-4)}`;
  const explorerUrl = getExplorerTxUrl(txData.hash);

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="tx-success-wrapper">
          <div className="tx-success-card">
            {/* Celebration Icon with Confetti */}
            <div className="tx-success-circle-wrap">
              <div className="tx-success-circle">✓</div>
              <div className="confetti-dot c-1" />
              <div className="confetti-dot c-2" />
              <div className="confetti-dot c-3" />
              <div className="confetti-dot c-4" />
            </div>

            <h1 className="tx-success-title">Payment Released!</h1>
            <p className="tx-success-sub">
              The escrow payment has been successfully transferred to the freelancer.
            </p>

            {/* Details Table (Screen 8) */}
            <div className="tx-details-table">
              <div className="tx-row">
                <span className="tx-row__label">Transaction Hash</span>
                <a
                  href={explorerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-row__link"
                >
                  {shortHash}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>

              <div className="tx-row">
                <span className="tx-row__label">Amount</span>
                <span className="tx-row__value" style={{ color: 'var(--purple-primary)' }}>
                  {txData.amount}
                </span>
              </div>

              <div className="tx-row">
                <span className="tx-row__label">To (Freelancer)</span>
                <span className="tx-row__value">{txData.recipient}</span>
              </div>

              <div className="tx-row">
                <span className="tx-row__label">Status</span>
                <span className="badge badge-green">✓ {txData.status}</span>
              </div>

              <div className="tx-row">
                <span className="tx-row__label">Network</span>
                <span className="tx-row__value" style={{ fontWeight: 600 }}>
                  {txData.network}
                </span>
              </div>

              <div className="tx-row">
                <span className="tx-row__label">Date</span>
                <span className="tx-row__value" style={{ fontWeight: 500, color: 'var(--text-muted)' }}>
                  {txData.date}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="tx-actions-row">
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-full"
              >
                View on Etherscan ↗
              </a>
              <button
                className="btn btn-outline btn-full"
                onClick={() => navigate('/marketplace')}
              >
                Back to Jobs
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TransactionSuccess;
