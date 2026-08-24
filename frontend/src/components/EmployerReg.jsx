import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, FileText, Globe, Image, UploadCloud, LogIn, Sparkles, Loader2 } from 'lucide-react';
import JobNav from './JobNav';
import '../styling/seeker.css';

const API_URL = 'http://localhost:1111/api';

const EmployerReg = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
    password: '',
    tagline: '',
    website: '',
    logoName: '',
    logo: '',
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          logo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          contact: formData.contactNumber,
          password: formData.password,
          tagline: formData.tagline,
          website: formData.website,
          logoName: formData.logoName,
          logo: formData.logo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        ...data.user,
        name: data.user?.name || formData.fullName,
        fullName: data.user?.fullName || formData.fullName,
        contact: data.user?.contact || formData.contactNumber,
        contactNumber: data.user?.contactNumber || formData.contactNumber,
        tagline: data.user?.tagline || formData.tagline,
        website: data.user?.website || formData.website,
        logoName: data.user?.logoName || formData.logoName,
        logo: data.user?.logo || formData.logo,
      }));
      setMessage('Registration successful. You can sign in now.');
      setFormData({
        fullName: '',
        email: '',
        contactNumber: '',
        password: '',
        tagline: '',
        website: '',
        logoName: '',
        logo: '',
      });
      e.target.reset();
    } catch (error) {
      setIsError(true);
      setMessage(error.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (




    <div>
      <JobNav/>
    <div className="emp-reg-global-wrapper">
      <div className="emp-reg-container">
        {/* Modern Corporate Header Hero */}
        <header className="emp-reg-header">
          <div className="emp-reg-badge"><Sparkles size={14} /> Elite Employer Network</div>
          <h1>Create Employer Account</h1>
          <p>Join top companies onboarding global remote & on-site talent.</p>
        </header>

        <div className="emp-reg-content">
          
          {/* Informative Sign In Banner */}
          <div className="emp-reg-banner">
            <div className="emp-reg-banner-text">
              <h2>Already Registered?</h2>
              <p>Access your recruiter dashboard, manage active listings, and screen candidate submissions instantly.</p>
            </div>
            <Link to="/employer-signup" className="emp-reg-signin-btn">
              <LogIn size={16} /> Sign In Now!
            </Link>
          </div>

          {/* Master Form Card */}
          <form className="emp-reg-form" onSubmit={handleSubmit}>
            <h3 className="emp-reg-section-title">Company & Admin Details</h3>
            
            <div className="emp-reg-grid">
              
              {/* Full Name */}
              <div className="emp-reg-group">
                <label htmlFor="fullName"><User size={15} /> <span>Full Name <span className="emp-req">*</span></span></label>
                <div className="emp-reg-input-box">
                  <input 
                    type="text" 
                    id="fullName" 
                    placeholder="e.g. Satya Nadella" 
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              {/* Your Email */}
              <div className="emp-reg-group">
                <label htmlFor="email"><Mail size={15} /> <span>Corporate Email <span className="emp-req">*</span></span></label>
                <div className="emp-reg-input-box">
                  <input 
                    type="email" 
                    id="email" 
                    placeholder="name@company.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              {/* Contact Number */}
              <div className="emp-reg-group">
                <label htmlFor="contactNumber"><Phone size={15} /> <span>Contact Number <span className="emp-req">*</span></span></label>
                <div className="emp-reg-input-box">
                  <input 
                    type="tel" 
                    id="contactNumber" 
                    placeholder="e.g. +91 9876543210" 
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              {/* Password */}
              <div className="emp-reg-group">
                <label htmlFor="password"><Lock size={15} /> <span>Secure Password <span className="emp-req">*</span></span></label>
                <div className="emp-reg-input-box">
                  <input 
                    type="password" 
                    id="password" 
                    placeholder="••••••••" 
                    value={formData.password}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              {/* Website */}
              <div className="emp-reg-group">
                <label htmlFor="website"><Globe size={15} /> <span>Company Website <span className="emp-req">*</span></span></label>
                <div className="emp-reg-input-box">
                  <input
                    type="text"
                    id="website"
                    placeholder="https://microsoft.com"
                    value={formData.website}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Logo Name */}
              <div className="emp-reg-group">
                <label htmlFor="logoName"><Image size={15} /> <span>Brand Logo Identifier <span className="emp-req">*</span></span></label>
                <div className="emp-reg-input-box">
                  <input
                    type="text"
                    id="logoName"
                    placeholder="e.g. Microsoft Light Logo"
                    value={formData.logoName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Tagline - Takes Full Grid Width */}
              <div className="emp-reg-group emp-reg-full-width">
                <label htmlFor="tagline"><FileText size={15} /> <span>Company Tagline / Bio <span className="emp-req">*</span></span></label>
                <div className="emp-reg-input-box">
                  <textarea
                    id="tagline"
                    placeholder="Briefly tell job seekers about your company culture, vision, or core tech stack..."
                    value={formData.tagline}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
              </div>

              {/* Premium Drag & Drop Style File Upload Box */}
              <div className="emp-reg-group emp-reg-full-width">
                <label><UploadCloud size={15} /> <span>Official Corporate Logo <span className="emp-req">*</span></span></label>
                <div className="emp-reg-file-upload-card">
                  <UploadCloud size={32} className="emp-reg-upload-icon" />
                  <div className="emp-reg-upload-text">
                    <span className="emp-reg-upload-highlight">Click to upload</span> or drag and drop brand asset
                    <small>PNG, JPG or SVG (Max recommended size 500x500px)</small>
                  </div>
                  <input
                    type="file"
                    id="logo"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="emp-reg-hidden-file-input"
                  />
                </div>

                {formData.logo && (
                  <div className="emp-reg-logo-preview-box">
                    <img src={formData.logo} alt="Logo Preview" />
                    <div>
                      <span>Upload Active & Parsed</span>
                      <small>Ready to be hosted on global servers</small>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Premium Messaging System */}
            {message && (
              <div className={`emp-reg-alert ${isError ? 'emp-reg-alert-error' : 'emp-reg-alert-success'}`}>
                <span>{isError ? '⚠️' : '🎉'}</span>
                <p>{message}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="emp-reg-btn-box">
              <button type="submit" className="emp-reg-submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="emp-reg-spinner" /> CREATING INTERFACE...
                  </>
                ) : (
                  'REGISTER COMPANY'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
    </div>
  );
};

export default EmployerReg;