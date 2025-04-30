import React, { useState, useEffect, useId } from 'react';
import { X, Download, Upload, XCircle } from 'lucide-react';
import AppDrawer from './common/AppDrawer';
import * as XLSX from 'xlsx';
import { useDrawer, Z_INDEX_LEVELS } from '../contexts/DrawerContext';

// Custom CSS styles for the scrollbar
const scrollbarStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #ddd;
    border-radius: 4px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #bbb;
  }
  
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #ddd #f1f1f1;
  }
`;

/**
 * ImportChartOfAccountsDrawer component
 * Provides a UI for importing chart of accounts data
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onImport - Function to call when import is completed
 * @param {number} [props.zIndex] - Z-index level for proper stacking
 * @returns {React.ReactElement} ImportChartOfAccountsDrawer component
 */
const ImportChartOfAccountsDrawer = ({ isOpen, onClose, onImport, zIndex = Z_INDEX_LEVELS.LEVEL_2 }) => {
  // Get drawer context for proper drawer management
  const { openDrawer, closeDrawer } = useDrawer();
  
  // Generate unique ID for this drawer instance
  const drawerId = useId();
  
  // Unique drawer ID
  const DRAWER_ID = 'import-chart-of-accounts-drawer';
  
  // Register/unregister drawer when opened/closed
  useEffect(() => {
    if (isOpen) {
      openDrawer(DRAWER_ID, zIndex);
    } else {
      closeDrawer(DRAWER_ID);
    }
    
    return () => {
      closeDrawer(DRAWER_ID);
    };
  }, [isOpen, openDrawer, closeDrawer, zIndex]);
  // State for file upload
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Generate file preview if it's a CSV or text file
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            // Parse lines of CSV for preview
            const content = e.target.result;
            const lines = content.split('\n')
              .filter(line => line.trim() !== '')
              .slice(0, 20); // Get up to 20 non-empty lines for a more comprehensive preview
            
            // Process CSV data
            if (lines.length > 0) {
              // Check if the CSV has the required columns
              const headers = lines[0].split(',');
              if (headers.some(h => h.trim().toLowerCase() === 'segment id' || h.trim().toLowerCase() === 'name')) {
                setFilePreview(lines);
              } else {
                // If no required columns, show a helpful error
                setFilePreview(['The file must contain "Segment ID" and "Name" columns']);
              }
            } else {
              setFilePreview(['No data found in the file']);
            }
          } catch (error) {
            console.error('Error parsing CSV:', error);
            setFilePreview(['Error parsing file']);
          }
        };
        reader.readAsText(selectedFile);
      } else if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        // Handle Excel files with SheetJS/xlsx
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get the first worksheet
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            
            // Process data for preview
            if (jsonData.length > 0) {
              // Check for required columns in headers
              const headers = jsonData[0];
              const hasRequiredColumns = headers.some(h => 
                String(h).toLowerCase().includes('segment id') || 
                String(h).toLowerCase().includes('name')
              );
              
              if (hasRequiredColumns) {
                // Convert up to 20 rows to comma-separated strings for the table rendering
                const previewRows = jsonData.slice(0, 20).map(row => row.join(','));
                setFilePreview(previewRows);
              } else {
                setFilePreview(['The file must contain "Segment ID" and "Name" columns']);
              }
            } else {
              setFilePreview(['No data found in the file']);
            }
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            setFilePreview(['Error parsing Excel file']);
          }
        };
        reader.readAsArrayBuffer(selectedFile);
      }
    }
  };
  
  // Handle drag events
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
    
    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      
      // Generate file preview for dropped file
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            // Parse lines of CSV for preview
            const content = e.target.result;
            const lines = content.split('\n')
              .filter(line => line.trim() !== '')
              .slice(0, 20); // Get up to 20 non-empty lines for a more comprehensive preview
            
            // Process CSV data
            if (lines.length > 0) {
              // Check if the CSV has the required columns
              const headers = lines[0].split(',');
              if (headers.some(h => h.trim().toLowerCase() === 'segment id' || h.trim().toLowerCase() === 'name')) {
                setFilePreview(lines);
              } else {
                // If no required columns, show a helpful error
                setFilePreview(['The file must contain "Segment ID" and "Name" columns']);
              }
            } else {
              setFilePreview(['No data found in the file']);
            }
          } catch (error) {
            console.error('Error parsing CSV:', error);
            setFilePreview(['Error parsing file']);
          }
        };
        reader.readAsText(droppedFile);
      } else if (droppedFile.name.endsWith('.xlsx') || droppedFile.name.endsWith('.xls')) {
        // Handle Excel files with SheetJS/xlsx
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get the first worksheet
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            
            // Process data for preview
            if (jsonData.length > 0) {
              // Check for required columns in headers
              const headers = jsonData[0];
              const hasRequiredColumns = headers.some(h => 
                String(h).toLowerCase().includes('segment id') || 
                String(h).toLowerCase().includes('name')
              );
              
              if (hasRequiredColumns) {
                // Convert up to 20 rows to comma-separated strings for the table rendering
                const previewRows = jsonData.slice(0, 20).map(row => row.join(','));
                setFilePreview(previewRows);
              } else {
                setFilePreview(['The file must contain "Segment ID" and "Name" columns']);
              }
            } else {
              setFilePreview(['No data found in the file']);
            }
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            setFilePreview(['Error parsing Excel file']);
          }
        };
        reader.readAsArrayBuffer(droppedFile);
      }
    }
  };
  
  // Handle file removal
  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };
  
  // Handle template download
  const handleDownloadTemplate = () => {
    // Create a sample template file
    const headers = ["Segment ID", "Name"];
    const sampleData = [
      ["200", "dues and subscriptions"],
      ["300", "fuel and gas"],
      ["100", "travel"]
    ];
    
    // Create workbook using SheetJS
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    XLSX.utils.book_append_sheet(wb, ws, "Chart of Accounts");
    
    // Generate and download the file
    XLSX.writeFile(wb, "Chart_of_Accounts_Template.xlsx");
    console.log('Template downloaded');
  };
  
  // Handle save and continue
  const handleSaveAndContinue = () => {
    // Process the file (in a real application, this would parse and validate the file)
    console.log('Save and continue clicked with file:', file);
    
    // Call the onImport callback if provided
    if (onImport && typeof onImport === 'function') {
      onImport(file);
    }
    
    // Close the drawer
    onClose();
  };
  
  // Footer with Cancel and Save & continue buttons
  const footerContent = (
    <div className="flex justify-between items-center w-full">
      <button
        onClick={onClose}
        className="px-6 py-2 rounded-lg font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={handleSaveAndContinue}
        disabled={!file}
        className={`px-6 py-2 rounded-lg font-medium transition-colors ${
          file
            ? "bg-[#FF6B00] text-white hover:bg-[#E86000]"
            : "bg-gray-200 text-gray-600 cursor-not-allowed"
        }`}
      >
        Save & continue
      </button>
    </div>
  );
  
  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Import Chart of Accounts"
      description="Import your chart of accounts to set up your financial structure."
      footer={footerContent}
      width="md:w-1/2"
      id={DRAWER_ID}
      zIndex={zIndex}
      position="right"
    >
      <style>{scrollbarStyles}</style>
      <div className="space-y-8 py-4">
        {/* Section 1: Download and fill our template */}
        <div>
          <h3 className="text-lg font-medium mb-3">1. Download and fill our template</h3>
          <p className="text-gray-600 text-sm mb-4">
            Download your chart of accounts and copy over the expense and asset account names and IDs you 
            want to use to classify your Stride transactions.
          </p>
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download size={16} className="mr-2" />
            Download template
          </button>
        </div>
        
        {/* Section 2: Upload completed template */}
        <div>
          <h3 className="text-lg font-medium mb-3">2. Upload completed template</h3>
          <p className="text-gray-600 text-sm mb-4">
            After you've filled out the template, upload it here 👇
          </p>
          <p className="text-gray-600 text-sm mb-4">
            The file should include the columns "Segment ID" and "Name"
          </p>
          
          {!file ? (
            <>
              {/* File upload area */}
              <label className="cursor-pointer block w-full">
                <div
                  className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center ${
                    isDragging ? 'border-[#FF6B00] bg-orange-50' : 'border-gray-300'
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  style={{ minHeight: '140px' }}
                >
                  <Upload className="text-gray-400 mb-2" size={20} />
                  <div className="text-gray-600 text-sm flex items-center justify-center">
                    <span>Upload your CSV or XLSX file</span>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                  />
                </div>
              </label>
            </>
          ) : (
            // File selected view
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded mr-3">
                    <Upload size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{file.name}</p>
                    <p className="text-gray-500 text-xs">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Remove file"
                >
                  <XCircle size={18} />
                </button>
              </div>
              
              {/* File preview section */}
              {filePreview && (
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-2">File Preview:</h4>
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                    {/* Check if filePreview is just an error message */}
                    {filePreview.length === 1 && !filePreview[0].includes(',') ? (
                      <div className="text-red-500 px-4 py-3 bg-red-50 border-l-4 border-red-500">{filePreview[0]}</div>
                    ) : (
                      <div className="overflow-x-auto">
                        <div className="max-h-72 overflow-y-auto custom-scrollbar">
                          <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="sticky top-0 bg-gray-50 z-10">
                              <tr>
                                {filePreview[0]?.split(',').map((header, idx) => (
                                  <th 
                                    key={idx} 
                                    className="text-left py-3 px-4 font-medium text-gray-700 tracking-wider bg-gray-50 border-b"
                                  >
                                    {header.trim()}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {filePreview.slice(1).map((line, lineIndex) => (
                                <tr 
                                  key={lineIndex} 
                                  className={lineIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                  {line.split(',').map((cell, cellIndex) => (
                                    <td 
                                      key={cellIndex} 
                                      className="py-3 px-4 whitespace-nowrap text-gray-600"
                                    >
                                      {cell.trim()}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppDrawer>
  );
};

export default ImportChartOfAccountsDrawer;