// src/pages/ClientReview.jsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEscrow } from '../context/EscrowContext.jsx';
import { useWallet } from '../hooks/useWallet.js';

const ClientReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJob, approveAndRelease, raiseDispute } = useEscrow();
  const { signer } = useWallet();

  const job = getJob(id);
  const [isReleasing, setIsReleasing] = useState(false);
  const [disputeOpen, setDisputeOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const submission = job.submission || {
    url: 'https://github.com/username/landing-page',
    message: 'Here is the completed landing page. Please review and let me know if any changes are needed.',
  };

  const handleApprove = async () => {
    try {
      setIsReleasing(true);
      await approveAndRelease(job.id, signer);
      navigate('/transaction-success');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Payment release failed');
    } finally {
      setIsReleasing(false);
    }
  };

  const handleRaiseDispute = () => {
    if (!disputeOpen) {
      setDisputeOpen(true);
      return;
    }
    raiseDispute(job.id, disputeReason || 'Work does not match specifications');
    alert('Dispute has been raised and recorded. An arbiter will review the case.');
    navigate(`/jobs/${job.id}/progress`);
  };

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="client-review-wrapper">
          <Link to={`/jobs/${job.id}/progress`} className="back-link">
            ← Back to Progress
          </Link>

          <div className="review-card">
            <div className="review-header">
              <h1 className="review-title">Review Submission</h1>
              <p className="review-sub">
                Freelancer has submitted the work. Please review and take an action.
              </p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                Submission
              </h3>

              {/* Browser Preview Window Frame (Mockup Screen 7) */}
              <div className="browser-frame">
                <div className="browser-frame__bar">
                  <div className="browser-frame__dots">
                    <div className="browser-frame__dot red" />
                    <div className="browser-frame__dot yellow" />
                    <div className="browser-frame__dot green" />
                  </div>
                  <div className="browser-frame__address-bar">
                    {submission.url}
                  </div>
                </div>

                <div className="browser-frame__content">
                  <h2 className="browser-frame__hero-title">Build Something Amazing</h2>
                  <p style={{ fontSize: '0.825rem', color: '#94a3b8', maxWidth: '380px', marginBottom: '1.25rem' }}>
                    Next-generation decentralized tools crafted for modern Web3 teams.
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="browser-frame__hero-btn">Get Started</button>
                    <button style={{
                      padding: '0.45rem 1rem',
                      background: 'rgba(255,255,255,0.1)',
                      color: '#ffffff',
                      borderRadius: '0.35rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      Learn More
                    </button>
                  </div>
                </div>
              </div>

              {/* Submission URL & Message */}
              <div style={{ marginBottom: '0.75rem' }}>
                <a
                  href={submission.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="submission-box__link"
                >
                  {submission.url}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>

              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {submission.message}
              </p>
            </div>

            {/* Dispute Input if toggled */}
            {disputeOpen && (
              <div style={{ margin: '1rem 0', padding: '1rem', background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: '0.5rem' }}>
                <label className="form-label" style={{ color: 'var(--red)' }}>Reason for Dispute</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '70px', marginBottom: '0.5rem' }}
                  placeholder="Describe why the work does not meet specifications..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                />
              </div>
            )}

            {/* Action Buttons (Matches Mockup Screen 7) */}
            <div className="review-actions-wrap">
              <button
                className="btn btn-green btn-full"
                onClick={handleApprove}
                disabled={isReleasing}
              >
                {isReleasing ? 'Releasing Funds in MetaMask...' : '✓ Approve & Release Payment'}
              </button>

              <button
                className="btn btn-red-outline btn-full"
                onClick={handleRaiseRaiseClick => handleRaiseDispute()}
              >
                ⚠️ Raise a Dispute
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClientReview;
