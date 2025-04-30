import React, { useState, useRef, useEffect, useId } from 'react';
import { ArrowLeft, X, Upload, Download, CheckCircle, AlertCircle, ChevronDown, Plus, File } from 'lucide-react';
import { useDrawer, Z_INDEX_LEVELS } from '../contexts/DrawerContext';
import AppDrawer from './common/AppDrawer';
import * as XLSX from 'xlsx';

/**
 * CSVExportDrawer Component
 * 
 * This component is a drawer that allows users to customize their CSV exports
 * for different transaction types following the format in the documentation.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Flag to control if the drawer is open or closed
 * @param {Function} props.onClose - Function to call when drawer is closed
 * @param {Function} props.onBack - Function to call when back button is clicked
 */
const CSVExportDrawer = ({ isOpen, onClose, onBack }) => {
  // Generate a unique ID for this drawer
  const generatedId = useId();
  const drawerId = `csv-export-drawer-${generatedId}`;
  
  // Get drawer context for proper drawer management
  const { openDrawer, closeDrawer } = useDrawer();
  
  // Register/unregister drawer when opened/closed
  useEffect(() => {
    if (isOpen) {
      openDrawer(drawerId, Z_INDEX_LEVELS.LEVEL_2);
    } else {
      closeDrawer(drawerId);
    }
    
    return () => {
      closeDrawer(drawerId);
    };
  }, [isOpen, openDrawer, closeDrawer, drawerId]);
  
  // State for tracking selected export type
  const [exportType, setExportType] = useState('transactions'); // 'transactions', 'bills', 'billPayments'
  const [exportFormat, setExportFormat] = useState('singleLine'); // 'singleLine', 'doubleLine'
  const [selectedTab, setSelectedTab] = useState('getting-started'); // 'getting-started', 'template', 'columns'
  const [file, setFile] = useState(null);
  const [exportRefundsAsNegative, setExportRefundsAsNegative] = useState(true);
  
  // Reference for file input
  const fileInputRef = useRef(null);
  
  // Mock data for available column fields (in a real app, this would come from API or state)
  const availableColumns = {
    transactions: [
      { id: 'amount', name: 'Amount', content: 'Amount', required: true, visible: true },
      { id: 'date', name: 'Date', content: 'Transaction Date', required: true, visible: true },
      { id: 'account', name: 'Account', content: 'Account Name', required: true, visible: true },
      { id: 'description', name: 'Description', content: 'Description', required: false, visible: true },
      { id: 'merchant', name: 'Merchant', content: 'Merchant Name', required: false, visible: true },
      { id: 'category', name: 'Category', content: 'Category', required: false, visible: true },
      { id: 'receipt', name: 'Receipt', content: 'Receipt URL', required: false, visible: true },
      { id: 'memo', name: 'Memo', content: 'Memo', required: false, visible: false },
      { id: 'cardName', name: 'Card Name', content: 'Card Name', required: false, visible: false },
      { id: 'cardNumber', name: 'Card Number', content: 'Card Number', required: false, visible: false },
    ],
    bills: [
      { id: 'amount', name: 'Amount', content: 'Amount', required: true, visible: true },
      { id: 'invoiceNumber', name: 'Invoice Number', content: 'Invoice Number', required: true, visible: true },
      { id: 'billDate', name: 'Bill Date', content: 'Bill Date', required: true, visible: true },
      { id: 'account', name: 'Account', content: 'Account Name', required: true, visible: true },
      { id: 'vendor', name: 'Vendor', content: 'Vendor Name', required: true, visible: true },
      { id: 'description', name: 'Description', content: 'Description', required: false, visible: true },
      { id: 'dueDate', name: 'Due Date', content: 'Due Date', required: false, visible: true },
      { id: 'terms', name: 'Terms', content: 'Terms', required: false, visible: false },
    ],
    billPayments: [
      { id: 'amount', name: 'Amount', content: 'Amount', required: true, visible: true },
      { id: 'invoiceNumber', name: 'Invoice Number', content: 'Invoice Number', required: true, visible: true },
      { id: 'paymentId', name: 'Payment ID', content: 'Payment ID', required: true, visible: true },
      { id: 'paymentDate', name: 'Payment Date', content: 'Payment Date', required: true, visible: true },
      { id: 'account', name: 'Account', content: 'Account Name', required: true, visible: true },
      { id: 'vendor', name: 'Vendor', content: 'Vendor Name', required: true, visible: true },
      { id: 'paymentMethod', name: 'Payment Method', content: 'Payment Method', required: false, visible: true },
      { id: 'reference', name: 'Reference', content: 'Reference', required: false, visible: false },
    ]
  };
  
  // State for user's customized columns
  const [customColumns, setCustomColumns] = useState({
    transactions: [...availableColumns.transactions],
    bills: [...availableColumns.bills],
    billPayments: [...availableColumns.billPayments]
  });
  
  // Function to generate template based on current settings
  const handleDownloadTemplate = () => {
    // Get the current columns for the selected export type
    const columns = customColumns[exportType].filter(col => col.visible);
    
    // Create headers row
    const headers = columns.map(col => col.name);
    
    // Create sample data rows (2 rows for example)
    const sampleData = [];
    
    // For single line format
    if (exportFormat === 'singleLine') {
      // Different sample data based on export type
      if (exportType === 'transactions') {
        sampleData.push(
          headers.map(header => {
            switch(header) {
              case 'Amount': return '100.00';
              case 'Date': return '2025-04-08';
              case 'Account': return 'Office Expenses';
              case 'Description': return 'Office supplies purchase';
              case 'Merchant': return 'Office Depot';
              case 'Category': return 'Office Supplies';
              case 'Receipt URL': return 'https://receipts.stride.com/abc123';
              default: return 'Sample data';
            }
          }),
          headers.map(header => {
            switch(header) {
              case 'Amount': return '45.75';
              case 'Date': return '2025-04-07';
              case 'Account': return 'Travel Expenses';
              case 'Description': return 'Taxi fare';
              case 'Merchant': return 'City Cab Co';
              case 'Category': return 'Transportation';
              case 'Receipt URL': return 'https://receipts.stride.com/def456';
              default: return 'Sample data';
            }
          })
        );
      } else if (exportType === 'bills') {
        sampleData.push(
          headers.map(header => {
            switch(header) {
              case 'Amount': return '850.00';
              case 'Invoice Number': return 'INV-2025-001';
              case 'Bill Date': return '2025-04-05';
              case 'Account': return 'Utilities';
              case 'Vendor Name': return 'PowerCo Electric';
              case 'Description': return 'Monthly electricity bill';
              case 'Due Date': return '2025-04-30';
              default: return 'Sample data';
            }
          }),
          headers.map(header => {
            switch(header) {
              case 'Amount': return '1200.00';
              case 'Invoice Number': return 'INV-2025-002';
              case 'Bill Date': return '2025-04-06';
              case 'Account': return 'Rent';
              case 'Vendor Name': return 'Corporate Realty';
              case 'Description': return 'Office rent for April';
              case 'Due Date': return '2025-04-15';
              default: return 'Sample data';
            }
          })
        );
      } else { // billPayments
        sampleData.push(
          headers.map(header => {
            switch(header) {
              case 'Amount': return '850.00';
              case 'Invoice Number': return 'INV-2025-001';
              case 'Payment ID': return 'PAY-2025-001';
              case 'Payment Date': return '2025-04-29';
              case 'Account': return 'Bank Account';
              case 'Vendor Name': return 'PowerCo Electric';
              case 'Payment Method': return 'ACH';
              default: return 'Sample data';
            }
          }),
          headers.map(header => {
            switch(header) {
              case 'Amount': return '1200.00';
              case 'Invoice Number': return 'INV-2025-002';
              case 'Payment ID': return 'PAY-2025-002';
              case 'Payment Date': return '2025-04-14';
              case 'Account': return 'Bank Account';
              case 'Vendor Name': return 'Corporate Realty';
              case 'Payment Method': return 'Check';
              default: return 'Sample data';
            }
          })
        );
      }
    } else { // Double line format
      // For double line format, we use debit/credit instead of amount
      const debitIndex = headers.indexOf('Amount');
      if (debitIndex !== -1) {
        headers[debitIndex] = 'Debit';
        headers.splice(debitIndex + 1, 0, 'Credit');
      }
      
      // Different sample data based on export type
      if (exportType === 'transactions') {
        // First transaction (two rows because it's double line)
        sampleData.push(
          headers.map((header, index) => {
            if (header === 'Debit') return '100.00';
            if (header === 'Credit') return '';
            if (index > debitIndex) {
              // Shift by one because we inserted Credit column
              const originalHeader = headers[index - 1];
              switch(originalHeader) {
                case 'Date': return '2025-04-08';
                case 'Account': return 'Office Expenses';
                case 'Description': return 'Office supplies purchase';
                case 'Merchant': return 'Office Depot';
                case 'Category': return 'Office Supplies';
                default: return 'Sample data';
              }
            }
            switch(header) {
              case 'Date': return '2025-04-08';
              case 'Account': return 'Office Expenses';
              case 'Description': return 'Office supplies purchase';
              case 'Merchant': return 'Office Depot';
              case 'Category': return 'Office Supplies';
              default: return 'Sample data';
            }
          }),
          headers.map((header, index) => {
            if (header === 'Debit') return '';
            if (header === 'Credit') return '100.00';
            if (index > debitIndex) {
              // Shift by one because we inserted Credit column
              const originalHeader = headers[index - 1];
              switch(originalHeader) {
                case 'Date': return '2025-04-08';
                case 'Account': return 'Bank Account';
                case 'Description': return 'Office supplies purchase';
                case 'Merchant': return 'Office Depot';
                case 'Category': return 'Office Supplies';
                default: return 'Sample data';
              }
            }
            switch(header) {
              case 'Date': return '2025-04-08';
              case 'Account': return 'Bank Account';
              case 'Description': return 'Office supplies purchase';
              case 'Merchant': return 'Office Depot';
              case 'Category': return 'Office Supplies';
              default: return 'Sample data';
            }
          })
        );
      } else if (exportType === 'bills') {
        // First bill (two rows because it's double line)
        sampleData.push(
          headers.map((header, index) => {
            if (header === 'Debit') return '850.00';
            if (header === 'Credit') return '';
            if (index > debitIndex) {
              // Shift by one because we inserted Credit column
              const originalHeader = headers[index - 1];
              switch(originalHeader) {
                case 'Invoice Number': return 'INV-2025-001';
                case 'Bill Date': return '2025-04-05';
                case 'Account': return 'Utilities';
                case 'Vendor Name': return 'PowerCo Electric';
                case 'Description': return 'Monthly electricity bill';
                case 'Due Date': return '2025-04-30';
                default: return 'Sample data';
              }
            }
            switch(header) {
              case 'Invoice Number': return 'INV-2025-001';
              case 'Bill Date': return '2025-04-05';
              case 'Account': return 'Utilities';
              case 'Vendor Name': return 'PowerCo Electric';
              case 'Description': return 'Monthly electricity bill';
              case 'Due Date': return '2025-04-30';
              default: return 'Sample data';
            }
          }),
          headers.map((header, index) => {
            if (header === 'Debit') return '';
            if (header === 'Credit') return '850.00';
            if (index > debitIndex) {
              // Shift by one because we inserted Credit column
              const originalHeader = headers[index - 1];
              switch(originalHeader) {
                case 'Invoice Number': return 'INV-2025-001';
                case 'Bill Date': return '2025-04-05';
                case 'Account': return 'Accounts Payable';
                case 'Vendor Name': return 'PowerCo Electric';
                case 'Description': return 'Monthly electricity bill';
                case 'Due Date': return '2025-04-30';
                default: return 'Sample data';
              }
            }
            switch(header) {
              case 'Invoice Number': return 'INV-2025-001';
              case 'Bill Date': return '2025-04-05';
              case 'Account': return 'Accounts Payable';
              case 'Vendor Name': return 'PowerCo Electric';
              case 'Description': return 'Monthly electricity bill';
              case 'Due Date': return '2025-04-30';
              default: return 'Sample data';
            }
          })
        );
      } else { // billPayments
        // First payment (two rows because it's double line)
        sampleData.push(
          headers.map((header, index) => {
            if (header === 'Debit') return '850.00';
            if (header === 'Credit') return '';
            if (index > debitIndex) {
              // Shift by one because we inserted Credit column
              const originalHeader = headers[index - 1];
              switch(originalHeader) {
                case 'Invoice Number': return 'INV-2025-001';
                case 'Payment ID': return 'PAY-2025-001';
                case 'Payment Date': return '2025-04-29';
                case 'Account': return 'Accounts Payable';
                case 'Vendor Name': return 'PowerCo Electric';
                case 'Payment Method': return 'ACH';
                default: return 'Sample data';
              }
            }
            switch(header) {
              case 'Invoice Number': return 'INV-2025-001';
              case 'Payment ID': return 'PAY-2025-001';
              case 'Payment Date': return '2025-04-29';
              case 'Account': return 'Accounts Payable';
              case 'Vendor Name': return 'PowerCo Electric';
              case 'Payment Method': return 'ACH';
              default: return 'Sample data';
            }
          }),
          headers.map((header, index) => {
            if (header === 'Debit') return '';
            if (header === 'Credit') return '850.00';
            if (index > debitIndex) {
              // Shift by one because we inserted Credit column
              const originalHeader = headers[index - 1];
              switch(originalHeader) {
                case 'Invoice Number': return 'INV-2025-001';
                case 'Payment ID': return 'PAY-2025-001';
                case 'Payment Date': return '2025-04-29';
                case 'Account': return 'Bank Account';
                case 'Vendor Name': return 'PowerCo Electric';
                case 'Payment Method': return 'ACH';
                default: return 'Sample data';
              }
            }
            switch(header) {
              case 'Invoice Number': return 'INV-2025-001';
              case 'Payment ID': return 'PAY-2025-001';
              case 'Payment Date': return '2025-04-29';
              case 'Account': return 'Bank Account';
              case 'Vendor Name': return 'PowerCo Electric';
              case 'Payment Method': return 'ACH';
              default: return 'Sample data';
            }
          })
        );
      }
    }
    
    // Create workbook using SheetJS
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    XLSX.utils.book_append_sheet(wb, ws, "CSV Export Template");
    
    // Generate and download the file
    const fileName = `${exportType}_template_${exportFormat}.xlsx`;
    XLSX.writeFile(wb, fileName);
    console.log('Template downloaded:', fileName);
  };
  
  // Handle file upload
  const handleFileUpload = (e) => {
    if (e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      
      // In a real app, we would parse the file and update the column configurations
      console.log('File uploaded:', uploadedFile.name);
      
      // Move to columns tab after file upload
      setSelectedTab('columns');
    }
  };
  
  // Handle toggling column visibility
  const handleToggleColumnVisibility = (columnId) => {
    setCustomColumns(prev => {
      const newColumns = {...prev};
      newColumns[exportType] = newColumns[exportType].map(col => {
        if (col.id === columnId) {
          return {...col, visible: !col.visible};
        }
        return col;
      });
      return newColumns;
    });
  };
  
  // Handle moving a column up or down in order
  const handleMoveColumn = (columnId, direction) => {
    setCustomColumns(prev => {
      const newColumns = {...prev};
      const columns = [...newColumns[exportType]];
      const columnIndex = columns.findIndex(col => col.id === columnId);
      
      if (direction === 'up' && columnIndex > 0) {
        // Swap with previous column
        [columns[columnIndex], columns[columnIndex - 1]] = [columns[columnIndex - 1], columns[columnIndex]];
      } else if (direction === 'down' && columnIndex < columns.length - 1) {
        // Swap with next column
        [columns[columnIndex], columns[columnIndex + 1]] = [columns[columnIndex + 1], columns[columnIndex]];
      }
      
      newColumns[exportType] = columns;
      return newColumns;
    });
  };
  
  // Handle renaming a column
  const handleRenameColumn = (columnId, newName) => {
    setCustomColumns(prev => {
      const newColumns = {...prev};
      newColumns[exportType] = newColumns[exportType].map(col => {
        if (col.id === columnId) {
          return {...col, name: newName};
        }
        return col;
      });
      return newColumns;
    });
  };
  
  // Handle changing a column's content type
  const handleChangeColumnContent = (columnId, newContent) => {
    setCustomColumns(prev => {
      const newColumns = {...prev};
      newColumns[exportType] = newColumns[exportType].map(col => {
        if (col.id === columnId) {
          return {...col, content: newContent};
        }
        return col;
      });
      return newColumns;
    });
  };
  
  // Handle save button click
  const handleSaveChanges = () => {
    // In a real app, we would save the configuration to the backend
    console.log('Saving CSV export configuration:', {
      exportType,
      exportFormat,
      exportRefundsAsNegative,
      columns: customColumns[exportType]
    });
    
    // Close the drawer
    onClose();
  };
  
  // Header with back button
  const headerPrefix = (
    <button 
      onClick={onBack}
      className="text-gray-500 hover:text-gray-700 flex items-center"
    >
      <ArrowLeft size={16} className="mr-1" />
      <span>Back</span>
    </button>
  );
  
  // Footer with cancel and save buttons
  const footerContent = (
    <div className="flex justify-between">
      <button 
        onClick={onClose}
        className="px-6 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
      <button 
        onClick={handleSaveChanges}
        className="px-6 py-2 rounded-lg font-medium bg-[#FF6B00] text-white hover:bg-[#e56100] transition-colors"
      >
        Save changes
      </button>
    </div>
  );
  
  // Custom styles for scrollbars
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
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
  
  return (
    <AppDrawer
      isOpen={isOpen}
      onClose={onClose}
      title="Customize CSV Export"
      description="Customize the format and contents of your CSV exports to match your ERP system."
      headerPrefix={headerPrefix}
      footer={footerContent}
      width="md:w-2/3"
      zIndex={Z_INDEX_LEVELS.LEVEL_2}
      id={drawerId}
      contentPadding="p-0"
    >
      <style>{scrollbarStyles}</style>
      
      <div className="flex h-full">
        {/* Left sidebar for export type selection */}
        <div className="w-56 border-r border-gray-200 bg-gray-50 p-4">
          <h3 className="font-medium text-gray-700 mb-3">Export Type</h3>
          <div className="space-y-2">
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                exportType === 'transactions'
                  ? 'bg-orange-100 text-orange-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setExportType('transactions')}
            >
              Transactions
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                exportType === 'bills'
                  ? 'bg-orange-100 text-orange-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setExportType('bills')}
            >
              Bills
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                exportType === 'billPayments'
                  ? 'bg-orange-100 text-orange-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setExportType('billPayments')}
            >
              Bill Payments
            </button>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-3">Export Format</h3>
            <div className="space-y-2">
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  exportFormat === 'singleLine'
                    ? 'bg-orange-100 text-orange-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setExportFormat('singleLine')}
              >
                Single Line
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded ${
                  exportFormat === 'doubleLine'
                    ? 'bg-orange-100 text-orange-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setExportFormat('doubleLine')}
              >
                Double Line
              </button>
            </div>
          </div>
          
          {/* Refunds as negative toggle - only show for Transactions in Single Line mode */}
          {exportType === 'transactions' && exportFormat === 'singleLine' && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-3">Refund Settings</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="refundsAsNegative"
                  checked={exportRefundsAsNegative}
                  onChange={() => setExportRefundsAsNegative(!exportRefundsAsNegative)}
                  className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="refundsAsNegative" className="ml-2 text-sm text-gray-600">
                  Show refunds as negative
                </label>
              </div>
            </div>
          )}
        </div>
        
        {/* Right content area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex px-6">
              <button
                className={`py-4 px-4 font-medium text-sm border-b-2 ${
                  selectedTab === 'getting-started'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTab('getting-started')}
              >
                Getting Started
              </button>
              <button
                className={`py-4 px-4 font-medium text-sm border-b-2 ${
                  selectedTab === 'template'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTab('template')}
              >
                Template
              </button>
              <button
                className={`py-4 px-4 font-medium text-sm border-b-2 ${
                  selectedTab === 'columns'
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTab('columns')}
              >
                Columns
              </button>
            </div>
          </div>
          
          {/* Tab content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {/* Getting Started tab */}
            {selectedTab === 'getting-started' && (
              <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Custom Accounting CSV Exports</h2>
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">How do I get started?</h3>
                  <p className="text-gray-600 mb-3">
                    In order to use custom CSV, you will need to set up your initial export. Here are the steps:
                  </p>
                  
                  <ol className="list-decimal ml-5 space-y-2 text-gray-600">
                    <li>
                      Upload a previous CSV with header names. This can be any previous CSV you have imported into your Accounting Software/ERP.
                    </li>
                    <li>
                      Or use the Stride default template. This will give you a preset export with the required fields.
                    </li>
                    <li>
                      Check your Column names and their placement to make sure the format fits what your team needs.
                    </li>
                    <li>
                      To ensure that content is pulled for every "Column name", select a corresponding "Content type" option. "Leave blank" will leave that column blank when exporting the CSV file.
                    </li>
                  </ol>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Key features</h3>
                  <ul className="list-disc ml-5 space-y-2 text-gray-600">
                    <li>Show or hide columns</li>
                    <li>Rename column headers</li>
                    <li>Re-arrange how columns appear in the export</li>
                    <li>Ability to show refunds in single-line journal entries as negative</li>
                    <li>Hardcoded fields (default value specified by user)</li>
                  </ul>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Export Requirements</h3>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700">Single Line Export Requirements</h4>
                    <p className="text-gray-600">Amount, Accounting Date, Account Name or Account ID</p>
                    <p className="text-sm text-gray-500 mt-1">
                      With single line transactions, you also have the ability to export refunds as negative. This is the default but can be toggled off in your CSV Export Settings.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700">Double Line Export Requirements</h4>
                    <p className="text-gray-600">Debit, Credit, Accounting Date, Account Name or Account ID</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center mt-8">
                  <button
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center font-medium"
                    onClick={() => setSelectedTab('template')}
                  >
                    Get started with templates
                    <ChevronDown className="ml-2 h-4 w-4 transform rotate-270" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Template tab */}
            {selectedTab === 'template' && (
              <div className="p-6">
                <h2 className="text-lg font-bold mb-6">Set up your CSV export</h2>
                
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-6">
                  <h3 className="font-medium text-gray-800 mb-4">1. Download the template</h3>
                  <p className="text-gray-600 mb-4">
                    Download a template CSV file with the recommended columns for your export type.
                    You can modify this template to match your ERP system requirements.
                  </p>
                  <button
                    onClick={handleDownloadTemplate}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center font-medium"
                  >
                    <Download size={16} className="mr-2" />
                    Download template
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-6">
                  <h3 className="font-medium text-gray-800 mb-4">2. Upload your existing CSV</h3>
                  <p className="text-gray-600 mb-4">
                    Already have a CSV format? Upload your existing CSV file to match 
                    your current format. We'll automatically configure your export settings.
                  </p>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                  />
                  
                  <div 
                    className={`
                      border-2 border-dashed rounded-lg p-6 
                      flex flex-col items-center justify-center 
                      cursor-pointer hover:bg-gray-100 transition-colors
                      ${file ? 'border-green-300 bg-green-50' : 'border-gray-300'}
                    `}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {file ? (
                      <>
                        <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
                        <p className="font-medium text-gray-800">{file.name}</p>
                        <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(1)}KB</p>
                        <p className="text-gray-400 text-xs mt-2">Click to select a different file</p>
                      </>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-gray-400 mb-2" />
                        <p className="text-gray-600 font-medium">Drop your CSV or XLSX file here</p>
                        <p className="text-gray-500 text-sm">or click to browse</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-center mt-8">
                  <button
                    className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center font-medium"
                    onClick={() => setSelectedTab('columns')}
                  >
                    Configure columns
                    <ChevronDown className="ml-2 h-4 w-4 transform rotate-270" />
                  </button>
                </div>
              </div>
            )}
            
            {/* Columns tab */}
            {selectedTab === 'columns' && (
              <div className="p-6">
                <h2 className="text-lg font-bold mb-6">Configure export columns</h2>
                
                {/* Required columns notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0 mr-3" />
                  <div>
                    <p className="text-blue-800 font-medium">Required columns</p>
                    <p className="text-blue-600 text-sm">
                      {exportFormat === 'singleLine' ? (
                        <>Amount, Accounting Date, and Account Name/ID</>
                      ) : (
                        <>Debit, Credit, Accounting Date, and Account Name/ID</>
                      )}
                      {' '}are required and cannot be disabled.
                    </p>
                  </div>
                </div>
                
                {/* Columns configuration table */}
                <div className="border border-gray-200 rounded-md overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Included</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Display Name</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Content</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Required</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500">Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customColumns[exportType].map((column, index) => (
                        <tr key={column.id} className="border-b border-gray-200 last:border-b-0">
                          <td className="px-4 py-3">
                            <input 
                              type="checkbox" 
                              checked={column.visible} 
                              onChange={() => column.required ? null : handleToggleColumnVisibility(column.id)}
                              disabled={column.required}
                              className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input 
                              type="text" 
                              value={column.name} 
                              onChange={(e) => handleRenameColumn(column.id, e.target.value)}
                              className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full max-w-xs"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <select 
                              value={column.content} 
                              onChange={(e) => handleChangeColumnContent(column.id, e.target.value)}
                              className="border border-gray-300 rounded-md px-2 py-1 text-sm w-full max-w-xs"
                            >
                              <option value={column.id}>{column.content}</option>
                              <option value="Leave blank">Leave blank</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-sm">
                            {column.required ? 'Yes' : 'No'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-1">
                              <button 
                                onClick={() => handleMoveColumn(column.id, 'up')}
                                disabled={index === 0 || !column.visible}
                                className={`p-1 rounded ${
                                  index === 0 || !column.visible ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <ChevronDown className="h-4 w-4 transform rotate-180" />
                              </button>
                              <button 
                                onClick={() => handleMoveColumn(column.id, 'down')}
                                disabled={index === customColumns[exportType].length - 1 || !column.visible}
                                className={`p-1 rounded ${
                                  index === customColumns[exportType].length - 1 || !column.visible 
                                    ? 'text-gray-300' 
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Add custom column button */}
                <div className="mt-6">
                  <button 
                    className="flex items-center text-gray-700 font-medium hover:text-gray-900"
                  >
                    <Plus size={16} className="mr-1" />
                    Add custom column
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppDrawer>
  );
};

export default CSVExportDrawer;