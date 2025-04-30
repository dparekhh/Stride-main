// src/components/FileUploader.jsx
import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, X, FileImage, File, FileText } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner.jsx';

/**
 * A reusable file uploader component with preview capabilities
 * Handles drag-and-drop and click-to-upload functionality
 * Supports image and document files
 */
const FileUploader = ({ 
  onFileSelect, 
  acceptedFileTypes = "image/*, application/pdf", 
  maxSizeMB = 5,
  label = "Upload Document",
  description = "Drag and drop your document here or click to browse"
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'loading', 'success', 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef(null);

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndProcessFile(selectedFile);
    }
  };

  // Validate file type and size
  const validateAndProcessFile = (file) => {
    setUploadStatus('loading');
    setErrorMessage('');
    
    // Check file size (convert MB to bytes)
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setUploadStatus('error');
      setErrorMessage(`File size exceeds maximum allowed (${maxSizeMB}MB)`);
      return;
    }
    
    // Check file type
    const fileType = file.type;
    const acceptedTypes = acceptedFileTypes.split(',').map(type => type.trim());
    
    // Handle wildcard types like 'image/*'
    const isAccepted = acceptedTypes.some(type => {
      if (type.endsWith('*')) {
        const category = type.substring(0, type.indexOf('/*'));
        return fileType.startsWith(category);
      }
      return type === fileType;
    });
    
    if (!isAccepted) {
      setUploadStatus('error');
      setErrorMessage('File type not supported');
      return;
    }
    
    // Create preview URL for the file
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFile(file);
    
    // Simulate processing delay for UX feedback
    setTimeout(() => {
      setUploadStatus('success');
      
      // Call the parent component callback with the uploaded file
      if (onFileSelect) {
        onFileSelect(file, url);
      }
    }, 800);
  };

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    inputRef.current.click();
  };
  
  // Handle removing the uploaded file
  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadStatus(null);
    setErrorMessage('');
    
    // Reset file input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    // Notify parent component
    if (onFileSelect) {
      onFileSelect(null);
    }
  };
  
  // Get file icon based on type
  const getFileIcon = () => {
    if (!file) return <Upload size={36} />;
    
    const fileType = file.type;
    if (fileType.startsWith('image')) {
      return <FileImage size={36} />;
    } else if (fileType === 'application/pdf') {
      return <File size={36} />;
    } else {
      return <FileText size={36} />;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {!file ? (
        // Upload area
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
            ${uploadStatus === 'error' ? 'border-red-300' : ''}`}
          onClick={handleButtonClick}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={acceptedFileTypes}
          />
          
          <div className="flex flex-col items-center space-y-3">
            <Upload className={`${dragActive ? 'text-blue-500' : 'text-gray-400'}`} size={36} />
            <p className="text-sm text-gray-600">{description}</p>
            <p className="text-xs text-gray-500">
              Max file size: {maxSizeMB}MB
            </p>
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Files
            </button>
          </div>
        </div>
      ) : (
        // File preview area
        <div className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              {getFileIcon()}
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleRemoveFile}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Status indicators */}
          {uploadStatus === 'loading' && (
            <div className="flex items-center justify-center bg-gray-50 p-4 rounded">
              <LoadingSpinner size="medium" />
              <span className="ml-3 text-sm text-gray-600">Processing document...</span>
            </div>
          )}
          
          {uploadStatus === 'success' && (
            <div className="flex items-center bg-green-50 p-3 rounded">
              <CheckCircle className="text-green-500" size={20} />
              <span className="ml-2 text-sm text-green-700">Document ready</span>
            </div>
          )}
          
          {/* Preview for images */}
          {file && file.type.startsWith('image') && previewUrl && (
            <div className="mt-4">
              <div className="border rounded overflow-hidden max-h-[200px] flex items-center justify-center bg-gray-50">
                <img 
                  src={previewUrl} 
                  alt="Uploaded file preview" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          )}
          
          {/* Preview for PDFs */}
          {file && file.type === 'application/pdf' && previewUrl && (
            <div className="mt-4">
              <div className="border rounded overflow-hidden h-[200px] bg-gray-50">
                <iframe 
                  src={previewUrl} 
                  title="PDF Preview" 
                  className="w-full h-full"
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Error message */}
      {errorMessage && (
        <div className="mt-2 flex items-center text-red-600 text-sm">
          <AlertCircle size={16} className="mr-1" />
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default FileUploader;