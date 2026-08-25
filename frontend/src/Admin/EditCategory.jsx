import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Save, 
  Tag, 
  AlignLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import '../admincss/editp.css'

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setFetchLoading(true);
      const res = await axios.get(
        "https://jon-available.onrender.com/api/categories"
      );

      const category = res.data.categories.find(
        (item) => item._id === id
      );

      if (category) {
        setFormData({
          name: category.name,
          description: category.description,
        });
      } else {
        setError("Category not found");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch category");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.put(
        `https://jon-available.onrender.com/api/categories/${id}`,
        formData
      );

      alert("Category Updated Successfully");
      navigate("/admin/manage-category");
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="editcat-container">
        <div className="editcat-loading">
          <Loader2 className="editcat-spinner" size={48} />
          <p>Loading category...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="editcat-container">
      <div className="editcat-card">
        {/* Header */}
        <div className="editcat-header">
          <button 
            className="editcat-back-btn"
            onClick={() => navigate("/manage-category")}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <h2 className="editcat-title">
            <Tag className="editcat-title-icon" size={24} />
            Edit Category
          </h2>
        </div>

        {/* Error Message */}
        {error && (
          <div className="editcat-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form className="editcat-form" onSubmit={handleSubmit}>
          <div className="editcat-field">
            <label className="editcat-label">
              <Tag size={18} />
              Category Name
            </label>
            <div className="editcat-input-wrap">
              <Tag className="editcat-input-icon" size={18} />
              <input
                className="editcat-input"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                required
              />
            </div>
          </div>

          <div className="editcat-field">
            <label className="editcat-label">
              <AlignLeft size={18} />
              Description
            </label>
            <div className="editcat-textarea-wrap">
              <AlignLeft className="editcat-textarea-icon" size={18} />
              <textarea
                className="editcat-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter category description"
                rows="4"
              />
            </div>
          </div>

          <div className="editcat-btn-wrap">
            <button
              type="submit"
              className="editcat-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="editcat-btn-spinner" size={20} />
                  Updating...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Update Category
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}