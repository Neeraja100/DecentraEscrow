// src/pages/JobProgress.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MOCK_JOBS } from '../utils/mockData.js';

const TIMELINE = [
  {
    id: 'funded',
    title: 'Escrow Funded',
    date: 'Oct 20, 2026, 10:30 AM',
    desc: 'Client has deposited 0.05 ETH into escrow.',
    done: true,
  },
  {
    id: 'submitted',
    title: 'Work Submitted',
    date: 'Oct 23, 2026, 4:13 PM',
    desc: 'Freelancer has submitted the work for review.',
    done: true,
  },
  {
    id: 'review',
    title: 'Client Review',
    date: null,
    desc: 'Waiting for client approval...',
    done: false,
  },
  {
    id: 'release',
    title: 'Payment Release',
    date: null,
    desc: 'Funds will be released after approval.',
    done: false,
  },
];

const JobProgress = () => {
  const { id } = useParams();
  const job = MOCK_JOBS.find(j => j.id === id) || MOCK_JOBS[0];

  return (
    <main className="page-wrapper">
      <div className="container progress-page">
        <Link to={`/jobs/${id}`} className="back-link">← Back to Job</Link>
        <h1 className="progress-page__title">Job Progress</h1>
        <p className="progress-page__sub">{job.title}</p>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start'}}>
          {/* Timeline */}
          <div className="card">
            <h3 style={{fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem'}}>Escrow Timeline</h3>
            <div className="timeline">
              {TIMELINE.map(item => (
                <div key={item.id} className={`timeline__item${item.done ? ' done' : ''}`}>
                  <div className={`timeline__icon${item.done ? ' done' : ' pending'}`}>
                    {item.done ? '✓' : '○'}
                  </div>
                  <div className="timeline__body">
                    <p className="timeline__title">{item.title}</p>
                    {item.date && <p className="timeline__date">{item.date}</p>}
                    <p className="timeline__desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submission */}
          <div className="card">
            <h3 className="submission-section__title">Submission Details</h3>
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Submission Link</p>
            <a
              href="https://github.com/username/landing-page"
              target="_blank"
              rel="noopener noreferrer"
              className="submission-link"
            >
              🔗 https://github.com/username/landing-page ↗
            </a>
            <p style={{fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>Message</p>
            <p className="submission-msg">
              Hi, I've completed all the requirements. The landing page is fully responsive, achieves Lighthouse 95+, and includes all requested sections. Please find the repository link above.
            </p>
            <p className="submission-time">Submitted on Oct 23, 2026, 4:12 PM</p>
            <div style={{marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap'}}>
              <Link to={`/jobs/${id}/review`} className="btn btn-primary btn-sm">Review Submission</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default JobProgress;
