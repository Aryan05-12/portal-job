import React from 'react';
import '../styling/recent.css';
import { Link } from 'react-router-dom';
import { MapPin, Banknote, Calendar, Briefcase } from 'lucide-react';

function RecentJob({ job }) {
  // Job Type ke hisab se dynamic badge color class dene ke liye
  const getJobTypeClass = (type) => {
    const jobType = type?.toLowerCase() || '';
    if (jobType.includes('full')) return 'type-fulltime'; // Green
    if (jobType.includes('part')) return 'type-parttime'; // Orange
    if (jobType.includes('remote') || jobType.includes('work from home')) return 'type-remote'; // Violet
    if (jobType.includes('intern')) return 'type-intern'; // Blue
    return 'type-default';
  };

  return (
    <div className="recent-job-card">
      <div className="recent-job-left">
        <Link to={`/jobs/${job._id}`} className="logo-link">
          <div className="recent-job-logo">
            <Briefcase size={22} className="logo-icon" />
          </div>
        </Link>
        
        <div className="recent-job-content">
          <div className="recent-job-header-row">
            <h2 className="recent-job-title">
              <Link to={`/jobs/${job._id}`}>{job?.jobTitle}</Link>
            </h2>
            <span className="job-badge category-badge">{job?.category}</span>
          </div>

          <div className="recent-job-meta-row">
            <span className="meta-item">
              <MapPin size={14} className="meta-icon" /> {job?.location}
            </span>
            <span className="meta-item salary-highlight">
              <Banknote size={14} className="meta-icon" /> ₹{job?.salary}
            </span>
            <span className="meta-item">
              <Calendar size={14} className="meta-icon" /> {job?.date ? new Date(job.date).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="recent-job-right">
        <span className={`recent-job-type ${getJobTypeClass(job?.jobType)}`}>
          {job?.jobType || "Full Time"}
        </span>
      </div>
    </div>
  );
}

export default RecentJob;