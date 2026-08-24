import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styling/jobdetails.css';

export default function ViewList() {
    // 1. URL se ID nikalne ke liye useParams
    const { id } = useParams();

    // 2. Single employer ka data store karne ke liye state
    const [formData, setFormData] = useState({
        email: "",
        contact: "",
        name: "",
        tagline: "",
        website: "",
        logoName: "",
        logo: ""
    });

    
   // 3. API call single user ka data laane ke liye
    const fetchEmployerDetails = async () => {
        try {
            const res = await axios.get(`http://localhost:1111/api/users/${id}`);
            
            // Backend se jo 'user' object aa raha hai, use check karo
            if (res.data && res.data.user) {
                // Purani state ke sath naye data ko merge karo
                setFormData(prevState => ({
                    ...prevState,
                    ...res.data.user
                }));
            }
        } catch (err) {
            console.log("Employer details load karne mein error:", err);
        }
    };

    useEffect(() => {
        if (id) {
            fetchEmployerDetails();
        }
    }, [id]);

    return (
        <div className="jd-page-wrapper">
            <div className="jd-card-container">
                
                {/* Header Section Logo ke Saath */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "25px", borderBottom: "2px solid #4a90e2", paddingBottom: "15px" }}>
                    {formData.logo ? (
                        <img src={formData.logo} alt="Company Logo" style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: "2px solid #4a90e2" }} />
                    ) : (
                        <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#718096", fontWeight: "bold" }}>No Logo</div>
                    )}
                    <div>
                        <h2 style={{ margin: 0, color: "#333", fontSize: "22px" }}>{formData.name || formData.fullName || "Employer Profile"}</h2>
                        {formData.tagline && <p style={{ margin: "5px 0 0 0", color: "#718096", fontSize: "14px" }}>{formData.tagline}</p>}
                    </div>
                </div>

                {/* Same Purana Mast Table Layout */}
                <table className="jd-details-table">
                    <thead>
                        <tr>
                            <th>Field Name</th>
                            <th>Information</th>
                            <th>Field Name</th>
                            <th>Information</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className="jd-label">Full Name / Company</td>
                            <td className="jd-value">{formData.name || formData.fullName}</td>
                            <td className="jd-label">Email Address</td>
                            <td className="jd-value">{formData.email}</td>
                        </tr>

                        <tr>
                            <td className="jd-label">Contact Number</td>
                            <td className="jd-value">{formData.contact || formData.contactNumber || "N/A"}</td>
                            <td className="jd-label">Logo Name</td>
                            <td className="jd-value">{formData.logoName || "N/A"}</td>
                        </tr>

                        <tr>
                            <td className="jd-label">Website</td>
                            <td className="jd-value" colSpan="3">
                                {formData.website ? (
                                    <a href={formData.website} target="_blank" rel="noreferrer" style={{ color: "#4a90e2", textDecoration: "none", fontWeight: "500" }}>
                                        {formData.website}
                                    </a>
                                ) : (
                                    "N/A"
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
        </div>
    );
}