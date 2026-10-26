// src/pages/CreateJob.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEscrow } from '../context/EscrowContext.jsx';

const CATEGORIES = ['Web Development', 'UI/UX Design', 'Content Writing', 'Data Analysis', 'Other'];

const CreateJob = () => {
  const navigate = useNavigate();
  const { createJob } = useEscrow();

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const created = createJob({
      title: form.title,
      description: form.description,
      category: form.category || 'Web Development',
      budget: form.budget || '0.05',
      deadline: form.deadline,
    });

    setTimeout(() => {
      navigate(`/jobs/${created.id}`);
    }, 600);
  };

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="create-job-wrapper">
          <div className="create-job-card">
            <div className="create-job-header">
              <h1 className="create-job-title">Create a New Job</h1>
              <p className="create-job-sub">
                Specify the details and lock the payment in escrow after selecting a freelancer.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Job Title</label>
                <input
                  type="text"
                  className="form-input"
                  name="title"
                  placeholder="e.g. Build a landing page"
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
                  placeholder="Describe the work, requirements, and deliverables..."
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Budget (ETH)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0.001"
                    className="form-input"
                    name="budget"
                    placeholder="e.g. 0.05"
                    value={form.budget}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-input"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={isSubmitting}
                style={{ marginTop: '0.75rem' }}
              >
                {isSubmitting ? 'Creating Job...' : 'Create Job'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreateJob;
