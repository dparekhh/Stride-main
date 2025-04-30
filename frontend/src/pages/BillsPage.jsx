// src/pages/BillsPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { 
  MoreVertical, Calendar, ChevronDown, Download, Grid, Search, Plus, 
  Mail, FileText, PenLine, Table, Upload, X, Loader, Eye, Filter, Settings,
  ClipboardList, FileCheck, FileX, CreditCard, History, BarChart, RefreshCcw
} from "lucide-react";
import { isAllowedFileType, getActionButton } from "../utils/helpers.jsx";
import { useNotification } from "../contexts/NotificationContext";
import { sampleBillsData } from "../utils/data";
import InvoicePreview from "../components/InvoicePreview";
import BillManager from "../components/BillManager";
import RecurringBillsDrawer from "../components/RecurringBillsDrawer";
import { PageLayout, PageTable } from "../components/common/page-layout";

/**
 * BillsPage component
 * Dedicated page component for the Bills section following the standard architectural pattern
 */
const BillsPage = () => {
  // Get notification context
  const { showSuccess, showError, showInfo } = useNotification();
  
  // State for the active subtab
  const [activeSubtab, setActiveSubtab] = useState('overview');
  
  // State for recurring bills drawer
  const [isRecurringBillsDrawerOpen, setIsRecurringBillsDrawerOpen] = useState(false);
  
  // States for file handling
  const [showFileUploadSection, setShowFileUploadSection] = useState(false);
  const [processingFile, setProcessingFile] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [uploadedInvoice, setUploadedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBill, setSelectedBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNewBillMenu, setShowNewBillMenu] = useState(false);
  const [showThreeDotsMenu, setShowThreeDotsMenu] = useState(false);
  
  const fileInputRef = useRef(null);
  const newBillMenuRef = useRef(null);
  const threeDotsMenuRef = useRef(null);

  // Define subtabs
  const subtabs = [
    { id: 'overview', label: 'Overview', icon: ClipboardList },
    { id: 'draft', label: 'Draft', icon: FileText },
    { id: 'for_approval', label: 'For Approval', icon: FileCheck },
    { id: 'for_payment', label: 'For Payment', icon: CreditCard },
    { id: 'history', label: 'History', icon: History }
  ];

  // Filter bills based on the active subtab
  const getFilteredBills = () => {
    if (activeSubtab === 'overview') {
      // Show all bills in the Overview tab
      return sampleBillsData;
    } else if (activeSubtab === 'draft') {
      // Show only draft bills
      return sampleBillsData.filter(bill => bill.status === 'draft');
    } else if (activeSubtab === 'for_approval') {
      // Show bills pending approval
      return sampleBillsData.filter(bill => bill.status === 'for_approval');
    } else if (activeSubtab === 'for_payment') {
      // Show bills that are approved but not paid
      return sampleBillsData.filter(bill => bill.status === 'approved');
    } else if (activeSubtab === 'history') {
      // Show bills that have been paid
      return sampleBillsData.filter(bill => bill.status === 'paid');
    }
    
    // Default to all bills
    return sampleBillsData;
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isAllowedFileType(file)) {
      setProcessingFile(true);
      setUploadedFile(file);
      
      // Create a preview URL for the image file
      const filePreview = file.type.includes('pdf') ? null : URL.createObjectURL(file);
      
      // Update invoice data for preview
      setUploadedInvoice({
        file: file,
        name: file.name,
        type: file.type,
        preview: filePreview
      });
      
      // Simulate processing delay
      setTimeout(() => {
        setProcessingFile(false);
        setUploadStatus('success');
        
        // Don't show the local invoice preview anymore
        // We'll emit an event for App.jsx to handle this with NewBill component
        setShowFileUploadSection(false);
        
        // Dispatch a file upload event to be caught by App.jsx
        window.dispatchEvent(new CustomEvent('fileUploaded', { detail: { file } }));
      }, 1000);
    } else {
      showError("Unsupported file type. Please upload a PDF or image file.");
    }
    
    // Reset file input to allow selecting the same file again
    e.target.value = '';
  };

  // Handle file selection from BillManager
  const handleFileUploadFromManager = (e) => {
    // Handle file upload from BillManager component
    handleFileSelect(e);
  };

  // Function to show/clear file upload section
  const toggleFileUploadSection = () => {
    setShowFileUploadSection(!showFileUploadSection);
    if (showFileUploadSection) {
      // Clear previous upload data when toggling off
      setUploadedFile(null);
      setUploadStatus(null);
    }
  };

  // Function to trigger file upload dialog
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle outside clicks for menus
  useEffect(() => {
    function handleClickOutside(event) {
      if (newBillMenuRef.current && !newBillMenuRef.current.contains(event.target)) {
        setShowNewBillMenu(false);
      }
      if (threeDotsMenuRef.current && !threeDotsMenuRef.current.contains(event.target)) {
        setShowThreeDotsMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle events from other components
  useEffect(() => {
    const handleToggleThreeDotsMenu = (event) => {
      // Only handle if it's for our three dots menu
      if (event.detail?.buttonRef === threeDotsMenuRef) {
        setShowThreeDotsMenu(!showThreeDotsMenu);
      }
    };

    window.addEventListener('toggleThreeDotsMenu', handleToggleThreeDotsMenu);
    
    return () => {
      window.removeEventListener('toggleThreeDotsMenu', handleToggleThreeDotsMenu);
    };
  }, [showThreeDotsMenu]);

  // New bill button options handler
  const handleNewBillOption = (option) => {
    setShowNewBillMenu(false);
    
    if (option === "upload") {
      handleUploadClick();
    } else if (option === "manual") {
      // Navigate to new bill page via event (App.jsx will handle navigation)
      window.dispatchEvent(new CustomEvent('showNewBillPage'));
    } else if (option === "recurring") {
      setIsRecurringBillsDrawerOpen(true);
    } else if (option === "spreadsheet") {
      // Trigger spreadsheet upload dialog via event
      window.dispatchEvent(new CustomEvent('showSpreadsheetUpload'));
    }
  };

  // Handle three dots menu options
  const handleThreeDotsMenuOption = (option) => {
    setShowThreeDotsMenu(false);
    
    if (option === "settings") {
      // Open settings for the Bills tab via event with permissions tab active
      window.dispatchEvent(new CustomEvent('openSettings', { detail: { tab: 'permissions' } }));
    } else if (option === "download_report") {
      showSuccess("Bill report downloaded successfully");
    }
  };

  // Function to refresh bills data
  const refreshBills = () => {
    setLoading(true);
    // For now, just simulate a refresh with a timeout
    setTimeout(() => {
      setLoading(false);
      showSuccess("Bills refreshed successfully!");
    }, 800);
  };

  // Handle opening settings
  const handleOpenSettings = (tab) => {
    // This will be handled through the App.jsx root component
    window.dispatchEvent(new CustomEvent('openSettings', { detail: { tab } }));
  };

  // Create action buttons for the header
  const actionButtons = [
    // Three dots menu
    <div className="relative" ref={threeDotsMenuRef} key="three-dots-menu">
      <button 
        className="p-2 rounded-md hover:bg-gray-100 three-dots-button"
        onClick={() => setShowThreeDotsMenu(!showThreeDotsMenu)}
        aria-label="More options"
      >
        <MoreVertical size={20} />
      </button>
      {showThreeDotsMenu && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
          <div className="p-3">
            <div
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleThreeDotsMenuOption("download_report")}
            >
              <BarChart size={16} className="mr-3 text-gray-600" />
              <span>Download bill report</span>
            </div>
            <div
              className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleThreeDotsMenuOption("settings")}
            >
              <Settings size={16} className="mr-3 text-gray-600" />
              <span>Bill settings</span>
            </div>
          </div>
        </div>
      )}
    </div>,
    
    // Recurring Bill button
    <div className="relative" key="recurring-bill-button">
      <button
        className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md flex items-center recurring-bill-button"
        onClick={() => setIsRecurringBillsDrawerOpen(true)}
      >
        <RefreshCcw size={16} className="mr-2" />
        Recurring Bill
      </button>
    </div>,
    
    // New Bill button
    <div className="relative" ref={newBillMenuRef} key="new-bill-button">
      <button
        className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md flex items-center new-bill-button"
        onClick={() => setShowNewBillMenu(!showNewBillMenu)}
      >
        <Plus size={16} className="mr-2" />
        New Bill
        <ChevronDown size={16} className="ml-2" />
      </button>
      {showNewBillMenu && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10 p-4">
          <div className="flex flex-col space-y-4">
            {/* Upload bill section */}
            <div>
              <div className="flex items-center mb-2">
                <button 
                  className="flex items-center text-gray-700 font-medium"
                  onClick={() => handleNewBillOption("upload")}
                >
                  <Upload size={16} className="mr-2 text-gray-600" />
                  <span>Select invoices to upload</span>
                </button>
              </div>
              <div className="border border-dashed border-gray-300 rounded-lg p-5 bg-gray-50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100"
                   onClick={() => handleNewBillOption("upload")}>
                <div className="text-gray-500 mb-2">
                  <Upload size={24} className="mx-auto mb-2" />
                  Drop invoices over the page or click to select
                </div>
                <p className="text-xs text-gray-400">Upload your PDF, PNG, or JPG files. Up to 50 MB per file.</p>
              </div>
            </div>
            
            {/* Spreadsheet option */}
            <div 
              className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md"
              onClick={() => handleNewBillOption("spreadsheet")}
            >
              <div className="flex items-center">
                <Table size={16} className="mr-3 text-gray-600" />
                <span>Create bills via spreadsheet</span>
              </div>
              <ChevronDown className="transform rotate-270 text-gray-400" size={16} />
            </div>
            
            {/* Manual option */}
            <div 
              className="flex items-center justify-between p-2 hover:bg-gray-100 cursor-pointer rounded-md"
              onClick={() => handleNewBillOption("manual")}
            >
              <div className="flex items-center">
                <PenLine size={16} className="mr-3 text-gray-600" />
                <span>Create bill without invoice</span>
              </div>
              <ChevronDown className="transform rotate-270 text-gray-400" size={16} />
            </div>
          </div>
        </div>
      )}
    </div>
  ];

  // Calculate bill counts for each subtab
  const getBillCount = (status) => {
    if (status === 'overview') {
      return sampleBillsData.length;
    } else if (status === 'draft') {
      return sampleBillsData.filter(bill => bill.status === 'draft').length;
    } else if (status === 'for_approval') {
      return sampleBillsData.filter(bill => bill.status === 'for_approval').length;
    } else if (status === 'for_payment') {
      return sampleBillsData.filter(bill => bill.status === 'approved').length;
    } else if (status === 'history') {
      return sampleBillsData.filter(bill => bill.status === 'paid').length;
    }
    return 0;
  };

  // Format subtabs for the PageLayout component with standardized format
  const formattedSubtabs = subtabs.map(subtab => ({
    id: subtab.id,
    label: subtab.label,
    icon: subtab.icon,
    count: getBillCount(subtab.id)
  }));

  // Define columns for column management
  const columns = [
    { id: 'vendor', label: 'Vendor' },
    { id: 'amount', label: 'Amount' },
    { id: 'invoiceDate', label: 'Invoice Date' },
    { id: 'invoiceNumber', label: 'Invoice #' },
    { id: 'invoice', label: 'Invoice' },
    { id: 'department', label: 'Department' },
    { id: 'dueDate', label: 'Due Date' },
    { id: 'status', label: 'Status' },
    { id: 'actions', label: 'Actions' }
  ];

  // Default visible columns
  const defaultVisibleColumns = ['vendor', 'amount', 'invoiceDate', 'invoiceNumber', 'invoice', 'department', 'dueDate', 'status', 'actions'];

  // Handle column visibility changes
  const handleColumnVisibilityChange = (columnId, isVisible) => {
    console.log(`Column ${columnId} visibility changed to ${isVisible}`);
    // In a real implementation, this would update some state to track visible columns
  };

  // Handle filter changes
  const handleFilterChange = (filterId) => {
    console.log(`Filter selected: ${filterId}`);
    // In a real implementation, this would apply the selected filter
  };

  // Handle date range changes
  const handleDateRangeChange = (dateRange) => {
    console.log('Date range changed:', dateRange);
    // In a real implementation, this would update the date range filter
  };

  // Handle download action
  const handleDownload = () => {
    showSuccess("Bills data downloaded successfully");
    // In a real implementation, this would trigger a download of the current bills data
  };

  return (
    <PageLayout
      pageTitle="Bill Pay"
      heading="Bills"
      actions={actionButtons}
      subtabs={formattedSubtabs}
      activeSubtab={activeSubtab}
      onSubtabChange={setActiveSubtab}
      showSearchBar={true}
      showActionButtons={true}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      columns={columns}
      defaultVisibleColumns={defaultVisibleColumns}
      onColumnVisibilityChange={handleColumnVisibilityChange}
      onFilterChange={handleFilterChange}
      onDateRangeChange={handleDateRangeChange}
      onDownload={handleDownload}
    >
      {/* Use the BillManager component with filtered bills based on active subtab
          but without its own search and action buttons since we're using the standardized ones */}
      <BillManager 
        bills={getFilteredBills()}
        loading={loading}
        error={null}
        onRefresh={refreshBills}
        uploadLoading={processingFile}
        uploadError={uploadStatus === 'error' ? "Failed to upload file" : null}
        handleFileUpload={handleFileUploadFromManager}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setSelectedBill={setSelectedBill}
        onSettingsOpen={handleOpenSettings}
      />

      {/* Invoice Preview Modal */}
      {showInvoicePreview && uploadedInvoice && (
        <InvoicePreview
          showInvoicePreview={showInvoicePreview}
          setShowInvoicePreview={setShowInvoicePreview}
          uploadedInvoice={uploadedInvoice}
          setUploadedInvoice={setUploadedInvoice}
        />
      )}

      {/* Recurring Bills Drawer */}
      <RecurringBillsDrawer
        isOpen={isRecurringBillsDrawerOpen}
        onClose={() => setIsRecurringBillsDrawerOpen(false)}
      />

      {/* Hidden file input for bill upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
      />
    </PageLayout>
  );
};

export default BillsPage;