
// src/pages/CreateJob.jsx

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEscrow } from '../context/EscrowContext.jsx';
import { WalletContext } from '../context/WalletContext.jsx';

const CATEGORIES = [
  'Web Development',
  'UI/UX Design',
  'Content Writing',
  'Data Analysis',
  'Other',
];

const CreateJob = () => {
  const navigate = useNavigate();
  const { createJob } = useEscrow();

  const {
    account,
    isConnected,
    connectWallet,
  } = useContext(WalletContext);

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    budget: '',
    deadline: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // A connected client wallet is required to create a job.
    if (!isConnected || !account) {
      try {
        await connectWallet();
        setErrorMessage(
          'Wallet connected. Please click Create Job again.'
        );
      } catch (error) {
        setErrorMessage(
          error.message || 'Please connect your MetaMask wallet.'
        );
      }
      return;
    }

    if (!form.deadline || new Date(form.deadline) <= new Date()) {
      setErrorMessage('Please select a future deadline.');
      return;
    }

    setIsSubmitting(true);

    try {
      const created = createJob({
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category || 'Web Development',
        budget: form.budget || '0.05',
        deadline: form.deadline,
        clientAddress: account,
        clientShort: `${account.slice(0, 6)}...${account.slice(-4)}`,
      });

      if (!created) {
        throw new Error('Job could not be created.');
      }

      navigate(`/jobs/${created.id}`);
    } catch (error) {
      setErrorMessage(
        error.message || 'Something went wrong while creating the job.'
      );
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="create-job-wrapper">
          <div className="create-job-card">
            <div className="create-job-header">
              <h1 className="create-job-title">
                Create a New Job
              </h1>

              <p className="create-job-sub">
                Specify the details and lock the payment in escrow
                after selecting a freelancer.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  Job Title
                </label>

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
                <label className="form-label">
                  Description
                </label>

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
                  <label className="form-label">
                    Category
                  </label>

                  <select
                    className="form-select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Budget (ETH)
                  </label>

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
                  <label className="form-label">
                    Deadline
                  </label>

                  <input
                    type="date"
                    className="form-input"
                    name="deadline"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.deadline}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {isConnected && account && (
                <div
                  style={{
                    marginTop: '1rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    wordBreak: 'break-all',
                  }}
                >
                  Client wallet: {account}
                </div>
              )}

              {errorMessage && (
                <p
                  role="alert"
                  style={{
                    marginTop: '1rem',
                    color: 'var(--text-secondary)',
                    fontSize: '0.875rem',
                  }}
                >
                  {errorMessage}
                </p>
              )}

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
