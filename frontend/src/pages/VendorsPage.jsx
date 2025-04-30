// src/pages/VendorsPage.jsx
import React, { useState, useRef, useEffect } from "react";
import { 
  Calendar, Download, Grid, Search, Plus, 
  Mail, FileText, PenLine, Table, Upload, X, Loader, Eye, Filter,
  ClipboardList, FileCheck, FileX, CreditCard, History, Users
} from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import VendorManager from "../components/VendorManager";
import VendorImportModal from "../components/VendorImportModal";
import VendorSidebar from "../components/VendorSidebar";
import VendorDrawer from "../components/VendorDrawer";
import { PageLayout, PageTable } from "../components/common/page-layout";

/**
 * VendorsPage component
 * Dedicated page component for the Vendors section
 */
const VendorsPage = () => {
  // Get notification context
  const { showSuccess, showError, showInfo } = useNotification();
  
  // State for the active subtab
  const [activeSubtab, setActiveSubtab] = useState('overview');
  
  // States for searching and data handling
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showVendorSidebar, setShowVendorSidebar] = useState(false);
  
  // New state for vendor drawer
  const [showVendorDrawer, setShowVendorDrawer] = useState(false);
  
  // Refs for file input
  const fileInputRef = useRef(null);
  
  // Define columns for filter and column action buttons
  const columns = [
    { id: 'checkbox', label: 'Select', Header: 'Select', accessor: 'checkbox', visible: true, order: 1 },
    { id: 'vendor', label: 'Vendor', Header: 'Vendor', accessor: 'vendor', visible: true, order: 2 },
    { id: 'owner', label: 'Vendor Owner', Header: 'Vendor Owner', accessor: 'owner', visible: true, order: 3 },
    { id: 'totalSpend', label: 'Total Spend', Header: 'Total Spend', accessor: 'totalSpend', visible: true, order: 4 },
    { id: 'recentSpend', label: 'Spend (30 days)', Header: 'Spend (30 days)', accessor: 'recentSpend', visible: true, order: 5 },
    { id: 'department', label: 'Department', Header: 'Department', accessor: 'department', visible: true, order: 6 },
    { id: 'location', label: 'Location', Header: 'Location', accessor: 'location', visible: true, order: 7 },
    { id: 'status', label: 'Status', Header: 'Status', accessor: 'status', visible: true, order: 8 },
    { id: 'tax', label: 'Tax', Header: 'Tax', accessor: 'tax', visible: true, order: 9 },
    { id: 'contractPeriod', label: 'Contract Period', Header: 'Contract Period', accessor: 'contractPeriod', visible: true, order: 10 },
    { id: 'terminationDate', label: 'Term. Date', Header: 'Term. Date', accessor: 'terminationDate', visible: true, order: 11 },
    { id: 'actions', label: 'Actions', Header: 'Actions', accessor: 'actions', visible: true, order: 12 }
  ];

  // Define subtabs - only Overview and Vendors now
  const subtabs = [
    { id: 'overview', label: 'Overview', icon: ClipboardList },
    { id: 'vendors', label: 'Vendors', icon: Users }
  ];

  // Sample vendor data for development
  const sampleVendorsData = [
    {
      id: 1,
      name: "ABC Technologies",
      owner: "Sarah Johnson",
      totalSpend: 450000,
      recentSpend: 125000,
      department: "IT",
      location: "Mumbai",
      status: "active",
      tax: "GST: 18%",
      contractStart: "2024-05-01",
      contractEnd: "2025-04-30",
      terminationDate: "2025-01-31"
    },
    {
      id: 2,
      name: "InnovateX Solutions",
      owner: "Amit Patel",
      totalSpend: 320000,
      recentSpend: 85000,
      department: "Operations",
      location: "Bangalore",
      status: "active",
      tax: "GST: 12%",
      contractStart: "2024-02-15",
      contractEnd: "2025-02-14"
    },
    {
      id: 3,
      name: "GlobalServe Logistics",
      owner: "Priya Sharma",
      totalSpend: 275000,
      recentSpend: 62000,
      department: "Supply Chain",
      location: "Delhi",
      status: "inactive",
      tax: "GST: 5%",
      contractStart: "2023-12-01",
      contractEnd: "2024-11-30",
      terminationDate: "2024-09-15"
    },
    {
      id: 4,
      name: "TechSoft India",
      owner: "Rajiv Kumar",
      totalSpend: 185000,
      recentSpend: 43000,
      department: "IT",
      location: "Hyderabad",
      status: "active",
      tax: "GST: 18%",
      contractStart: "2024-03-01",
      contractEnd: "2025-02-28"
    },
    {
      id: 5,
      name: "EcoGreen Supplies",
      owner: "Neha Gupta",
      totalSpend: 130000,
      recentSpend: 28000,
      department: "Procurement",
      location: "Chennai",
      status: "review",
      tax: "GST: 12%",
      contractStart: "2024-01-15",
      contractEnd: "2024-12-31"
    }
  ];
  
  // Filter vendors based on the active subtab
  const getFilteredVendors = () => {
    if (activeSubtab === 'overview') {
      // Show all vendors in the Overview tab
      return sampleVendorsData;
    } else if (activeSubtab === 'vendors') {
      // Show active vendors only
      return sampleVendorsData.filter(vendor => vendor.status === 'active');
    }
    
    // Default to all vendors
    return sampleVendorsData;
  };

  // Handle creating new vendor - now opens the drawer instead of navigating
  const handleNewVendor = () => {
    setShowVendorDrawer(true);
  };
  
  // Handle newly created vendor from the drawer
  const handleVendorCreated = (vendorData) => {
    console.log("New vendor created:", vendorData);
    showSuccess(`Vendor ${vendorData.vendorName} created successfully!`);
    refreshVendors();
  };
  
  // Handle vendor import
  const handleImportVendor = () => {
    setShowImportModal(true);
  };

  // Function to refresh vendors data
  const refreshVendors = () => {
    setLoading(true);
    // For now, just simulate a refresh with a timeout
    setTimeout(() => {
      setLoading(false);
      showSuccess("Vendors refreshed successfully!");
    }, 800);
  };

  // Handle opening settings
  const handleOpenSettings = (tab) => {
    // This will be handled through the App.jsx root component
    window.dispatchEvent(new CustomEvent('openSettings', { detail: { tab } }));
  };

  // Create action buttons for the header
  const actionButtons = [
    // Import vendors button (white with border)
    <button
      key="import-vendors-button"
      className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md flex items-center"
      onClick={handleImportVendor}
    >
      <Upload size={16} className="mr-2" />
      Import Vendors
    </button>,
    
    // New Vendor button (orange/coral)
    <button
      key="new-vendor-button"
      className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md flex items-center"
      onClick={handleNewVendor}
    >
      <Plus size={16} className="mr-2" />
      New Vendor
    </button>
  ];

  // Calculate vendor counts for each subtab
  const getVendorCount = (status) => {
    if (status === 'overview') {
      return sampleVendorsData.length;
    } else if (status === 'vendors') {
      return sampleVendorsData.filter(vendor => vendor.status === 'active').length;
    }
    return 0;
  };

  // Format subtabs for the PageLayout component with standardized format
  const formattedSubtabs = subtabs.map(subtab => ({
    id: subtab.id,
    label: subtab.label,
    icon: subtab.icon,
    count: getVendorCount(subtab.id)
  }));

  // Define handlers for column visibility and filtering
  const handleColumnVisibilityChange = (columnId, isVisible) => {
    console.log(`Column ${columnId} visibility changed to ${isVisible}`);
    // Update column visibility state would go here in a real implementation
  };

  const handleFilterChange = (columnId, filterValue) => {
    console.log(`Filter for column ${columnId} changed to ${filterValue}`);
    // Apply filter logic here in a real implementation
  };

  // Define default visible columns
  const defaultVisibleColumns = columns.filter(col => col.visible).map(col => col.id);

  return (
    <PageLayout
      pageTitle="Bill Pay"
      heading="Vendors"
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
    >

      {/* Use the VendorManager component with filtered vendors based on active subtab */}
      <VendorManager 
        vendors={getFilteredVendors()}
        loading={loading}
        error={null}
        onRefresh={refreshVendors}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setSelectedVendor={setSelectedVendor}
        onVendorClick={(vendor) => {
          setSelectedVendor(vendor);
          setShowVendorSidebar(true);
        }}
        onSettingsOpen={handleOpenSettings}
      />

      {/* Vendor Import Modal */}
      <VendorImportModal
        show={showImportModal}
        onClose={() => {
          setShowImportModal(false);
          showSuccess("Vendors imported successfully!");
          refreshVendors();
        }}
      />

      {/* Vendor Sidebar for details */}
      {showVendorSidebar && selectedVendor && (
        <VendorSidebar
          isOpen={showVendorSidebar}
          vendor={selectedVendor}
          onClose={() => setShowVendorSidebar(false)}
        />
      )}
      
      {/* New Vendor Drawer Component */}
      <VendorDrawer
        isOpen={showVendorDrawer}
        onClose={() => setShowVendorDrawer(false)}
        onSave={handleVendorCreated}
      />
    </PageLayout>
  );
};

export default VendorsPage;