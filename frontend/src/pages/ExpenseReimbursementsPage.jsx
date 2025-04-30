import React, { useState, useEffect } from 'react';
import { 
  Flag, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText,
  Check,
  X
} from 'lucide-react';
import { PageLayout, PageTable } from '../components/common/page-layout';
import CreateReimbursementsDrawer from '../components/CreateReimbursementsDrawer';
import { 
  REIMBURSEMENT_TRANSACTIONS, 
  filterTransactionsByType, 
  searchTransactions,
  formatCurrency 
} from '../utils/ExpenseReimbursementsData';

/**
 * ExpenseReimbursementsPage Component
 * 
 * Displays employee reimbursement transactions with filtering and search capabilities
 */
const ExpenseReimbursementsPage = () => {
  // Page state
  const [activeSubtab, setActiveSubtab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleColumns, setVisibleColumns] = useState([
    'merchant', 'date', 'employeeName', 'amount', 'flagged', 
    'policyReview', 'department', 'category', 'receiptAttached', 
    'reviewStatus', 'approvalStatus'
  ]);
  const [isReimbursementDrawerOpen, setIsReimbursementDrawerOpen] = useState(false);

  // Get transactions based on active subtab and search term
  const getFilteredTransactions = () => {
    const filteredByType = filterTransactionsByType(REIMBURSEMENT_TRANSACTIONS, activeSubtab);
    return searchTransactions(filteredByType, searchTerm);
  };

  // Action buttons for the header
  const actionButtons = [
    // Reminders button (left of Create reimbursements)
    <button
      key="reminders-button"
      className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md"
      onClick={() => console.log('Reminders clicked')}
    >
      Reminders
    </button>,
    
    // Create reimbursements button (extreme right)
    <button
      key="create-reimbursements-button"
      className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-md"
      onClick={() => setIsReimbursementDrawerOpen(true)}
    >
      Create reimbursements
    </button>
  ];

  // Subtabs configuration
  const subtabs = [
    {
      id: 'overview',
      label: 'Overview',
      count: REIMBURSEMENT_TRANSACTIONS.length
    },
    {
      id: 'needs-review',
      label: 'Needs review',
      count: REIMBURSEMENT_TRANSACTIONS.filter(t => t.reviewStatus === 'Needs Review').length
    },
    {
      id: 'pending',
      label: 'Pending',
      count: REIMBURSEMENT_TRANSACTIONS.filter(t => t.approvalStatus === 'Pending').length
    },
    {
      id: 'history',
      label: 'History',
      count: REIMBURSEMENT_TRANSACTIONS.filter(t => t.approvalStatus === 'Approved').length
    }
  ];

  // Table columns configuration
  const columns = [
    {
      id: 'merchant',
      header: 'Merchant',
      accessor: 'merchant',
      cell: (row) => row.merchant,
      visible: true,
      sticky: true,
      width: 180
    },
    {
      id: 'date',
      header: 'Date',
      accessor: 'date',
      cell: (row) => new Date(row.date).toLocaleDateString('en-IN'),
      visible: true,
      width: 120
    },
    {
      id: 'employeeName',
      header: 'Employee name',
      accessor: 'employeeName',
      cell: (row) => row.employeeName,
      visible: true,
      width: 180
    },
    {
      id: 'amount',
      header: 'Amount',
      accessor: 'amount',
      cell: (row) => formatCurrency(row.amount),
      visible: true,
      width: 120
    },
    {
      id: 'flagged',
      header: 'Flagged',
      accessor: 'flagged',
      cell: (row) => row.flagged ? (
        <div className="flex items-center text-red-500">
          <Flag size={16} className="mr-1" />
          <span>Yes</span>
        </div>
      ) : (
        <div className="flex items-center text-gray-400">
          <span>No</span>
        </div>
      ),
      visible: true,
      width: 100
    },
    {
      id: 'policyReview',
      header: 'Policy review',
      accessor: 'policyReview',
      cell: (row) => {
        if (row.policyReview === 'Compliant') {
          return (
            <div className="flex items-center text-green-500">
              <CheckCircle size={16} className="mr-1" />
              <span>Compliant</span>
            </div>
          );
        } else {
          return (
            <div className="flex items-center text-red-500">
              <AlertTriangle size={16} className="mr-1" />
              <span>Flagged</span>
            </div>
          );
        }
      },
      visible: true,
      width: 150
    },
    {
      id: 'flaggedReason',
      header: 'Flagged reason',
      accessor: 'flaggedReason',
      cell: (row) => row.flaggedReason || '-',
      visible: false,
      width: 180
    },
    {
      id: 'department',
      header: 'Department',
      accessor: 'department',
      cell: (row) => row.department,
      visible: true,
      width: 150
    },
    {
      id: 'category',
      header: 'Category',
      accessor: 'category',
      cell: (row) => row.category,
      visible: true,
      width: 150
    },
    {
      id: 'location',
      header: 'Location',
      accessor: 'location',
      cell: (row) => row.location,
      visible: false,
      width: 150
    },
    {
      id: 'receiptAttached',
      header: 'Receipt',
      accessor: 'receiptAttached',
      cell: (row) => row.receiptAttached ? (
        <div className="text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
      ) : (
        <span className="text-gray-400">—</span>
      ),
      visible: true,
      width: 100
    },
    {
      id: 'paymentMethod',
      header: 'Payment method',
      accessor: 'paymentMethod',
      cell: (row) => row.paymentMethod,
      visible: false,
      width: 150
    },
    {
      id: 'spentFrom',
      header: 'Spent From',
      accessor: 'spentFrom',
      cell: (row) => row.spentFrom,
      visible: false,
      width: 150
    },
    {
      id: 'reviewStatus',
      header: 'Review Status',
      accessor: 'reviewStatus',
      cell: (row) => {
        if (row.reviewStatus === 'Reviewed') {
          return (
            <div className="flex items-center text-green-500">
              <Check size={16} className="mr-1" />
              <span>Reviewed</span>
            </div>
          );
        } else {
          return (
            <div className="flex items-center text-amber-500">
              <Clock size={16} className="mr-1" />
              <span>Needs Review</span>
            </div>
          );
        }
      },
      visible: true,
      width: 150
    },
    {
      id: 'approvalStatus',
      header: 'Approval status',
      accessor: 'approvalStatus',
      cell: (row) => {
        if (row.approvalStatus === 'Approved') {
          return (
            <div className="flex items-center text-green-500">
              <CheckCircle size={16} className="mr-1" />
              <span>Approved</span>
            </div>
          );
        } else {
          return (
            <div className="flex items-center text-amber-500">
              <Clock size={16} className="mr-1" />
              <span>Pending</span>
            </div>
          );
        }
      },
      visible: true,
      width: 150
    },
    {
      id: 'note',
      header: 'Note',
      accessor: 'note',
      cell: (row) => row.note,
      visible: false,
      width: 200
    },
    {
      id: 'approverName',
      header: 'Approver Name',
      accessor: 'approverName',
      cell: (row) => row.approverName,
      visible: false,
      width: 180
    },
    {
      id: 'approvedDate',
      header: 'Approved Date',
      accessor: 'approvedDate',
      cell: (row) => row.approvedDate ? new Date(row.approvedDate).toLocaleDateString('en-IN') : '-',
      visible: false,
      width: 150
    },
    {
      id: 'receiptSubmissionDate',
      header: 'Receipt Submission Date',
      accessor: 'receiptSubmissionDate',
      cell: (row) => row.receiptSubmissionDate ? new Date(row.receiptSubmissionDate).toLocaleDateString('en-IN') : '-',
      visible: false,
      width: 200
    }
  ];

  // Format columns for filter and column action buttons
  const formattedColumns = columns.map(col => ({
    id: col.id,
    label: col.header,
    visible: col.visible,
    filterable: true
  }));

  // Define handlers for column visibility and filtering
  const handleColumnVisibilityChange = (columnId, isVisible) => {
    if (isVisible) {
      setVisibleColumns([...visibleColumns, columnId]);
    } else {
      setVisibleColumns(visibleColumns.filter(id => id !== columnId));
    }
  };

  const handleFilterChange = (columnId, filterValue) => {
    console.log(`Filter for column ${columnId} changed to ${filterValue}`);
    // Apply filter logic here in a real implementation
  };

  // Define default visible columns
  const defaultVisibleColumns = columns.filter(col => col.visible).map(col => col.id);

  // Handle download action
  const handleDownload = () => {
    console.log('Download action triggered');
    // Implement download functionality here
  };

  // Get filtered transactions
  const filteredTransactions = getFilteredTransactions();

  return (
    <>
      <PageLayout
        pageTitle="Expenses"
        heading="Reimbursements"
        actions={actionButtons}
        subtabs={subtabs}
        activeSubtab={activeSubtab}
        onSubtabChange={setActiveSubtab}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        columns={formattedColumns}
        onColumnVisibilityChange={handleColumnVisibilityChange}
        onFilterChange={handleFilterChange}
        onDateRangeChange={() => {}}
        onDownload={handleDownload}
        defaultVisibleColumns={defaultVisibleColumns}
        showSearchBar={true}
        showActionButtons={true}
      >
        {/* Reimbursements table using PageTable component */}
        <PageTable
          columns={columns.filter(col => visibleColumns.includes(col.id))}
          data={filteredTransactions}
          loading={false}
          emptyMessage="No reimbursements found matching your criteria"
        />
      </PageLayout>
      
      {/* Create Reimbursements Drawer */}
      <CreateReimbursementsDrawer
        isOpen={isReimbursementDrawerOpen}
        onClose={() => setIsReimbursementDrawerOpen(false)}
      />
    </>
  );
};

export default ExpenseReimbursementsPage;