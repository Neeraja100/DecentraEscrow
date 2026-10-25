// src/components/StatusBadge.jsx
import React from 'react';
import '../styles/components.css';

const statusColors = {
  Pending: '#fbbf24', // amber
  Funded: '#34d399', // green
  Completed: '#60a5fa', // blue
  Disputed: '#f87171', // red
};

const StatusBadge = ({ status }) => (
  <span
    className="status-badge"
    style={{ backgroundColor: statusColors[status] || '#d1d5db' }}
  >
    {status || 'Unknown'}
  </span>
);

export default StatusBadge;
