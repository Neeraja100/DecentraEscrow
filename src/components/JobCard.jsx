// src/components/JobCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORY_COLORS } from '../utils/mockData.js';

const JobCard = ({ job }) => {
  const catClass = CATEGORY_COLORS[job.category] || 'badge-gray';
  const clientShort = job.clientShort || (job.clientAddress ? `${job.clientAddress.slice(0, 4)}...${job.clientAddress.slice(-4)}` : '0x84...9d1e');
  const avatarLetter = clientShort.slice(2, 4).toUpperCase();

  return (
    <div className="job-card">
      <div className="job-card__top">
        <div style={{ flex: 1 }}>
          <div className="job-card__title-row">
            <h3 className="job-card__title">{job.title}</h3>
            <span className={`badge ${catClass}`}>{job.category}</span>
          </div>
          <p className="job-card__desc">{job.description}</p>
        </div>

        <div className="job-card__budget-block">
          <div className="job-card__budget-val">{job.budget} ETH</div>
          <div className="job-card__budget-label">Budget</div>
        </div>
      </div>

      <div className="job-card__bottom">
        <div className="job-card__client-info">
          <div className="job-card__client-avatar">
            {avatarLetter}
          </div>
          <div className="job-card__client-text">
            <span>Client</span>{' '}
            <span className="job-card__client-addr">{clientShort}</span>
            <span style={{ margin: '0 0.4rem', color: '#cbd5e1' }}>•</span>
            <span>Posted {job.postedText || `${job.postedDays || 2} days ago`}</span>
          </div>
        </div>

        <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
