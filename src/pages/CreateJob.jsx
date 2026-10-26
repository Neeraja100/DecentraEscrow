// src/pages/CreateJob.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Web Development', 'UI/UX Design', 'Content Writing', 'Data Analysis', 'Other'];

const CreateJob = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', budget: '', deadline: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => navigate('/marketplace'), 1200);
  };

  return (
    <main className="page-wrapper">
      <div className="container create-job-page">
        <div className="create-job-page__inner">
          <h1 className="create-job-page__title">Post a New Job</h1>
          <p className="create-job-page__sub">
            Specify the details and lock the payment in escrow after selecting a freelancer.
          </p>

          <form className="card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Job Title</label>
              <input
                className="form-input"
                name="title"
                placeholder="e.g. Build a landing page for SaaS app"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                name="description"
                placeholder="Describe the work, deliverables, and expectations..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Budget (ETH)</label>
              <input
                className="form-input"
                name="budget"
                type="number"
                step="0.001"
                min="0.001"
                placeholder="0.05"
                value={form.budget}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Deadline</label>
              <input
                className="form-input"
                name="deadline"
                type="date"
                value={form.deadline}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={submitted}
              style={{marginTop: '0.5rem'}}
            >
              {submitted ? '✓ Job Created!' : 'Create Job'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateJob;
