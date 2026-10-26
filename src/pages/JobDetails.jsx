// src/pages/JobDetails.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_JOBS, CATEGORY_COLORS } from '../utils/mockData.js';
import { formatAddress } from '../utils/formatAddress.js';

const JobDetails = () => {
  const { id } = useParams();
  const job = MOCK_JOBS.find(j => j.id === id) || MOCK_JOBS[0];
  const catClass = CATEGORY_COLORS[job.category] || 'badge-gray';

  const initials = job.clientAddress.slice(2, 4).toUpperCase();

  return (
    <main className="page-wrapper">
      <div className="container job-details-page">
        <Link to="/marketplace" className="back-link">← Back to Jobs</Link>

        <div className="job-details-header">
          <div className="job-details-header__left">
            <span className={`badge ${catClass}`}>{job.category}</span>
            <h1 className="job-details-header__title">{job.title}</h1>
          </div>
          <Link to={`/escrow/${job.id}/fund`} className="btn btn-primary">Apply for Job</Link>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <p className="stat-card__label">Budget</p>
            <p className="stat-card__value purple">{job.budget} ETH</p>
          </div>
          <div className="stat-card">
            <p className="stat-card__label">Posted</p>
            <p className="stat-card__value">{job.postedDays} days ago</p>
          </div>
          <div className="stat-card">
            <p className="stat-card__label">Deadline</p>
            <p className="stat-card__value">{job.deadline} days</p>
          </div>
          <div className="stat-card">
            <p className="stat-card__label">Proposals</p>
            <p className="stat-card__value">{job.proposals}</p>
          </div>
        </div>

        <div className="job-details-layout">
          {/* Main */}
          <div className="card">
            <h2 className="job-details-body__title">Job Description</h2>
            <p className="job-details-body__text">{job.description_full}</p>
            <h3 className="job-details-body__title" style={{marginTop: '1.5rem'}}>Requirements</h3>
            <ul className="requirements-list">
              {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </div>

          {/* Sidebar */}
          <div>
            {/* Client */}
            <div className="card client-card">
              <h3 style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem'}}>Client Information</h3>
              <div className="client-card__header">
                <div className="client-avatar">{initials}</div>
                <div>
                  <p className="client-name">{formatAddress(job.clientAddress)}</p>
                  <p className="client-since">Member since Jan 2024</p>
                </div>
              </div>
              <p className="client-address">{job.clientAddress}</p>
            </div>

            {/* Payment */}
            <div className="card">
              <h3 style={{fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem'}}>Payment Details</h3>
              <p className="payment-amount">{job.budget} ETH</p>
              <p className="payment-usd">≈ ${job.budgetUSD} USD</p>
              <p className="payment-note">
                Payment will be held in a smart contract and released after work approval.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default JobDetails;
