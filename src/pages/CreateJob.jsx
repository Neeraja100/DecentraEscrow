// src/pages/CreateJob.jsx
import React from 'react';
import '../styles/pages.css';

const CreateJob = () => (
  <section className="create-job">
    <h1>Create Job (Demo)</h1>
    <p>This UI demonstrates the job creation form layout. Persistent storage is not yet implemented.</p>
    <form className="job-form">
      <label>
        Title:
        <input type="text" placeholder="Job title" required />
      </label>
      <label>
        Description:
        <textarea placeholder="Job description" required />
      </label>
      <label>
        Budget (ETH):
        <input type="number" step="0.01" placeholder="0.1" required />
      </label>
      <label>
        Deadline:
        <input type="date" required />
      </label>
      <button type="submit" className="button primary" disabled>
        Submit (demo placeholder)
      </button>
    </form>
  </section>
);

export default CreateJob;
