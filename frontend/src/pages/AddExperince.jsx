import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Building2, UserCheck, Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import '../styling/apply.css';
import JobNav from "../components/JobNav";

export default function AddExperience() {
  const navigate = useNavigate();
  const [exp, setExp] = useState({ company: "", role: "", duration: "" });

  const handleSave = (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    
    const currentExperience = savedUser.experience || [];
    const updatedExperience = [...currentExperience, exp];

    const updatedUser = { ...savedUser, experience: updatedExperience };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Experience Added!");
    navigate(-1);
  };

  return (
    <div>
      <JobNav/>
    <div className="exp-form-wrapper">
      <div className="exp-form-card">
        
        {/* Back Button & Header */}
        <div className="exp-form-header">
          <button type="button" className="exp-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div className="exp-header-title">
            <Briefcase size={28} className="exp-main-icon" />
            <h2>Add Work Experience</h2>
          </div>
          <p className="exp-subtitle">Highlight your professional history to attract recruiters</p>
        </div>

        <form onSubmit={handleSave} className="exp-elite-form">
          
          {/* Company Name Input */}
          <div className="exp-form-group">
            <label>
              <Building2 size={16} /> <span>Company Name</span>
            </label>
            <div className="exp-input-wrapper">
              <input 
                type="text" 
                placeholder="e.g. Google, Tech Mahindra"
                required 
                onChange={(e) => setExp({ ...exp, company: e.target.value })} 
              />
            </div>
          </div>

          {/* Role / Position Input */}
          <div className="exp-form-group">
            <label>
              <UserCheck size={16} /> <span>Role / Position</span>
            </label>
            <div className="exp-input-wrapper">
              <input 
                type="text" 
                placeholder="e.g. Full Stack Developer"
                required 
                onChange={(e) => setExp({ ...exp, role: e.target.value })} 
              />
            </div>
          </div>

          {/* Duration Input */}
          <div className="exp-form-group">
            <label>
              <Clock size={16} /> <span>Duration</span>
            </label>
            <div className="exp-input-wrapper">
              <input 
                type="text" 
                placeholder="e.g. 1 Year, 6 Months" 
                required 
                onChange={(e) => setExp({ ...exp, duration: e.target.value })} 
              />
            </div>
          </div>

          {/* Form Actions / Buttons */}
          <div className="exp-form-actions">
            <button type="button" className="exp-cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="exp-save-btn">
              <CheckCircle2 size={16} /> Add Experience
            </button>
          </div>

        </form>
      </div>
    </div>
    </div>
  );
}