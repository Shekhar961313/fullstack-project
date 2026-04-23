import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

/**
 * Dashboard Page - main page after login.
 * Shows storage usage, file upload, and list of uploaded files.
 */
function Dashboard() {
  const [files, setFiles] = useState([]);         // List of uploaded files
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Total storage limit: 2GB (in bytes)
  const TOTAL_STORAGE = 2 * 1024 * 1024 * 1024;

  // Load files when page opens
  useEffect(() => {
    fetchFiles();
  }, []);

  // Fetch all files from backend
  const fetchFiles = async () => {
    try {
      const response = await api.get('/files');
      setFiles(response.data);
    } catch (err) {
      console.error('Failed to fetch files:', err);
    }
  };

  // Upload a file
  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchFiles(); // Refresh the file list
    } catch (err) {
      alert('Upload failed: ' + (err.response?.data?.error || 'Unknown error'));
    } finally {
      setUploading(false);
    }
  };

  // Delete a file
  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;
    try {
      await api.delete(`/files/${fileId}`);
      fetchFiles(); // Refresh the file list
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  // Handle file input change
  const onFileSelect = (e) => {
    handleUpload(e.target.files[0]);
  };

  // Handle drag and drop
  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files[0]);
  };

  // Calculate total storage used
  const usedStorage = files.reduce((sum, f) => sum + f.fileSize, 0);
  const usagePercent = ((usedStorage / TOTAL_STORAGE) * 100).toFixed(1);

  // Format bytes to readable size (KB, MB, GB)
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  };

  // Get emoji icon for file type
  const getFileIcon = (type) => {
    if (!type) return '📁';
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type.includes('document') || type.includes('word') || type.includes('text')) return '📝';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    return '📁';
  };

  // Format date
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Manage your cloud files</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-icon">📁</span>
            <div>
              <h3>{files.length}</h3>
              <p>Total Files</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">💾</span>
            <div>
              <h3>{formatSize(usedStorage)}</h3>
              <p>Storage Used</p>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-icon">📦</span>
            <div>
              <h3>{formatSize(TOTAL_STORAGE - usedStorage)}</h3>
              <p>Storage Free</p>
            </div>
          </div>
        </div>

        {/* Storage Usage Bar */}
        <div className="storage-card">
          <div className="storage-header">
            <h3>Storage Usage</h3>
            <span>{formatSize(usedStorage)} / {formatSize(TOTAL_STORAGE)}</span>
          </div>
          <div className="storage-bar-bg">
            <div
              className="storage-bar-fill"
              style={{ width: `${Math.min(usagePercent, 100)}%` }}
            />
          </div>
          <span className="storage-percent">{usagePercent}% used</span>
        </div>

        {/* Upload Zone */}
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileSelect}
            style={{ display: 'none' }}
          />
          <span className="upload-icon">{uploading ? '⏳' : '⬆️'}</span>
          <p>{uploading ? 'Uploading...' : 'Click or drag a file here to upload'}</p>
          <span className="upload-hint">Max file size: 10MB</span>
        </div>

        {/* Files List */}
        <div className="files-section">
          <h2>Your Files</h2>
          {files.length === 0 ? (
            <div className="empty-state">
              <span>📂</span>
              <p>No files uploaded yet</p>
            </div>
          ) : (
            <div className="files-grid">
              {files.map((file) => (
                <div key={file.id} className="file-card">
                  <div className="file-icon">{getFileIcon(file.fileType)}</div>
                  <div className="file-info">
                    <h4 className="file-name">{file.fileName}</h4>
                    <div className="file-meta">
                      <span>{formatSize(file.fileSize)}</span>
                      <span>•</span>
                      <span>{formatDate(file.uploadDate)}</span>
                    </div>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(file.id)}
                    title="Delete file"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
