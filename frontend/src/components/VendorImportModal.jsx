// src/components/VendorImportModal.jsx
import React, { useState, useEffect } from "react";
import { Download, Upload, X } from "lucide-react";

const VendorImportModal = ({ show, onClose }) => {
  const [animateIn, setAnimateIn] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (show) {
      setTimeout(() => setAnimateIn(true), 10);
    } else {
      setAnimateIn(false);
    }
  }, [show]);

  if (!show) return null;

  const handleDownloadTemplate = () => {
    console.log("Download template clicked");
    // In a real app, this would download a CSV template
  };

  const handleUploadTemplate = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      console.log("File selected:", file.name);
    }
  };

  const handleConfirmImport = () => {
    if (uploadedFile) {
      console.log("Importing vendors from file:", uploadedFile.name);
      // In a real app, this would process the CSV file
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex z-50">
      <div 
        className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="flex-grow" />
      <div 
        className="relative bg-white w-1/2 h-full shadow-xl"
        style={{ 
          opacity: animateIn ? 1 : 0,
          transform: `translateX(${animateIn ? 0 : 100}%)`,
          transition: 'all 300ms ease-in-out'
        }}
      >
        {/* Close button in the top right corner */}
        <button 
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Import Vendors via spreadsheet</h2>
          <p className="text-gray-600 mb-8">
            Download and fill out the template below to add multiple vendors at once
          </p>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold">Download the template</h3>
            </div>
            <p className="text-gray-600 ml-11 mb-4">
              Fill out a separate row in the spreadsheet for each vendor.
            </p>
            <div className="ml-11">
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Download size={20} className="mr-2" />
                <span>Download Template</span>
              </button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold">Upload the template</h3>
            </div>
            <p className="text-gray-600 ml-11 mb-4">
              Review the values you entered in the spreadsheet and fix any issues that may prevent your vendor from importing correctly.
            </p>
            <div className="ml-11">
              <input
                type="file"
                onChange={handleUploadTemplate}
                accept=".csv"
                className="hidden"
                id="vendor-template-upload"
              />
              <label
                htmlFor="vendor-template-upload"
                className="inline-flex items-center justify-center w-64 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <Upload size={20} className="mr-2" />
                <span>Upload Template</span>
              </label>
              {uploadedFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Selected file: {uploadedFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold">Confirm Vendors for import</h3>
            </div>
            <p className="text-gray-600 ml-11 mb-4">
              Review the vendors you entered
            </p>
            {uploadedFile && (
              <div className="ml-11">
                <button
                  onClick={handleConfirmImport}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
                >
                  Import Vendors
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorImportModal;