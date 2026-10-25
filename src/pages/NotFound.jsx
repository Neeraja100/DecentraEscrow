// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages.css';

const NotFound = () => (
  <section className="not-found">
    <h1>404 – Page Not Found</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
    <Link to="/" className="button primary">Go Home</Link>
  </section>
);

export default NotFound;
