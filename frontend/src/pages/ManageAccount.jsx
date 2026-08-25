import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styling/manageacc.css";
import JobNav from "../components/JobNav";

const ManageAccount = () => {

  const [logo, setLogo] = useState("https://via.placeholder.com/150?text=Company+Logo");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    password: "",
    companyName: "",
    tagline: "",
    description: "",
    website: "",
    employees: "",
    industry: "",
    businessType: "",
    location: "",
    establishedIn: "",
    resume: null,
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      setFormData({
        fullName: user.fullName || user.name || "",
        email: user.email || "",
        contactNumber: user.contactNumber || user.contact || "",
        password: "",
        companyName: user.companyName || user.logoName || "",
        tagline: user.tagline || "",
        description: user.description || "",
        website: user.website || "",
        employees: user.employees || "",
        industry: user.industry || "",
        businessType: user.businessType || "",
        location: user.location || "",
        establishedIn: user.establishedIn || "",
        resume: null,
      });

      if (user.logo) {
        setLogo(user.logo);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];

    setFormData({
      ...formData,
      resume: file,
    });

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setLogo(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const savedUser = JSON.parse(localStorage.getItem("user")) || {};
      const updatedUser = {
        ...savedUser,
        name: formData.fullName,
        fullName: formData.fullName,
        email: formData.email,
        contact: formData.contactNumber,
        contactNumber: formData.contactNumber,
        companyName: formData.companyName,
        tagline: formData.tagline,
        description: formData.description,
        website: formData.website,
        employees: formData.employees,
        industry: formData.industry,
        businessType: formData.businessType,
        location: formData.location,
        establishedIn: formData.establishedIn,
        logo: logo,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      const userId = savedUser._id || savedUser.id;

      if (userId) {
        const { _id, id, ...profilePayload } = updatedUser;
        const res = await axios.put(
          `https://jon-available.onrender.com/api/update-jobregister/${userId}`,
          profilePayload
        );

        const newUser = {
          ...updatedUser,
          ...(res.data.updatedUser || {}),
          id: res.data.updatedUser?._id || userId,
        };

        localStorage.setItem("user", JSON.stringify(newUser));
        alert(res.data.message);
      } else {
        alert("Profile updated");
      }

    } catch (error) {
      console.log(error);
      alert("Profile saved locally");
    }
  };

  return (

    <div className="manage-container">
      <JobNav />

      <div className="cp-container">

        <form className="cp-form" onSubmit={handleSubmit}>

          {/* Row 1 */}
          <div className="cp-row">
            <div className="cp-group">
              <label>Concern Person Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="Anuj Kumar"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="cp-group">
              <label>Your Email *</label>
              <input
                type="email"
                name="email"
                placeholder="anuj@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="cp-row">

            <div className="cp-group">
              <label>Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                placeholder="9876543210"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </div>

            <div className="cp-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="******"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Row 3 */}
          <div className="cp-row">

            <div className="cp-group">
              <label>Company Name</label>
              <input
                type="text"
                name="companyName"
                placeholder="TCS"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            <div className="cp-group">
              <label>Tagline</label>
              <input
                type="text"
                name="tagline"
                placeholder="Information Technology"
                value={formData.tagline}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Description */}
          <div className="cp-group cp-full-width">

            <label>Description</label>

            <div className="cp-editor-toolbar">
              <button type="button" className="cp-tb-btn cp-bold">B</button>
              <button type="button" className="cp-tb-btn cp-italic">I</button>
              <button type="button" className="cp-tb-btn cp-underline">U</button>
            </div>

            <textarea
              rows="5"
              name="description"
              placeholder="Tata Consultancy Services"
              value={formData.description}
              onChange={handleChange}
            ></textarea>

          </div>

          {/* Row 4 */}
          <div className="cp-row">

            <div className="cp-group">
              <label>Website</label>
              <input
                type="url"
                name="website"
                placeholder="http://tcs.com"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="cp-group">
              <label>No. of Employees</label>
              <input
                type="text"
                name="employees"
                placeholder="e.g. 105"
                value={formData.employees}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Row 5 */}
          <div className="cp-row">

            <div className="cp-group">
              <label>Industry</label>
              <input
                type="text"
                name="industry"
                placeholder="e.g. Insurance, E-commerce"
                value={formData.industry}
                onChange={handleChange}
              />
            </div>

            <div className="cp-group">
              <label>Type of Business Entity</label>
              <input
                type="text"
                name="businessType"
                placeholder="e.g. Pvt Ltd"
                value={formData.businessType}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Row 6 */}
          <div className="cp-row">

            <div className="cp-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                placeholder="e.g. New Delhi"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="cp-group">
              <label>Established In</label>
              <input
                type="text"
                name="establishedIn"
                placeholder="e.g. 2018"
                value={formData.establishedIn}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Logo Section */}
          <div className="cp-group cp-full-width cp-logo-section">

            <label>Company Logo</label>

            <div className="cp-logo-flex">

              <div className="cp-logo-preview">
                <img src={logo} alt="Company Logo Preview" />
              </div>

              <div className="cp-logo-upload-btn">

                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  onChange={handleLogoChange}
                  style={{ display: "none" }}
                />

                <label htmlFor="logo-upload" className="cp-upload-label">
                  Change Logo
                </label>

                <p>Supports JPG, PNG. Max size 2MB.</p>

              </div>

            </div>
          </div>

          {/* Button */}
          <div className="cp-form-actions">

            <button type="submit" className="cp-update-btn">
              Update Profile
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default ManageAccount;
