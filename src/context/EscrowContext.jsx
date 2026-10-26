// src/context/EscrowContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { INITIAL_JOBS } from '../utils/mockData.js';
import {
  depositToEscrow,
  submitWorkDeliverable,
  approveAndReleaseEscrow,
  generateTxHash,
} from '../utils/contract.js';

const STORAGE_KEY = 'decentra_escrow_jobs_v1';
const TX_KEY = 'decentra_escrow_last_tx';

export const EscrowContext = createContext(null);

export const EscrowProvider = ({ children }) => {
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read saved jobs from localStorage:', e);
    }
    return INITIAL_JOBS;
  });

  const [lastTx, setLastTx] = useState(() => {
    try {
      const saved = localStorage.getItem(TX_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      hash: '0x7a9c8f2b1d3e4a5c6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7bc3d2',
      amount: '0.05 ETH',
      recipient: '0x5C...8a3F',
      status: 'Success',
      network: 'Sepolia Testnet',
      date: 'Oct 23, 2026, 5:14 PM',
      jobTitle: 'Build a Landing Page',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
      console.warn('Could not persist jobs to localStorage:', e);
    }
  }, [jobs]);

  useEffect(() => {
    try {
      localStorage.setItem(TX_KEY, JSON.stringify(lastTx));
    } catch (e) {
      // ignore
    }
  }, [lastTx]);

  const getJob = (id) => {
    return jobs.find((j) => String(j.id) === String(id)) || jobs[0];
  };

  const createJob = (newJobData) => {
    const newId = String(Date.now());
    const job = {
      id: newId,
      title: newJobData.title,
      category: newJobData.category || 'Web Development',
      description: newJobData.description.slice(0, 80) + '...',
      description_full: newJobData.description,
      budget: parseFloat(newJobData.budget) || 0.05,
      budgetUSD: Math.round((parseFloat(newJobData.budget) || 0.05) * 1700),
      clientAddress: '0x84f18A7c3D4e5F6a7B8C9D0e1f2A3b4C5d6E9d1e',
      clientShort: '0x84...9d1e',
      freelancerAddress: '0x5C6a7B8c9D0e1F2a3B4c5D6E7f8A9B0c1D2e8a3F',
      freelancerShort: '0x5C...8a3F',
      postedDays: 0,
      postedText: 'Just now',
      deadline: newJobData.deadline ? 10 : 7,
      deadlineDays: `${newJobData.deadline ? 10 : 7} days`,
      proposals: 0,
      status: 'open',
      requirements: [
        'Responsive and cross-browser support',
        'Clean, modular code architecture',
        'Timely deliverables as specified',
      ],
      submission: null,
    };

    setJobs((prev) => [job, ...prev]);
    return job;
  };

  const fundJob = async (id, signer) => {
    const job = getJob(id);
    const result = await depositToEscrow({
      jobId: id,
      amountEth: job.budget,
      signer,
    });

    const now = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    setJobs((prev) =>
      prev.map((j) =>
        String(j.id) === String(id)
          ? {
              ...j,
              status: 'funded',
              submission: {
                ...(j.submission || {}),
                fundedDate: now,
                depositTxHash: result.hash,
              },
            }
          : j
      )
    );

    return result;
  };

  const submitWork = async (id, { url, message }, signer) => {
    const result = await submitWorkDeliverable({
      jobId: id,
      submissionUrl: url,
      submissionMessage: message,
      signer,
    });

    const now = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    setJobs((prev) =>
      prev.map((j) =>
        String(j.id) === String(id)
          ? {
              ...j,
              status: 'work_submitted',
              submission: {
                ...(j.submission || {}),
                url,
                message,
                date: now,
                submitTxHash: result.hash,
              },
            }
          : j
      )
    );

    return result;
  };

  const approveAndRelease = async (id, signer) => {
    const job = getJob(id);
    const result = await approveAndReleaseEscrow({
      jobId: id,
      signer,
    });

    const now = new Date().toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });

    const txDetails = {
      hash: result.hash,
      amount: `${job.budget} ETH`,
      recipient: job.freelancerShort || '0x5C...8a3F',
      status: 'Success',
      network: 'Sepolia Testnet',
      date: now,
      jobTitle: job.title,
    };

    setLastTx(txDetails);

    setJobs((prev) =>
      prev.map((j) =>
        String(j.id) === String(id)
          ? {
              ...j,
              status: 'approved',
              submission: {
                ...(j.submission || {}),
                completedDate: now,
                releaseTxHash: result.hash,
              },
            }
          : j
      )
    );

    return txDetails;
  };

  const raiseDispute = (id, reason) => {
    setJobs((prev) =>
      prev.map((j) =>
        String(j.id) === String(id)
          ? {
              ...j,
              status: 'disputed',
              disputeReason: reason || 'Dispute raised by client',
            }
          : j
      )
    );
  };

  return (
    <EscrowContext.Provider
      value={{
        jobs,
        getJob,
        createJob,
        fundJob,
        submitWork,
        approveAndRelease,
        raiseDispute,
        lastTx,
      }}
    >
      {children}
    </EscrowContext.Provider>
  );
};

export const useEscrow = () => {
  const context = useContext(EscrowContext);
  if (!context) {
    throw new Error('useEscrow must be used within an EscrowProvider');
  }
  return context;
};
