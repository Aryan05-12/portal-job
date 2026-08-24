import React, { useEffect, useState } from "react";
import { FileText, Check, X, Inbox, Mail, Briefcase, Calendar, ShieldAlert } from "lucide-react";
import "../admincss/adminapplication.css"; // Dedicated design sheet 

export default function AdminApplication() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", isError: false });

  // Helper status alert trigger
  const triggerToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => setToast({ show: false, message: "", isError: false }), 4000);
  };

  // 1. Fetch Incoming Applications Array
  const fetchApplications = () => {
    setLoading(true);
    fetch("http://localhost:1111/api/applications")
      .then((res) => res.json())
      .then((data) => {
        setApplications(data.applications || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        triggerToast("Server directory load karne me error!", true);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // 2. Premium Status Mutation Operations
  const handleStatusChange = async (appId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:1111/api/applications/${appId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApplications((prevApps) =>
          prevApps.map((app) =>
            app._id === appId ? { ...app, status: newStatus } : app
          )
        );
        triggerToast(`Application status overridden to ${newStatus}!`);
      } else {
        triggerToast("Action intercept rejected by system.", true);
      }
    } catch (error) {
      console.error("Update error:", error);
      triggerToast("Network link failed or server offline.", true);
    }
  };

  return (
    <div className="aap-master-panel">
      {/* Dynamic Native Notification Overlay Toast */}
      {toast.show && (
        <div className={`aap-toast ${toast.isError ? "aap-toast-critical" : "aap-toast-success"}`}>
          {toast.isError ? <ShieldAlert size={16} /> : <Check size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="aap-card-structure">
        {/* Core Control Center Header */}
        <div className="aap-card-header">
          <div className="aap-header-icon-container">
            <FileText size={20} />
          </div>
          <div className="aap-header-text-group">
            <h2>Incoming Candidate Applications</h2>
            <p>Review, screen, and audit candidate submissions across active listings.</p>
          </div>
          <div className="aap-metric-pill">
            Submissions: {applications.length}
          </div>
        </div>

        {/* Dynamic Condition Window Layout Render */}
        {loading ? (
          <div className="aap-loading-state">
            <div className="aap-loading-spinner"></div>
            <p>Synchronizing application streams...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="aap-empty-state">
            <Inbox size={48} />
            <h3>No Active Submissions Found</h3>
            <p>Platform records currently contain no inbound job applications.</p>
          </div>
        ) : (
          <div className="aap-responsive-overflow">
            <table className="aap-data-table">
              <thead>
                <tr>
                  <th>Applicant Profile</th>
                  <th>Contact Email</th>
                  <th>Target Position</th>
                  <th>Filing Date</th>
                  <th>Status Token</th>
                  <th style={{ textAlign: "center" }}>Direct Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className={`aap-row-status-${app.status?.toLowerCase() || 'pending'}`}>
                    {/* Applicant Identity */}
                    <td className="aap-cell-identity">
                      <strong>{app.userName}</strong>
                    </td>
                    
                    {/* Contact Link Meta */}
                    <td>
                      <div className="aap-meta-row">
                        <Mail size={13} />
                        <span>{app.userEmail}</span>
                      </div>
                    </td>
                    
                    {/* Position Applied For */}
                    <td>
                      <div className="aap-meta-row aap-highlight-position">
                        <Briefcase size={13} />
                        <span>{app.jobTitle}</span>
                      </div>
                    </td>
                    
                    {/* Formatted Date Block */}
                    <td>
                      <div className="aap-meta-row">
                        <Calendar size={13} />
                        <span>{new Date(app.date).toLocaleDateString("en-US", {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}</span>
                      </div>
                    </td>
                    
                    {/* Status Badge Rendering */}
                    <td>
                      <span className={`aap-badge status-${app.status?.toLowerCase() || 'pending'}`}>
                        <span className="aap-badge-dot"></span>
                        {app.status || "Pending"}
                      </span>
                    </td>

                    
                    {/* Core Process Control Operations */}
                    <td>
                      <div className="aap-action-flex-cluster">
                        <button
                          className="aap-btn-action btn-action-approve"
                          onClick={() => handleStatusChange(app._id, "Accepted")}
                          disabled={app.status === "Accepted"}
                          title="Approve Submission"
                          type="button"
                        >
                          <Check size={14} />
                          <span>Accept</span>
                        </button>
                        <button
                          className="aap-btn-action btn-action-reject"
                          onClick={() => handleStatusChange(app._id, "Rejected")}
                          disabled={app.status === "Rejected"}
                          title="Deny Submission"
                          type="button"
                        >
                          <X size={14} />
                          <span>Reject</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}