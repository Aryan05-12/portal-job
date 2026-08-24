import React, { useEffect, useState } from "react";
import { Briefcase, MapPin, DollarSign, FileText, Building2, ChevronRight, CircleDot } from "lucide-react";
import '../styling/apply.css';

export default function ApplyAllJob() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:1111/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="ajb-main-container">
      <div className="ajb-header-section">
        <h1>Applied Jobs</h1>
        <p className="ajb-subtitle">Track and manage all the positions you have applied for</p>
      </div>

      {jobs.length === 0 ? (
        <div className="ajb-empty-state">
          <Briefcase size={48} className="ajb-empty-icon" />
          <p>No jobs found. Start applying to see them here!</p>
        </div>
      ) : (
        <div className="ajb-jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="ajb-job-card">
              
              <div className="ajb-card-top">
                <div className="ajb-icon-box">
                  <Building2 size={24} />
                </div>
                <div className="ajb-title-block">
                  <h2>{job.title}</h2>
                  <p className="ajb-company-name">{job.company}</p>
                </div>
              </div>

              <div className="ajb-card-details">
                <div className="ajb-detail-item">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
                {/* Salary box ko green tag aur bold logic de diya */}
                <div className="ajb-detail-item ajb-salary-highlight">
                  <DollarSign size={16} />
                  <span>₹{job.salary}</span>
                </div>
              </div>

              <div className="ajb-card-description">
                <div className="ajb-desc-title">
                  <FileText size={14} /> <span>Description:</span>
                </div>
                <p>{job.description}</p>
              </div>

              <div className="ajb-card-footer">
                {/* Active application dot status text */}
                <span className="ajb-status-live">
                  <CircleDot size={12} className="ajb-pulse-dot" /> Applied
                </span>
                <div className="ajb-footer-right">
                  <span className="ajb-view-detail-txt">Details</span>
                  <ChevronRight size={16} />
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}