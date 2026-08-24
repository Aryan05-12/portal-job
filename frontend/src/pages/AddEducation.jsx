import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, School, Award, Calendar, ArrowLeft, PlusCircle } from "lucide-react";
import '../styling/apply.css';
import JobNav from "../components/JobNav";

export default function AddEducation() {
  const navigate = useNavigate();
  const [edu, setEdu] = useState({ school: "", degree: "", year: "" });

  const handleSave = (e) => {
    e.preventDefault();
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    
    const currentEducation = savedUser.education || [];
    const updatedEducation = [...currentEducation, edu];

    const updatedUser = { ...savedUser, education: updatedEducation };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Education Added!");
    navigate(-1);
  };

  return (
    <div>
      <JobNav/>
    <div className="edu-form-wrapper">
      <div className="edu-form-card">
        
        {/* Back Button & Header */}
        <div className="edu-form-header">
          <button type="button" className="edu-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div className="edu-header-title">
            <GraduationCap size={28} className="edu-main-icon" />
            <h2>Add Education</h2>
          </div>
          <p className="edu-subtitle">Add your academic qualifications to complete your profile</p>
        </div>

        <form onSubmit={handleSave} className="edu-elite-form">
          
          {/* School / University Input */}
          <div className="edu-form-group">
            <label>
              <School size={16} /> <span>School / University</span>
            </label>
            <div className="edu-input-wrapper">
              <input 
                type="text" 
                placeholder="e.g. Delhi University"
                required 
                onChange={(e) => setEdu({ ...edu, school: e.target.value })} 
              />
            </div>
          </div>

          {/* Degree / Course Input */}
          <div className="edu-form-group">
            <label>
              <Award size={16} /> <span>Degree / Course</span>
            </label>
            <div className="edu-input-wrapper">
              <input 
                type="text" 
                placeholder="e.g. B.Tech Computer Science"
                required 
                onChange={(e) => setEdu({ ...edu, degree: e.target.value })} 
              />
            </div>
          </div>

          {/* Passing Year Input */}
          <div className="edu-form-group">
            <label>
              <Calendar size={16} /> <span>Passing Year</span>
            </label>
            <div className="edu-input-wrapper">
              <input 
                type="number" 
                placeholder="e.g. 2026"
                required 
                onChange={(e) => setEdu({ ...edu, year: e.target.value })} 
              />
            </div>
          </div>

          {/* Form Actions / Buttons */}
          <div className="edu-form-actions">
            <button type="button" className="edu-cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="edu-save-btn">
              <PlusCircle size={16} /> Add Details
            </button>
          </div>

        </form>
      </div>
    </div>
    </div>
  );
}