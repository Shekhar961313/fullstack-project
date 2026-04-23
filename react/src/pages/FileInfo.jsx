import { useState, useEffect } from 'react';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import './FileInfo.css';

/**
 * FileInfo Page - shows files grouped by type (Images, PDFs, Documents, Others).
 * Includes a search/filter feature.
 */
function FileInfo() {
  const [files, setFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // File type categories
  const categories = ['All', 'Images', 'PDFs', 'Documents', 'Others'];

  // Load files on page open
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await api.get('/files');
      setFiles(response.data);
    } catch (err) {
      console.error('Failed to fetch files:', err);
    }
  };

  // Determine file category from MIME type
  const getCategory = (type) => {
    if (!type) return 'Others';
    if (type.startsWith('image/')) return 'Images';
    if (type === 'application/pdf') return 'PDFs';
    if (type.includes('document') || type.includes('word') || type.includes('text')) return 'Documents';
    return 'Others';
  };

  // Get icon for file type
  const getFileIcon = (type) => {
    if (!type) return '📁';
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'application/pdf') return '📄';
    if (type.includes('document') || type.includes('word') || type.includes('text')) return '📝';
    return '📁';
  };

  // Format bytes
  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Filter files by active tab and search query
  const filteredFiles = files.filter((file) => {
    const matchesTab = activeTab === 'All' || getCategory(file.fileType) === activeTab;
    const matchesSearch = file.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Count files per category (for tab badges)
  const getCategoryCount = (category) => {
    if (category === 'All') return files.length;
    return files.filter((f) => getCategory(f.fileType) === category).length;
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>File Info</h1>
          <p>Browse and filter your files by type</p>
        </div>

        {/* Search Bar */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search files by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${activeTab === cat ? 'active' : ''}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
              <span className="tab-count">{getCategoryCount(cat)}</span>
            </button>
          ))}
        </div>

        {/* Files List */}
        {filteredFiles.length === 0 ? (
          <div className="empty-state">
            <span>📂</span>
            <p>No files found {activeTab !== 'All' ? `in ${activeTab}` : ''}</p>
          </div>
        ) : (
          <div className="file-info-grid">
            {filteredFiles.map((file) => (
              <div key={file.id} className="file-detail-card">
                <div className="file-detail-icon">{getFileIcon(file.fileType)}</div>
                <h4>{file.fileName}</h4>
                <div className="file-detail-row">
                  <span className="detail-label">Size</span>
                  <span>{formatSize(file.fileSize)}</span>
                </div>
                <div className="file-detail-row">
                  <span className="detail-label">Type</span>
                  <span>{file.fileType || 'Unknown'}</span>
                </div>
                <div className="file-detail-row">
                  <span className="detail-label">Uploaded</span>
                  <span>{formatDate(file.uploadDate)}</span>
                </div>
                <div className="file-category-badge">
                  {getCategory(file.fileType)}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default FileInfo;
