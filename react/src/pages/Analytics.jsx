import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, Area, AreaChart
} from 'recharts';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import './Analytics.css';

/**
 * Analytics Page - shows visual charts based on uploaded files.
 * - Pie Chart: files by type
 * - Bar Chart: storage by type
 * - Line/Area Chart: upload trend over time
 */
function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Colors for chart segments
  const COLORS = ['#6C63FF', '#00d2ff', '#ff6b6b', '#ffd93d', '#6BCB77'];

  // Load stats from backend
  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/files/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format bytes to readable size
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  };

  // Prepare data for Pie Chart (files by type)
  const pieData = stats?.filesByType
    ? Object.entries(stats.filesByType).map(([name, value]) => ({ name, value }))
    : [];

  // Prepare data for Bar Chart (storage by type)
  const barData = stats?.storageByType
    ? Object.entries(stats.storageByType).map(([name, value]) => ({
        name,
        bytes: value,
        display: formatSize(value),
      }))
    : [];

  // Prepare data for Area Chart (upload trend)
  const trendData = stats?.uploadTrend
    ? Object.entries(stats.uploadTrend).map(([date, count]) => ({
        date: date.substring(5), // Show only MM-DD
        files: count,
      }))
    : [];

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <p>Loading analytics...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Analytics</h1>
          <p>Visual insights about your cloud storage</p>
        </div>

        {/* Summary Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon">📁</span>
            <div>
              <h3>{stats?.totalFiles || 0}</h3>
              <p>Total Files</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💾</span>
            <div>
              <h3>{formatSize(stats?.totalStorage || 0)}</h3>
              <p>Total Storage</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📊</span>
            <div>
              <h3>{pieData.length}</h3>
              <p>File Categories</p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Pie Chart: Files by Type */}
          <div className="chart-card">
            <h3>Files by Type</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">No data yet. Upload some files!</div>
            )}
          </div>

          {/* Bar Chart: Storage by Type */}
          <div className="chart-card">
            <h3>Storage by Type</h3>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={formatSize} />
                  <Tooltip
                    formatter={(value) => formatSize(value)}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Bar dataKey="bytes" fill="#6C63FF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">No data yet. Upload some files!</div>
            )}
          </div>

          {/* Area Chart: Upload Trend */}
          <div className="chart-card full-width">
            <h3>Upload Trend</h3>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <defs>
                    <linearGradient id="colorFiles" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6C63FF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#6C63FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="files"
                    stroke="#6C63FF"
                    strokeWidth={2}
                    fill="url(#colorFiles)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="chart-empty">No upload history yet</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Analytics;
