// src/components/JobCard.jsx
import React from 'react';
import '../styles/components.css';

const JobCard = ({ job }) => (
  <div className="job-card">
    <h3 className="job-card__title">{job.title}</h3>
    <p className="job-card__desc">{job.description}</p>
    <p className="job-card__budget">Budget: {job.budget} ETH</p>
    <p className="job-card__status"><StatusBadge status={job.status} /></p>
    <button className="button secondary">View Details</button>
  </div>
);

export default JobCard;
