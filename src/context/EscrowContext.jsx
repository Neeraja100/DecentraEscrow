
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';

import { ethers } from 'ethers';

import { INITIAL_JOBS } from '../utils/mockData.js';

import {
  depositToEscrow,
  submitWorkDeliverable,
  approveAndReleaseEscrow,
  createAndFundEscrow,
} from '../utils/contract.js';

const STORAGE_KEY = 'decentra_escrow_jobs_v1';
const TX_KEY = 'decentra_escrow_last_tx';
const APPLICATIONS_KEY = 'decentra_escrow_applications_v1';

export const EscrowContext = createContext(null);

export const EscrowProvider = ({ children }) => {
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.warn('Could not read saved jobs:', error);
    }

    return INITIAL_JOBS;
  });

  // No default or simulated transaction
  const [lastTx, setLastTx] = useState(() => {
    try {
      const saved = localStorage.getItem(TX_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Could not read saved transaction:', error);
      return null;
    }
  });

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(APPLICATIONS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.warn('Could not read applications:', error);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (error) {
      console.warn('Could not save jobs:', error);
    }
  }, [jobs]);

  useEffect(() => {
    try {
      if (lastTx) {
        localStorage.setItem(TX_KEY, JSON.stringify(lastTx));
      } else {
        localStorage.removeItem(TX_KEY);
      }
    } catch (error) {
      console.warn('Could not save transaction:', error);
    }
  }, [lastTx]);

  useEffect(() => {
    try {
      localStorage.setItem(
        APPLICATIONS_KEY,
        JSON.stringify(applications)
      );
    } catch (error) {
      console.warn('Could not save applications:', error);
    }
  }, [applications]);

  const getJob = (id) => {
    return jobs.find((job) => String(job.id) === String(id)) || null;
  };

  // Only jobs created on the deployed smart contract can be used
  // for blockchain transactions.
  const getOnChainJob = (id) => {
    const job = getJob(id);

    if (!job) {
      throw new Error('Job not found.');
    }

    if (job.onChain !== true || job.chainJobId == null) {
      throw new Error(
        'This is a demo/local job, not an on-chain escrow. Create the escrow on Sepolia first.'
      );
    }

    return job;
  };

  // Current job creation is local only.
  // On-chain escrow creation will be integrated separately.
  const createJob = (newJobData) => {
    const newId = String(Date.now());

    const job = {
      id: newId,
      title: newJobData.title,
      category: newJobData.category || 'Web Development',
      description: newJobData.description.slice(0, 80) + '...',
      description_full: newJobData.description,
      budget: parseFloat(newJobData.budget) || 0.05,
      budgetUSD: Math.round(
        (parseFloat(newJobData.budget) || 0.05) * 1700
      ),

      // Placeholder information for local demo display only
      clientAddress: null,
      clientShort: null,
      freelancerAddress: null,
      freelancerShort: null,

      postedDays: 0,
      postedText: 'Just now',
      deadline: newJobData.deadline ? 10 : 7,
      deadlineDays: `${newJobData.deadline ? 10 : 7} days`,
      proposals: 0,
      status: 'open',

      // Explicitly mark this job as not deployed on-chain
      onChain: false,
      chainJobId: null,

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
    const job = getOnChainJob(id);

    const result = await depositToEscrow({
      jobId: job.chainJobId,
      amountEth: job.budget,
      signer,
    });

    const now = new Date().toLocaleString('en-US');

    setJobs((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
            ...item,
            status: 'funded',
            submission: {
              ...(item.submission || {}),
              fundedDate: now,
              depositTxHash: result.hash,
            },
          }
          : item
      )
    );

    return result;
  };

  const submitWork = async (id, { url, message }, signer) => {
    const job = getOnChainJob(id);

    const result = await submitWorkDeliverable({
      jobId: job.chainJobId,
      submissionUrl: url,
      submissionMessage: message,
      signer,
    });

    const now = new Date().toLocaleString('en-US');

    setJobs((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
            ...item,
            status: 'work_submitted',
            submission: {
              ...(item.submission || {}),
              url,
              message,
              date: now,
              submitTxHash: result.hash,
            },
          }
          : item
      )
    );

    return result;
  };

  const approveAndRelease = async (id, signer) => {
    const job = getOnChainJob(id);

    const result = await approveAndReleaseEscrow({
      jobId: job.chainJobId,
      signer,
    });

    const now = new Date().toLocaleString('en-US');

    const txDetails = {
      hash: result.hash,
      amount: `${job.budget} ETH`,
      recipient: job.freelancerAddress || 'Not available',
      status: 'Success',
      network: 'Sepolia Testnet',
      date: now,
      jobTitle: job.title,
    };

    setLastTx(txDetails);

    setJobs((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
            ...item,
            status: 'approved',
            submission: {
              ...(item.submission || {}),
              completedDate: now,
              releaseTxHash: result.hash,
            },
          }
          : item
      )
    );

    return txDetails;
  };

  // Freelancer applies for a job
  const applyForJob = (jobId, { walletAddress, proposal }) => {
    const job = getJob(jobId);

    if (!job) {
      throw new Error('Job not found.');
    }

    if (!ethers.isAddress(walletAddress)) {
      throw new Error('Invalid freelancer wallet address.');
    }

    if (job.status !== 'open') {
      throw new Error('This job is no longer accepting applications.');
    }

    const existing = applications[jobId] || [];

    if (
      existing.some(
        (application) =>
          application.walletAddress.toLowerCase() === walletAddress.toLowerCase()
      )
    ) {
      throw new Error('You have already applied for this job.');
    }

    const newApplication = {
      id: `${Date.now()}`,
      walletAddress,
      proposal,
      appliedAt: new Date().toISOString(),
      status: 'pending',
    };

    setApplications((prev) => ({
      ...prev,
      [jobId]: [...(prev[jobId] || []), newApplication],
    }));

    setJobs((prev) =>
      prev.map((item) =>
        String(item.id) === String(jobId)
          ? { ...item, proposals: (item.proposals || 0) + 1 }
          : item
      )
    );

    return newApplication;
  };

  // Client views applications for a job
  const getApplications = (jobId) => {
    return applications[jobId] || [];
  };

  // Client selects a freelancer and creates + funds the escrow
  const selectFreelancer = async (jobId, applicationId, signer) => {
    const job = getJob(jobId);

    if (!job) {
      throw new Error('Job not found.');
    }

    if (job.onChain === true) {
      throw new Error('An escrow has already been created for this job.');
    }

    const application = getApplications(jobId).find(
      (item) => String(item.id) === String(applicationId)
    );

    if (!application) {
      throw new Error('Application not found.');
    }

    const deadlineTimestamp = Math.floor(
      Date.now() / 1000
    ) + (Number(job.deadline || 7) * 24 * 60 * 60);

    const chainJobId = Date.now();

    const result = await createAndFundEscrow({
      jobId: chainJobId,
      title: job.title,
      freelancerAddress: application.walletAddress,
      deadline: deadlineTimestamp,
      amountEth: job.budget,
      signer,
    });

    const now = new Date().toLocaleString('en-US');

    setJobs((prev) =>
      prev.map((item) =>
        String(item.id) === String(jobId)
          ? {
            ...item,
            freelancerAddress: application.walletAddress,
            freelancerShort: `${application.walletAddress.slice(0, 6)}...${application.walletAddress.slice(-4)}`,
            chainJobId,
            onChain: true,
            status: 'funded',
            selectedApplicationId: applicationId,
            submission: {
              ...(item.submission || {}),
              fundedDate: now,
              depositTxHash: result.hash,
            },
          }
          : item
      )
    );

    setApplications((prev) => ({
      ...prev,
      [jobId]: (prev[jobId] || []).map((item) => ({
        ...item,
        status: String(item.id) === String(applicationId)
          ? 'selected'
          : 'rejected',
      })),
    }));

    setLastTx({
      hash: result.hash,
      amount: `${job.budget} ETH`,
      recipient: application.walletAddress,
      status: 'Success',
      network: 'Sepolia Testnet',
      date: now,
      jobTitle: job.title,
    });

    return result;
  };

  // Dispute transactions will be connected to the contract separately.
  const raiseDispute = async () => {
    throw new Error(
      'On-chain dispute functionality has not been connected yet.'
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

        applications,
        applyForJob,
        getApplications,
        selectFreelancer,
      }}
    >
      {children}
    </EscrowContext.Provider>
  );
};

export const useEscrow = () => {
  const context = useContext(EscrowContext);

  if (!context) {
    throw new Error(
      'useEscrow must be used within an EscrowProvider'
    );
  }

  return context;
};
