import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../styling/recent.css';

export default function SingleJob() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`https://jon-available.onrender.com/api/jobs/${id}`)
      .then((res) => res.json())
      .then((data) => setJob(data.job))
      .catch((err) => console.log(err));
  }, [id]);

  const handleApplyNow = async () => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");

    if (!currentUser) {
      alert("login first");
      return;
    }

    const userId = currentUser._id || currentUser.id;

    if (!userId) {
      alert("User id not found. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://jon-available.onrender.com/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobId: job?._id,
          jobTitle: job?.jobTitle,
          userId,
          userName: currentUser.fullName || currentUser.name,
          userEmail: currentUser.email,
          resume: currentUser.resume || "",
          resumeName: currentUser.resumeName || "",
          status: "Pending",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Applied Successfully! Your data has been sent to Admin.");
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
        <div className="sj-card-header">
          <div className="sj-header-main">
            <h1 className="sj-main-title">{job.jobTitle}</h1>
            <p className="sj-company-name">{job.companyName || job.category || "Company Name"}</p>
          </div>
          {job.jobType && (
            <span className={`sj-type-badge ${isFullTime ? "sj-bg-blue" : "sj-bg-teal"}`}>
              {job.jobType}
            </span>
          )}
        </div>

        <hr className="sj-divider" />

        <div className="sj-meta-grid">
          <div className="sj-meta-box">
            <span className="sj-meta-label">Location</span>
            <span className="sj-meta-value">{job.location || "Remote / Onsite"}</span>
          </div>
          <div className="sj-meta-box">
            <span className="sj-meta-label">Salary Package</span>
            <span className="sj-meta-value">Rs. {job.salary || "Not added"}</span>
          </div>
          <div className="sj-meta-box">
            <span className="sj-meta-label">Posted Date</span>
            <span className="sj-meta-value">{job.date ? new Date(job.date).toLocaleDateString() : "Recent"}</span>
          </div>
        </div>

        <div className="sj-description-section">
          <h3 className="sj-section-title">Job Description & Requirements</h3>
          <p className="sj-description-text">{job.description}</p>
        </div>

        <div className="sj-action-area">
          <button className="sj-apply-btn" onClick={handleApplyNow} disabled={loading}>
            {loading ? "Applying..." : "Apply For This Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
