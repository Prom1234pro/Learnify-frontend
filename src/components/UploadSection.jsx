import { useRef, useState } from 'react';
import { useTheme } from './ThemeContext';
import { Upload } from 'lucide-react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

import './UploadSection.css';

const socket = io('https://backend-368k.onrender.com');

// eslint-disable-next-line react/prop-types
const AnimatedButton = ({ children, onClick, disabled }) => {
  const { isDark } = useTheme();

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`animated-button ${isDark ? 'animated-button-dark' : 'animated-button-light'} ${
        disabled ? 'animated-button-disabled' : ''
      }`}
    >
      {children}
    </button>
  );
};

const UploadSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false); // State for preview visibility
  const [isSummarizing, setIsSummarizing] = useState(false); // Summarizing state
  const fileInputRef = useRef(null);
  const { isDark } = useTheme();
  const navigate = useNavigate(); // Initialize navigate

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length) handleFiles(files[0]);
  };

  const handleFiles = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('page_start', 1);
    formData.append('page_end', 10);
    formData.append('total_pages_mark', 10);

    socket.on('processing_progress', (data) => {
      setUploadProgress(data.progress);
    });

    try {
      const response = await fetch('https://backend-368k.onrender.com/extract-multiple-page-from-document', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload and process document');
      }

      const data = await response.json();
      localStorage.setItem('uploadedDocument', data.text); // Store extracted text
      localStorage.setItem('documentName', file.name);

      setDocumentPreview(data.text); // Update preview content
      setUploadProgress(100);
      setIsUploading(false);
    } catch (error) {
      console.error('Error uploading document:', error);
      setIsUploading(false);
    }
  };

  const handleSummarize = async () => {
    setIsSummarizing(true);

    const documentText = localStorage.getItem('uploadedDocument');
    try {
      const response = await fetch('https://backend-368k.onrender.com/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: documentText }),
      });

      if (!response.ok) {
        throw new Error('Failed to summarize the document');
      }

      const summary = await response.json();
      console.log(summary)
      localStorage.setItem('summary', summary.summary);
      const chatId = Date.now(); // Create unique ID for the new chat
    navigate(`/chat/${chatId}`, { state: { initialMessage: summary.summary, isSummary: true } }); // Store summary for /chat page
    } catch (error) {
      console.error('Error summarizing document:', error);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="upload-section-container">
      <div className="upload-section-inner">
        <h1 className="upload-title">What Do You Want To Learn Today? Let&apos;s Help you get started</h1>

        <div
          className={`upload-area ${isDragging ? 'upload-area-dragging' : ''} ${
            isDark ? 'upload-area-dark' : 'upload-area-light'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="file-input"
            onChange={(e) => handleFiles(e.target.files[0])}
            accept=".pdf,.doc,.docx,.txt"
          />

          {isUploading ? (
            <div className="upload-progress-container">
              <div className="upload-progress-icon">
                <Upload className="upload-icon" />
                <p>Uploading... {Math.round(uploadProgress)}%</p>
              </div>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="upload-placeholder">
              <p className="upload-placeholder-title">Drop your documents here</p>
              <p className="upload-placeholder-subtitle">or click to browse</p>
              <p className="upload-file-support">Supports PDF, DOC, TXT files and</p>
              <p className="upload-file-support">images with text content.</p>
            </div>
          )}
        </div>

        {/* Overlay Preview Trigger */}
        {documentPreview && (
          <>
            <button
              className="preview-button"
              onClick={() => setIsPreviewVisible(true)}
            >
              Preview Document
            </button>
            {isPreviewVisible && (
              <div className="preview-overlay">
                <div className="preview-content">
                  <h2>Preview of {localStorage.getItem('documentName')}</h2>
                  <textarea
                    className="preview-textarea"
                    value={documentPreview}
                    readOnly
                  />
                  <button
                    className="close-preview-button"
                    onClick={() => setIsPreviewVisible(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        <div className="action-buttons-container">
          <AnimatedButton
            onClick={() => {
              const chatId = Date.now();
              navigate(`/chat/${chatId}`);
            }}
            disabled={!localStorage.getItem('uploadedDocument')}
          >
            Chat with Doc
          </AnimatedButton>
          <AnimatedButton
            onClick={handleSummarize}
            disabled={!localStorage.getItem('uploadedDocument') || isSummarizing}
          >
            {isSummarizing ? 'Summarizing...' : 'Get Summary'}
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
};

export default UploadSection;
