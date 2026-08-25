import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Camera, FileText, Upload, LogIn, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Nav from './Nav';
import "../styling/seeker.css";

const API_URL = 'https://jon-available.onrender.com/api';

const Seeker = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    password: '',
    photo: '',
    resume: '',
    resumeName: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        resume: file,
        resumeName: file.name,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          fullName: formData.fullName,
          email: formData.email,
          contact: formData.contactNumber,
          contactNumber: formData.contactNumber,
          password: formData.password,
          photo: formData.photo,
          resumeName: formData.resumeName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      const user = {
        ...data.user,
        name: data.user?.name || formData.fullName,
        fullName: data.user?.fullName || formData.fullName,
        contact: data.user?.contact || formData.contactNumber,
        contactNumber: data.user?.contactNumber || formData.contactNumber,
        photo: data.user?.photo || formData.photo,
        resumeName: data.user?.resumeName || formData.resumeName,
      };

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      window.dispatchEvent(new Event('userUpdated'));
      setStatus({ type: 'success', message: 'Signup successful! Welcome to your future.' });
      setFormData({ fullName: '', email: '', contactNumber: '', password: '', photo: '', resume: '', resumeName: '' });
      e.target.reset();
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Signup failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sk-reg-global-wrapper">
      <Nav />
      
      <div className="sk-reg-container">
        {/* Elite Glass Header Section */}
        <header className="sk-reg-header">
          <div className="sk-reg-badge"><Sparkles size={14} /> Premium Talent Hub</div>
          <h1>Create Candidate Profile</h1>
          <p>Build your professional profile and unlock direct tracking from top tech recruiters.</p>
        </header>

        <div className="sk-reg-content-wrapper">
          {/* Informative Modern Banner */}
          <div className="sk-reg-account-banner">
            <div className="sk-reg-banner-text">
              <h2>Already Have an Account?</h2>
              <p>Sign in to update your resume dashboard, view active application analytics, and monitor screening rounds.</p>
            </div>
            <Link to="/employer-signup" className="sk-reg-signin-btn">
              <LogIn size={16} /> SIGN IN NOW
            </Link>
          </div>

          {/* Master Glass Form */}
          <form className="sk-reg-form" onSubmit={handleSubmit}>
            
            {/* Status Feedback System */}
            {status.message && (
              <div className={`sk-reg-alert ${status.type === 'success' ? 'sk-alert-success' : 'sk-alert-error'}`}>
                {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <p>{status.message}</p>
              </div>
            )}

            <div className="sk-reg-grid">
              {/* Full Name */}
              <div className="sk-reg-group">
                <label htmlFor="fullName"><User size={15} /> <span>Full Name <span className="sk-req">*</span></span></label>
                <div className="sk-reg-input-wrapper">
                  <input 
                    type="text" id="fullName" placeholder="e.g. Aman Sharma" 
                    value={formData.fullName} onChange={handleInputChange} required 
                  />
                </div>
              </div>

              {/* Your Email */}
              <div className="sk-reg-group">
                <label htmlFor="email"><Mail size={15} /> <span>Email Address <span className="sk-req">*</span></span></label>
                <div className="sk-reg-input-wrapper">
                  <input 
                    type="email" id="email" placeholder="aman@example.com" 
                    value={formData.email} onChange={handleInputChange} required 
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div className="sk-reg-group">
                <label htmlFor="contactNumber"><Phone size={15} /> <span>Contact Number <span className="sk-req">*</span></span></label>
                <div className="sk-reg-input-wrapper">
                  <input 
                    type="tel" id="contactNumber" placeholder="e.g. 9876543210" 
                    value={formData.contactNumber} onChange={handleInputChange} required 
                  />
                </div>
              </div>

              {/* Password */}
              <div className="sk-reg-group">
                <label htmlFor="password"><Lock size={15} /> <span>Password <span className="sk-req">*</span></span></label>
                <div className="sk-reg-input-wrapper">
                  <input 
                    type="password" id="password" placeholder="••••••••" 
                    value={formData.password} onChange={handleInputChange} required 
                  />
                </div>
              </div>

              {/* Advanced Custom Photo Selector Card */}
              <div className="sk-reg-group">
                <label><Camera size={15} /> <span>Profile Picture <span className="sk-req">*</span></span></label>
                <div className="sk-reg-upload-card">
                  <Upload size={24} className="sk-reg-upload-icon" />
                  <div className="sk-reg-upload-label-text">
                    <span className="sk-reg-upload-primary">Upload Photo</span>
                    <small>JPG, PNG max 2MB</small>
                  </div>
                  <input
                    type="file" id="photo" accept="image/*"
                    onChange={handlePhotoChange} required className="sk-reg-hidden-file-input"
                  />
                </div>
                {formData.photo && (
                  <div className="sk-reg-preview-badge">
                    <img src={formData.photo} alt="Profile Preview" />
                    <span>Asset Cached Successfully</span>
                  </div>
                )}
              </div>

              {/* Advanced Custom Resume Selector Card */}
              <div className="sk-reg-group">
                <label><FileText size={15} /> <span>Professional Resume <span className="sk-req">*</span></span></label>
                <div className="sk-reg-upload-card">
                  <Upload size={24} className="sk-reg-upload-icon-alt" />
                  <div className="sk-reg-upload-label-text">
                    <span className="sk-reg-upload-primary">Upload Resume</span>
                    <small>PDF, DOC, DOCX formats</small>
                  </div>
                  <input
                    type="file" id="resume" accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange} required className="sk-reg-hidden-file-input"
                  />
                </div>
                {formData.resumeName && (
                  <div className="sk-reg-file-badge">
                    <FileText size={14} />
                    <span>{formData.resumeName}</span>
                  </div>
                )}
              </div>

              {/* Action Submit Area */}
              <div className="sk-reg-full-width">
                <button type="submit" className="sk-reg-submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="sk-reg-spinner" /> SYNCHRONIZING PROFILE...
                    </>
                  ) : (
                    'REGISTER ACCOUNT'
                  )}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Seeker;