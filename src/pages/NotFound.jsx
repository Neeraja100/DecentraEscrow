// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <main className="page-wrapper">
    <div className="container notfound-page">
      <div className="notfound-code">404</div>
      <h1 className="notfound-title">Page Not Found</h1>
      <p className="notfound-sub">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  </main>
);

export default NotFound;
