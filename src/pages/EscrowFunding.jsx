// src/pages/EscrowFunding.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '../hooks/useWallet.js';
import { useEscrow } from '../context/EscrowContext.jsx';

const EscrowFunding = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isConnected, connectWallet, signer } = useWallet();
  const { getJob, fundJob } = useEscrow();

  const job = getJob(id);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    try {
      setIsProcessing(true);
      await fundJob(job.id, signer);
      navigate(`/jobs/${job.id}/progress`);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Deposit failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const freelancerShort = job.freelancerShort || '0x5C...8a3F';

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="escrow-funding-wrapper">
          {/* Stepper (Screen 5) */}
          <div className="stepper-header">
            <div className="stepper-step done">
              <div className="stepper-circle">✓</div>
              <span>Details</span>
            </div>
            <div className="stepper-divider done" />
            <div className="stepper-step active">
              <div className="stepper-circle">2</div>
              <span>Fund Escrow</span>
            </div>
            <div className="stepper-divider" />
            <div className="stepper-step">
              <div className="stepper-circle">3</div>
              <span>Confirm</span>
            </div>
          </div>

          {/* Funding Card */}
          <div className="funding-card">
            <div className="funding-card__wallet-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="2" y1="10" x2="22" y2="10"/>
                <circle cx="16" cy="14" r="1.5" fill="currentColor"/>
              </svg>
            </div>

            <h1 className="funding-card__title">Fund the Escrow</h1>
            <p className="funding-card__sub">
              Deposit {job.budget} ETH into the smart contract to secure this job. The funds will be locked and released only after you approve the work.
            </p>

            <div className="escrow-summary-table">
              <div className="summary-row">
                <span className="summary-row__label">Job</span>
                <span className="summary-row__value">{job.title}</span>
              </div>

              <div className="summary-row">
                <span className="summary-row__label">Freelancer</span>
                <span className="summary-row__value">
                  <span style={{
                    width: '1.25rem',
                    height: '1.25rem',
                    borderRadius: '50%',
                    background: '#e0e7ff',
                    color: '#4f46e5',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.65rem',
                    fontWeight: 700
                  }}>
                    5C
                  </span>
                  {freelancerShort}
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-row__label">Amount</span>
                <span className="summary-row__value" style={{ color: 'var(--purple-primary)' }}>
                  {job.budget} ETH (~ ${job.budgetUSD || Math.round(job.budget * 1700)})
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-row__label">Network</span>
                <span className="summary-network-pill">
                  <span className="summary-network-dot" />
                  Sepolia Testnet
                </span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-full"
              onClick={handleDeposit}
              disabled={isProcessing}
            >
              {isProcessing
                ? 'Confirming Transaction in MetaMask...'
                : !isConnected
                ? 'Connect Wallet & Deposit'
                : `Deposit ${job.budget} ETH to Escrow`}
            </button>

            <p className="funding-helper-text">
              You'll be asked to confirm the transaction in MetaMask.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EscrowFunding;
