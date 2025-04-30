import React, { useState, useId } from 'react';
import { Download, Upload, XCircle } from 'lucide-react';
import AppDrawer from './common/AppDrawer';
import { Z_INDEX_LEVELS } from '../contexts/DrawerContext';
import * as XLSX from 'xlsx';

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
 * CreateNewFieldDrawer component
 * Provides a UI for creating a new field for custom provider setup
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onSave - Function to call when a new field is created
 * @param {Function} props.onBack - Function to call when back button is clicked

 * @param {number} props.zIndex - Z-index for the drawer (default: Z_INDEX_LEVELS.BASE)
 * @returns {React.ReactElement} CreateNewFieldDrawer component
 */
const CreateNewFieldDrawer = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onBack,
  zIndex = Z_INDEX_LEVELS.BASE 
}) => {
  // Generate a unique ID for this drawer
  const generatedId = useId();
  const drawerId = `create-field-drawer-${generatedId}`;
  // State for form fields
  const [fieldName, setFieldName] = useState('');
  const [fieldType, setFieldType] = useState('');
  const [isRequiredForExport, setIsRequiredForExport] = useState(false);
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState(null);

  // Handle field name change
  const handleFieldNameChange = (e) => {
    setFieldName(e.target.value);
  };

  // Handle field type selection
  const handleFieldTypeChange = (type) => {
    // Only allow field type selection if a field name has been entered
    if (!fieldName) return;
    setFieldType(type);
  };

  // Handle required for export toggle
  const handleRequiredToggle = () => {
    // Only allow toggle if field name has been entered
    if (!fieldName) return;
    setIsRequiredForExport(!isRequiredForExport);
  };

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
              setFilePreview(['The file appears to be empty']);
            }
          } catch (error) {
            console.error('Error parsing file:', error);
            setFilePreview(['Error parsing file. Please check the file format.']);
          }
        };
        reader.readAsText(selectedFile);
      } else if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || selectedFile.name.endsWith('.xlsx')) {
        // Handle Excel files
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Get the first worksheet
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            
            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            // Filter out empty rows and take up to 20 rows
            const rows = jsonData.filter(row => row.length > 0).slice(0, 20);
            
            if (rows.length > 0) {
              // Check if the Excel file has the required columns
              const headers = rows[0];
              if (headers.some(h => (typeof h === 'string' && (h.trim().toLowerCase() === 'segment id' || h.trim().toLowerCase() === 'name')))) {
                setFilePreview(rows.map(row => row.join(',')));
              } else {
                setFilePreview(['The file must contain "Segment ID" and "Name" columns']);
              }
            } else {
              setFilePreview(['The file appears to be empty']);
            }
          } catch (error) {
            console.error('Error parsing Excel file:', error);
            setFilePreview(['Error parsing file. Please check the file format.']);
          }
        };
        reader.readAsArrayBuffer(selectedFile);
      } else {
        setFilePreview(['Unsupported file format. Please upload a CSV or Excel file.']);
      }
    }
  };

  // Handle drag events for file upload
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Use the same file handling as in onChange
      const fileInput = { target: { files: e.dataTransfer.files } };
      handleFileChange(fileInput);
    }
  };

  // Handle template download
  const handleDownloadTemplate = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Create data with headers and sample row
    const wsData = [
      ['Segment ID', 'Name', 'Description'],
      ['1', 'Sample ' + fieldName, 'Description for ' + fieldName]
    ];
    
    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Additional Fields");
    
    // Generate and download the file
    XLSX.writeFile(wb, `${fieldName}_Template.xlsx`);
    console.log('Template downloaded');
  };

  // Handle save button
  const handleSave = () => {
    // Prepare field data
    const fieldData = {
      name: fieldName,
      type: fieldType,
      isRequiredForExport,
      file: file
    };
    
    // Call the onSave callback if provided
    if (onSave && typeof onSave === 'function') {
      onSave(fieldData);
    }
    
    // Close the drawer
    onClose();
  };

  // Check if save button should be enabled
  const isSaveEnabled = fieldName !== '';

  // Render the footer buttons based on form completion
  const footerContent = (
    <div className="flex justify-between items-center w-full">
      <button
        onClick={onClose}
        className="px-6 py-2 rounded-lg font-medium text-gray-600 border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <div className="flex space-x-3">
        <button
          onClick={() => {
            if (onSave) {
              onSave({
                name: fieldName,
                type: fieldType,
                isRequiredForExport,
                file
              }, true); // Pass true to indicate "save and add another"
            }
            setFieldName('');
            setFieldType('');
            setIsRequiredForExport(false);
            setFile(null);
            setFilePreview(null);
          }}
          disabled={!isSaveEnabled}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isSaveEnabled
              ? "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Save & add another field
        </button>
        <button
          onClick={handleSave}
          disabled={!isSaveEnabled}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isSaveEnabled
              ? "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );

  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}
      title="Create new field"
      footer={footerContent}
      width="md:w-1/2"
      zIndex={zIndex}
      id={drawerId}
      showBackButton={true}
      headerPrefix="Back"
    >
      <div className="space-y-8">
        {/* Add custom scrollbar styles */}
        <style>{scrollbarStyles}</style>
        
        {/* Section 1: Name your field */}
        <div>
          <h3 className="text-base font-medium mb-2">1. Name your field</h3>
          <input
            type="text"
            placeholder="Additional field name (Customer, Project, Conference, etc.)"
            className="w-full p-2 border-b border-gray-300 focus:outline-none mb-4"
            value={fieldName}
            onChange={handleFieldNameChange}
          />
        </div>
        
        {/* Section 2: Choose a field type */}
        <div>
          <h3 className="text-base font-medium mb-2">2. Choose a field type</h3>
          <div className="space-y-2">
            <div 
              className={`bg-white border border-gray-200 rounded ${!fieldName ? 'opacity-50' : ''}`}
            >
              <div 
                className={`p-3 flex justify-between items-center ${fieldName ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={() => handleFieldTypeChange('single-select')}
              >
                <div>
                  <p className="text-sm text-gray-700">Single select</p>
                  <p className="text-xs text-gray-500">Select from a list of options.</p>
                </div>
                <div className="rounded-full w-4 h-4 flex items-center justify-center">
                  {fieldType === 'single-select' ? (
                    <div className="w-4 h-4 bg-black rounded-full"></div>
                  ) : (
                    <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
            
            <div 
              className={`bg-white border border-gray-200 rounded ${!fieldName ? 'opacity-50' : ''}`}
            >
              <div 
                className={`p-3 flex justify-between items-center ${fieldName ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                onClick={() => handleFieldTypeChange('text-field')}
              >
                <div>
                  <p className="text-sm text-gray-700">Text field</p>
                  <p className="text-xs text-gray-500">A line of free text.</p>
                </div>
                <div className="rounded-full w-4 h-4 flex items-center justify-center">
                  {fieldType === 'text-field' ? (
                    <div className="w-4 h-4 bg-black rounded-full"></div>
                  ) : (
                    <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <p className={`mt-4 text-xs text-gray-700 mb-2 ${!fieldName ? 'opacity-50' : ''}`}>Do you want to require this field to be coded in order to be exported?</p>
          <div 
            className={`flex items-center bg-gray-100 p-3 rounded-md ${fieldName ? 'cursor-pointer' : 'cursor-not-allowed'} ${!fieldName ? 'opacity-50' : ''}`}
            onClick={handleRequiredToggle}
          >
            <div className="rounded-full w-5 h-5 bg-gray-400 flex items-center justify-center mr-2">
              {isRequiredForExport && <X size={12} className="text-white" />}
            </div>
            <span className="text-sm text-gray-700">Required for export</span>
          </div>
        </div>
        
        {/* Sections 3 and 4 - Only show when field type is 'single-select' */}
        {fieldType === 'single-select' && (
          <>
            {/* Section 3: Download template */}
            <div>
              <h3 className="text-base font-medium mb-4">3. Download template</h3>
              <p className="text-sm text-gray-600 mb-4">
                Export a CSV file with your additional transaction fields names and IDs.
              </p>
              <button
                onClick={handleDownloadTemplate}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={16} className="mr-2" />
                Download template
              </button>
            </div>
            
            {/* Section 4: Upload completed template */}
            <div>
              <h3 className="text-base font-medium mb-4">4. Upload completed template</h3>
              <p className="text-sm text-gray-600 mb-2">
                After you've filled out the template, upload it here 👇
              </p>
              <p className="text-xs text-gray-500 mb-4">
                The file should include the columns "Segment ID" and "Name"
              </p>
              
              {/* File upload area */}
              {file ? (
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
                      onClick={() => {
                        setFile(null);
                        setFilePreview(null);
                      }}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Remove file"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <label htmlFor="file-upload" className="cursor-pointer block w-full">
                  <div
                    className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center ${
                      isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
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
                      accept=".csv,.xlsx"
                      onChange={handleFileChange}
                      id="file-upload"
                    />
                  </div>
                </label>
              )}
              
              {/* File preview if available */}
              {filePreview && filePreview.length > 0 && (
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
          </>
        )}
      </div>
    </AppDrawer>
  );
};

export default CreateNewFieldDrawer;