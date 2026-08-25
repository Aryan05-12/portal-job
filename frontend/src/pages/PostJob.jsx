import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styling/postjob.css";
import JobNav from "../components/JobNav";

const PostJob = () => {

  const [formData, setFormData] = useState({
    category: "Development - IT",
    jobTitle: "",
    jobType: "Full Time",
    salary: "",
    skill: "",
    expirence: "",
    location: "",
    date: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState(["Development - IT", "Marketing", "Finance"]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("https://jon-available.onrender.com/api/categories");
        const apiCategories = (res.data.categories || []).map((category) => category.name);
        setCategories([...new Set(["Development - IT", "Marketing", "Finance", ...apiCategories])]);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(
        "https://jon-available.onrender.com/api/jobs",
        formData
      );

      alert(response.data.message);

      // Reset Form
      setFormData({
        category: "Development - IT",
        jobTitle: "",
        jobType: "Full Time",
        salary: "",
        skill: "",
        expirence: "",
        location: "",
        date: "",
        description: "",
      });

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (



    <div>
      <JobNav/>
    <div className="postjob-wrapper">
      {/* Header */}
      <div className="postjob-header">
        <h1>Employers | Post a Job</h1>
      </div>

      <div className="postjob-container">

        <form className="postjob-form" onSubmit={handleSubmit}>

          {/* Row 1 */}
          <div className="form-row">

            <div className="form-group">
              <label>Category*</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Job Title*</label>

              <input
                type="text"
                placeholder="Software Application Developer"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* Row 2 */}
          <div className="form-row">

            <div className="form-group">
              <label>Job Type</label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
              >
                <option>Full Time</option>
                <option>Part Time</option>
                <option>Remote</option>
              </select>
            </div>

            <div className="form-group">
              <label>Salary Package</label>

              <input
                type="text"
                placeholder="80000-100000"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Row 3 */}
          <div className="form-row">

            <div className="form-group">
              <label>Skill Required</label>

              <input
                type="text"
                placeholder="PHP, MySQL, HTML, Bootstrap"
                name="skill"
                value={formData.skill}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Experience</label>

              <input
                type="text"
                placeholder="2-5"
                name="expirence"
                value={formData.expirence}
                onChange={handleChange}
              />
            </div>

          </div>

          {/* Row 4 */}
          <div className="form-row">

            <div className="form-group">
              <label>Job Location</label>

              <input
                type="text"
                placeholder="Noida"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Job Expiration Date</label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          {/* Description */}
          <div className="form-group full-width">

            <label>Job Description</label>

            <textarea
              rows="6"
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>

          </div>

          {/* Button */}
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Job"}
          </button>

        </form>

      </div>
    </div>
    </div>
  );
};

export default PostJob;
