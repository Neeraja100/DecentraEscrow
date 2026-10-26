// src/pages/Marketplace.jsx
import React, { useState } from 'react';
import JobCard from '../components/JobCard.jsx';
import { CATEGORIES } from '../utils/mockData.js';
import { useEscrow } from '../context/EscrowContext.jsx';

const Marketplace = () => {
  const { jobs } = useEscrow();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Jobs');
  const [sort, setSort] = useState('newest');

  // Filter jobs
  let filtered = jobs.filter((j) => {
    const matchCat = activeCategory === 'All Jobs' || j.category === activeCategory;
    const matchSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  // Sorting
  if (sort === 'newest') filtered = [...filtered].sort((a, b) => (a.postedDays || 0) - (b.postedDays || 0));
  if (sort === 'budget-high') filtered = [...filtered].sort((a, b) => b.budget - a.budget);
  if (sort === 'budget-low') filtered = [...filtered].sort((a, b) => a.budget - b.budget);

  return (
    <main className="page-wrapper">
      <div className="container">
        <div className="browse-jobs-layout">
          {/* Left Sidebar */}
          <aside className="browse-sidebar">
            <div className="search-box">
              <span className="search-box__icon">🔍</span>
              <input
                type="text"
                className="search-box__input"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="categories-card">
              <h2 className="categories-card__title">Categories</h2>
              <div className="categories-list">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.name}
                    className={`category-item${activeCategory === cat.name ? ' active' : ''}`}
                    onClick={() => setActiveCategory(cat.name)}
                  >
                    <span>{cat.name}</span>
                    <span className="category-item__count">{cat.count}</span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Right Main Content */}
          <section className="browse-main">
            <div className="browse-main__header">
              <h1 className="browse-main__title">Available Jobs</h1>
              <div className="sort-select-wrap">
                <span>Sort by</span>
                <select
                  className="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="budget-high">Budget: High → Low</option>
                  <option value="budget-low">Budget: Low → High</option>
                </select>
              </div>
            </div>

            <div className="jobs-list-stack">
              {filtered.length > 0 ? (
                filtered.map((j) => <JobCard key={j.id} job={j} />)
              ) : (
                <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <p>No jobs found matching your criteria.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Marketplace;
