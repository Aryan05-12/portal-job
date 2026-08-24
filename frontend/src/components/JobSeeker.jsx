import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  PlusCircle, 
  Settings, 
  Users, 
  BarChart3, 
  User, 
  LogOut, 
  ChevronDown, 
  Mail, 
  LogIn, 
  Home, 
  ArrowRight, 
  Loader2, 
  Lock 
} from 'lucide-react';
import "../styling/js.css";


const API_URL = 'http://localhost:1111/api';

const JobSeeker = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [userData, setUserData] = useState(null);
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);

  const accountDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      const oldUser = JSON.parse(localStorage.getItem('user')) || {};
      const loginUser = {
        ...data.user,
        logo: data.user.logo || oldUser.logo || '',
      };

      localStorage.setItem('user', JSON.stringify(loginUser));
      setUserData(loginUser);

      setMessage(`Welcome back, ${loginUser.name || loginUser.email}.`);
      setEmail('');
      setPassword('');
      
      setTimeout(() => {
        navigate('/eprofile');
      }, 1000);

    } catch (error) {
      setIsError(true);
      setMessage(error.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleJobsToggle = (e) => {
    e.preventDefault();
    setIsJobsDropdownOpen(!isJobsDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserData(null);
    setIsAccountDropdownOpen(false);
    setMessage('Logged out successfully.');
    setIsError(false);
    navigate('/');
  };

  return (
    <div className="js-login-global-wrapper">
      {/* Premium Navigation Dashboard Bar */}
      <nav className="custom-jobnav-container hidden md:flex">
        <div className="custom-jobnav-logo">
          Job Portal
        </div>

        <div className="custom-jobnav-links">
          <div className="custom-jobnav-dropdown-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
            <a 
              href="#jobs" 
              className={`custom-jobnav-link ${isJobsDropdownOpen ? 'active' : ''}`}
              onClick={handleJobsToggle}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Briefcase size={16} />
              <span>Jobs</span>
              <ChevronDown size={14} className={`nav-arrow-icon ${isJobsDropdownOpen ? 'rotate-180' : ''}`} />
            </a>

            {isJobsDropdownOpen && (
              <div className="custom-jobnav-dropdown-menu">
                <Link to={'/post-job'} className="custom-jobnav-dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlusCircle size={15} />
                  <span>Post a Job</span>
                </Link>
                <Link to={'/manage-job'} className="custom-jobnav-dropdown-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings size={15} />
                  <span>Manage Job</span>
                </Link>
              </div>
            )}
          </div>

          <Link to={'/Candiate-list'} className="custom-jobnav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} />
            <span>Candidate List</span>
          </Link>
          
          <Link to={'/reports'} className="custom-jobnav-link" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart3 size={16} />
            <span>Reports</span>
          </Link>
        </div>

        <div className="custom-jobnav-actions">
          {userData ? (
            <div className="custom-account-dropdown-container" ref={accountDropdownRef}>
              <button 
                type="button"
                className="custom-account-trigger"
                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {userData.logo ? (
                  <img src={userData.logo} alt="User" className="custom-nav-user-photo" />
                ) : (
                  <span className="custom-nav-user-letter">
                    {(userData.name || userData.email || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
                <ChevronDown size={14} />
              </button>

              {isAccountDropdownOpen && (
                <div className="custom-account-menu">
                  <Link to={'/manage-account'} onClick={() => setIsAccountDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={15} />
                    <span>Manage Account</span>
                  </Link>
                  <Link to={'/change-password'} onClick={() => setIsAccountDropdownOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Lock size={15} />
                    <span>Change Password</span>
                  </Link>
                  <button type="button" onClick={handleLogout} className="custom-nav-logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
                    <LogOut size={15} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to={'/account'} className="custom-jobnav-link-static" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} />
              <span>Account</span>
            </Link>
          )}
        </div>
      </nav> 

      {/* Main Container */}
      <div className="js-login-container">
        <header className="js-login-header">
          <h1>Welcome Back</h1>
          <p>Enter your professional credentials to access your console</p>
        </header>

        <main className="js-card-wrapper">
          {/* Circular Dynamic Icon Profile Shell */}
          <div className="js-avatar-container">
            <div className="js-avatar-circle">
              <User size={36} className="js-avatar-icon" />
            </div>
          </div>

          {/* Core Login Card Box */}
          <div className="js-login-card">
            <form onSubmit={handleSubmit} className="js-login-form">
              
              {/* Corporate Email Group */}
              <div className="js-input-group">
                <label>Email Address</label>
                <div className="js-input-field-wrapper">
                  <span className="js-input-icon"><Mail size={18} /></span>
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* Secure Password Group */}
              <div className="js-input-group">
                <label>Password</label>
                <div className="js-input-field-wrapper">
                  <span className="js-input-icon"><Lock size={18} /></span>
                  <input 
                    type="password" 
                    placeholder="••••••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
              </div>

              {/* Action Trigger Button */}
              <div className="js-btn-container">
                <button type="submit" className="js-signin-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="js-spinner" /> VERIFYING ID...
                    </>
                  ) : (
                    <>
                      SIGN IN <LogIn size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Premium Message Pipeline Alerts */}
            {message && (
              <div className={`js-auth-alert ${isError ? 'js-alert-error' : 'js-alert-success'}`}>
                <p>{message}</p>
              </div>
            )}

            {/* Footer Navigation Hierarchy */}
            <div className="js-form-footer">
              <a href="/forget-pass" className="js-forgot-password">Forgot Password?</a>
              
              <div className="js-divider-or">
                <span>OR</span>
              </div>

              <Link to="/job-signup" className="js-signup-link">
                Don't have an account? <span>Create Account <ArrowRight size={14} /></span>
              </Link>

              <Link to="/" className="js-back-home">
                <Home size={16} /> Back to Homepage
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default JobSeeker;