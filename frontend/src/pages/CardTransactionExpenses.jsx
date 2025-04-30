import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight,
  Receipt,
  Flag,
  Check,
  X,
  FileText
} from 'lucide-react';
import PaymentsDrawer from '../components/PaymentsDrawer';
import StatementsDrawer from '../components/StatementsDrawer';
import BalanceProgressBar from '../components/common/BalanceProgressBar';
import { PageLayout, PageTable } from '../components/common/page-layout';
import { 
  MOCK_CARD_TRANSACTION_EXPENSES, 
  formatCurrency, 
  filterTransactionsByType, 
  searchTransactions 
} from '../utils/Expenses_CardTransactionPageData';

const CardTransactionExpenses = ({ children }) => {
  // Filter states
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaymentsDrawer, setShowPaymentsDrawer] = useState(false);
  const [showStatementsDrawer, setShowStatementsDrawer] = useState(false);

  // Dropdown toggle states
  const [showCalendarDropdown, setShowCalendarDropdown] = useState(false);
  const [showColumnsDropdown, setShowColumnsDropdown] = useState(false);

  // Refs for click-outside handling
  const calendarDropdownRef = useRef(null);

  // Add body class when drawer is open to blur the entire app
  useEffect(() => {
    // When a drawer is open, add a class to the body to handle blur in CSS
    if (showPaymentsDrawer || showStatementsDrawer) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }

    // Cleanup function to ensure class is removed when component unmounts
    return () => {
      document.body.classList.remove('drawer-open');
    };
  }, [showPaymentsDrawer, showStatementsDrawer]);

  // Handle clicks outside of dropdowns to close them
  useEffect(() => {
    function handleClickOutside(event) {
      // Calendar dropdown
      if (calendarDropdownRef.current && !calendarDropdownRef.current.contains(event.target)) {
        setShowCalendarDropdown(false);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Using transaction data from our data utility file
  const [transactions, setTransactions] = useState(MOCK_CARD_TRANSACTION_EXPENSES);
  
  // Column management state
  const [columns] = useState([
    { id: 'merchant', label: 'Merchant', header: 'Merchant', accessor: 'merchant', 
      render: (item) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            {item.merchant.charAt(0)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{item.merchant}</div>
            <div className="text-sm text-gray-500">{item.merchantDescription}</div>
          </div>
        </div>
      )
    },
    { id: 'date', label: 'Date', header: 'Date', accessor: 'date',
      render: (item) => (
        <span>{new Date(item.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
      )
    },
    { id: 'cardholder', label: 'Cardholder', header: 'Cardholder', accessor: 'cardholder',
      render: (item) => <span>{item.cardholder}</span>
    },
    { id: 'card', label: 'Card', header: 'Card', accessor: 'card',
      render: (item) => <span>{item.card}</span>
    },
    { id: 'flagged', label: 'Flagged', header: 'Flagged', accessor: 'flagged',
      render: (item) => (
        <div className="flex items-center">
          {item.flagged && <Flag size={16} className="text-yellow-500" />}
        </div>
      )
    },
    { id: 'department', label: 'Department', header: 'Department', accessor: 'department',
      render: (item) => <span>{item.department}</span>
    },
    { id: 'category', label: 'Category', header: 'Category', accessor: 'category',
      render: (item) => <span>{item.category}</span>
    },
    { id: 'location', label: 'Location', header: 'Location', accessor: 'location',
      render: (item) => <span>{item.location}</span>
    },
    { id: 'amount', label: 'Amount', header: 'Amount', accessor: 'amount',
      render: (item) => <span className="font-medium">{formatCurrency(item.amount)}</span>
    },
    { id: 'spentFrom', label: 'Spent From', header: 'Spent From', accessor: 'spentFrom' },
    { id: 'approvalStatus', label: 'Approval status', header: 'Approval status', accessor: 'approvalStatus' },
    { id: 'approvedDate', label: 'Approved Date', header: 'Approved Date', accessor: 'approvedDate' },
    { id: 'approver', label: 'Approver Name', header: 'Approver Name', accessor: 'approver' },
    { id: 'flaggedReason', label: 'Flagged reason', header: 'Flagged reason', accessor: 'flaggedReason' },
    { id: 'memo', label: 'Memo', header: 'Memo', accessor: 'memo' },
    { id: 'receipt', label: 'Receipt Attached', header: 'Receipt Attached', accessor: 'receipt',
      render: (item) => (
        <div className="flex items-center">
          {item.receipt && <Check size={16} className="text-green-500" />}
        </div>
      )
    },
    { id: 'reviewStatus', label: 'Review Status', header: 'Review Status', accessor: 'reviewStatus' },
    { id: 'submissionDate', label: 'Submission Date', header: 'Submission Date', accessor: 'submissionDate' }
  ]);
  
  // Use all column IDs as default visible columns
  const defaultVisibleColumns = columns.map(column => column.id);
  
  const [visibleColumns, setVisibleColumns] = useState([...defaultVisibleColumns]);
  
  // Handle column visibility change and reordering
  const handleColumnVisibilityChange = (columnId, isVisible, newIndex) => {
    if (typeof newIndex === 'number') {
      // Handle column reordering
      const updatedColumns = [...columns];
      
      // Find the column to move
      const columnToMove = updatedColumns.find(col => col.id === columnId);
      if (!columnToMove) return;

      // Find current index
      const currentIndex = updatedColumns.indexOf(columnToMove);
      
      // Remove the column from its current position
      updatedColumns.splice(currentIndex, 1);
      
      // Insert the column at the new position
      updatedColumns.splice(newIndex, 0, columnToMove);
      
      // Update the columns state (we're not actually changing the state here
      // because columns is a constant, but in a real app you would update it)
      // This would be something like setColumns(updatedColumns);
      
      // Instead, we'll update the visible columns to respect the new order
      const newVisibleColumns = updatedColumns
        .filter(col => visibleColumns.includes(col.id))
        .map(col => col.id);
      
      setVisibleColumns(newVisibleColumns);
    } else if (isVisible) {
      // Handle column visibility toggling (show)
      setVisibleColumns(prev => [...prev, columnId]);
    } else {
      // Handle column visibility toggling (hide)
      setVisibleColumns(prev => prev.filter(id => id !== columnId));
    }
  };
  
  // Handle reset to default columns
  const handleResetColumns = () => {
    setVisibleColumns([...defaultVisibleColumns]);
  };
  
  // Handle filter selection
  const handleFilterChange = (filterId) => {
    console.log('Filter selected:', filterId);
    
    // Apply filter based on selected filter ID
    if (filterId === 'flagged') {
      setActiveFilter('flagged');
    } else if (filterId === 'receipt') {
      setActiveFilter('needs-review');
    } else if (filterId === 'approvalStatus') {
      setActiveFilter('fully-approved');
    } else {
      // For other filters, you could implement more complex filtering logic
      // or open specific filter dialogs based on the selected filter
      console.log(`Filter ${filterId} not implemented yet`);
    }
  };

  // Sample statements data
  const [statements] = useState([
    {
      id: 1,
      period: 'March 2024',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      totalTransactions: 42,
      totalAmount: 149568.50,
      status: 'Current',
      dueDate: '2024-04-15',
      downloadUrl: '#'
    },
    {
      id: 2,
      period: 'February 2024',
      startDate: '2024-02-01',
      endDate: '2024-02-29',
      totalTransactions: 37,
      totalAmount: 125732.75,
      status: 'Paid',
      dueDate: '2024-03-15',
      downloadUrl: '#'
    },
    {
      id: 3,
      period: 'January 2024',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      totalTransactions: 45,
      totalAmount: 163891.20,
      status: 'Paid',
      dueDate: '2024-02-15',
      downloadUrl: '#'
    },
    {
      id: 4,
      period: 'December 2023',
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      totalTransactions: 56,
      totalAmount: 219754.35,
      status: 'Paid',
      dueDate: '2024-01-15',
      downloadUrl: '#'
    }
  ]);

  // Sample payment history data
  const [paymentHistory] = useState([
    {
      id: 1,
      type: 'Cashback redeemed',
      date: '11/14/2024',
      amount: 1636.68
    },
    {
      id: 2,
      type: 'Cashback redeemed',
      date: '11/14/2024',
      amount: 1227.51
    },
    {
      id: 3,
      type: 'Manual payment',
      date: '11/14/2024',
      account: 'Checking (****9752)',
      amount: 8994.53
    },
    {
      id: 4, 
      type: 'Manual payment',
      date: '11/14/2024',
      account: 'Checking (****9752)',
      amount: 8797.38
    },
    {
      id: 5,
      type: 'Manual payment',
      date: '11/14/2024',
      account: 'Checking (****9752)',
      amount: 9384.47
    },
    {
      id: 6,
      type: 'Manual payment',
      date: '11/14/2024',
      account: 'Checking (****9752)',
      amount: 3779.27
    }
  ]);

  // Using formatCurrency from our data utility file

  // Current and total balance values (as requested)
  const totalBalance = 2000000;
  const currentBalance = 1539072.87;
  const pendingBalance = 203097;
  const cashbackRate = 0.005; // 0.5%
  const availableCashback = currentBalance * cashbackRate;
  const pendingCashback = pendingBalance * cashbackRate;

  // Filter transactions based on activeFilter and search term using utility functions
  const filteredByType = filterTransactionsByType(transactions, activeFilter);
  const filteredTransactions = searchTransactions(filteredByType, searchTerm);
  
  // Handle download of transaction data
  const handleDownload = () => {
    // In a real application, this would export the filtered transactions to a file
    console.log('Downloading transaction data:', filteredTransactions);
    
    // Example implementation that could be used in a real app:
    // 1. Format the data for export
    // 2. Create a file with the appropriate format (CSV, XLSX, etc.)
    // 3. Trigger a download in the browser
    
    alert('Downloading transaction data...');
    // Here you would typically call an export utility function
    // exportToExcel(filteredTransactions, 'card_transactions.xlsx');
  };

  // Progress bar calculation
  const progressPercentage = (currentBalance / totalBalance) * 100;

  // Define action buttons for the PageHeader
  const headerActions = [
    <button 
      key="statements"
      className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md flex items-center"
      onClick={() => setShowStatementsDrawer(true)}
    >
      <FileText size={16} className="mr-2" />
      Statements
    </button>,
    <button 
      key="payments"
      className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md flex items-center"
      onClick={() => setShowPaymentsDrawer(true)}
    >
      Payments
    </button>
  ];
  
  // Calculate transaction counts for each subtab
  const getTransactionCount = (filter) => {
    if (filter === 'all') {
      return transactions.length;
    } else if (filter === 'needs-review') {
      return transactions.filter(tx => tx.reviewStatus === 'needs_review').length;
    } else if (filter === 'flagged') {
      return transactions.filter(tx => tx.flagged).length;
    } else if (filter === 'fully-approved') {
      return transactions.filter(tx => tx.approvalStatus === 'approved').length;
    } else if (filter === 'declined') {
      return transactions.filter(tx => tx.approvalStatus === 'declined').length;
    }
    return 0;
  };

  // Define subtabs for the PageLayout using the standardized format with counts
  const subtabs = [
    { id: 'all', label: 'All', icon: Receipt, count: getTransactionCount('all') },
    { id: 'needs-review', label: 'Needs review', icon: Receipt, count: getTransactionCount('needs-review') },
    { id: 'flagged', label: 'Flagged', icon: Flag, count: getTransactionCount('flagged') },
    { id: 'fully-approved', label: 'Fully approved', icon: Check, count: getTransactionCount('fully-approved') },
    { id: 'declined', label: 'Declined', icon: X, count: getTransactionCount('declined') }
  ];

  // Create balance progress bar component to be used between header and subtabs
  const balanceProgressBarComponent = (
    <BalanceProgressBar
      currentBalance={currentBalance}
      totalBalance={totalBalance}
      pendingBalance={pendingBalance}
      availableCashback={availableCashback}
      pendingCashback={pendingCashback}
      onAddFunds={() => alert('Add funds action would open a modal in a real implementation')}
    />
  );

  return (
    <div>
      <PageLayout
        pageTitle="Expenses"
        heading="Card transactions"
        actions={headerActions}
        subtabs={subtabs}
        activeSubtab={activeFilter}
        onSubtabChange={setActiveFilter}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        columns={columns}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        onFilterChange={handleFilterChange}
        onDateRangeChange={() => {}}
        onDownload={handleDownload}
        defaultVisibleColumns={defaultVisibleColumns}
        showSearchBar={true}
        showActionButtons={true}
        headerBottomComponent={balanceProgressBarComponent}
      >

        {/* Transactions table using PageTable component */}
        <PageTable
          columns={columns.filter(col => visibleColumns.includes(col.id))}
          data={filteredTransactions}
          loading={false}
          emptyMessage="No transactions found matching your criteria"
        />

        {/* Pagination */}
        <div className="flex items-center justify-between py-4">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTransactions.length}</span> of <span className="font-medium">{transactions.length}</span> transactions
          </div>
          <div className="flex items-center space-x-2">
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm font-medium text-gray-700">
              Previous
            </button>
            <span className="border border-gray-300 rounded-md px-3 py-1 text-sm font-medium bg-blue-50 text-blue-600">1</span>
            <button className="border border-gray-300 rounded-md px-3 py-1 text-sm font-medium text-gray-700 flex items-center">
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>
      </PageLayout>

      {/* Payments Drawer - Using reusable component with all required props */}
      <PaymentsDrawer 
        isOpen={showPaymentsDrawer} 
        onClose={() => setShowPaymentsDrawer(false)} 
        paymentHistory={paymentHistory}
        currentBalance={currentBalance}
        pendingBalance={pendingBalance}
        availableCashback={availableCashback}
        pendingCashback={pendingCashback}
      />

      {/* Statements Drawer - Using reusable component */}
      <StatementsDrawer 
        isOpen={showStatementsDrawer} 
        onClose={() => setShowStatementsDrawer(false)} 
        statements={statements} 
      />
    </div>
  );
};

export default CardTransactionExpenses;