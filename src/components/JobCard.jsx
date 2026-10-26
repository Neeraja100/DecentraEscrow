// src/components/JobCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatAddress } from '../utils/formatAddress.js';
import { CATEGORY_COLORS } from '../utils/mockData.js';

const JobCard = ({ job }) => {
  const catClass = CATEGORY_COLORS[job.category] || 'badge-gray';
  return (
    <div className="job-card">
      <div className="job-card__header">
        <h3 className="job-card__title">{job.title}</h3>
        <span className={`badge ${catClass}`}>{job.category}</span>
      </div>
      <p className="job-card__desc">{job.description}</p>
      <div className="job-card__meta">
        <span className="job-card__budget">{job.budget} ETH</span>
        <span className="job-card__client">By {formatAddress(job.clientAddress)}</span>
      </div>
      <span className="job-card__posted">Posted {job.postedDays} day{job.postedDays !== 1 ? 's' : ''} ago</span>
      <div className="job-card__footer">
        <Link to={`/jobs/${job.id}`} className="btn btn-primary btn-sm">View Details</Link>
      </div>
    </div>
  );
};

export default JobCard;
