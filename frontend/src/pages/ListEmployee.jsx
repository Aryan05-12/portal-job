import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { Eye, Building2, Globe, Phone, Mail, AlertCircle } from 'lucide-react';
import '../admincss/listemployee.css'; // New standalone premium style file

const ListEmployee = () => {
  const [employeesList, setEmployeesList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:1111/api/users");
      setEmployeesList(res.data.users || res.data);
    } catch (err) {
      console.log("Employees load karne mein error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="emp-panel-main-container">
      <div className="emp-panel-table-card">
        
        {/* Header Block Section */}
        <div className="emp-panel-card-header">
          <div className="emp-panel-header-icon-box">
            <Building2 size={20} />
          </div>
          <div className="emp-panel-header-text-block">
            <h2>Registered Employers & Companies</h2>
            <p>Manage and audit corporate accounts registered on your platform.</p>
          </div>
          <div className="emp-panel-counter-badge">
            Total: {employeesList.length}
          </div>
        </div>

        {/* Dynamic State Layout Render */}
        {loading ? (
          <div className="emp-panel-loading-state">
            <div className="emp-panel-spinner"></div>
            <p>Fetching database records...</p>
          </div>
        ) : employeesList.length === 0 ? (
          <div className="emp-panel-empty-state">
            <AlertCircle size={40} />
            <p>No registered corporate users found in the system database.</p>
          </div>
        ) : (
          <div className="emp-panel-responsive-wrapper">
            <table className="emp-panel-data-table">
              <thead>
                <tr>
                  <th width="60px">#</th>
                  <th width="80px">Identity</th>
                  <th>Company / Full Name</th>
                  <th>Email Address</th>
                  <th>Contact No.</th>
                  <th>Website</th>
                  <th width="90px" style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              
              <tbody>
                {employeesList.map((emp, index) => (
                  <tr key={emp._id || index}>
                    {/* Index Counter */}
                    <td className="emp-panel-cell-index">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    
                    {/* Logo Segment */}
                    <td>
                      {emp.logo ? (
                        <img src={emp.logo} alt="Company Logo" className="emp-panel-avatar-img" />
                      ) : (
                        <div className="emp-panel-avatar-fallback">
                          {(emp.name || emp.fullName || 'C').charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>

                    {/* Company Information Name */}
                    <td>
                      <div className="emp-panel-name-column">
                        <span className="emp-panel-primary-name">{emp.name || emp.fullName}</span>
                        {emp.tagline && <span className="emp-panel-sub-tagline">{emp.tagline}</span>}
                      </div>
                    </td>
                    
                    {/* Communication Details */}
                    <td>
                      <div className="emp-panel-icon-link">
                        <Mail size={14} />
                        <span>{emp.email}</span>
                      </div>
                    </td>

                    <td>
                      <div className="emp-panel-icon-link">
                        <Phone size={14} />
                        <span>{emp.contact || emp.contactNumber || "—"}</span>
                      </div>
                    </td>
                    
                    {/* Web Link Redirection */}
                    <td>
                      {emp.website ? (
                        <a 
                          href={emp.website} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="emp-panel-web-anchor"
                        >
                          <Globe size={14} />
                          <span>Visit Site</span>
                        </a>
                      ) : (
                        <span className="emp-panel-not-available">—</span>
                      )}
                    </td>

                    {/* Action Panel Trigger */}
                    <td style={{ textAlign: 'center' }}>
                      <Link 
                        to={`/view-employee/${emp._id}`} 
                        className="emp-panel-action-btn"
                        title="View Detailed Profile"
                      >
                        <Eye size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

export default ListEmployee;