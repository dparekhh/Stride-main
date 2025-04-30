import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  ChevronDown, 
  ClipboardCheck, 
  AlertCircle, 
  Clock, 
  UserCheck, 
  UserX,
  Filter,
  Settings,
  Eye,
  EyeOff,
  Plus
} from 'lucide-react';
import SearchableDropdown from '../../../components/common/SearchableDropdown';
import { tableUtils } from '../utils/tableUtils';
import { useAccounting } from '../../../contexts/AccountingContext';
import CreateNewRuleModal from '../../../components/common/CreateNewRuleModal';

/**
 * ReimbursementsTable Component
 * 
 * This component displays reimbursement transaction data in a tabular format with
 * checkboxes for selection, category dropdowns, and status indicators.
 */
const ReimbursementsTable = ({
  transactions,
  loading,
  columns,
  checkedRows,
  actionCheckedRows,
  onTransactionCheckboxChange,
  onActionCheckboxChange,
  connectedProvider,
  chartOfAccounts
}) => {
  // Local state for managing category selections
  const [categorySelections, setCategorySelections] = useState({});
  
  // State for CreateNewRuleModal
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [ruleModalData, setRuleModalData] = useState({
    merchantName: '',
    merchantUnsyncedCount: 0,
    receiptStatus: false,
    receiptStatusUnsyncedCount: 0,
    employeeName: '',
    employeeUnsyncedCount: 0,
    selectedCategory: '',
    transaction: null // Will hold the current transaction object
  });
  
  // Get accounting context for chart of accounts visibility and options
  const { 
    toggleAccountVisibility, 
    showHiddenAccounts, 
    toggleShowHiddenAccounts 
  } = useAccounting();
  
  // Handle category dropdown change
  const handleCategoryChange = (transactionId, category) => {
    setCategorySelections(prev => ({
      ...prev,
      [transactionId]: category
    }));
  };
  
  // Use the showHiddenAccounts state from AccountingContext for sync
  useEffect(() => {
    console.log("Syncing showHiddenAccounts state:", showHiddenAccounts);
  }, [showHiddenAccounts]);
  
  // Handle visibility toggle for an account
  const handleToggleVisibility = (accountId) => {
    toggleAccountVisibility(accountId);
  };
  
  // Handle opening the create rule modal
  const openCreateRuleModal = (transaction) => {
    console.log("Opening rule modal with transaction:", transaction);
    
    // Calculate or get unsynced counts - this would normally come from an API
    const merchantUnsyncedCount = transactions.filter(tx => tx.merchant === transaction.merchant).length;
    const mccUnsyncedCount = transactions.filter(tx => tx.mccCategory === transaction.mccCategory).length;
    const cardNameUnsyncedCount = transactions.filter(tx => tx.cardName === transaction.cardName).length;
    const departmentUnsyncedCount = transactions.filter(tx => tx.department === transaction.department).length;
    const locationUnsyncedCount = transactions.filter(tx => tx.location === transaction.location).length;
    
    // Set the rule modal data from the transaction
    setRuleModalData({
      merchantName: transaction.merchant,
      merchantUnsyncedCount: merchantUnsyncedCount || 5, // Fallback to example value
      mccCategory: transaction.mccCategory || '',
      mccUnsyncedCount: mccUnsyncedCount || 0,
      cardName: transaction.cardName || '',
      cardNameUnsyncedCount: cardNameUnsyncedCount || 0,
      department: transaction.department || 'Engineering',
      departmentUnsyncedCount: departmentUnsyncedCount || 12, // Fallback to example value
      location: transaction.location || 'Mumbai',
      locationUnsyncedCount: locationUnsyncedCount || 8, // Fallback to example value
      receiptStatus: transaction.receiptStatus || false,
      receiptStatusUnsyncedCount: 3, // Example value, would come from API
      employeeName: transaction.employeeName || 'N/A',
      employeeUnsyncedCount: 2, // Example value, would come from API
      selectedCategory: '',
      transaction: {
        ...transaction,
        mccCategory: transaction.mccCategory || '',
        mccUnsyncedCount: mccUnsyncedCount || 0,
        cardName: transaction.cardName || '',
        cardNameUnsyncedCount: cardNameUnsyncedCount || 0,
        department: transaction.department || 'Engineering',
        departmentUnsyncedCount: departmentUnsyncedCount || 12,
        location: transaction.location || 'Mumbai',
        locationUnsyncedCount: locationUnsyncedCount || 8
      }
    });
    
    // Open the modal
    setIsRuleModalOpen(true);
  };
  
  // Handle closing the create rule modal
  const closeCreateRuleModal = () => {
    setIsRuleModalOpen(false);
  };

  // Get category options from chart of accounts
  const getCategoryOptions = () => {
    // Get accounts from the accounting context
    if (!chartOfAccounts || chartOfAccounts.length === 0) {
      return [];
    }

    // Filter accounts based on visibility
    let accounts = chartOfAccounts.filter(account => {
      // When showing hidden accounts, only show hidden accounts
      if (showHiddenAccounts) {
        return account.visible === false;
      }
      // When showing visible options, only show visible accounts
      return account.visible !== false;
    });

    // Sort alphabetically by name
    accounts = [...accounts].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    // Map accounts to options format
    return accounts.map(account => ({
      id: account.id,
      name: account.name,
      code: account.code || "",
      type: account.type,
      visible: account.visible !== false // Ensure visible property is defined
    }));
  };
  
  // If loading, display loading state
  if (loading) {
    return (
      <div className="w-full p-8 text-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Loading reimbursements...</p>
      </div>
    );
  }
  
  // If no transactions, display empty state
  if (!transactions || transactions.length === 0) {
    return (
      <div className="w-full p-8 text-center border border-gray-200 rounded-lg">
        <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No reimbursements found</h3>
        <p className="text-gray-500 mt-2">There are no reimbursements matching your criteria.</p>
      </div>
    );
  }
  
  // Function to render approval status icon
  const renderApprovalStatusIcon = (status) => {
    switch(status) {
      case "Approved":
        return <UserCheck size={16} className="text-green-500 mr-2" />;
      case "Pending":
        return <Clock size={16} className="text-yellow-400 mr-2" />;
      default:
        return null;
    }
  };

  // Select all transactions
  const onSelectAll = (allIds) => {
    onTransactionCheckboxChange(null, allIds);
  };

  // Deselect all transactions
  const onDeselectAll = () => {
    onTransactionCheckboxChange(null, {});
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {/* Left Checkbox Column - Always visible */}
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-20 shadow-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                  onChange={(e) => {
                    if (e.target.checked) {
                      const allIds = {};
                      transactions.forEach(tx => { allIds[tx.id] = true; });
                      onSelectAll(allIds);
                    } else {
                      onDeselectAll();
                    }
                  }}
                  checked={Object.keys(checkedRows).length === transactions.length && transactions.length > 0}
                />
              </div>
            </th>
            
            {/* Merchant column - Always sticky left */}
            <th 
              scope="col" 
              className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-12 bg-gray-50 z-10 shadow-sm"
            >
              <div className="flex items-center">
                Merchant
              </div>
            </th>
            
            {/* Visible Columns - Dynamic based on settings (excluding merchant which is always visible) */}
            {columns.filter(column => column.id !== 'merchant').map(column => (
              <th 
                key={column.id}
                scope="col" 
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  {column.name}
                </div>
              </th>
            ))}
            
            {/* Right Action Checkbox Column - Always visible */}
            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky right-0 bg-gray-50 z-10 shadow-sm">
              <div className="flex items-center">
                <span>Action</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map(transaction => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              {/* Left Checkbox Column */}
              <td className="px-3 py-4 whitespace-nowrap sticky left-0 bg-white z-20">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-green-600 border-gray-300 rounded"
                  checked={!!checkedRows[transaction.id]}
                  onChange={() => onTransactionCheckboxChange(transaction.id)}
                />
              </td>
              
              {/* Merchant Column - Always sticky left */}
              <td className="px-3 py-4 whitespace-nowrap sticky left-12 bg-white z-10">
                <div className="flex items-center">
                  {/* Logo placeholder - would be replaced with actual merchant logo */}
                  <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-500">{transaction.merchant?.charAt(0) || "?"}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{transaction.merchant}</div>
                      <div className="ml-2">
                        {renderApprovalStatusIcon(transaction.approvalStatus)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{transaction.expenseCode || "Miscellaneous"}</div>
                    {transaction.policyCompliance === "Flagged" && (
                      <div className="text-xs text-red-500 font-medium mt-1">Flagged</div>
                    )}
                  </div>
                </div>
              </td>
              
              {/* Dynamic Columns based on visibility settings (excluding merchant which is handled separately) */}
              {columns.filter(column => column.id !== 'merchant').map(column => {
                // Render appropriate content based on column type
                switch (column.id) {
                  case 'amount':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {tableUtils.formatCurrency(transaction.amount)}
                        </div>
                      </td>
                    );
                  case 'employeeName':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.employeeName}</div>
                      </td>
                    );
                  case 'expenseCode':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.expenseCode || "—"}</div>
                      </td>
                    );
                  case 'accountingCategory':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <SearchableDropdown
                          options={getCategoryOptions()}
                          value={
                            categorySelections[transaction.id] || 
                            transaction.accountingCategory || 
                            ""
                          }
                          onChange={(value) => handleCategoryChange(transaction.id, value)}
                          placeholder={`Choose one (required)`}
                          className="w-64 text-sm"
                          showAddRule={true}
                          onAddRule={(categoryId) => {
                            // Find the selected category option
                            const category = chartOfAccounts?.find(acc => acc.id === categoryId);
                            if (category) {
                              // Calculate or get unsynced counts
                              const merchantUnsyncedCount = transactions.filter(tx => tx.merchant === transaction.merchant).length;
                              const mccUnsyncedCount = transactions.filter(tx => tx.mccCategory === transaction.mccCategory).length;
                              const cardNameUnsyncedCount = transactions.filter(tx => tx.cardName === transaction.cardName).length;
                              const departmentUnsyncedCount = transactions.filter(tx => tx.department === transaction.department).length;
                              const locationUnsyncedCount = transactions.filter(tx => tx.location === transaction.location).length;
                              
                              // Update rule modal data with the selected category and all required fields
                              setRuleModalData({
                                selectedCategory: categoryId,
                                merchantName: transaction.merchant,
                                merchantUnsyncedCount: merchantUnsyncedCount || 5,
                                mccCategory: transaction.mccCategory || '',
                                mccUnsyncedCount: mccUnsyncedCount || 0,
                                cardName: transaction.cardName || '',
                                cardNameUnsyncedCount: cardNameUnsyncedCount || 0,
                                department: transaction.department || 'Engineering',
                                departmentUnsyncedCount: departmentUnsyncedCount || 12,
                                location: transaction.location || 'Mumbai',
                                locationUnsyncedCount: locationUnsyncedCount || 8,
                                receiptStatus: transaction.receiptStatus || false,
                                receiptStatusUnsyncedCount: 3,
                                employeeName: transaction.employeeName || 'N/A',
                                employeeUnsyncedCount: 2,
                                transaction: {
                                  ...transaction,
                                  mccCategory: transaction.mccCategory || '',
                                  mccUnsyncedCount: mccUnsyncedCount || 0,
                                  cardName: transaction.cardName || '',
                                  cardNameUnsyncedCount: cardNameUnsyncedCount || 0,
                                  department: transaction.department || 'Engineering',
                                  departmentUnsyncedCount: departmentUnsyncedCount || 12,
                                  location: transaction.location || 'Mumbai',
                                  locationUnsyncedCount: locationUnsyncedCount || 8
                                }
                              });
                              // Open the rule modal
                              setIsRuleModalOpen(true);
                            }
                          }}
                          supportsVisibility={true}
                          showHiddenOptions={showHiddenAccounts}
                          onToggleShowHidden={() => toggleShowHiddenAccounts()}
                          onToggleVisibility={(accountId) => handleToggleVisibility(accountId)}
                          showHiddenToggle={true}
                        />
                      </td>
                    );
                  case 'spentFrom':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.spentFrom || "Personal Funds"}</div>
                      </td>
                    );
                  case 'department':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.department || "—"}</div>
                      </td>
                    );
                  case 'location':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.location || "—"}</div>
                      </td>
                    );
                  case 'approvalStatus':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tableUtils.getApprovalStatusColor(transaction.approvalStatus)}`}>
                          {transaction.approvalStatus}
                        </span>
                      </td>
                    );
                  case 'policyCompliance':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tableUtils.getPolicyComplianceColor(transaction.policyCompliance)}`}>
                          {transaction.policyCompliance}
                        </span>
                      </td>
                    );
                  case 'notes':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.notes || "—"}</div>
                      </td>
                    );
                  case 'receiptStatus':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        {transaction.receiptStatus ? (
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
                        )}
                      </td>
                    );
                  case 'clearedDate':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tableUtils.formatDate(transaction.clearedDate) || "—"}</div>
                      </td>
                    );
                  case 'transactionId':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.transactionId}</div>
                      </td>
                    );
                  default:
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction[column.accessor] || "—"}
                        </div>
                      </td>
                    );
                }
              })}
              
              {/* Right Action Column */}
              <td className="px-3 py-4 whitespace-nowrap sticky right-0 bg-white z-10">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-orange-600 border-gray-300 rounded mr-2"
                    checked={!!actionCheckedRows[transaction.id]}
                    onChange={() => onActionCheckboxChange(transaction.id)}
                  />
                  <button
                    className="px-2 py-1 ml-1 text-gray-500 hover:text-gray-800"
                    onClick={() => console.log('View details for', transaction.transactionId)}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Create New Rule Modal */}
      {isRuleModalOpen && (
        <CreateNewRuleModal
          isOpen={isRuleModalOpen}
          onClose={closeCreateRuleModal}
          merchantName={ruleModalData.merchantName}
          merchantUnsyncedCount={ruleModalData.merchantUnsyncedCount}
          mccCategory={ruleModalData.transaction?.mccCategory || ''}
          mccUnsyncedCount={ruleModalData.transaction?.mccUnsyncedCount || 0}
          cardName={ruleModalData.transaction?.cardName || ''}
          cardNameUnsyncedCount={ruleModalData.transaction?.cardNameUnsyncedCount || 0}
          selectedCategory={ruleModalData.selectedCategory}
          transaction={ruleModalData.transaction}
          onSave={(data) => {
            console.log("Saving rule with data:", data);
            closeCreateRuleModal();
          }}
        />
      )}
    </div>
  );
};

export default ReimbursementsTable;