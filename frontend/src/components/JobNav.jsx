import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Users, FileBarChart, ChevronDown, Settings, Lock, LogOut } from 'lucide-react';
import '../styling/navjob.css';

const JobNav = () => {
  const [isJobsDropdownOpen, setIsJobsDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const navRef = useRef(null);
  const navigate = useNavigate();

  const checkUser = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUserData(JSON.parse(savedUser));
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    checkUser();
    window.addEventListener('userUpdated', checkUser);
    return () => window.removeEventListener('userUpdated', checkUser);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsJobsDropdownOpen(false);
        setIsAccountDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUserData(null);
    setIsAccountDropdownOpen(false);
    setIsJobsDropdownOpen(false);
    window.dispatchEvent(new Event('userUpdated'));
    navigate('/');
  };

  return (
    <nav className="jnv-platform-navbar" ref={navRef}>
      {/* Brand Platform Logo */}
      <div className="jnv-platform-logo-zone" onClick={() => navigate('/')}>
        <div className="jnv-platform-graphic-cube">
          <span>J</span>
          <div className="jnv-platform-cube-glow"></div>
        </div>
        <span className="jnv-platform-logo-text">
          Job<span className="jnv-platform-text-gradient">Portal</span>
        </span>
      </div>

      {/* Central Interactive Grid Navigation */}
      <div className="jnv-platform-links-segment">
        {/* Dropdown Field: Jobs */}
        <div className="jnv-platform-dropdown-anchor">
          <button 
            type="button"
            className={`jnv-platform-nav-btn ${isJobsDropdownOpen ? 'jnv-platform-state-active' : ''}`}
            onClick={() => {
              setIsJobsDropdownOpen(!isJobsDropdownOpen);
              setIsAccountDropdownOpen(false);
            }}
          >
            <Briefcase size={15} />
            <span>Jobs</span>
            <ChevronDown size={13} className={`jnv-platform-chevron ${isJobsDropdownOpen ? 'jnv-platform-rotate-up' : ''}`} />
          </button>

          {isJobsDropdownOpen && (
            <div className="jnv-platform-flyout-card">
              <Link to={'/post-job'} className="jnv-platform-flyout-item" onClick={() => setIsJobsDropdownOpen(false)}>
                <div className="jnv-platform-indicator-dot blue"></div>
                <span>Post a Job</span>
              </Link>
              <Link to={'/manage-job'} className="jnv-platform-flyout-item" onClick={() => setIsJobsDropdownOpen(false)}>
                <div className="jnv-platform-indicator-dot purple"></div>
                <span>Manage Job</span>
              </Link>
            </div>
          )}
        </div>

        <Link to={'/Candiate-list'} className="jnv-platform-nav-btn">
          <Users size={15} />
          <span>Candidate List</span>
        </Link>
        
        <Link to={'/reports'} className="jnv-platform-nav-btn">
          <FileBarChart size={15} />
          <span>Reports</span>
        </Link>
      </div>

      {/* Right Core Action Deck */}
      <div className="jnv-platform-actions-segment">
        {userData ? (
          <div className="jnv-platform-account-anchor">
            <button 
              type="button"
              className={`jnv-platform-profile-pill ${isAccountDropdownOpen ? 'jnv-platform-pill-active' : ''}`}
              onClick={() => {
                setIsAccountDropdownOpen(!isAccountDropdownOpen);
                setIsJobsDropdownOpen(false);
              }}
            >
              {userData.logo ? (
                <img src={userData.logo} alt="User Avatar" className="jnv-platform-avatar-media" />
              ) : (
                <div className="jnv-platform-avatar-text-fallback">
                  {(userData.name || userData.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
              <span className="jnv-platform-profile-name">{userData.name || 'Dashboard'}</span>
              <ChevronDown size={13} className={`jnv-platform-chevron ${isAccountDropdownOpen ? 'jnv-platform-rotate-up' : ''}`} />
            </button>

            {isAccountDropdownOpen && (
              <div className="jnv-platform-user-dropdown-board">
                <div className="jnv-platform-user-profile-summary">
                  <p className="jnv-platform-summary-title">{userData.name || 'User Profile'}</p>
                  <p className="jnv-platform-summary-subtitle">{userData.email}</p>
                </div>
                
                <div className="jnv-platform-board-divider"></div>
                
                <Link to={'/manage-account'} className="jnv-platform-board-item" onClick={() => setIsAccountDropdownOpen(false)}>
                  <Settings size={14} /> <span>Manage Account</span>
                </Link>
                <Link to={'/change-password'} className="jnv-platform-board-item" onClick={() => setIsAccountDropdownOpen(false)}>
                  <Lock size={14} /> <span>Change Password</span>
                </Link>
                
                <div className="jnv-platform-board-divider"></div>
                
                <button type="button" onClick={handleLogout} className="jnv-platform-board-item jnv-platform-critical-logout">
                  <LogOut size={14} /> <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to={'/employer-signup'} className="jnv-platform-cta-neon-btn">
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
};

export default JobNav;