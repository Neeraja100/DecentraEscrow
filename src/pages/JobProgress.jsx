// src/pages/JobProgress.jsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEscrow } from '../context/EscrowContext.jsx';
import { useWallet } from '../hooks/useWallet.js';

const JobProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJob, submitWork } = useEscrow();
  const { signer } = useWallet();

  const job = getJob(id);

  // Freelancer submission form state (if work is not yet submitted)
  const [subUrl, setSubUrl] = useState('https://github.com/username/landing-page');
  const [subMsg, setSubMsg] = useState(
    'Here is the completed landing page. Please review and let me know if any changes are needed.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitDeliverable = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitWork(job.id, { url: subUrl, message: subMsg }, signer);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFunded = job.status === 'funded' || job.status === 'work_submitted' || job.status === 'approved';
  const isWorkSubmitted = job.status === 'work_submitted' || job.status === 'approved';
  const isApproved = job.status === 'approved';

  const submissionData = job.submission || {
    url: 'https://github.com/username/landing-page',
    message: 'Here is the completed landing page. Please review and let me know if any changes are needed.',
    date: 'Oct 23, 2026, 4:12 PM',
    fundedDate: 'Oct 20, 2026, 10:30 AM',
  };

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="progress-container">
          <Link to={`/jobs/${job.id}`} className="back-link">
            ← Back to Job Details
          </Link>

          <div className="progress-main-card">
            <h1 className="progress-title">Job Progress</h1>

            {/* Timeline Steps (Matches Mockup Screen 6) */}
            <div className="timeline-vertical">
              {/* Step 1: Escrow Funded */}
              <div className="timeline-step">
                <div className={`timeline-step__marker ${isFunded ? 'green' : 'gray'}`}>
                  {isFunded ? '✓' : ''}
                </div>
                <div className="timeline-step__content">
                  <div className="timeline-step__header">
                    <span className="timeline-step__title">Escrow Funded</span>
                    <span className="timeline-step__date">
                      {submissionData.fundedDate || 'Oct 20, 2026, 10:30 AM'}
                    </span>
                  </div>
                  <p className="timeline-step__desc">
                    Client has deposited {job.budget} ETH into escrow.
                  </p>
                </div>
              </div>

              {/* Step 2: Work Submitted */}
              <div className="timeline-step">
                <div className={`timeline-step__marker ${isWorkSubmitted ? 'blue' : 'gray'}`}>
                  {isWorkSubmitted ? '✓' : ''}
                </div>
                <div className="timeline-step__content">
                  <div className="timeline-step__header">
                    <span className="timeline-step__title">Work Submitted</span>
                    {isWorkSubmitted && (
                      <span className="timeline-step__date">
                        {submissionData.date || 'Oct 23, 2026, 4:12 PM'}
                      </span>
                    )}
                  </div>
                  <p className="timeline-step__desc">
                    {isWorkSubmitted
                      ? 'Freelancer has submitted the work for review.'
                      : 'Freelancer is working on deliverables.'}
                  </p>
                </div>
              </div>

              {/* Step 3: Client Review */}
              <div className="timeline-step">
                <div className={`timeline-step__marker ${isApproved ? 'green' : 'gray'}`}>
                  {isApproved ? '✓' : ''}
                </div>
                <div className="timeline-step__content">
                  <div className="timeline-step__header">
                    <span className="timeline-step__title">Client Review</span>
                  </div>
                  <p className="timeline-step__desc">
                    {isApproved
                      ? 'Client has approved the deliverables.'
                      : 'Waiting for client approval...'}
                  </p>
                </div>
              </div>

              {/* Step 4: Payment Release */}
              <div className="timeline-step">
                <div className={`timeline-step__marker ${isApproved ? 'green' : 'gray'}`}>
                  {isApproved ? '✓' : ''}
                </div>
                <div className="timeline-step__content">
                  <div className="timeline-step__header">
                    <span className="timeline-step__title">Payment Release</span>
                  </div>
                  <p className="timeline-step__desc">
                    {isApproved
                      ? 'Payment has been released on Sepolia.'
                      : 'Funds will be released after approval.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Submission Details Box (Screen 6) */}
            {isWorkSubmitted ? (
              <div className="submission-box">
                <h3 className="submission-box__title">Submission Details</h3>
                <div className="submission-box__label">Submission Link</div>
                <div>
                  <a
                    href={submissionData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="submission-box__link"
                  >
                    {submissionData.url}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </a>
                </div>

                <div className="submission-box__label" style={{ marginTop: '0.5rem' }}>Message</div>
                <p className="submission-box__msg">{submissionData.message}</p>

                <p className="submission-box__footer">
                  Submitted on {submissionData.date || 'Oct 23, 2026, 4:12 PM'}
                </p>

                <div style={{ marginTop: '1.25rem' }}>
                  <Link to={`/jobs/${job.id}/review`} className="btn btn-primary btn-full">
                    Go to Client Review →
                  </Link>
                </div>
              </div>
            ) : (
              /* Freelancer Submission Form */
              <form onSubmit={handleSubmitDeliverable} className="submission-box">
                <h3 className="submission-box__title">Submit Work Deliverables</h3>
                <div className="form-group">
                  <label className="form-label">Deliverable / Repository URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={subUrl}
                    onChange={(e) => setSubUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Note to Client</label>
                  <textarea
                    className="form-textarea"
                    style={{ minHeight: '80px' }}
                    value={subMsg}
                    onChange={(e) => setSubMsg(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Recording on Blockchain...' : 'Submit Deliverable for Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default JobProgress;
