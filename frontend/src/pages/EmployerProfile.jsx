import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Phone, Calendar, FileText, Edit2, GraduationCap, Briefcase, ExternalLink, CheckCircle, Clock, XCircle } from "lucide-react";
import '../styling/allcss.css';
import JobNav from "../components/JobNav";

export default function EmployerProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [applications, setApplication] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:1111/api/my-apply/${user.id}`)
      .then((res) => res.json())
      .then((data) => setApplication(data));
  }, [user.id]);

  useEffect(() => {
    fetch("http://localhost:1111/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data.jobs))
      .catch((err) => console.log(err));
  }, []);

  // Status badge icon helper
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return <CheckCircle size={16} />;
      case 'rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (

    <div>

      <JobNav/>
    <div className="emp-dashboard-container">
      
      
      {/* LEFT SIDE: PROFILE CARD */}
      <div className="emp-profile-card">
        <div className="emp-profile-top">
          <div className="emp-avatar-wrapper">
            {user?.photo ? (
              <img src={user?.photo} alt="profile" className="emp-profile-image" />
            ) : (
              <User size={48} className="emp-default-avatar" />
            )}
          </div>

          <div className="emp-profile-info">
            <h1>{user?.fullName || "User Name"}</h1>
            <p className="emp-join-date">
              <Calendar size={14} /> Registered: {new Date().toLocaleDateString()}
            </p>
            
            <div className="emp-profile-contact">
              <span><Mail size={14} /> {user?.email}</span>
              <span><Phone size={14} /> {user?.contactNumber || "N/A"}</span>
            </div>
          </div>
        </div>

        <div className="emp-profile-actions">
          <button className="emp-btn emp-btn-secondary" onClick={() => window.open(user?.resume)}>
            <FileText size={16} /> RESUME
          </button>
          <button className="emp-btn emp-btn-primary" onClick={() => navigate("/editProfile")}>
            <Edit2 size={16} /> EDIT PROFILE
          </button>
          <button className="emp-btn emp-btn-outline" onClick={() => navigate("/education")}>
            <GraduationCap size={16} /> ADD EDUCATION
          </button>
          <button className="emp-btn emp-btn-outline" onClick={() => navigate("/experience")}>
            <Briefcase size={16} /> ADD EXPERIENCE
          </button>
        </div>
      </div>
      
      {/* RIGHT SIDE: JOB HISTORY */}
      <div className="emp-job-history-container">
        <div className="emp-history-header-main">
          <h2 className="emp-section-title">Applied Jobs History</h2>
        </div>

        <div className="emp-history-list">
          {applications.length > 0 ? (
            applications.map((item) => (
              <div key={item._id} className="emp-history-card">
                <div className="emp-history-header">
                  <h3 className="emp-history-job-title">{item.jobTitle}</h3>
                  <span className={`emp-status-badge ${item.status?.toLowerCase() || 'pending'}`}>
                    {getStatusIcon(item.status)}
                    {item.status || 'Pending'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="emp-no-data">No applications found.</p>
          )}
        </div>

        <div className="emp-view-all-wrapper">
          <Link to="/applied-job" className="emp-view-all-link">
            View All Applied Jobs <ExternalLink size={14} />
          </Link>
        </div>
      </div>

    </div>
    </div>
  );
}