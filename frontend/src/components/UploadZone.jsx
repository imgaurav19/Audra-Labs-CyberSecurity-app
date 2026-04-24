import React, { useCallback, useState } from 'react';
import { UploadCloud, FileImage, FileVideo, X } from 'lucide-react';
import './UploadZone.css';

export default function UploadZone({ onAnalyze }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const validateAndSetFile = (file) => {
    setError('');
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, WEBP, MP4, or WEBM.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError('File is too large. Maximum size is 50MB.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  // Paste Support
  React.useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1 || items[i].type.indexOf('video') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            validateAndSetFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleAnalyzeClick = () => {
    if (selectedFile) {
      onAnalyze(selectedFile, previewUrl);
    }
  };

  return (
    <div className="upload-container">
      {!selectedFile ? (
        <div 
          className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            id="file-upload" 
            className="file-input" 
            accept="image/jpeg, image/png, image/webp, video/mp4, video/webm"
            onChange={handleChange}
          />
          <label htmlFor="file-upload" className="upload-label">
            <UploadCloud size={48} className="upload-icon" />
            <h3>Drag & drop media here</h3>
            <p>or click to browse files</p>
            <div className="supported-formats">
              <span><FileImage size={14} /> JPG, PNG, WEBP</span>
              <span><FileVideo size={14} /> MP4, WEBM</span>
            </div>
            {error && <div className="error-message">{error}</div>}
          </label>
        </div>
      ) : (
        <div className="preview-zone">
          <button className="clear-btn" onClick={clearSelection}>
            <X size={20} />
          </button>
          <div className="media-preview">
            {selectedFile.type.startsWith('video/') ? (
              <video src={previewUrl} controls className="preview-content" />
            ) : (
              <img src={previewUrl} alt="Preview" className="preview-content" />
            )}
          </div>
          <div className="file-info">
            <span className="file-name">{selectedFile.name}</span>
            <span className="file-size">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
          <button className="analyze-btn" onClick={handleAnalyzeClick}>
            Run Forensic Analysis
          </button>
        </div>
      )}
    </div>
  );
}
