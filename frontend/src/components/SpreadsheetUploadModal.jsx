// src/components/SpreadsheetUploadModal.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, Download, Upload } from "lucide-react";

const SpreadsheetUploadModal = ({ show, onClose }) => {
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
    alert("Template download would start here");
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
      console.log("Importing file:", uploadedFile.name);
      alert("Processing would start here");
      onClose();
    } else {
      alert("Please upload a file first");
    }
  };

  return (
    <div className="fixed inset-0 flex z-50">
      <div
        className="absolute inset-0 backdrop-filter backdrop-blur-sm bg-black/20"
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
        <div className="border-b p-4">
          <button onClick={onClose} className="flex items-center text-gray-700 hover:text-gray-900">
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Create drafts via spreadsheet</h1>
          <p className="text-gray-600 mb-8">
            Download and fill out the template below to create multiple drafts at once
          </p>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="font-bold">1</span>
              </div>
              <h2 className="text-xl font-bold">Download the template</h2>
            </div>
            <p className="text-gray-600 ml-11 mb-4">
              Fill out a separate row in the spreadsheet for each draft
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
              <h2 className="text-xl font-bold">Upload the template</h2>
            </div>
            <p className="text-gray-600 ml-11 mb-4">
              Upload your completed spreadsheet
            </p>
            <div className="ml-11">
              <input
                type="file"
                onChange={handleUploadTemplate}
                accept=".xlsx,.xls,.csv"
                className="hidden"
                id="template-upload"
              />
              <label
                htmlFor="template-upload"
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                <Upload size={20} className="mr-2" />
                <span>Upload Template</span>
              </label>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                <span className="font-bold">3</span>
              </div>
              <h2 className="text-xl font-bold">Confirm drafts for import</h2>
            </div>
            <p className="text-gray-600 ml-11 mb-4">
              Review the drafts you entered
            </p>
            {uploadedFile && (
              <div className="ml-11">
                <button
                  onClick={handleConfirmImport}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
                >
                  Import Drafts
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetUploadModal;