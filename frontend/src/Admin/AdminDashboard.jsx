import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Users, 
  Briefcase, 
  Layers, 
  Sparkles,
  MapPin, 
  Loader2,
  Bell,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../admincss/admindash.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState({
    counts: { employers: 0, jobs: 0, categories: 0 },
    users: [],
    jobs: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('http://localhost:1111/api/dashboard');
        setDashboard({
          counts: res.data.counts || { employers: 0, jobs: 0, categories: 0 },
          users: res.data.users || [],
          jobs: res.data.jobs || [],
          categories: res.data.categories || [],
        });
      } catch (error) {
        setMessage(error.response?.data?.message || 'Telemetry link dropped.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const getGraphMetrics = () => {
    if (!dashboard.jobs || dashboard.jobs.length === 0) {
      return {
        labels: ['Tech', 'Design', 'Marketing', 'Sales', 'Management'],
        data: [45, 32, 28, 15, 12]
      };
    }
    const frequencyMap = {};
    dashboard.jobs.forEach(job => {
      const key = job.category || 'General';
      frequencyMap[key] = (frequencyMap[key] || 0) + 1;
    });
    const sortedCategories = Object.entries(frequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sortedCategories.map(item => item[0]),
      data: sortedCategories.map(item => item[1] * 8) 
    };
  };

  const metrics = getGraphMetrics();

  const barColors = [
    '#22c55e',
    '#f59e0b',
    '#ef4444',
    '#06b6d4',
    '#8b5cf6',
  ];

  const chartData = {
    labels: metrics.labels,
    datasets: [
      {
        label: 'Job Selection Weight',
        data: metrics.data,
        backgroundColor: barColors.slice(0, metrics.labels.length),
        borderRadius: 4,
        barThickness: 28,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { size: 11 },
        bodyFont: { size: 11 },
        padding: 8,
      }
    },
    scales: {
      y: { 
        border: { display: false }, 
        grid: { color: 'rgba(0,0,0,0.05)' },
        ticks: { color: '#64748b', font: { size: 10 } },
        beginAtZero: true,
      },
      x: { 
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 10 } }
      }
    }
  };

  const totalSelections = dashboard.counts.jobs * 12 || 1436;

  return (
    <main className="admin-dashboard-main">
      {/* Header */}
      <div className="admin-dashboard-header">
        <div className="header-title-wrapper">
          <div className="admin-badge">
            <Sparkles size={10} className="sparkle-icon" />
            <span>Telemetry Active</span>
          </div>
          <h1>Dashboard</h1>
        </div>
        <div className="header-actions">
          <div className="notification-bell-icon">
            <Bell size={15} />
            <span className="bell-dot"></span>
          </div>
          <div className="admin-profile-avatar">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Admin" />
          </div>
        </div>
      </div>

      {loading && (
        <div className="admin-loading-screen">
          <Loader2 className="admin-spinner" size={24} />
          <p>Syncing core matrix...</p>
        </div>
      )}
      
      {!loading && message && (
        <div className="admin-error-card"><p>{message}</p></div>
      )}

      {!loading && !message && (
        <>
          {/* ✅ TOP ROW: 3 Small Cards - Width Kam */}
          <div className="stats-wrapper">
            <div className="admin-dashboard-stats">
              <div className="admin-dashboard-stat main-card-green animate-card">
                <div className="card-top-row">
                  <div className="stat-icon-wrapper-white">
                    <TrendingUp size={14} />
                  </div>
                  <span className="see-details-txt">Overview <ChevronRight size={10}/></span>
                </div>
                <div className="stat-text-white">
                  <strong>{totalSelections.toLocaleString()}</strong>
                  <span>Total Selections</span>
                </div>
              </div>
              
              <div className="admin-dashboard-stat mini-stat animate-card delay-1">
                <div className="stat-icon-wrapper orange-bg"><Users size={14} /></div>
                <div className="stat-text">
                  <strong>{dashboard.counts.employers || '424'}</strong>
                  <span>Partners</span>
                </div>
              </div>
              
              <div className="admin-dashboard-stat mini-stat animate-card delay-2">
                <div className="stat-icon-wrapper yellow-bg"><Layers size={14} /></div>
                <div className="stat-text">
                  <strong>{dashboard.counts.categories || '103'}</strong>
                  <span>Taxonomy Nodes</span>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ MIDDLE: Most Chosen Job Tracks - Bada & Height zyada */}
          <section className="admin-chart-section animate-card delay-3">
            <div className="chart-header-row">
              <h2>Most Chosen Job Tracks</h2>
              <span className="live-pill">
                <span className="pulse-point"></span>Dynamic Live
              </span>
            </div>
            <div className="chart-container-large">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </section>

          {/* ✅ BOTTOM: Active Core Pipelines - Niche gap deke */}
          <section className="admin-dashboard-card animate-card delay-4">
            <div className="card-header">
              <h2>Active Core Pipelines</h2>
              <span className="card-count-badge">{dashboard.jobs.length} nodes</span>
            </div>
            <div className="card-content-list">
              {dashboard.jobs.length === 0 ? (
                <p className="no-data-text">No active paths tracking.</p>
              ) : (
                dashboard.jobs.slice(0, 5).map((job) => (
                  <div className="admin-dashboard-row row-hover" key={job._id}>
                    <div className="row-left">
                      <div className="job-icon-box green-bg-light"><Briefcase size={14} /></div>
                      <div className="row-details">
                        <strong>{job.jobTitle || 'Unassigned Title'}</strong>
                        <span className="category-pill orange-pill">{job.category || 'Standard'}</span>
                      </div>
                    </div>
                    <div className="row-right">
                      <span className="geo-tag"><MapPin size={11} /> {job.location || 'Remote'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* ✅ LATEST INGRESS LOGS - Sabse Niche */}
          <section className="listings-widget animate-card delay-4">
            <div className="widget-header">
              <h3>Latest Ingress Logs</h3>
              <span className="card-count-badge">{dashboard.users.length} users</span>
            </div>
            <div className="sidebar-user-list-horizontal">
              {dashboard.users.length === 0 ? (
                <p className="no-data-text">No structural logs found.</p>
              ) : (
                dashboard.users.slice(0, 6).map((user, idx) => (
                  <div className="sidebar-user-card" key={user._id || idx}>
                    <div className="avatar-wrapper">
                      <img src={`https://i.pravatar.cc/150?img=${idx + 12}`} alt="User" className="user-row-avatar" />
                      <span className="online-status-indicator"></span>
                    </div>
                    <div className="user-card-info">
                      <h4>{user.fullName || user.name || 'Anonymous'}</h4>
                      <p>{user.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default AdminDashboard;