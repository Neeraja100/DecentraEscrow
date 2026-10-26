// src/pages/Marketplace.jsx
import React, { useState } from 'react';
import JobCard from '../components/JobCard.jsx';
import { MOCK_JOBS, CATEGORIES } from '../utils/mockData.js';

const Marketplace = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Jobs');
  const [sort, setSort] = useState('newest');

  let filtered = MOCK_JOBS.filter(j => {
    const matchCat = activeCategory === 'All Jobs' || j.category === activeCategory;
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sort === 'newest') filtered = [...filtered].sort((a, b) => a.postedDays - b.postedDays);
  if (sort === 'budget-high') filtered = [...filtered].sort((a, b) => b.budget - a.budget);
  if (sort === 'budget-low') filtered = [...filtered].sort((a, b) => a.budget - b.budget);

  return (
    <main className="page-wrapper">
      <div className="container marketplace-page">
        <div className="marketplace-page__header">
          <h1 className="marketplace-page__title">Browse Jobs</h1>
          <p className="marketplace-page__sub">Find your next blockchain freelance project</p>
        </div>

        <div className="marketplace-search">
          <div className="marketplace-search__input-wrap">
            <span className="marketplace-search__icon">🔍</span>
            <input
              className="marketplace-search__input"
              placeholder="Search jobs by title or keyword..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="marketplace-sort"
            value={sort}
            onChange={e => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="budget-high">Budget: High → Low</option>
            <option value="budget-low">Budget: Low → High</option>
          </select>
        </div>

        <div className="marketplace-layout">
          {/* Sidebar */}
          <aside className="sidebar">
            <p className="sidebar__title">Categories</p>
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                className={`sidebar__item${activeCategory === cat.name ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat.name)}
              >
                <span>{cat.name}</span>
                <span className="sidebar__count">{cat.count}</span>
              </button>
            ))}
          </aside>

          {/* Jobs */}
          <div>
            <p className="jobs-count">{filtered.length} job{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="jobs-grid">
              {filtered.length > 0
                ? filtered.map(j => <JobCard key={j.id} job={j} />)
                : <p style={{color: 'var(--text-muted)'}}>No jobs found for this filter.</p>
              }
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Marketplace;
