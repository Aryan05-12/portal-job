import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import Nav from './Nav';
import RecentJob from './RecentJob';
import { 
  Search, MapPin, Briefcase, Sparkles, ArrowRight, Layers, Users, 
  Laptop, Settings, Box, Rocket, Lightbulb, Settings2, BarChart3, 
  Globe, CheckCircle, ShieldCheck, Filter, Building2 
} from "lucide-react";
import '../styling/content.css';

export default function Content() {
  const categories = [
    { id: 1, title: 'Digital Marketing', count: 1, icon: <Layers size={22} color="#0d9488" /> }, 
    { id: 2, title: 'Human Resources', count: 2, icon: <Users size={22} color="#059669" /> },    
    { id: 3, title: 'Information Technology', count: 2, icon: <Laptop size={22} color="#0284c7" /> },   
    { id: 4, title: 'Operations', count: 1, icon: <Settings size={22} color="#4f46e5" /> }, 
    { id: 5, title: 'Product Management', count: 1, icon: <Box size={22} color="#7c3aed" /> },     
  ];

  const [jobs, setJobs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  useEffect(() => {
    fetch("http://localhost:1111/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        // Backend console check ke liye
        console.log("Fetched Jobs Data:", data.jobs);
        setJobs(data.jobs || []);
      })
      .catch((err) => console.log("Fetch Error:", err));
  }, []);

  // Safe Filtering Logic (No matching stream bug fix)
  const filteredJobs = jobs.filter(job => {
    // Agar koi category select nahi hai toh true, warna database ki category match karo (lowercase safe check)
    const matchesCategory = !selectedCategory || 
      job.category?.toLowerCase().trim() === selectedCategory.toLowerCase().trim();
    
    const matchesSearch = !searchQuery || 
      job.title?.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesLocation = !locationQuery || 
      job.location?.toLowerCase().includes(locationQuery.toLowerCase());

    return matchesCategory && matchesSearch && matchesLocation;
  });

  return (
    <div className="zen-home-wrapper">
      <div className="zen-blob zen-blob-1"></div>
      <div className="zen-blob zen-blob-2"></div>
      
      <Nav />
      
      {/* Hero Section */}
      <header className="zen-hero">
        <div className="zen-watermark watermark-rocket"><Rocket size={34} strokeWidth={1.2} /></div>
        <div className="zen-watermark watermark-bulb"><Lightbulb size={30} strokeWidth={1.2} /></div>
        <div className="zen-watermark watermark-gear"><Settings2 size={40} strokeWidth={1.2} /></div>
        <div className="zen-watermark watermark-chart"><BarChart3 size={28} strokeWidth={1.2} /></div>
        <div className="zen-watermark watermark-globe"><Globe size={32} strokeWidth={1.2} /></div>

        <div className="zen-hero-container">
          <div className="zen-hero-left">
            <span className="zen-badge">
              <Sparkles size={14} className="zen-teal-sparkle" /> Trusted and Verified
            </span>
            <h1 className="zen-hero-title">
              Make Your <br />
              <span className="zen-text-gradient-teal">Dream Come true</span>
            </h1>
            <p className="zen-hero-subtitle">
             Manage your job listings, track applications & monitor platform activity in real-time.
            </p>
            
            {/* Search Box */}
            <div className="zen-search-box">
              <div className="zen-search-group">
                <div className="zen-input-with-icon">
                  <Search size={18} className="zen-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Job Title, Skills..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="zen-divider"></div>
                <div className="zen-input-with-icon">
                  <MapPin size={18} className="zen-search-icon" />
                  <input 
                    type="text" 
                    placeholder="Location..." 
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                  />
                </div>
                <button className="zen-search-btn">Search</button>
              </div>
            </div>

            <div className="zen-hero-actions">
              <button className="zen-btn zen-btn-primary-teal">
                <Briefcase size={16} /> Find Jobs
              </button>
              <Link className="zen-btn zen-btn-outline-teal" to={'/job-seeker'}>
                Apply Here <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right Side Showcase */}
          <div className="zen-hero-right">
            <div className="zen-collage-wrapper">
              <div className="zen-card-frame frame-main">
                <img src="https://mediahub.debenhams.com/m5063566580602_navy_xl.jpeg" alt="Showcase" />
                <div className="zen-frame-overlay">
                  <h4>Get hired. Start now..</h4>
                 
                </div>
              </div>
              <div className="zen-card-frame frame-sub-1">
                <img src="https://img.magnific.com/premium-photo/businessman-man-goes-work-new-office-formal-clothes_283470-2251.jpg" alt="Office" />
              </div>
              <div className="zen-card-frame frame-stats-badge">
                <div className="zen-glass-content">
                  <h5>1k+</h5>
                  <p>Daily Hires</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🔄 SPINNING AI ASSISTANT */}
      <a href="/aichatbox" className="zen-ai-spinner-btn">
        <div className="zen-ai-inside">
          <Sparkles size={24} className="zen-ai-sparkle-center" />
          <svg viewBox="0 0 100 100" className="zen-svg-loop">
            <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
            <text>
              <textPath href="#circlePath" className="zen-text-loop-track">
                • AI ASSISTANT • ASK ANYTHING • LIVE CHAT 
              </textPath>
            </text>
          </svg>
        </div>
      </a>

      {/* Trusted Brands Slider */}
      <section className="zen-brands-slider">
        <p className="zen-brands-label">TRUSTED BY INDUSTRY LEADERS</p>
        <div className="zen-brands-track">
          <div className="zen-brand-item"><Building2 size={16} /> TechCorp</div>
          <div className="zen-brand-item"><Building2 size={16} /> DeltaStudio</div>
          <div className="zen-brand-item"><Building2 size={16} /> InnovateX</div>
          <div className="zen-brand-item"><Building2 size={16} /> CyberFlow</div>
          <div className="zen-brand-item"><Building2 size={16} /> AlphaHub</div>
        </div>
      </section>

      {/* Analytical Micro-Metrics */}
      <section className="zen-metrics-section">
        <div className="zen-metrics-grid">
          <div className="zen-metric-card">
            <div className="zen-metric-icon-wrapper teal-bg"><CheckCircle size={20} /></div>
            <div>
              <h4>94,200+</h4>
              <p>Active Verified Listings</p>
            </div>
          </div>
          <div className="zen-metric-card">
            <div className="zen-metric-icon-wrapper mint-bg"><ShieldCheck size={20} /></div>
            <div>
              <h4>2,450+</h4>
              <p>Premium Partner Shops</p>
            </div>
          </div>
          <div className="zen-metric-card">
            <div className="zen-metric-icon-wrapper blue-bg"><Users size={20} /></div>
            <div>
              <h4>12.5M</h4>
              <p>Expert Talent Network</p>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Loop Category Slider Section */}
      <section className="zen-categories-section">
        <div className="zen-section-header">
          <h2 className="zen-section-title">Popular Job Categories</h2>
          <p className="zen-section-subtitle">Live tracks uploaded across major functional domains</p>
        </div>

        {/* 5 Cards Loop Infinite Marquee System */}
        <div className="zen-marquee-view">
          <div className="zen-marquee-rail">
            {/* Set 1 */}
            {categories.map((cat) => (
              <div 
                key={`set1-${cat.id}`} 
                className={`zen-cat-card ${selectedCategory === cat.title ? 'zen-cat-card-active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat.title ? null : cat.title)}
              >
                <div className="zen-cat-icon-box">{cat.icon}</div>
                <h3 className="zen-cat-card-title">{cat.title}</h3>
                <span className="zen-cat-card-count">{cat.count} Open Positions</span>
                <div className="zen-cat-arrow"><ArrowRight size={16} /></div>
              </div>
            ))}
            {/* Set 2 (Infinite Smooth Loop Duplicate) */}
            {categories.map((cat) => (
              <div 
                key={`set2-${cat.id}`} 
                className={`zen-cat-card ${selectedCategory === cat.title ? 'zen-cat-card-active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat.title ? null : cat.title)}
              >
                <div className="zen-cat-icon-box">{cat.icon}</div>
                <h3 className="zen-cat-card-title">{cat.title}</h3>
                <span className="zen-cat-card-count">{cat.count} Open Positions</span>
                <div className="zen-cat-arrow"><ArrowRight size={16} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Jobs Container */}
      <section className="zen-recent-jobs-section">
        <div className="zen-container">
          <div className="zen-section-header-row">
            <div className="zen-section-header-left">
              <h2 className="zen-section-title">Featured & Recent Jobs</h2>
              <p className="zen-section-subtitle">Handpicked roles that match your profile</p>
            </div>
            
            <div className="zen-controls-panel">
              <button className="zen-control-btn" onClick={() => setSelectedCategory(null)}>
                <Filter size={14} /> Reset Filter {selectedCategory && `(${selectedCategory})`}
              </button>
            </div>
          </div>

          <div className="zen-jobs-list-wrapper">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <RecentJob key={job._id} job={job} />
              ))
            ) : (
              <div className="zen-empty-loader">
                <div className="subtle-spinner"></div>
                <p>No matching streams found for current selection...</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}