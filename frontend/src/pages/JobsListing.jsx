import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../styling/joblist.css';
import JobNav from '../components/JobNav';

const JobsListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const employerId = savedUser._id || savedUser.id;

        if (!employerId) {
          setMessage('Please login first to manage your jobs');
          setJobs([]);
          return;
        }

        const res = await axios.get(`https://jon-available.onrender.com/api/jobs?employerId=${employerId}`);
        const myJobs = (res.data.jobs || []).filter((job) => job.employerId === employerId);
        setJobs(myJobs);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Jobs load nahi ho paaye');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return jobs;
    }

    return jobs.filter((job) =>
      `${job.jobTitle || ''} ${job.category || ''} ${job.location || ''}`
        .toLowerCase()
        .includes(search)
    );
  }, [jobs, searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="jobs-listing-wrapper">
      <JobNav />

      <header className="jobs-listing-header">
        <h1>Employer | Manage My Jobs</h1>
      </header>

      <main className="jobs-listing-container">
        <section className="search-section-box">
          <form onSubmit={handleSearch} className="search-form-flex">
            <div className="search-input-field">
              <input
                type="text"
                placeholder="Enter Job Title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="search-action-btn" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="search-icon-svg">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </section>

        <div className="latest-jobs-heading-bar">
          <h2>My Posted Jobs</h2>
        </div>

        <section className="jobs-cards-grid-wrapper">
          {loading && (
            <div className="dummy-job-card-placeholder">
              <p>Jobs load ho rahe hain...</p>
            </div>
          )}

          {!loading && message && (
            <div className="dummy-job-card-placeholder">
              <p>{message}</p>
            </div>
          )}

          {!loading && !message && filteredJobs.length === 0 && (
            <div className="dummy-job-card-placeholder">
              <p>Abhi aapne koi job post nahi ki.</p>
              <span className="api-hint-badge">Post Job first</span>
            </div>
          )}

          {!loading && !message && filteredJobs.map((job) => (
            <article className="job-data-card" key={job._id}>
              <div>
                <h3>{job.jobTitle}</h3>
                <p>{job.description || 'No description added'}</p>
              </div>
              <div className="job-data-meta">
                <span>{job.category || 'General'}</span>
                <span>{job.jobType || 'Full Time'}</span>
                <span>{job.location || 'Location not added'}</span>
                <span>{job.salary || 'Salary not added'}</span>
                <span>{job.skill || 'SKill Compulsary'}</span>
                <span>{job.date || 'Date Here'}</span>

              </div>
            </article>
            
          ))}
        </section>

        <nav className="jobs-pagination-nav" aria-label="Pagination">
          <button className="pag-nav-btn" disabled>Previous</button>
          <button className="pag-number-btn active-page-num">1</button>
          <button className="pag-number-btn" disabled>2</button>
          <button className="pag-number-btn" disabled>3</button>
          <button className="pag-nav-btn" disabled>Next</button>
        </nav>
      </main>
    </div>
  );
};

export default JobsListing;
