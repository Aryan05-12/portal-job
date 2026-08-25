import React, { useEffect, useState } from "react";
import { Users, RefreshCw, Edit3, Trash2, X, ShieldAlert, CheckCircle, Mail, Phone, Shield } from "lucide-react";
import "../admincss/alluser.css"; // Pure CSS styles linked here

const API_URL = "https://jon-available.onrender.com/api";

const emptyForm = {
  name: "",
  fullName: "",
  email: "",
  contactNumber: "",
  role: "user",
};

function AllUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const showStatus = (text, errorState = false) => {
    setMessage(text);
    setIsError(errorState);
    setTimeout(() => setMessage(""), 4000); // Automatically clears alert banner
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/All-reg-user`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Users load nahi hue");
      }

      setUsers(Array.isArray(data.users) ? data.users : []);
    } catch (error) {
      showStatus(error.message, true);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name || user.fullName || "",
      fullName: user.fullName || user.name || "",
      email: user.email || "",
      contactNumber: user.contactNumber || user.contact || "",
      role: user.role || "user",
    });
  };

  const closeEdit = () => {
    setEditingUser(null);
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    if (!editingUser?._id) return;

    try {
      setSaving(true);
      const payload = {
        name: form.name.trim(),
        fullName: (form.fullName || form.name).trim(),
        email: form.email.trim(),
        contactNumber: form.contactNumber.trim(),
        contact: form.contactNumber.trim(),
        role: form.role,
      };

      const response = await fetch(`${API_URL}/users/${editingUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "User not updated");
      }

      setUsers((prev) =>
        prev.map((user) => (user._id === editingUser._id ? data.user : user))
      );
      showStatus("User systems updated successfully!", false);
      closeEdit();
    } catch (error) {
      showStatus(error.message, true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    if (!user?._id) return;

    const confirmDelete = window.confirm(`Permanently delete structural account for ${user.name || user.fullName}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/users/${user._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "User delete nahi hua");
      }

      setUsers((prev) => prev.filter((item) => item._id !== user._id));
      showStatus("Account successfully purged from system.", false);
    } catch (error) {
      showStatus(error.message, true);
    }
  };

  return (
    <div className="au-master-container">
      <div className="au-table-card">
        
        {/* Dynamic System Action Alerts */}
        {message && (
          <div className={`au-status-toast ${isError ? "toast-critical" : "toast-success"}`}>
            {isError ? <ShieldAlert size={16} /> : <CheckCircle size={16} />}
            <span>{message}</span>
          </div>
        )}

        {/* Dynamic Layout Control Panel Header */}
        <div className="au-card-header">
          <div className="au-header-icon-box">
            <Users size={20} />
          </div>
          <div className="au-header-text-block">
            <h2>System Accounts Registry</h2>
            <p>Total Provisioned Nodes: <b className="au-accent-count">{users.length} authenticated users</b></p>
          </div>
          <button className="au-refresh-action-btn" onClick={loadUsers} type="button" disabled={loading}>
            <RefreshCw size={14} className={loading ? "au-spin" : ""} />
            <span>Sync Directory</span>
          </button>
        </div>

        {/* Dynamic Condition Screen Intercepts */}
        {loading ? (
          <div className="au-loading-wrapper">
            <div className="au-spinning-loader"></div>
            <p>Re-indexing local records directory...</p>
          </div>
        ) : (
          <div className="au-responsive-overflow-layer">
            <table className="au-data-table">
              <thead>
                <tr>
                  <th width="70px">ID</th>
                  <th>Profile / Identity</th>
                  <th>Secure Email</th>
                  <th>Contact Metadata</th>
                  <th>Access Role</th>
                  <th width="110px" style={{ textAlign: "center" }}>Operations</th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr key={user._id || index}>
                      <td className="au-index-cell">{String(index + 1).padStart(2, '0')}</td>
                      <td className="au-identity-cell">
                        <span className="au-primary-title">{user.name || user.fullName || "N/A"}</span>
                        <span className="au-sub-system-id">UID: {user._id?.slice(-6) || "—"}</span>
                      </td>
                      <td>
                        <div className="au-meta-flex-link">
                          <Mail size={13} />
                          <span>{user.email || "N/A"}</span>
                        </div>
                      </td>
                      <td>
                        <div className="au-meta-flex-link">
                          <Phone size={13} />
                          <span>{user.contactNumber || user.contact || "—"}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`au-role-badge badge-${user.role || "user"}`}>
                          <Shield size={10} style={{ marginRight: '4px' }} />
                          {user.role || "user"}
                        </span>
                      </td>
                      <td>
                        <div className="au-operations-cluster">
                          <button
                            className="au-btn-operation btn-op-edit"
                            onClick={() => openEdit(user)}
                            title="Modify Privileges"
                            type="button"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            className="au-btn-operation btn-op-delete"
                            onClick={() => handleDelete(user)}
                            title="Revoke and Purge"
                            type="button"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="au-empty-placeholder-cell">
                      No matching records structural indexes exist in local directory.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Luxury Glassmorphic Overlay Layer Modal Form */}
      {editingUser && (
        <div className="au-modal-backdrop-blur">
          <div className="au-modal-window">
            <form onSubmit={handleUpdate}>
              <div className="au-modal-window-header">
                <div className="au-modal-header-text">
                  <h3>Modify Account Directives</h3>
                  <p>Altering access nodes changes system level permissions instantly.</p>
                </div>
                <button type="button" onClick={closeEdit} className="au-modal-close-trigger">
                  <X size={16} />
                </button>
              </div>

              <div className="au-modal-form-grid">
                <div className="au-input-group">
                  <label>Display Initializer Tag</label>
                  <input name="name" value={form.name} onChange={handleChange} required />
                </div>

                <div className="au-input-group">
                  <label>Legal Corporate / Full Name</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} required />
                </div>

                <div className="au-input-group">
                  <label>Primary Communications Routing Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required />
                </div>

                <div className="au-input-group">
                  <label>Secure System Mobile Terminal</label>
                  <input name="contactNumber" value={form.contactNumber} onChange={handleChange} required />
                </div>

                <div className="au-input-group full-width-grid-node">
                  <label>Access Privilege Allocation Level</label>
                  <select name="role" value={form.role} onChange={handleChange}>
                    <option value="user">Standard Registered User</option>
                    <option value="admin">System Level Administrator</option>
                    <option value="employer">Verified Organization Employer</option>
                    <option value="jobseeker">Active Candidate Jobseeker</option>
                  </select>
                </div>
              </div>

              <div className="au-modal-action-footer">
                <button type="button" onClick={closeEdit} className="au-modal-btn-dismiss">
                  Abort Adjustments
                </button>
                <button type="submit" className="au-modal-btn-commit" disabled={saving}>
                  {saving ? "Overwriting Nodes..." : "Commit Directive Updates"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllUser;