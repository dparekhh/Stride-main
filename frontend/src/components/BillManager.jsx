import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  MoreVertical, 
  Filter, 
  BarChart, 
  Settings, 
  Upload, 
  PenLine, 
  FileText, 
  Table, 
  Plus, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Search
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner.jsx";
import { isAllowedFileType, getHumanReadableFileSize } from "../utils/helpers";
import { useNotification } from "../contexts/NotificationContext";

/**
 * BillManager component for managing bills in the Bill Pay section
 * Handles bill listing, search, filtering, and new bill creation 
 */
const BillManager = ({ 
  bills = [], 
  loading, 
  error, 
  onRefresh, 
  uploadLoading, 
  uploadError, 
  handleFileUpload, 
  searchTerm, 
  setSearchTerm, 
  setSelectedBill,
  onSettingsOpen,
  activeSubtab = 'overview'
}) => {
  // State for new bill dropdown
  const [isNewBillMenuOpen, setIsNewBillMenuOpen] = useState(false);
  const [isThreeDotsMenuOpen, setIsThreeDotsMenuOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error'
  const [uploadMessage, setUploadMessage] = useState('');
  
  // Refs
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);
  const newBillMenuRef = useRef(null);
  const threeDotsMenuRef = useRef(null);
  
  // React Router navigate hook
  const navigate = useNavigate();
  
  // Get notification context
  const { showSuccess, showError, showInfo } = useNotification();


  const toggleThreeDotsMenu = () => {
    setIsThreeDotsMenuOpen(!isThreeDotsMenuOpen);
  };

  const toggleNewBillMenu = () => {
    setIsNewBillMenuOpen(!isNewBillMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close menus when clicking outside of them
      if (isThreeDotsMenuOpen && 
          !event.target.closest('.three-dots-menu') && 
          !event.target.closest('[aria-label="More options"]')) {
        setIsThreeDotsMenuOpen(false);
      }
      
      if (isNewBillMenuOpen && 
          !event.target.closest('.new-bill-menu') && 
          !event.target.closest('.new-bill-button')) {
        setIsNewBillMenuOpen(false);
      }
    };

    // Add event listener to document
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isThreeDotsMenuOpen, isNewBillMenuOpen]);

  // State to store the position of buttons
  const [threeDotsPosition, setThreeDotsPosition] = useState({ top: 60, left: 0 });
  const [newBillPosition, setNewBillPosition] = useState({ top: 60, right: 20 });
  
  // Listen for events from BillsPage component
  useEffect(() => {
    // Listen for toggleNewBillMenu events
    const handleToggleNewBillMenu = (event) => {
      // Get the button reference from the event detail
      const buttonRef = event.detail?.buttonRef?.current;
      
      if (buttonRef) {
        // Calculate position relative to the button
        const rect = buttonRef.getBoundingClientRect();
        setNewBillPosition({
          top: rect.height,
          right: 20 // Keep some margin from the right edge
        });
      }
      
      toggleNewBillMenu();
    };
    
    // Listen for toggleThreeDotsMenu events
    const handleToggleThreeDotsMenu = (event) => {
      // Get the button reference from the event detail
      const buttonRef = event.detail?.buttonRef?.current;
      
      if (buttonRef) {
        // Calculate position relative to the button
        const rect = buttonRef.getBoundingClientRect();
        setThreeDotsPosition({
          top: rect.height,
          left: 0 // Align with the left edge of the button
        });
      }
      
      toggleThreeDotsMenu();
    };
    
    window.addEventListener('toggleNewBillMenu', handleToggleNewBillMenu);
    window.addEventListener('toggleThreeDotsMenu', handleToggleThreeDotsMenu);
    
    return () => {
      window.removeEventListener('toggleNewBillMenu', handleToggleNewBillMenu);
      window.removeEventListener('toggleThreeDotsMenu', handleToggleThreeDotsMenu);
    };
  }, []);
  
  // Handle file drop area events
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add('border-blue-500');
      dropAreaRef.current.classList.add('border-dashed');
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('border-blue-500');
      dropAreaRef.current.classList.add('border-gray-300');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('border-blue-500');
    }
    
    // If we have files in the drop event, process the first one
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFileSelect(event.dataTransfer.files[0]);
    }
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) return;
    
    // Check if the file type is allowed
    if (isAllowedFileType(file)) {
      setSelectedFile(file);
      setFileUploadError(null);
      setUploadStatus('processing');
      setUploadMessage('Processing file...');
      
      // Actually triggering the file upload and processing
      // would be done here in a real implementation
      
      // For demo purposes, we'll simulate success after a delay
      setTimeout(() => {
        setUploadStatus('success');
        setUploadMessage('File processed successfully!');
        
        // REMOVED: No need to show notification here, useFileUpload will handle that
        // showSuccess('File successfully uploaded!');
        
        // Create a new custom event to let parent App.jsx know we've uploaded a file
        const customEvent = new CustomEvent('fileUploaded', { 
          detail: { file: file } 
        });
        window.dispatchEvent(customEvent);
        
        // Clear status after 5 seconds
        setTimeout(() => {
          setUploadStatus('idle');
          setUploadMessage('');
        }, 5000);
      }, 2000);
    } else {
      setSelectedFile(null);
      setFileUploadError('Invalid file type. Please use PDF, PNG, or JPG files.');
      setUploadStatus('error');
      setUploadMessage('Invalid file type. Please use PDF, PNG, or JPG files.');
      
      // Notify user
      showError('Invalid file type. Please use PDF, PNG, or JPG files.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Three dots dropdown menu - positioned correctly relative to button in BillsPage */}
      {isThreeDotsMenuOpen && (
        <div className="fixed w-56 bg-white rounded-md shadow-lg z-50 py-1 three-dots-menu" style={{
          top: `${threeDotsPosition.top + 40}px`, 
          left: `${window.innerWidth - 330}px`
        }}>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => {
              console.log('Download AP aging report');
              setIsThreeDotsMenuOpen(false);
            }}
          >
            <BarChart size={16} className="mr-2" />
            Download AP aging report
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            onClick={() => {
              onSettingsOpen && onSettingsOpen('permissions');
              setIsThreeDotsMenuOpen(false);
            }}
          >
            <Settings size={16} className="mr-2" />
            Settings
          </button>
        </div>
      )}

      {/* Search bar and action buttons are now handled by PageLayout */}

      {/* New Bill dropdown menu - positioned correctly relative to the button in BillsPage */}
      {isNewBillMenuOpen && (
        <div className="fixed w-80 bg-white rounded-md shadow-lg z-50 py-4 px-3 new-bill-menu" style={{
          top: `${newBillPosition.top + 40}px`, 
          right: `20px`
        }}>
          {/* Non-clickable title with FileText icon */}
          <div className="text-gray-700 px-2 py-1 font-medium mb-1 flex items-center">
            <FileText size={16} className="mr-2" />
            <span>Select invoice to upload</span>
          </div>
          
          {/* Hidden file input for upload */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
          
          {/* Only file input area is clickable */}
          <div
            ref={dropAreaRef}
            className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center cursor-pointer transition-colors duration-200 mt-2"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            aria-label="Upload invoice file"
          >
            {selectedFile ? (
              <div className="flex items-center justify-between">
                <span className="truncate">{selectedFile.name}</span>
                <button
                  className="rounded-full w-5 h-5 flex items-center justify-center bg-gray-200 hover:bg-gray-300"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedFile(null);
                    setFileUploadError(null);
                    setUploadStatus('idle');
                    setUploadMessage('');
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-center">
                  <Upload size={24} className="text-gray-400 mb-2" />
                </div>
                <p>Upload invoice over the page or click to select</p>
                <p className="text-xs text-gray-500 mt-1">Upload your PDF, PNG, or JPG files.</p>
              </div>
            )}
          </div>
          
          {/* Add invoice manually option */}
          <div
            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer mt-3"
            onClick={() => {
              console.log('Create bill manually clicked');
              setIsNewBillMenuOpen(false);
              navigate('/bill-pay/create-bill');
            }}
          >
            <PenLine size={18} className="mr-2" />
            <span>Add invoice manually</span>
          </div>
          
          {/* Upload spreadsheet option */}
          <div
            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
            onClick={() => {
              console.log('Create drafts via spreadsheet clicked');
              setIsNewBillMenuOpen(false);
              window.dispatchEvent(new CustomEvent('showSpreadsheetUpload'));
            }}
          >
            <Table size={18} className="mr-2" />
            <span>Upload spreadsheet</span>
          </div>
          
          {/* Upload status indicator */}
          {uploadStatus !== 'idle' && (
            <div className={`mt-2 p-2 rounded text-sm ${
              uploadStatus === 'processing' ? 'bg-blue-50 text-blue-700' :
              uploadStatus === 'success' ? 'bg-green-50 text-green-700' :
              'bg-red-50 text-red-700'
            }`}>
              {uploadStatus === 'processing' && (
                <div className="flex items-center">
                  <LoadingSpinner size="small" className="mr-2" />
                  {uploadMessage}
                </div>
              )}
              {uploadStatus === 'success' && (
                <div className="flex items-center">
                  <CheckCircle size={14} className="mr-2" />
                  {uploadMessage}
                </div>
              )}
              {uploadStatus === 'error' && (
                <div className="flex items-center">
                  <AlertCircle size={14} className="mr-2" />
                  {uploadMessage}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error message if upload fails */}
      {uploadError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          <AlertCircle className="inline-block mr-2" size={16} />
          {uploadError}
        </div>
      )}

      {/* Bills table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Show appropriate state based on loading, error, and data */}
        {loading ? (
          <div className="py-16 text-center">
            <LoadingSpinner size="large" className="mb-4 mx-auto" />
            <p className="text-gray-600">Loading bills...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-md text-center">
            <AlertCircle className="mx-auto mb-3" size={36} />
            <p>{error}</p>
            <button onClick={onRefresh} className="mt-4 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-md">
              Try Again
            </button>
          </div>
        ) : !bills || bills.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="text-gray-300 mx-auto mb-4" size={56} />
            <p className="text-gray-600 text-lg">No bills found</p>
            <p className="text-sm text-gray-400 mt-2">Upload an invoice to get started</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-6 px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {activeSubtab === 'for_payment' || activeSubtab === 'history' ? (
                    <>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Date
                      </th>
                    </>
                  ) : null}
                  {activeSubtab === 'for_approval' || activeSubtab === 'for_payment' || activeSubtab === 'history' ? (
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Approval Status
                    </th>
                  ) : null}
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PO#
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bills.map(bill => (
                  <tr key={bill.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="font-medium text-gray-900">{bill.vendor_name}</div>
                          <div className="text-sm text-gray-500">{bill.vendor_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">₹ {bill.amount || '0.00'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div>{bill.issue_date || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{bill.invoice_number || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {bill.invoice_file ? (
                        <button 
                          className="text-blue-600 hover:text-blue-900 text-sm"
                          onClick={() => {
                            // View invoice file without notification
                          }}
                        >
                          View PDF
                        </button>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {bill.department || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex flex-col">
                        <span>{bill.due_date || '-'}</span>
                        {bill.status === 'overdue' && (
                          <span className="text-xs text-red-500">
                            Overdue
                          </span>
                        )}
                        {bill.status === 'due_soon' && (
                          <span className="text-xs text-yellow-500">
                            Due Soon
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1.5 text-xs font-medium rounded-full inline-flex items-center ${
                        bill.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                        bill.status === 'for_approval' ? 'bg-blue-100 text-blue-700' :
                        bill.status === 'approved' ? 'bg-green-100 text-green-700' :
                        bill.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        bill.status === 'paid' ? 'bg-purple-100 text-purple-700' :
                        bill.status === 'overdue' ? 'bg-red-100 text-red-700' : ''
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          bill.status === 'draft' ? 'bg-gray-500' :
                          bill.status === 'for_approval' ? 'bg-blue-500' :
                          bill.status === 'approved' ? 'bg-green-500' :
                          bill.status === 'rejected' ? 'bg-red-500' :
                          bill.status === 'paid' ? 'bg-purple-500' :
                          bill.status === 'overdue' ? 'bg-red-500' : ''
                        }`}></span>
                        {bill.status === 'for_approval' ? 'Pending Approval' :
                         bill.status === 'approved' ? 'Approved' :
                         bill.status === 'rejected' ? 'Rejected' :
                         bill.status === 'paid' ? 'Paid' :
                         bill.status === 'overdue' ? 'Overdue' :
                         bill.status === 'draft' ? 'Draft' : bill.status || 'Unknown'}
                      </span>
                    </td>
                    
                    {/* Conditional columns based on the active subtab */}
                    {(activeSubtab === 'for_payment' || activeSubtab === 'history') && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {bill.payment_status || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {bill.payment_date || '-'}
                        </td>
                      </>
                    )}
                    
                    {(activeSubtab === 'for_approval' || activeSubtab === 'for_payment' || activeSubtab === 'history') && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {bill.approval_status || '-'}
                      </td>
                    )}
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {bill.category || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {bill.po_number || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        className="px-3 py-1.5 text-primary hover:text-white hover:bg-primary border border-primary rounded-md transition-all duration-150 font-medium text-xs"
                        onClick={() => setSelectedBill && setSelectedBill(bill)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillManager;