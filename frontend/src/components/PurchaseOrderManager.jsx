import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  FileText, 
  AlertCircle, 
  Upload, 
  Filter,
  MoreVertical,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from "./LoadingSpinner.jsx";
import { PageTable } from "../components/common/page-layout";

const PurchaseOrderManager = ({ 
  purchaseOrders,
  loading,
  error,
  onRefresh,
  uploadLoading,
  uploadError,
  handleFileUpload,
  searchTerm,
  setSearchTerm,
  setSelectedPO,
  onSettingsOpen,
  activeSubtab,
  onSyncPO
}) => {
  // State for file handling
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error'
  const [uploadMessage, setUploadMessage] = useState('');
  
  // Refs for file handling
  const fileInputRef = useRef(null);
  const dropAreaRef = useRef(null);

  // Handle file drop area events
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.add('border-blue-500');
      dropAreaRef.current.classList.add('bg-blue-50');
    }
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('border-blue-500');
      dropAreaRef.current.classList.remove('bg-blue-50');
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (dropAreaRef.current) {
      dropAreaRef.current.classList.remove('border-blue-500');
      dropAreaRef.current.classList.remove('bg-blue-50');
    }

    const file = event.dataTransfer.files[0];
    if (!file) return;

    handleFileSelect(file);
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    if (!file) {
      console.error("No file provided to handleFileSelect");
      return;
    }

    // If external handler provided, pass the file
    if (handleFileUpload) {
      handleFileUpload({ target: { files: [file] } });
    }
  };

  const navigate = useNavigate();

  const handleGRNUpload = (poId) => {
    // Find the PO in the purchase orders array
    const po = purchaseOrders.find(po => po.id === poId);
    if (!po) {
      console.error(`PO with ID ${poId} not found`);
      return;
    }
    
    // Navigate to the GRN page with PO details as state
    navigate('/grn', {
      state: {
        poDetails: {
          poId: po.id,
          poNumber: po.po_number,
          vendor: po.vendor_name
        }
      }
    });
  };

  return (
    <div className="space-y-6">

      {/* Error message if upload fails */}
      {uploadError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          <AlertCircle className="inline-block mr-2" size={16} />
          {uploadError}
        </div>
      )}

      {/* Purchase Orders table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Show appropriate state based on loading, error, and data */}
        {loading ? (
          <div className="py-10 text-center">
            <LoadingSpinner size="large" className="mb-3 mx-auto" />
            <p>Loading purchase orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-md text-center">
            <AlertCircle className="mx-auto mb-2" size={32} />
            <p>{error}</p>
            <button onClick={onRefresh} className="mt-3 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md">
              Try Again
            </button>
          </div>
        ) : !purchaseOrders || purchaseOrders.length === 0 ? (
          <div className="py-10 text-center">
            <FileText className="text-gray-300 mx-auto mb-3" size={48} />
            <p className="text-gray-500">No purchase orders found</p>
            <p className="text-sm text-gray-400 mt-1">Sync purchase orders to get started</p>
            <button 
              onClick={onSyncPO}
              className="mt-4 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md flex items-center mx-auto"
            >
              Sync Purchase Orders
            </button>
          </div>
        ) : (
          <PageTable
            columns={[
              {
                id: 'checkbox',
                header: <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />,
                sticky: 'left',
                width: '40px',
                render: () => (
                  <input type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                )
              },
              {
                id: 'po_number',
                header: 'PO Number',
                sticky: 'left',
                render: (po) => (
                  <span className="font-medium text-gray-900">{po.po_number}</span>
                )
              },
              {
                id: 'upload_grn',
                header: 'Upload GRN',
                render: (po) => (
                  <button 
                    onClick={() => handleGRNUpload(po.id)}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center"
                  >
                    <Upload size={14} className="mr-1" />
                    Upload
                  </button>
                )
              },
              {
                id: 'vendor_name',
                header: 'Vendor Name',
                render: (po) => (
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium text-gray-900">{po.vendor_name}</div>
                    </div>
                  </div>
                )
              },
              {
                id: 'po_date',
                header: 'PO Date',
                accessor: 'po_date'
              },
              {
                id: 'po_sync_date',
                header: 'PO Sync Date',
                accessor: 'po_sync_date'
              },
              {
                id: 'vendor_contact',
                header: 'Vendor Contact',
                accessor: 'vendor_contact'
              },
              {
                id: 'amount',
                header: 'Amount',
                render: (po) => (
                  <span className="text-gray-900 font-medium">{po.amount}</span>
                )
              },
              {
                id: 'po_status',
                header: 'PO Status',
                render: (po) => (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    po.po_status === 'Completed' ? 'bg-green-100 text-green-800' :
                    po.po_status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                    po.po_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    po.po_status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {po.po_status}
                  </span>
                )
              },
              {
                id: 'payment_status',
                header: 'Payment Status',
                render: (po) => (
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    po.payment_status === 'Paid' ? 'bg-green-100 text-green-800' :
                    po.payment_status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    po.payment_status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {po.payment_status}
                  </span>
                )
              },
              {
                id: 'delivery_date',
                header: 'Delivery Date',
                accessor: 'delivery_date'
              },
              {
                id: 'description',
                header: 'Items / Description',
                accessor: 'description'
              },
              {
                id: 'total_price',
                header: 'Total Price',
                render: (po) => (
                  <span className="text-gray-900 font-medium">{po.total_price}</span>
                )
              },
              {
                id: 'invoice_number',
                header: 'Invoice Number',
                accessor: 'invoice_number'
              },
              {
                id: 'notes',
                header: 'PO Notes',
                accessor: 'notes'
              },
              {
                id: 'tax',
                header: 'Tax',
                accessor: 'tax'
              },
              {
                id: 'action',
                header: 'Action',
                sticky: 'right',
                render: (po) => (
                  <button 
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => {
                      if (setSelectedPO) {
                        setSelectedPO(po);
                      }
                      console.log(`Viewing details for PO ${po.po_number}`);
                    }}
                  >
                    View
                  </button>
                )
              }
            ]}
            data={purchaseOrders}
            emptyMessage="No purchase orders found. Try adjusting your filters."
          />
        )}
      </div>
      
      {/* Upload status indicator */}
      {uploadStatus !== 'idle' && (
        <div className={`mt-2 p-3 rounded-md ${
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
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              {uploadMessage}
            </div>
          )}
          {uploadStatus === 'error' && (
            <div className="flex items-center">
              <AlertCircle size={16} className="mr-2" />
              {uploadMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PurchaseOrderManager;