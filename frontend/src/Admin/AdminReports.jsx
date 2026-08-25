import React, { useState } from "react";
import axios from "axios";
import {Link} from 'react-router-dom'
import '../styling/report.css'

const AdminReports = () => {
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
        setMessage('not data found in this range .');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Report load failed');
    }
  };

  return (
    <div className="br-report-page">
      

      <div className="br-top-header">
        <h1>Dates Report</h1>
      </div>

      <div className="br-report-container">
        <h2>Ai deteced Report of Posted Jobs</h2>
        <br />

        <form className="br-report-form" onSubmit={handleSubmit}>
          <button type="submit" className="br-submit-btn">
           Enter Here to get Report
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

export default AdminReports;
