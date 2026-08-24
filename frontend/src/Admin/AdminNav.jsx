import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  FolderPlus, 
  Building2, 
  Users, 
  FileText, 
  UserCheck, 
  CalendarRange, 
  Search, 
  ChevronDown, 
  Settings, 
  LogOut 
} from "lucide-react";
import "../admincss/adminnav.css";

import aryan from '../Gemini/aryan.jpeg'

const AdminNav = () => {
  const [showJobDrop, setShowJobDrop] = useState(false);
  const [showPagesDrop, setShowPagesDrop] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Helper function to detect active routes for precision styling
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    // Apni logout logic yahan handle karein
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  return (
    <aside className="anv-admin-sidebar">
      {/* Premium Header Branding */}
      <div className="anv-sidebar-header">
        <div className="anv-logo-mark">A</div>
        <div className="anv-branding-text-block">
          <span className="anv-brand-main">JOB PORTAL</span>
          <span className="anv-brand-badge">SYSTEM CONTROL</span>
        </div>
      </div>

      {/* Luxury User Profile Meta Box */}
      <div className="anv-profile-card">
        <div className="anv-avatar-cluster">
          <div className="anv-avatar-frame">
            <img src={aryan} alt="" style={{height:'50px',borderRadius:'10px'}} />
          </div>
          <span className="anv-online-indicator"></span>
        </div>
        
        <div className="anv-user-info">
          <span className="anv-user-name"> Admin</span>
          <span className="anv-user-status">Manage Everything</span>
        </div>
        
        <div className="anv-quick-actions">
          <button className="anv-action-pill" title="System Settings" type="button">
            <Settings size={14} />
          </button>
          <button 
            className="anv-action-pill anv-pill-critical" 
            title="Secure Logout" 
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Navigation Main Options Deck */}
      <ul className="anv-navigation-menu">
        
        {/* Core Dashboard Link */}
        <li className="anv-menu-item">
          <Link to="/admindash" className={`anv-menu-link ${isActive('/admindash') ? 'anv-state-active' : ''}`}>
            <LayoutDashboard size={18} />
            <span className="anv-link-text">Dashboard</span>
          </Link>
        </li>

        {/* Accordion 1: Job Categories */}
        <li className="anv-menu-item">
          <button
            type="button"
            onClick={() => {
              setShowJobDrop(!showJobDrop);
              setShowPagesDrop(false);
            }}
            className={`anv-menu-link ${showJobDrop ? "anv-dropdown-expanded" : ""}`}
          >
            <FolderPlus size={18} />
            <span className="anv-link-text">Job Category</span>
            <ChevronDown size={14} className={`anv-accordion-arrow ${showJobDrop ? "anv-rotate" : ""}`} />
          </button>

          <div
            className="anv-drawer-submenu"
            style={{ maxHeight: showJobDrop ? "120px" : "0px" }}
          >
            <Link to="/add-category" className={`anv-submenu-sublink ${isActive('/add-category') ? 'anv-sub-active' : ''}`}>
              <div className="anv-sub-bullet"></div> Add Category
            </Link>
            <Link to="/manage-category" className={`anv-submenu-sublink ${isActive('/manage-category') ? 'anv-sub-active' : ''}`}>
              <div className="anv-sub-bullet"></div> Manage Category
            </Link>
          </div>
        </li>

        {/* Employers Management */}
        <li className="anv-menu-item">
          <Link to="/list-employee" className={`anv-menu-link ${isActive('/list-employee') ? 'anv-state-active' : ''}`}>
            <Building2 size={18} />
            <span className="anv-link-text">List of Employers</span>
          </Link>
        </li>

        {/* Jobseekers Management */}
        <li className="anv-menu-item">
          <Link to="/reg-jobseeker" className={`anv-menu-link ${isActive('/reg-jobseeker') ? 'anv-state-active' : ''}`}>
            <Users size={18} />
            <span className="anv-link-text">Reg Jobseekers</span>
          </Link>
        </li>

        {/* Accordion 2: Static Pages */}
        <li className="anv-menu-item">
          <button
            type="button"
            onClick={() => {
              setShowPagesDrop(!showPagesDrop);
              setShowJobDrop(false);
            }}
            className={`anv-menu-link ${showPagesDrop ? "anv-dropdown-expanded" : ""}`}
          >
            <FileText size={18} />
            <span className="anv-link-text">Pages</span>
            <ChevronDown size={14} className={`anv-accordion-arrow ${showPagesDrop ? "anv-rotate" : ""}`} />
          </button>

          <div
            className="anv-drawer-submenu"
            style={{ maxHeight: showPagesDrop ? "120px" : "0px" }}
          >
            <Link to="/admin-about" className={`anv-submenu-sublink ${isActive('/admin-about') ? 'anv-sub-active' : ''}`}>
              <div className="anv-sub-bullet"></div> About Us
            </Link>
            <Link to="/admin-contact" className={`anv-submenu-sublink ${isActive('/admin-contact') ? 'anv-sub-active' : ''}`}>
              <div className="anv-sub-bullet"></div> Contact Us
            </Link>
          </div>
        </li>

        {/* Custom Application User Link */}
        <li className="anv-menu-item">
          <Link to="/admin-application" className={`anv-menu-link ${isActive('/admin-application') ? 'anv-state-active' : ''}`}>
            <UserCheck size={18} />
            <span className="anv-link-text">User Applications</span>
          </Link>
        </li>

        {/* Advanced Filter Reports */}
        <li className="anv-menu-item">
          <Link to="/date-reports" className={`anv-menu-link ${isActive('/date-reports') ? 'anv-state-active' : ''}`}>
            <CalendarRange size={18} />
            <span className="anv-link-text">B/W Dates Report</span>
          </Link>
        </li>

        {/* Universal Engine Search */}
        <li className="anv-menu-item">
          <Link to="/search" className={`anv-menu-link ${isActive('/search') ? 'anv-state-active' : ''}`}>
            <Search size={18} />
            <span className="anv-link-text">Search Database</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default AdminNav;