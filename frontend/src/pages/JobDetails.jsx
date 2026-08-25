import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../styling/jobdetails.css'; 
import JobNav from '../components/JobNav';

export default function JobDetails() {
    const { id } = useParams();

    const [formData, setFormData] = useState({
        jobTitle: "",
        salary: "",
        description: "",
        location: "",
        skill: "",
        applydate: "",
        date: "",
        jobType: "",
        expirence: "",
    });

    useEffect(() => {
        const fetchjob = async () => {
            try {
                const res = await axios.get(`https://jon-available.onrender.com/api/jobs/${id}`);
                setFormData(res.data.job || res.data);
            } catch (error) {
                console.log("Data error", error);
            }
        };

        if (id) fetchjob();
    }, [id]);

    return (
       <div>
        <JobNav/>
        <div className="jd-page-wrapper">
            
            <div className="jd-card-container">
                <h3 className="jd-title">Application Detailed View</h3>

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
                            <td className="jd-label">Job Title</td>
                            <td className="jd-value">{formData.jobTitle}</td>
                            <td className="jd-label">Salary Package</td>
                            <td className="jd-value">₹{formData.salary || "N/A"}</td>
                        </tr>

                        <tr>
                            <td className="jd-label">Job Description</td>
                            {/* colSpan se description ko poori width mil jayegi aur baki do empty <td> hatane padenge */}
                            <td className="jd-value jd-desc" colSpan="3">{formData.description || "No description provided."}</td>
                        </tr>

                        <tr>
                            <td className="jd-label">Job Location</td>
                            <td className="jd-value">{formData.location}</td>
                            <td className="jd-label">Skills Required</td>
                            <td className="jd-value">{formData.skill}</td>
                        </tr>

                        <tr>
                            <td className="jd-label">Apply Date</td>
                            <td className="jd-value">{formData.applydate || "N/A"}</td>
                            <td className="jd-label">Last Date</td>
                            <td className="jd-value">{formData.date}</td>
                        </tr>

                        <tr>
                            <td className="jd-label">Job Type</td>
                            <td className="jd-value"><span className="jd-badge">{formData.jobType}</span></td>
                            <td className="jd-label">Experience</td>
                            <td className="jd-value">{formData.expirence} Years</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
}