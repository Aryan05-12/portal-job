import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Image, ArrowLeft, Save } from "lucide-react";
import '../styling/apply.css';
import Nav from "../components/Nav";
import JobNav from "../components/JobNav";

export default function EditProfile() {
  const navigate = useNavigate();
  const savedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    fullName: savedUser?.fullName || "",
    email: savedUser?.email || "",
    contactNumber: savedUser?.contactNumber || "",
    photo: savedUser?.photo || "",
    resume: savedUser?.resume || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUser = { ...savedUser, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    alert("Profile Updated Successfully..!");
    navigate(-1);
  };

  return (
    <div>
      <JobNav/>
    <div className="edt-form-wrapper">
      <div className="edt-form-card">
        
        
        {/* Header Section */}
        <div className="edt-form-header">
          <button type="button" className="edt-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <div className="edt-header-title">
            <User size={28} className="edt-main-icon" />
            <h2>Edit Profile Details</h2>
          </div>
          <p className="edt-subtitle">Keep your professional details accurate and up to date</p>
        </div>

        <form onSubmit={handleSave} className="edt-elite-form">
          
          {/* Full Name */}
          <div className="edt-form-group">
            <label>
              <User size={16} /> <span>Full Name</span>
            </label>
            <div className="edt-input-wrapper">
              <input 
                type="text" 
                name="fullName" 
                value={formData.fullName} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Email Address */}
          <div className="edt-form-group">
            <label>
              <Mail size={16} /> <span>Email Address</span>
            </label>
            <div className="edt-input-wrapper">
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Contact Number */}
          <div className="edt-form-group">
            <label>
              <Phone size={16} /> <span>Contact Number</span>
            </label>
            <div className="edt-input-wrapper">
              <input 
                type="text" 
                name="contactNumber" 
                value={formData.contactNumber} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          {/* Profile Image URL */}
          <div className="edt-form-group">
            <label>
              <Image size={16} /> <span>Profile Image URL</span>
            </label>
            <div className="edt-input-wrapper">
              <input 
                type="text" 
                name="photo" 
                value={formData.photo} 
                onChange={handleChange} 
                placeholder="https://example.com/photo.jpg"
              />
            </div>
          </div>

          {/* Resume Link */}
          <div className="edt-form-group">
            <label>
            <span>Resume Link (Drive / Cloud)</span>
            </label>
            <div className="edt-input-wrapper">
              <input 
                type="text" 
                name="resume" 
                value={formData.resume} 
                onChange={handleChange} 
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="edt-form-actions">
            <button type="button" className="edt-cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="edt-save-btn">
              <Save size={16} /> Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
    </div>
  );
}