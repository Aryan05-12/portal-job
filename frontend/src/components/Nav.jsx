import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Home, Users, ShieldCheck, Info, PhoneCall, Sparkles } from "lucide-react";
import '../styling/nav.css';

export default function Nav() {
  const [userData, setUserData] = useState(null);
  const location = useLocation(); // Active link highlight karne ke liye

  useEffect(() => {
    const getUser = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUserData(JSON.parse(savedUser));
      }
    };

    getUser();
    window.addEventListener('userUpdated', getUser);

    return () => window.removeEventListener('userUpdated', getUser);
  }, []);

  return (
    <nav className="nv-navbar">
      <div className="nv-container">
        
        {/* Elite Branding Logo */}
        <Link to={'/'} className="nv-logo-block">
          <div className="nv-logo-icon">
            <Sparkles size={18} />
          </div>
          <span>Job<span className="nv-logo-accent">Portal</span></span>
        </Link>

        {/* Spacious Menu Links */}
        <ul className="nv-menu">
          <li className={`nv-item ${location.pathname === '/' ? 'nv-active' : ''}`}>
            <Link to={'/'} className="nv-link">
              <Home size={16} /> <span>Home</span>
            </Link>
          </li>

          <li className={`nv-item ${location.pathname === '/job-seeker' ? 'nv-active' : ''}`}>
            <Link to={'/job-seeker'} className="nv-link">
              <Users size={16} /> <span>Job Seekers</span>
            </Link>
          </li>

          <li className={`nv-item ${location.pathname === '/employer' ? 'nv-active' : ''}`}>
            <Link to={'/employer'} className="nv-link">
              <Briefcase size={16} /> <span>Employers</span>
            </Link>
          </li>

          <li className={`nv-item ${location.pathname === '/admin' ? 'nv-active' : ''}`}>
            <Link to={'/admin'} className="nv-link">
              <ShieldCheck size={16} /> <span>Admin</span>
            </Link>
          </li>

          <li className={`nv-item ${location.pathname === '/about-us' ? 'nv-active' : ''}`}>
            <Link to={'/about-us'} className="nv-link">
              <Info size={16} /> <span>About Us</span>
            </Link>
          </li>

          <li className={`nv-item ${location.pathname === '/contact-us' ? 'nv-active' : ''}`}>
            <Link to={'/contact-us'} className="nv-link">
              <PhoneCall size={16} /> <span>Contact</span>
            </Link>
          </li>
        </ul>

        {/* Conditional Profile / Login Dynamic Area */}
        <div className="nv-actions-area">
          {userData ? (
            <Link to="/account" className="nv-profile-wrapper" title="View Account">
              {userData.photo ? (
                <div className="nv-avatar-ring">
                  <img src={userData.photo} alt="User" className="nv-photo" />
                </div>
              ) : (
                <div className="nv-letter-avatar">
                  {(userData.fullName || userData.email || 'U').charAt(0).toUpperCase()}
                </div>
              )}
            </Link>
          ) : (
            <Link to="/job-seeker" className="nv-login-btn">
              Sign In
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}