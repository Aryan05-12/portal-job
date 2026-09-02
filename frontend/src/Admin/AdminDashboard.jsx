import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Users,
  Briefcase,
  Layers,
  FileText,
  CheckCircle2,
  Clock3,
  XCircle,
  MapPin,
  Mail,
  Loader2,
} from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import '../admincss/admindash.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const emptyCounts = {
  employers: 0,
  jobs: 0,
  categories: 0,
  applications: 0,
  accepted: 0,
  rejected: 0,
  pending: 0,
};

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState({
    counts: emptyCounts,
    users: [],
    jobs: [],
    categories: [],
    applications: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('https://jon-available.onrender.com/api/dashboard');
        setDashboard({
          counts: { ...emptyCounts, ...(res.data.counts || {}) },
          users: res.data.users || [],
          jobs: res.data.jobs || [],
          categories: res.data.categories || [],
          applications: res.data.applications || [],
        });
      } catch (error) {
        setMessage(error.response?.data?.message || 'Dashboard data load nahi ho paaya.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const categoryMetrics = useMemo(() => {
    const map = {};
    dashboard.jobs.forEach((job) => {
      const category = job.category || 'General';
      map[category] = (map[category] || 0) + 1;
    });

    const entries = Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      labels: entries.length ? entries.map(([name]) => name) : ['No Jobs'],
      data: entries.length ? entries.map(([, count]) => count) : [0],
    };
  }, [dashboard.jobs]);

  const chartData = {
    labels: categoryMetrics.labels,
    datasets: [
      {
        label: 'Jobs',
        data: categoryMetrics.data,
        backgroundColor: ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#7c3aed', '#0891b2'],
        borderRadius: 6,
        barThickness: 34,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#111827', padding: 10 },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0, color: '#64748b' },
        grid: { color: '#e5e7eb' },
        border: { display: false },
      },
      x: {
        ticks: { color: '#64748b' },
        grid: { display: false },
        border: { display: false },
      },
    },
  };

  const latestApplications = dashboard.applications.slice(0, 5);
  const latestJobs = dashboard.jobs.slice(0, 5);
  const latestUsers = dashboard.users.slice(0, 5);
  const statusTotal = dashboard.counts.applications || 0;

  const getPercent = (value) => {
    if (!statusTotal) return 0;
    return Math.round((value / statusTotal) * 100);
  };

  return (
    <main className="admin-dashboard-main">
      <div className="admin-dashboard-header">
        <div>
          <span className="admin-dashboard-eyebrow">Admin Dashboard</span>
          <h1>Job Portal Overview</h1>
          <p>Live data from users, jobs, categories and applications.</p>
        </div>
      </div>

      {loading && (
        <div className="admin-loading-screen">
          <Loader2 className="admin-spinner" size={30} />
          <p>Loading dashboard data...</p>
        </div>
      )}

      {!loading && message && (
        <div className="admin-error-card">{message}</div>
      )}

      {!loading && !message && (
        <>
          <section className="admin-stats-grid">
            <div className="admin-stat-card blue">
              <div className="admin-stat-icon"><Briefcase size={20} /></div>
              <span>Total Jobs</span>
              <strong>{dashboard.counts.jobs}</strong>
            </div>
            <div className="admin-stat-card green">
              <div className="admin-stat-icon"><FileText size={20} /></div>
              <span>Applications</span>
              <strong>{dashboard.counts.applications}</strong>
            </div>
            <div className="admin-stat-card amber">
              <div className="admin-stat-icon"><Users size={20} /></div>
              <span>Registered Users</span>
              <strong>{dashboard.counts.employers}</strong>
            </div>
            <div className="admin-stat-card purple">
              <div className="admin-stat-icon"><Layers size={20} /></div>
              <span>Categories</span>
              <strong>{dashboard.counts.categories}</strong>
            </div>
          </section>

          <section className="admin-dashboard-grid">
            <div className="admin-panel admin-chart-panel">
              <div className="admin-panel-header">
                <div>
                  <h2>Jobs By Category</h2>
                  <p>Category wise posted job count</p>
                </div>
                <span>{dashboard.jobs.length} jobs</span>
              </div>
              <div className="admin-chart-box">
                <Bar data={chartData} options={chartOptions} />
              </div>
            </div>

            <div className="admin-panel admin-status-panel">
              <div className="admin-panel-header">
                <div>
                  <h2>Application Status</h2>
                  <p>Current hiring pipeline</p>
                </div>
              </div>

              <div className="status-list">
                <div className="status-item pending">
                  <div><Clock3 size={18} /><span>Pending</span></div>
                  <strong>{dashboard.counts.pending}</strong>
                  <div className="status-track"><span style={{ width: getPercent(dashboard.counts.pending) + '%' }} /></div>
                </div>
                <div className="status-item accepted">
                  <div><CheckCircle2 size={18} /><span>Accepted</span></div>
                  <strong>{dashboard.counts.accepted}</strong>
                  <div className="status-track"><span style={{ width: getPercent(dashboard.counts.accepted) + '%' }} /></div>
                </div>
                <div className="status-item rejected">
                  <div><XCircle size={18} /><span>Rejected</span></div>
                  <strong>{dashboard.counts.rejected}</strong>
                  <div className="status-track"><span style={{ width: getPercent(dashboard.counts.rejected) + '%' }} /></div>
                </div>
              </div>
            </div>
          </section>

          <section className="admin-bottom-grid">
            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h2>Latest Posted Jobs</h2>
                  <p>Newest job entries</p>
                </div>
              </div>
              <div className="admin-list">
                {latestJobs.length === 0 ? (
                  <p className="no-data-text">No jobs posted yet.</p>
                ) : latestJobs.map((job) => (
                  <div className="admin-list-row" key={job._id}>
                    <div className="admin-row-icon"><Briefcase size={16} /></div>
                    <div className="admin-row-main">
                      <strong>{job.jobTitle || 'Untitled Job'}</strong>
                      <span>{job.category || 'General'} | {job.jobType || 'Full Time'}</span>
                    </div>
                    <div className="admin-row-meta"><MapPin size={13} /> {job.location || 'Remote'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-panel">
              <div className="admin-panel-header">
                <div>
                  <h2>Latest Applications</h2>
                  <p>Recent candidate activity</p>
                </div>
              </div>
              <div className="admin-list">
                {latestApplications.length === 0 ? (
                  <p className="no-data-text">No applications yet.</p>
                ) : latestApplications.map((app) => (
                  <div className="admin-list-row" key={app._id}>
                    <div className="admin-row-icon"><FileText size={16} /></div>
                    <div className="admin-row-main">
                      <strong>{app.userName || 'Candidate'}</strong>
                      <span>{app.jobTitle || 'Job'} | {app.status || 'Pending'}</span>
                    </div>
                    <div className="admin-row-meta">{app.date ? new Date(app.date).toLocaleDateString() : 'Recent'}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-panel admin-users-panel">
              <div className="admin-panel-header">
                <div>
                  <h2>Latest Users</h2>
                  <p>Recently registered accounts</p>
                </div>
              </div>
              <div className="admin-list">
                {latestUsers.length === 0 ? (
                  <p className="no-data-text">No users registered yet.</p>
                ) : latestUsers.map((user) => (
                  <div className="admin-list-row" key={user._id}>
                    <div className="admin-user-avatar">{(user.fullName || user.name || user.email || 'U').charAt(0).toUpperCase()}</div>
                    <div className="admin-row-main">
                      <strong>{user.fullName || user.name || 'User'}</strong>
                      <span><Mail size={12} /> {user.email || 'No email'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
};

export default AdminDashboard;
