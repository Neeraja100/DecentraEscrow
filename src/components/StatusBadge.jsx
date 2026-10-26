// src/components/StatusBadge.jsx
import React from 'react';

const STATUS_MAP = {
  Funded: 'status-funded',
  'Work Submitted': 'status-submitted',
  'Under Review': 'status-review',
  Completed: 'status-completed',
  Disputed: 'status-disputed',
  Open: 'status-open',
  open: 'status-open',
  funded: 'status-funded',
  submitted: 'status-submitted',
  review: 'status-review',
  completed: 'status-completed',
  disputed: 'status-disputed',
};

const StatusBadge = ({ status }) => {
  const cls = STATUS_MAP[status] || 'status-open';
  const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown';
  return <span className={`status-badge ${cls}`}>{label}</span>;
};

export default StatusBadge;
