import React, { useState } from "react";
import axios from "axios";
import {Link} from 'react-router-dom'
import JobNav from "../components/JobNav";
import '../styling/report.css'

const Report = () => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await axios.get('https://jon-available.onrender.com/api/jobs');
      const allJobs = res.data.jobs || [];
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const filtered = allJobs.filter((job) => {
        const jobDate = new Date(job.date || job.createdAt);

        if (from && jobDate < from) {
          return false;
        }

        if (to && jobDate > to) {
          return false;
        }

        return true;
      });

      setJobs(filtered);
      if (filtered.length === 0) {
        setMessage('Is date range me koi job data nahi mila.');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Report load nahi hua');
    }
  };

  return (
    <div className="br-report-page">
      <JobNav />

      <div className="br-top-header">
        <h1>Between Dates Report</h1>
      </div>

      <div className="br-report-container">
        <h2>Between Dates Report of Posted Jobs</h2>

        <form className="br-report-form" onSubmit={handleSubmit}>
          <div className="br-form-group">
            <label htmlFor="fromDate">From Date:</label>
            <input
              type="date"
              id="fromDate"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="br-form-group">
            <label htmlFor="toDate">To Date:</label>
            <input
              type="date"
              id="toDate"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

          <button type="submit" className="br-submit-btn">
            Submit Report
          </button>
        </form>

        {message && <p className="br-report-message">{message}</p>}

        {jobs.length > 0 && (
          <div className="br-report-results">
            {jobs.map((job) => (
              <div className="br-report-row" key={job._id}>
                <strong>{job.jobTitle}</strong>
                <span>{job.category || 'General'} | {job.location || 'No location'}</span>

                <Link to={`/applications-details/${job._id}`}>Application Details</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;
