import React, { useEffect, useState } from "react";
import { Briefcase, MapPin, DollarSign, FileText, Building2, ChevronRight, CircleDot } from "lucide-react";
import '../styling/apply.css';

export default function ApplyAllJob() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = currentUser._id || currentUser.id;

    if (!userId) {
      setMessage("Please login first to view applied jobs.");
      setLoading(false);
      return;
    }

    fetch(`https://jon-available.onrender.com/api/my-apply/${userId}`)
      .then((res) => res.json())
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.log(err);
        setMessage("Applied jobs load nahi ho paaye.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="ajb-main-container">
      <div className="ajb-header-section">
        <h1>Applied Jobs</h1>
        <p className="ajb-subtitle">Track all positions you have applied for from your account</p>
      </div>

      {loading ? (
        <div className="ajb-empty-state">
          <Briefcase size={48} className="ajb-empty-icon" />
          <p>Applied jobs load ho rahe hain...</p>
        </div>
      ) : message ? (
        <div className="ajb-empty-state">
          <Briefcase size={48} className="ajb-empty-icon" />
          <p>{message}</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="ajb-empty-state">
          <Briefcase size={48} className="ajb-empty-icon" />
          <p>No applications found. Apply to a job first.</p>
        </div>
      ) : (
        <div className="ajb-jobs-grid">
          {applications.map((app) => (
            <div key={app._id} className="ajb-job-card">
              <div className="ajb-card-top">
                <div className="ajb-icon-box">
                  <Building2 size={24} />
                </div>
                <div className="ajb-title-block">
                  <h2>{app.jobTitle}</h2>
                  <p className="ajb-company-name">Applied on {app.date ? new Date(app.date).toLocaleDateString() : "Recent"}</p>
                </div>
              </div>

              <div className="ajb-card-details">
                <div className="ajb-detail-item">
                  <MapPin size={16} />
                  <span>Application ID: {app._id?.slice(-6)}</span>
                </div>
                <div className="ajb-detail-item ajb-salary-highlight">
                  <DollarSign size={16} />
                  <span>{app.status || "Pending"}</span>
                </div>
              </div>

              <div className="ajb-card-description">
                <div className="ajb-desc-title">
                  <FileText size={14} /> <span>Resume:</span>
                </div>
                <p>{app.resumeName || (app.resume ? "Resume uploaded" : "No resume uploaded")}</p>
              </div>

              <div className="ajb-card-footer">
                <span className="ajb-status-live">
                  <CircleDot size={12} className="ajb-pulse-dot" /> {app.status || "Pending"}
                </span>
                {app.resume && (
                  <div className="ajb-footer-right" onClick={() => window.open(app.resume, "_blank")}>
                    <span className="ajb-view-detail-txt">Resume</span>
                    <ChevronRight size={16} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}