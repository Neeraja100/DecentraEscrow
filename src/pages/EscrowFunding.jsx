// src/pages/EscrowFunding.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_JOBS } from '../utils/mockData.js';
import { useWallet } from '../hooks/useWallet.js';

const STEPS = ['Details', 'Fund Escrow', 'Confirm'];

const EscrowFunding = () => {
  const { id } = useParams();
  const { isConnected, connectWallet } = useWallet();
  const job = MOCK_JOBS.find(j => j.id === id) || MOCK_JOBS[0];

  return (
    <main className="page-wrapper">
      <div className="container escrow-page">
        <div className="escrow-page__inner">
          {/* Stepper */}
          <div className="stepper">
            {STEPS.map((s, i) => (
              <React.Fragment key={s}>
                <div className={`stepper__step${i === 1 ? ' active' : i === 0 ? ' done' : ''}`}>
                  <div className="stepper__circle">{i === 0 ? '✓' : i + 1}</div>
                  <span className="stepper__label">{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`stepper__line${i === 0 ? ' done' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Card */}
          <div className="card escrow-card">
            <h2 className="escrow-card__title">Fund the Escrow</h2>
            <p className="escrow-card__sub">
              Deposit the agreed ETH amount into the smart contract. Funds are locked until work is approved.
            </p>

            <table className="escrow-table">
              <tbody>
                <tr><td>Job</td><td>{job.title}</td></tr>
                <tr><td>Freelancer</td><td>0x5C6...8e3F</td></tr>
                <tr><td>Amount</td><td>{job.budget} ETH</td></tr>
                <tr><td>Network</td><td>Sepolia Testnet</td></tr>
              </tbody>
            </table>

            <button
              className="btn btn-primary btn-full"
              onClick={!isConnected ? connectWallet : undefined}
            >
              {isConnected ? '⚡ Deposit to Escrow' : '🔗 Connect Wallet & Deposit'}
            </button>

            <p className="escrow-note">
              You'll be asked to confirm the transaction in MetaMask.
            </p>
          </div>

          <div style={{textAlign: 'center', marginTop: '1.5rem'}}>
            <Link to={`/jobs/${id}`} className="btn btn-outline btn-sm">← Back to Job</Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EscrowFunding;
