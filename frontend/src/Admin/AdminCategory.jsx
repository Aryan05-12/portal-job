import React, { useState } from "react";
import axios from "axios";
import '../admincss/adminnav.css'

const AdminCategory = () => {
  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post("https://jon-available.onrender.com/api/createcategory", {
        name: categoryName,
        description: description,
      });

      if (res.status === 200 || res.status === 201) {
        alert("Category Added Successfully");
        setCategoryName("");
        setDescription("");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  return (
    <div className="category-container-main">

      <div className="category-form-wrapper">
        <h2 className="category-title-main">Add Category</h2>

        <form onSubmit={handleSubmit} className="category-form-box">

          {/* Category Name */}
          <div className="category-input-group">
            <label className="category-label">Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name..."
              className="category-input-field"
              required
            />
          </div>

          {/* Description */}
          <div className="category-input-group">
            <label className="category-label">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter category description..."
              className="category-textarea-field"
              rows="4"
              required
            />
          </div>

          <button type="submit" className="category-submit-btn">
            Add Category
          </button>

        </form>
      </div>

    </div>
  );
};

export default AdminCategory;
