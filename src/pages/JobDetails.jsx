
import React, { useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEscrow } from '../context/EscrowContext.jsx';
import { WalletContext } from '../context/WalletContext.jsx';
import { CATEGORY_COLORS } from '../utils/mockData.js';

const JobDetails = () => {
  const { id } = useParams();

  const {
    getJob,
    applyForJob,
    getApplications,
    selectFreelancer,
  } = useEscrow();

  const {
    account,
    isConnected,
    connectWallet,
    signer,
  } = useContext(WalletContext);

  const [proposal, setProposal] = useState('');
  const [applicationMessage, setApplicationMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const job = getJob(id);

  // Handle invalid job IDs
  if (!job) {
    return (
      <main className="page-wrapper">
        <div className="container">
          <Link to="/marketplace" className="back-link">
            ← Back to Jobs
          </Link>

          <div className="card" style={{ marginTop: '2rem' }}>
            <h2 className="section-subtitle">Job Not Found</h2>

            <p style={{ color: 'var(--text-secondary)' }}>
              This job may have been removed or does not exist.
            </p>

            <Link to="/marketplace" className="btn btn-primary">
              Browse Jobs
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const catClass = CATEGORY_COLORS[job.category] || 'badge-gray';

  const clientShort =
    job.clientShort ||
    (job.clientAddress
      ? `${job.clientAddress.slice(0, 4)}...${job.clientAddress.slice(-4)}`
      : 'Unknown Client');

  const avatarLetter = clientShort.slice(0, 2).toUpperCase();

  const applications = getApplications(id) || [];

  // Check whether the connected wallet owns this job
  const isJobOwner =
    account &&
    job.clientAddress &&
    account.toLowerCase() === job.clientAddress.toLowerCase();

  const hasApplied =
    isConnected &&
    applications.some(
      (application) =>
        application.walletAddress?.toLowerCase() ===
        account?.toLowerCase()
    );

  // Freelancer application handler
  const handleApply = () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    if (!proposal.trim()) {
      setApplicationMessage('Please enter your proposal.');
      return;
    }

    if (hasApplied) {
      setApplicationMessage(
        'You have already applied for this job.'
      );
      return;
    }

    try {
      setIsSubmitting(true);

      applyForJob(id, {
        walletAddress: account,
        proposal: proposal.trim(),
      });

      setProposal('');
      setApplicationMessage(
        'Your application was submitted successfully!'
      );
    } catch (error) {
      setApplicationMessage(
        error.message || 'Unable to submit your application.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client selects a freelancer
  const handleSelectFreelancer = async (application) => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!isJobOwner) {
      setApplicationMessage(
        'Only the client who created this job can select a freelancer.'
      );
      return;
    }

    if (!signer) {
      setApplicationMessage(
        'Wallet signer is unavailable. Please reconnect MetaMask.'
      );
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to select this freelancer? This will initiate the escrow creation and funding transaction on Sepolia.'
    );

    if (!confirmed) return;

    try {
      setIsSubmitting(true);
      setApplicationMessage('');

      await selectFreelancer(job.id, application.id, signer);

      setApplicationMessage(
        'Freelancer selected successfully! Escrow transaction completed.'
      );
    } catch (error) {
      setApplicationMessage(
        error.message || 'Unable to select freelancer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-wrapper">
      <div className="container">
        <Link to="/marketplace" className="back-link">
          ← Back to Jobs
        </Link>

        {/* Hero Card */}
        <div className="job-details-hero-card">
          <div className="job-details-hero__top">
            <div>
              <div className="job-details-hero__title-row">
                <h1 className="job-details-hero__title">
                  {job.title}
                </h1>

                <span className={`badge ${catClass}`}>
                  {job.category}
                </span>
              </div>

              <p className="job-details-hero__subtitle">
                {job.description ||
                  'Explore this opportunity and submit your proposal.'}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}
            >
              {job.status === 'work_submitted' ? (
                <Link
                  to={`/jobs/${job.id}/review`}
                  className="btn btn-primary"
                >
                  Review Submission
                </Link>
              ) : job.status === 'open' ? (
                <a
                  href="#apply-section"
                  className="btn btn-primary"
                >
                  Apply for Job
                </a>
              ) : (
                <Link
                  to={`/jobs/${job.id}/progress`}
                  className="btn btn-primary"
                >
                  View Progress
                </Link>
              )}
            </div>
          </div>

          {/* Meta Stats Row */}
          <div className="meta-stats-row">
            <div className="meta-stat">
              <span className="meta-stat__icon">🪙</span>

              <div>
                <div className="meta-stat__label">Budget</div>
                <div className="meta-stat__val">
                  {job.budget} ETH
                </div>
              </div>
            </div>

            <div className="meta-stat">
              <span className="meta-stat__icon">🕒</span>

              <div>
                <div className="meta-stat__label">Posted</div>
                <div className="meta-stat__val">
                  {job.postedText ||
                    `${job.postedDays ?? 0} days ago`}
                </div>
              </div>
            </div>

            <div className="meta-stat">
              <span className="meta-stat__icon">📅</span>

              <div>
                <div className="meta-stat__label">Deadline</div>
                <div className="meta-stat__val">
                  {job.deadlineDays ||
                    job.deadline ||
                    'Not specified'}
                </div>
              </div>
            </div>

            <div className="meta-stat">
              <span className="meta-stat__icon">🏷️</span>

              <div>
                <div className="meta-stat__label">Proposals</div>
                <div className="meta-stat__val">
                  {applications.length || job.proposals || 0}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Columns Layout */}
        <div className="job-details-columns">

          {/* Left Column */}
          <div className="card">

            {/* Client Section */}
            <h2 className="section-subtitle">Client</h2>

            <div className="client-meta-box">
              <div className="client-meta-box__avatar">
                {avatarLetter}
              </div>

              <div>
                <div className="client-meta-box__addr">
                  {clientShort}
                </div>

                <div className="client-meta-box__since">
                  Member since Jan 2024
                </div>
              </div>
            </div>

            {/* Job Description */}
            <h2 className="section-subtitle">
              Job Description
            </h2>

            <p
              style={{
                fontSize: '0.925rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
              }}
            >
              {job.description_full ||
                job.description ||
                'No detailed description provided.'}
            </p>

            {/* Requirements */}
            <h2 className="section-subtitle">
              Requirements
            </h2>

            <ul className="checklist-items">
              {(job.requirements || []).map((req, i) => (
                <li key={i} className="checklist-item">
                  <span className="checklist-item__check">
                    ✓
                  </span>

                  <span>{req}</span>
                </li>
              ))}
            </ul>

            {/* Client: Freelancer Applications */}
            {isJobOwner && (
              <section className="mt-10">
                <h2 className="section-subtitle">
                  Freelancer Applications ({applications.length})
                </h2>

                {applications.length === 0 ? (
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                    }}
                  >
                    No applications received for this job yet.
                  </p>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    {applications.map((application) => (
                      <div
                        key={application.id}
                        style={{
                          padding: '1.25rem',
                          borderRadius: '12px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--bg-secondary)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '1rem',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div>
                            <h3
                              style={{
                                fontWeight: 600,
                                fontSize: '1rem',
                              }}
                            >
                              Freelancer
                            </h3>

                            <p
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                marginTop: '0.4rem',
                                wordBreak: 'break-all',
                              }}
                            >
                              Wallet: {application.walletAddress}
                            </p>
                          </div>

                          <span
                            style={{
                              fontSize: '0.8rem',
                              color: 'var(--text-secondary)',
                              textTransform: 'capitalize',
                            }}
                          >
                            {application.status || 'Pending'}
                          </span>
                        </div>

                        <div style={{ marginTop: '1rem' }}>
                          <h4
                            style={{
                              fontWeight: 600,
                              marginBottom: '0.5rem',
                            }}
                          >
                            Proposal
                          </h4>

                          <p
                            style={{
                              color: 'var(--text-secondary)',
                              fontSize: '0.9rem',
                              lineHeight: 1.6,
                              whiteSpace: 'pre-wrap',
                            }}
                          >
                            {application.proposal}
                          </p>
                        </div>

                        {job.status === 'open' &&
                          application.status !== 'rejected' &&
                          application.status !== 'selected' && (
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() =>
                                handleSelectFreelancer(application)
                              }
                              className="btn btn-primary"
                              style={{ marginTop: '1.25rem' }}
                            >
                              {isSubmitting
                                ? 'Processing...'
                                : 'Select Freelancer'}
                            </button>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Application Feedback */}
            {applicationMessage && (
              <p
                role="status"
                style={{
                  marginTop: '1rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                }}
              >
                {applicationMessage}
              </p>
            )}
          </div>

          {/* Right Column: Payment Details */}
          <div>
            <div className="payment-card">
              <h2
                className="section-subtitle"
                style={{ marginBottom: 0 }}
              >
                Payment Details
              </h2>

              <div>
                <div className="payment-card__amount">
                  {job.budget} ETH
                </div>

                <div className="payment-card__usd">
                  (~ ${job.budgetUSD ||
                    Math.round((job.budget || 0) * 1700)})
                </div>
              </div>

              <div className="payment-lock-banner">
                <span style={{ fontSize: '1rem' }}>🔒</span>

                <span>
                  Payment will be held in a smart contract and
                  released after work approval.
                </span>
              </div>

              {/* Freelancer Application Section */}
              {job.status === 'open' ? (
                isJobOwner ? (
                  <p
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                    }}
                  >
                    You posted this job. Review freelancer applications
                    on the left.
                  </p>
                ) : (
                  <div
                    id="apply-section"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1rem',
                    }}
                  >
                    <h2 className="section-subtitle">
                      Apply for this Job
                    </h2>

                    {hasApplied ? (
                      <p
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.9rem',
                        }}
                      >
                        You have already submitted an application
                        for this job.
                      </p>
                    ) : (
                      <>
                        {!isConnected ? (
                          <button
                            type="button"
                            onClick={connectWallet}
                            className="btn btn-primary btn-full"
                          >
                            Connect Wallet to Apply
                          </button>
                        ) : (
                          <>
                            <p
                              style={{
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                wordBreak: 'break-all',
                              }}
                            >
                              Applying from: {account}
                            </p>

                            <textarea
                              value={proposal}
                              onChange={(e) =>
                                setProposal(e.target.value)
                              }
                              placeholder="Explain why you are suitable for this job..."
                              rows={5}
                              style={{
                                width: '100%',
                                padding: '0.85rem',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                resize: 'vertical',
                                font: 'inherit',
                              }}
                            />

                            <button
                              type="button"
                              onClick={handleApply}
                              disabled={isSubmitting}
                              className="btn btn-primary btn-full"
                            >
                              {isSubmitting
                                ? 'Submitting...'
                                : 'Submit Application'}
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )
              ) : (
                <Link
                  to={`/jobs/${job.id}/progress`}
                  className="btn btn-outline btn-full"
                >
                  Check Escrow Progress
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default JobDetails;
