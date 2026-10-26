// src/pages/ClientReview.jsx
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_JOBS } from '../utils/mockData.js';

const ClientReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = MOCK_JOBS.find(j => j.id === id) || MOCK_JOBS[0];

  return (
    <main className="page-wrapper">
      <div className="container review-page">
        <Link to={`/jobs/${id}/progress`} className="back-link">← Back to Progress</Link>

        <div className="review-page__header">
          <h1 className="review-page__title">Review Submission</h1>
          <p className="review-page__sub">Freelancer has submitted the work. Please review and take action.</p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start'}}>
          {/* Main */}
          <div className="card">
            <h3 style={{fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem'}}>Submission</h3>

            <div className="review-preview">
              <p className="review-preview__text">Build Something Amazing</p>
            </div>

            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem'}}>Submission Link</p>
            <a
              href="https://github.com/username/landing-page"
              target="_blank"
              rel="noopener noreferrer"
              className="submission-link"
              style={{marginBottom: '1.25rem'}}
            >
              🔗 https://github.com/username/landing-page ↗
            </a>

            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem'}}>Message from Freelancer</p>
            <p className="submission-msg">
              Hi, I've completed all the requirements. The landing page is fully responsive, achieves Lighthouse 95+, and includes all requested sections. Please review and let me know if you need any changes!
            </p>
          </div>

          {/* Actions */}
          <div>
            <div className="card">
              <h3 style={{fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem'}}>{job.title}</h3>
              <p style={{fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
                Review the submission and release escrow payment or raise a dispute.
              </p>
              <div className="review-actions">
                <button
                  className="btn btn-green btn-full"
                  onClick={() => navigate('/transaction-success')}
                >
                  ✓ Approve &amp; Release Payment
                </button>
                <button className="btn btn-red-outline btn-full">
                  ⚠ Raise a Dispute
                </button>
              </div>
              <p style={{fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center'}}>
                Approving will release {job.budget} ETH to the freelancer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ClientReview;
