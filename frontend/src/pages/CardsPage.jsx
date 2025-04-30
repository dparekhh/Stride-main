import React, { useState, useRef, useEffect } from "react";
import { 
  CreditCard, 
  Filter, 
  Plus, 
  MoreVertical
} from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import PhysicalCardDrawer from "../components/PhysicalCardDrawer";
import VirtualCardDrawer from "../components/VirtualCardDrawer";
import IssueCardDrawer from "../components/IssueCardDrawer";
import RequestsDrawer from "../components/RequestsDrawer";
import ConfirmAddressDrawer from "../components/ConfirmAddressDrawer";
import { PageLayout, PageTable } from "../components/common/page-layout";

const CardsPage = () => {
  // Filter and search state
  const [activeSubtab, setActiveSubtab] = useState('virtual');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // State for modals/drawers
  const [showIssueCardDrawer, setShowIssueCardDrawer] = useState(false);
  const [showRequestsDrawer, setShowRequestsDrawer] = useState(false);
  const [showPhysicalCardDrawer, setShowPhysicalCardDrawer] = useState(false);
  const [showVirtualCardDrawer, setShowVirtualCardDrawer] = useState(false);
  const [showConfirmAddressDrawer, setShowConfirmAddressDrawer] = useState(false);
  
  // State for address data
  const [cardholderName, setCardholderName] = useState('');
  const [addressData, setAddressData] = useState(null);
  
  // Refs for click-outside handling
  const filterMenuRef = useRef(null);
  const moreOptionsMenuRef = useRef(null);
  const [showMoreOptionsMenu, setShowMoreOptionsMenu] = useState(false);
  
  // Define columns for filter and column action buttons
  const columns = [
    { id: 'name', label: 'Name', Header: 'Name', accessor: 'name', visible: true, order: 1 },
    { id: 'owner', label: 'Owner (Employee)', Header: 'Owner (Employee)', accessor: 'owner', visible: true, order: 2 },
    { id: 'utilization', label: 'Utilization (%)', Header: 'Utilization (%)', accessor: 'utilization', visible: true, order: 3 },
    { id: 'limit', label: 'Amount (Limit)', Header: 'Amount (Limit)', accessor: 'limit', visible: true, order: 4 },
    { id: 'used', label: 'Amount (Used)', Header: 'Amount (Used)', accessor: 'used', visible: true, order: 5 },
    { id: 'department', label: 'Department', Header: 'Department', accessor: 'department', visible: true, order: 6 },
    { id: 'actions', label: 'Actions', Header: 'Actions', accessor: 'actions', visible: true, order: 7 }
  ];
  
  // Get notification context
  const { showSuccess, showError, showInfo } = useNotification();
  
  // Sample data for virtual cards
  const [virtualCards, setVirtualCards] = useState([
    {
      id: 1,
      name: 'Marketing Expenses',
      owner: 'Priya Sharma',
      utilization: 65,
      limit: 25000.00,
      used: 16250.00,
      department: 'Marketing',
      frequency: 'Quarterly',
      type: 'virtual'
    },
    {
      id: 2,
      name: 'Software Subscriptions',
      owner: 'Rahul Verma',
      utilization: 45,
      limit: 25000.00,
      used: 11250.00,
      department: 'Engineering',
      frequency: 'Quarterly',
      type: 'virtual'
    },
    {
      id: 3,
      name: 'Figma Card',
      owner: 'Aisha Patel',
      utilization: 28,
      limit: 25000.00,
      used: 7000.00,
      department: 'Design',
      frequency: 'Quarterly',
      type: 'virtual'
    },
    {
      id: 4,
      name: 'Google Ad Spend',
      owner: 'Vikram Singh',
      utilization: 85,
      limit: 25000.00,
      used: 21250.00,
      department: 'Marketing',
      frequency: 'Quarterly',
      type: 'virtual'
    },
    {
      id: 5,
      name: 'Travel Booking',
      owner: 'Neha Gupta',
      utilization: 20,
      limit: 25000.00,
      used: 5000.00,
      department: 'Finance',
      frequency: 'Quarterly',
      type: 'virtual'
    }
  ]);
  
  // Sample data for physical cards
  const [physicalCards, setPhysicalCards] = useState([
    {
      id: 101,
      name: 'Office Supplies',
      owner: 'Dinesh Kumar',
      utilization: 32,
      limit: 5000.00,
      used: 1600.00,
      department: 'Operations',
      frequency: 'Monthly',
      type: 'physical'
    },
    {
      id: 102,
      name: 'Travel Expenses',
      owner: 'Sangeeta Joshi',
      utilization: 70,
      limit: 5000.00,
      used: 3500.00,
      department: 'Sales',
      frequency: 'Monthly',
      type: 'physical'
    },
    {
      id: 103,
      name: 'Emergency Fund',
      owner: 'Arjun Malhotra',
      utilization: 10,
      limit: 5000.00,
      used: 500.00,
      department: 'Finance',
      frequency: 'Monthly',
      type: 'physical'
    }
  ]);
  
  // Handle outside clicks for dropdowns
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
      if (moreOptionsMenuRef.current && !moreOptionsMenuRef.current.contains(event.target)) {
        setShowMoreOptionsMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Format currency for INR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Get filtered cards based on subtab and search
  const getFilteredCards = () => {
    const cardsToFilter = activeSubtab === 'virtual' ? virtualCards : physicalCards;
    
    return cardsToFilter.filter(card => {
      if (!searchTerm) return true;
      
      const term = searchTerm.toLowerCase();
      return (
        card.name.toLowerCase().includes(term) ||
        card.owner.toLowerCase().includes(term) ||
        card.department.toLowerCase().includes(term)
      );
    });
  };

  // Create action buttons for the header
  const actionButtons = [
    // More options menu
    <div className="relative" ref={moreOptionsMenuRef} key="more-options-menu">
      <button 
        className="p-2 rounded-md hover:bg-gray-100"
        onClick={() => setShowMoreOptionsMenu(!showMoreOptionsMenu)}
        aria-label="More options"
      >
        <MoreVertical size={20} />
      </button>
      {showMoreOptionsMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Export Cards
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              View Archive
            </button>
            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              Card Settings
            </button>
          </div>
        </div>
      )}
    </div>,
    
    // Requests button
    <button
      key="requests-button"
      className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md"
      onClick={() => setShowRequestsDrawer(true)}
    >
      Requests
    </button>,
    
    // Issue Card button
    <button
      key="issue-card-button"
      className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md flex items-center"
      onClick={() => setShowIssueCardDrawer(true)}
    >
      <Plus size={16} className="mr-2" />
      Issue Card
    </button>
  ];

  // Format subtabs for the PageLayout component with standardized format
  const formattedSubtabs = [
    {
      id: 'virtual',
      label: 'Virtual Cards',
      icon: CreditCard
    },
    {
      id: 'physical',
      label: 'Physical Cards',
      icon: CreditCard
    }
  ];
  
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
      heading="Cards"
      actions={actionButtons}
      subtabs={formattedSubtabs}
      activeSubtab={activeSubtab}
      onSubtabChange={setActiveSubtab}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      showSearchBar={true}
      showActionButtons={true}
      columns={columns}
      defaultVisibleColumns={defaultVisibleColumns}
      onColumnVisibilityChange={handleColumnVisibilityChange}
      onFilterChange={handleFilterChange}
    >
      
      {/* Filter menu */}
      <div className="relative" ref={filterMenuRef}>
        {showFilterMenu && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10">
            <div className="p-3">
              <h3 className="font-medium mb-2">Department</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Engineering</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Marketing</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Finance</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Sales</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>Operations</span>
                </label>
              </div>
              
              <h3 className="font-medium mb-2 mt-4">Utilization</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>0-25%</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>26-50%</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>51-75%</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span>76-100%</span>
                </label>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2">
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                  Reset
                </button>
                <button className="px-3 py-1 text-sm bg-primary text-white rounded-md hover:bg-primary-dark">
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Cards Table */}
      <div className="px-6">
        <PageTable
          columns={[
            {
              id: 'name',
              header: 'Name',
              render: (card) => (
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <CreditCard size={18} className="text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{card.name}</div>
                    <div className="text-xs text-gray-500">{card.frequency} • {card.type === 'virtual' ? 'Virtual' : 'Physical'}</div>
                  </div>
                </div>
              )
            },
            {
              id: 'owner',
              header: 'Owner (Employee)',
              accessor: 'owner'
            },
            {
              id: 'utilization',
              header: 'Utilization (%)',
              render: (card) => (
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        card.utilization < 50 ? 'bg-green-500' : 
                        card.utilization < 75 ? 'bg-yellow-500' : 'bg-red-500'
                      }`} 
                      style={{ width: `${card.utilization}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600">{card.utilization}%</span>
                </div>
              )
            },
            {
              id: 'limit',
              header: 'Amount (Limit)',
              render: (card) => formatCurrency(card.limit)
            },
            {
              id: 'used',
              header: 'Amount (Used)',
              render: (card) => formatCurrency(card.used)
            },
            {
              id: 'department',
              header: 'Department',
              accessor: 'department'
            },
            {
              id: 'actions',
              header: 'Actions',
              render: (card) => (
                <div className="text-right">
                  <button className="text-primary hover:text-primary-dark">Manage</button>
                </div>
              )
            }
          ]}
          data={getFilteredCards()}
          emptyMessage="No cards found. Try adjusting your filters."
        />
      </div>
      
      {/* Issue Card Drawer */}
      <IssueCardDrawer 
        isOpen={showIssueCardDrawer}
        onClose={() => setShowIssueCardDrawer(false)}
        onSelectPhysicalCard={() => {
          setShowIssueCardDrawer(false);
          setShowPhysicalCardDrawer(true);
        }}
        onSelectVirtualCard={() => {
          setShowIssueCardDrawer(false);
          setShowVirtualCardDrawer(true);
        }}
      />
      
      {/* Physical Card Drawer */}
      <PhysicalCardDrawer 
        isOpen={showPhysicalCardDrawer}
        onClose={() => setShowPhysicalCardDrawer(false)}
        onBack={() => {
          setShowPhysicalCardDrawer(false);
          setShowIssueCardDrawer(true);
        }}
        onConfirmAddress={(name, address) => {
          setCardholderName(name);
          setAddressData(address);
          setShowPhysicalCardDrawer(false);
          setShowConfirmAddressDrawer(true);
        }}
      />
      
      {/* Confirm Address Drawer */}
      <ConfirmAddressDrawer 
        isOpen={showConfirmAddressDrawer}
        onClose={() => {
          setShowConfirmAddressDrawer(false);
          showSuccess("Physical card issuance initiated successfully");
        }}
        onBack={() => {
          setShowConfirmAddressDrawer(false);
          setShowPhysicalCardDrawer(true);
        }}
        cardholderName={cardholderName}
        address={addressData}
      />
      
      {/* Virtual Card Drawer */}
      <VirtualCardDrawer 
        isOpen={showVirtualCardDrawer}
        onClose={() => {
          setShowVirtualCardDrawer(false);
          showSuccess("Virtual card issuance initiated successfully");
        }}
        onBack={() => {
          setShowVirtualCardDrawer(false);
          setShowIssueCardDrawer(true);
        }}
      />
      
      {/* Requests Drawer */}
      <RequestsDrawer
        isOpen={showRequestsDrawer}
        onClose={() => setShowRequestsDrawer(false)}
      />
    </PageLayout>
  );
};

export default CardsPage;