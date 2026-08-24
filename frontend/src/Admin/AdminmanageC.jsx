import React, { useState, useEffect } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../admincss/adminmanagec.css";

const AdminmanageC = () => {
  const [categoriesList, setCategoriesList] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:1111/api/categories"
      );

      setCategoriesList(res.data.categories || res.data);
    } catch (err) {
      console.log("Categories loading erroe:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Do you really wanna to delete?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:1111/api/categories/${id}`
      );

      fetchCategories();

      alert("Category deleted successfully");
    } catch (error) {
      console.log("Delete Error:", error);
      alert("Delete failed");
    }
  };

  const handleEdit = (category) => {
    navigate(`/admin/edit-category/${category._id}`);
  };

  return (
    <div className="amc-container">
      <div className="amc-card">
        <div className="amc-header">
          <h2 className="amc-title">
            Manage Categories
          </h2>
        </div>

        {categoriesList.length === 0 ? (
          <div className="amc-empty-state">
            <p>There is no category after an effort.</p>
          </div>
        ) : (
          <div className="amc-table-wrapper">
            <table className="amc-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categoriesList.map((cat, index) => (
                  <tr key={cat._id}>
                    <td className="amc-serial">
                      {index + 1}
                    </td>

                    <td className="amc-category-name">
                      {cat.name}
                    </td>

                    <td className="amc-description">
                      {cat.description}
                    </td>

                    <td>
                      <div className="amc-actions">
                        <button
                          className="amc-icon-edit"
                          onClick={() => handleEdit(cat)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          className="amc-icon-delete"
                          onClick={() =>
                            handleDelete(cat._id)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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

export default AdminmanageC;