// src/pages/PurchaseOrderPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { 
  Upload, ClipboardList, Search,
  AlertCircle, CheckCircle, X, Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../contexts/NotificationContext";
import PurchaseOrderManager from "../components/PurchaseOrderManager.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { isAllowedFileType } from "../utils/helpers.jsx";
import { PageLayout, PageTable } from "../components/common/page-layout";

/**
 * PurchaseOrderPage component
 * Dedicated page component for the Purchase Order section
 */
const PurchaseOrderPage = () => {
  const navigate = useNavigate();
  
  // Get notification context
  const { showSuccess, showError, showInfo } = useNotification();
  
  // State for the active subtab and UI elements
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Ref for file input
  const fileInputRef = useRef(null);
  
  // Define columns for the table with proper structure for filter and column buttons
  const columns = [
    { id: 'checkbox', label: 'Select', Header: 'Select', accessor: 'checkbox', visible: true, order: 1 },
    { id: 'po_number', label: 'PO Number', Header: 'PO Number', accessor: 'po_number', visible: true, order: 2 },
    { id: 'upload_grn', label: 'Upload GRN', Header: 'Upload GRN', accessor: 'upload_grn', visible: true, order: 3 },
    { id: 'vendor_name', label: 'Vendor Name', Header: 'Vendor Name', accessor: 'vendor_name', visible: true, order: 4 },
    { id: 'po_date', label: 'PO Date', Header: 'PO Date', accessor: 'po_date', visible: true, order: 5 },
    { id: 'po_sync_date', label: 'PO Sync Date', Header: 'PO Sync Date', accessor: 'po_sync_date', visible: true, order: 6 },
    { id: 'vendor_contact', label: 'Vendor Contact', Header: 'Vendor Contact', accessor: 'vendor_contact', visible: true, order: 7 },
    { id: 'amount', label: 'Amount', Header: 'Amount', accessor: 'amount', visible: true, order: 8 },
    { id: 'po_status', label: 'PO Status', Header: 'PO Status', accessor: 'po_status', visible: true, order: 9 },
    { id: 'payment_status', label: 'Payment Status', Header: 'Payment Status', accessor: 'payment_status', visible: true, order: 10 },
    { id: 'delivery_date', label: 'Delivery Date', Header: 'Delivery Date', accessor: 'delivery_date', visible: true, order: 11 },
    { id: 'description', label: 'Items / Description', Header: 'Items / Description', accessor: 'description', visible: true, order: 12 },
    { id: 'total_price', label: 'Total Price', Header: 'Total Price', accessor: 'total_price', visible: true, order: 13 },
    { id: 'invoice_number', label: 'Invoice Number', Header: 'Invoice Number', accessor: 'invoice_number', visible: true, order: 14 },
    { id: 'notes', label: 'PO Notes', Header: 'PO Notes', accessor: 'notes', visible: true, order: 15 },
    { id: 'tax', label: 'Tax', Header: 'Tax', accessor: 'tax', visible: true, order: 16 },
    { id: 'action', label: 'Action', Header: 'Action', accessor: 'action', visible: true, order: 17 }
  ];

  // Sample data for development - This is only for UI display
  const samplePurchaseOrders = [
    {
      id: 1,
      po_number: "PO-2025-001",
      vendor_name: "Tech Solutions Ltd.",
      vendor_contact: "contact@techsolutions.com",
      po_date: "2025-03-01",
      po_sync_date: "2025-03-02",
      amount: "₹120,000.00",
      po_status: "Approved",
      payment_status: "Pending",
      delivery_date: "2025-04-01",
      description: "Server equipment and accessories",
      total_price: "₹120,000.00",
      invoice_number: "-",
      notes: "Expedited shipping requested",
      tax: "18%"
    },
    {
      id: 2,
      po_number: "PO-2025-002",
      vendor_name: "Office Supplies Co.",
      vendor_contact: "sales@officesupplies.com",
      po_date: "2025-03-05",
      po_sync_date: "2025-03-06",
      amount: "₹45,000.00",
      po_status: "Pending",
      payment_status: "Pending",
      delivery_date: "2025-03-20",
      description: "Office furniture and stationery",
      total_price: "₹45,000.00",
      invoice_number: "-",
      notes: "Required for new office setup",
      tax: "12%"
    },
    {
      id: 3,
      po_number: "PO-2025-003",
      vendor_name: "Industrial Components Inc.",
      vendor_contact: "orders@indcomponents.com",
      po_date: "2025-03-10",
      po_sync_date: "2025-03-11",
      amount: "₹75,000.00",
      po_status: "Rejected",
      payment_status: "Cancelled",
      delivery_date: "2025-03-30",
      description: "Machine parts and hardware",
      total_price: "₹75,000.00",
      invoice_number: "-",
      notes: "Budget constraints led to cancellation",
      tax: "18%"
    },
    {
      id: 4,
      po_number: "PO-2025-004",
      vendor_name: "Software Solutions Ltd.",
      vendor_contact: "licensing@softsoltn.com",
      po_date: "2025-03-15",
      po_sync_date: "2025-03-16",
      amount: "₹325,000.00",
      po_status: "Approved",
      payment_status: "Paid",
      delivery_date: "2025-03-25",
      description: "Enterprise software licenses",
      total_price: "₹325,000.00",
      invoice_number: "INV-2025-102",
      notes: "Annual subscription",
      tax: "18%"
    },
    {
      id: 5,
      po_number: "PO-2025-005",
      vendor_name: "Logistics Partners",
      vendor_contact: "dispatch@logisticsp.com",
      po_date: "2025-03-20",
      po_sync_date: "2025-03-21",
      amount: "₹38,000.00",
      po_status: "Draft",
      payment_status: "Pending",
      delivery_date: "2025-04-15",
      description: "Transportation services",
      total_price: "₹38,000.00",
      invoice_number: "-",
      notes: "Pending manager approval",
      tax: "5%"
    }
  ];

  // Get purchase orders (no filtering by status now)
  const getFilteredPurchaseOrders = () => {
    return samplePurchaseOrders;
  };


  
  // Handle Sync PO button click - navigate directly to importing tab in settings
  const handleSyncPO = () => {
    window.dispatchEvent(new CustomEvent('openSettings', { detail: { tab: 'importing' } }));
  };

  // Function to refresh PO data
  const refreshPurchaseOrders = () => {
    setLoading(true);
    // For now, just simulate a refresh with a timeout
    setTimeout(() => {
      setLoading(false);
      showSuccess("Purchase orders refreshed successfully!");
    }, 800);
  };

  // Handle PO file upload
  const handlePOFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (isAllowedFileType(file)) {
      // For now, just show a success message
      showSuccess(`Purchase order file ${file.name} uploaded successfully`);
    } else {
      showError("Unsupported file type. Please upload a PDF or spreadsheet file.");
    }
    
    // Reset file input
    e.target.value = "";
  };

  // Define the tabs for filtering
  const tabs = [
    { id: 'all', label: 'Overview', icon: ClipboardList }
  ];
  
  // Create action buttons for the header
  const actionButtons = [
    // Upload PO button (white with border)
    <button
      key="upload-po-button"
      className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md flex items-center"
      onClick={() => fileInputRef.current.click()}
    >
      <Upload size={16} className="mr-2" />
      Upload PO
    </button>,
    
    // Sync PO button (orange/coral)
    <button
      key="sync-po-button"
      className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md flex items-center"
      onClick={handleSyncPO}
    >
      <ClipboardList size={16} className="mr-2" />
      Sync PO
    </button>
  ];

  // Calculate purchase order count
  const getPOCount = () => {
    return samplePurchaseOrders.length;
  };

  // Format tabs with standardized structure including icons and count
  const formattedTabs = tabs.map(tab => ({
    id: tab.id,
    label: tab.label,
    icon: tab.icon,
    count: getPOCount()
  }));

  // Create an array of default visible column IDs
  const defaultVisibleColumns = columns
    .filter(col => col.visible)
    .map(col => col.id);
  
  // Define column filtering and visibility handlers
  const handleColumnVisibilityChange = (columnId, isVisible) => {
    // This would normally update state, but for this fix we just need the function to exist
    console.log(`Column ${columnId} visibility changed to ${isVisible}`);
  };
  
  const handleFilterChange = (filterId) => {
    // This would normally update state, but for this fix we just need the function to exist
    console.log(`Filter ${filterId} selected`);
  };

  return (
    <PageLayout
      pageTitle="Bill Pay"
      heading="Purchase Orders"
      actions={actionButtons}
      subtabs={formattedTabs}
      activeSubtab={activeTab}
      onSubtabChange={setActiveTab}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      showSearchBar={true}
      showActionButtons={true}
      columns={columns}
      defaultVisibleColumns={defaultVisibleColumns}
      onColumnVisibilityChange={handleColumnVisibilityChange}
      onFilterChange={handleFilterChange}
    >

      {/* Purchase Order Manager Component */}
      <PurchaseOrderManager 
        purchaseOrders={getFilteredPurchaseOrders()}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        loading={loading}
        onRefresh={refreshPurchaseOrders}
      />

      {/* Hidden file input for PO upload */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.xlsx,.xls,.csv"
        onChange={handlePOFileUpload}
      />
    </PageLayout>
  );
};

export default PurchaseOrderPage;