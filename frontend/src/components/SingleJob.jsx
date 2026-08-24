import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styling/recent.css';

export default function SingleJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false); // Apply loading state ke liye

  useEffect(() => {
    fetch(`http://localhost:1111/api/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => setJob(data.job))
      .catch((err) => console.log(err));
  }, [id]);

  // Apply Now Function
  const handleApplyNow = async () => {
    // 1. LocalStorage se logged-in user uthao
    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser) {
      alert("login first ");
      return;
    }

    setLoading(true);

    try {
      // 2. Apne backend par Application data bhejo
      const response = await fetch("http://localhost:1111/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: job?._id,
          jobTitle: job?.jobTitle,
          userId: currentUser._id || currentUser.id, // Jo bhi tumhari user id key ho
          userName: currentUser.fullName,
          userEmail: currentUser.email,
          status: "Pending" // <--- Yeh default status admin ke paas jayega
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Applied Successfully! Your data has been sended to Admin.");
      } else {
        alert(data.message || "You have already applied to this job");
      }
    } catch (error) {
      console.error("Apply error:", error);
      alert("Server error please try again few min later!");
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="sj-loading-container">
        <h2 className="sj-loading-text">Loading Details...</h2>
      </div>
    );
  }

  const isFullTime = job.jobType?.toUpperCase() === "FULL TIME";

  return (
    <div className="sj-page-wrapper">
      <div className="sj-details-card">
        
        {/* Top Header Grid Area */}
        <div className="sj-card-header">
          <div className="sj-header-main">
            <h1 className="sj-main-title">{job.jobTitle}</h1>
            <p className="sj-company-name">{job.category || "Company Name"}</p>
          </div>
          
          {/* Right side Badge Type */}
          {job.jobType && (
            <span className={`sj-type-badge ${isFullTime ? "sj-bg-blue" : "sj-bg-teal"}`}>
              {job.jobType}
            </span>
          )}
        </div>

        <hr className="sj-divider" />

        {/* Info Meta Grid: 3 columns layout */}
        <div className="sj-meta-grid">
          <div className="sj-meta-box">
            <span className="sj-meta-label">Location</span>
            <span className="sj-meta-value">📍 {job.location || "Remote / Onsite"}</span>
          </div>
          <div className="sj-meta-box">
            <span className="sj-meta-label">Salary Package</span>
            <span className="sj-meta-value">💵 ₹{job.salary}</span>
          </div>
          <div className="sj-meta-box">
            <span className="sj-meta-label">Posted Date</span>
            <span className="sj-meta-value">📅 {job.date ? new Date(job.date).toLocaleDateString() : "Recent"}</span>
          </div>
        </div>

        {/* Job Requirements Description Section */}
        <div className="sj-description-section">
          <h3 className="sj-section-title">Job Description & Requirements</h3>
          <p className="sj-description-text">{job.description}</p>
        </div>

        {/* Bottom Call to Action */}
        <div className="sj-action-area">
          <button 
            className="sj-apply-btn" 
            onClick={handleApplyNow} 
            disabled={loading}
          >
            {loading ? "Applying..." : "Apply For This Job"}
          </button>
        </div>

      </div>
    </div>
  );
}