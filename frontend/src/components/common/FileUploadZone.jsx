import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';

/**
 * FileUploadZone Component
 * 
 * A reusable file upload zone with drag-and-drop and click-to-upload functionality
 * 
 * @param {Object} props
 * @param {Function} props.onFileUpload - Function to handle uploaded file
 * @param {string} props.uploadText - Primary text shown in the upload area
 * @param {string} props.tipText - Optional tip text shown at the bottom
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.acceptedFileTypes - File types to accept (e.g., ".pdf,.jpg,.png")
 */
const FileUploadZone = ({ 
  onFileUpload,
  uploadText = "Drop receipts or click here to upload",
  tipText,
  className = "",
  acceptedFileTypes = ".pdf,.jpg,.jpeg,.png" 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0]);
    }
  };

  // Handle button click to trigger file input
  const handleButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <div 
        className={`border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
          ${dragActive ? 'border-primary bg-primary-light' : 'border-gray-300 hover:border-gray-400'}
          min-h-[200px]`}
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
        
        <Upload className={`${dragActive ? 'text-primary' : 'text-gray-400'} mb-3`} size={28} />
        <p className="text-sm text-gray-600 mb-1">{uploadText}</p>
        
      </div>
      
      {tipText && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          <span className="font-medium">Tip:</span> {tipText}
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;