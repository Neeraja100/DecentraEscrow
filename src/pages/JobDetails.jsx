// src/pages/JobDetails.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEscrow } from '../context/EscrowContext.jsx';
import { CATEGORY_COLORS } from '../utils/mockData.js';

const JobDetails = () => {
  const { id } = useParams();
  const { getJob } = useEscrow();
  const job = getJob(id);

  const catClass = CATEGORY_COLORS[job.category] || 'badge-gray';
  const clientShort = job.clientShort || `${job.clientAddress.slice(0, 4)}...${job.clientAddress.slice(-4)}`;
  const avatarLetter = clientShort.slice(2, 4).toUpperCase();

  return (
    <main className="page-wrapper">
      <div className="container">
        <Link to="/marketplace" className="back-link">
          ← Back to Jobs
        </Link>

        {/* Hero Card */}
        <div className="job-details-hero-card">
          <div className="job-details-hero__top">
            <div>
              <div className="job-details-hero__title-row">
                <h1 className="job-details-hero__title">{job.title}</h1>
                <span className={`badge ${catClass}`}>{job.category}</span>
              </div>
              <p className="job-details-hero__subtitle">
                Responsive landing page for a product launch. Tech stack: React or Next.js.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {job.status === 'work_submitted' ? (
                <Link to={`/jobs/${job.id}/review`} className="btn btn-primary">
                  Review Submission
                </Link>
              ) : job.status === 'funded' ? (
                <Link to={`/jobs/${job.id}/progress`} className="btn btn-primary">
                  View Progress
                </Link>
              ) : (
                <Link to={`/escrow/${job.id}/fund`} className="btn btn-primary">
                  Apply for Job
                </Link>
              )}
            </div>
          </div>

          {/* Meta Stats Row */}
          <div className="meta-stats-row">
            <div className="meta-stat">
              <span className="meta-stat__icon">🪙</span>
              <div>
                <div className="meta-stat__label">Budget</div>
                <div className="meta-stat__val">{job.budget} ETH</div>
              </div>
            </div>

            <div className="meta-stat">
              <span className="meta-stat__icon">🕒</span>
              <div>
                <div className="meta-stat__label">Posted</div>
                <div className="meta-stat__val">{job.postedText || `${job.postedDays} days ago`}</div>
              </div>
            </div>

            <div className="meta-stat">
              <span className="meta-stat__icon">📅</span>
              <div>
                <div className="meta-stat__label">Deadline</div>
                <div className="meta-stat__val">{job.deadlineDays || `${job.deadline} days`}</div>
              </div>
            </div>

            <div className="meta-stat">
              <span className="meta-stat__icon">🏷️</span>
              <div>
                <div className="meta-stat__label">Proposals</div>
                <div className="meta-stat__val">{job.proposals}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Columns Layout */}
        <div className="job-details-columns">
          {/* Left Column */}
          <div className="card">
            {/* Client Section */}
            <h2 className="section-subtitle">Client</h2>
            <div className="client-meta-box">
              <div className="client-meta-box__avatar">{avatarLetter}</div>
              <div>
                <div className="client-meta-box__addr">{clientShort}</div>
                <div className="client-meta-box__since">Member since Jan 2024</div>
              </div>
            </div>

            {/* Job Description */}
            <h2 className="section-subtitle">Job Description</h2>
            <p style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              {job.description_full}
            </p>

            {/* Requirements */}
            <h2 className="section-subtitle">Requirements</h2>
            <ul className="checklist-items">
              {job.requirements.map((req, i) => (
                <li key={i} className="checklist-item">
                  <span className="checklist-item__check">✓</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Payment Details */}
          <div>
            <div className="payment-card">
              <h2 className="section-subtitle" style={{ marginBottom: 0 }}>Payment Details</h2>
              <div>
                <div className="payment-card__amount">{job.budget} ETH</div>
                <div className="payment-card__usd">(~ ${job.budgetUSD || Math.round(job.budget * 1700)})</div>
              </div>

              <div className="payment-lock-banner">
                <span style={{ fontSize: '1rem' }}>🔒</span>
                <span>Payment will be held in a smart contract and released after work approval.</span>
              </div>

              {job.status === 'open' ? (
                <Link to={`/escrow/${job.id}/fund`} className="btn btn-primary btn-full">
                  Fund Escrow
                </Link>
              ) : (
                <Link to={`/jobs/${job.id}/progress`} className="btn btn-outline btn-full">
                  Check Escrow Progress
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default JobDetails;
