// src/pages/Marketplace.jsx
import React from 'react';
import JobCard from '../components/JobCard.jsx';
import '../styles/pages.css';

// Sample job data (demo only)
const sampleJobs = [
  { id: 1, title: 'Design a logo', description: 'Create a modern logo for a startup.', budget: 0.5, status: 'Pending' },
  { id: 2, title: 'Develop landing page', description: 'Build a responsive landing page using React.', budget: 1, status: 'Funded' },
];

const Marketplace = () => (
  <section className="marketplace">
    <h1>Marketplace</h1>
    <div className="job-list">
      {sampleJobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  </section>
);

export default Marketplace;
