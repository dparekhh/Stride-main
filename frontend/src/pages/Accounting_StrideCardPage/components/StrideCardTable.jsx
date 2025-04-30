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
 * StrideCardTable Component
 * 
 * This component displays transaction data in a tabular format with
 * checkboxes for selection, category dropdowns, and status indicators.
 */
const StrideCardTable = ({
  transactions,
  loading,
  columns,
  checkedRows,
  actionCheckedRows,
  onTransactionCheckboxChange,
  onActionCheckboxChange,
  connectedProvider
}) => {
  // Local state for managing category selections
  const [categorySelections, setCategorySelections] = useState({});
  
  // State for CreateNewRuleModal
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [ruleModalData, setRuleModalData] = useState({
    merchantName: '',
    merchantUnsyncedCount: 0,
    mccCategory: '',
    mccUnsyncedCount: 0,
    cardName: '',
    cardNameUnsyncedCount: 0,
    selectedCategory: '',
    transaction: null // Will hold the current transaction object
  });
  
  // Get accounting context for chart of accounts visibility and options
  const { 
    toggleAccountVisibility, 
    showHiddenAccounts, 
    toggleShowHiddenAccounts,
    chartOfAccounts
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
    
    // Set the rule modal data from the transaction
    setRuleModalData({
      merchantName: transaction.merchant,
      merchantUnsyncedCount: 5, // Example value, would come from API
      mccCategory: transaction.mccCategory || 'N/A',
      mccUnsyncedCount: 3, // Example value, would come from API
      cardName: transaction.cardName || 'N/A',
      cardNameUnsyncedCount: 2, // Example value, would come from API
      selectedCategory: '',
      transaction
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
        <p className="text-gray-500">Loading transactions...</p>
      </div>
    );
  }
  
  // If no transactions, display empty state
  if (!transactions || transactions.length === 0) {
    return (
      <div className="w-full p-8 text-center border border-gray-200 rounded-lg">
        <ClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No transactions found</h3>
        <p className="text-gray-500 mt-2">There are no transactions matching your criteria.</p>
      </div>
    );
  }
  
  // Function to render approval status icon
  const renderApprovalStatusIcon = (status) => {
    switch(status) {
      case "Approved":
        return <UserCheck size={16} className="text-green-500 mr-2" />;
      case "Awaiting reviewer":
        return <UserX size={16} className="text-gray-400 mr-2" />;
      case "Awaiting cardholder":
        return <Clock size={16} className="text-gray-400 mr-2" />;
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
                    {transaction.merchantLogo ? (
                      <img src={transaction.merchantLogo} alt={transaction.merchant} className="h-8 w-8 rounded-full" />
                    ) : (
                      <span className="text-xs font-medium text-gray-500">{transaction.merchant?.charAt(0) || "?"}</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">{transaction.merchant}</div>
                      <div className="ml-2">
                        {renderApprovalStatusIcon(transaction.approvalStatus)}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">{transaction.mccCategory || "Travel & Lodging"}</div>
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
                          {tableUtils.formatCurrency(transaction.amount, transaction.currency)}
                        </div>
                      </td>
                    );
                  case 'cardholder':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.cardholder}</div>
                      </td>
                    );
                  case 'cardName':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.cardName || "—"}</div>
                      </td>
                    );
                  case 'transactionDate':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tableUtils.formatDate(transaction.transactionDate)}</div>
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
                            const category = chartOfAccounts.find(acc => acc.id === categoryId);
                            if (category) {
                              // Update rule modal data with the selected category
                              setRuleModalData({
                                ...ruleModalData,
                                selectedCategory: categoryId,
                                merchantName: transaction.merchant,
                                mccCategory: transaction.mccCategory || 'N/A',
                                mccUnsyncedCount: 3, // Example value
                                cardName: transaction.cardName || 'N/A',
                                cardNameUnsyncedCount: 2, // Example value
                                transaction: transaction
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
                          renderFooter={() => (
                            <div className="p-2 border-t border-gray-100 sticky bottom-0 bg-white flex justify-between items-center">
                              <button
                                type="button"
                                className="flex items-center text-gray-600 hover:text-gray-800"
                                onClick={() => handleCategoryChange(transaction.id, "")}
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Clear selection
                              </button>
                              
                              <div className="relative group">
                                <button
                                  type="button"
                                  className="flex items-center text-gray-600 hover:text-gray-800"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleShowHiddenAccounts();
                                  }}
                                  aria-label={showHiddenAccounts ? "Show visible options" : "Show hidden options"}
                                >
                                  {showHiddenAccounts ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                <div 
                                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-white border border-gray-200 rounded-md shadow-sm text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                  style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    marginBottom: '8px',
                                    padding: '6px 8px',
                                    background: 'white',
                                    border: '1px solid rgb(229 231 235)',
                                    borderRadius: '6px',
                                    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
                                    fontSize: '0.75rem',
                                    whiteSpace: 'nowrap',
                                    pointerEvents: 'none',
                                  }}
                                >
                                  {showHiddenAccounts ? "Show visible options" : "Show hidden options"}
                                </div>
                              </div>
                            </div>
                          )}
                        />
                      </td>
                    );
                  case 'spentFrom':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.spentFrom || "—"}</div>
                      </td>
                    );
                  case 'department':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.department || "Not assigned"}</div>
                      </td>
                    );
                  case 'location':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{transaction.location || "Not assigned"}</div>
                      </td>
                    );
                  case 'approvalStatus':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tableUtils.getApprovalStatusClass(transaction.approvalStatus)}`}>
                          {transaction.approvalStatus}
                        </span>
                      </td>
                    );
                  case 'policyCompliance':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tableUtils.getPolicyComplianceClass(transaction.policyCompliance)}`}>
                          {transaction.policyCompliance}
                        </span>
                      </td>
                    );
                  case 'notes':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.notes ? 
                            <span className="inline-flex items-center">
                              <AlertCircle className="h-4 w-4 mr-1 text-gray-400" />
                              {transaction.notes.length > 20 ? 
                                `${transaction.notes.substring(0, 20)}...` : 
                                transaction.notes
                              }
                            </span> : 
                            "—"
                          }
                        </div>
                      </td>
                    );
                  case 'receiptStatus':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tableUtils.getReceiptStatusClass(transaction.receiptStatus)}`}>
                          {transaction.receiptStatus}
                        </span>
                      </td>
                    );
                  case 'clearedDate':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {transaction.clearedDate ? 
                            tableUtils.formatDate(transaction.clearedDate) : 
                            "Pending"
                          }
                        </div>
                      </td>
                    );
                  case 'transactionId':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{transaction.transactionId}</div>
                      </td>
                    );
                  case 'cardLimit':
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tableUtils.formatCurrency(transaction.cardLimit, transaction.currency)}
                        </div>
                      </td>
                    );
                  default:
                    return (
                      <td key={column.id} className="px-3 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">—</div>
                      </td>
                    );
                }
              })}
              
              {/* Right Action Checkbox Column */}
              <td className="px-3 py-4 whitespace-nowrap text-right sticky right-0 bg-white z-10 shadow-sm">
                <div className="flex items-center justify-end">
                  {/* Single action item */}
                  <div 
                    className={`h-7 w-7 bg-gray-50 border border-gray-200 rounded flex items-center justify-center ${
                      categorySelections[transaction.id] || transaction.accountingCategory
                        ? 'cursor-pointer hover:bg-gray-100'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (categorySelections[transaction.id] || transaction.accountingCategory) {
                        onActionCheckboxChange(transaction.id);
                      }
                    }}
                  >
                    <CheckSquare
                      className={`h-4 w-4 ${
                        actionCheckedRows[transaction.id] ? 
                        'text-green-600' : 
                        (categorySelections[transaction.id] || transaction.accountingCategory) ? 
                        'text-gray-500' : 
                        'text-gray-300'
                      }`}
                    />
                  </div>
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
          mccCategory={ruleModalData.mccCategory}
          mccUnsyncedCount={ruleModalData.mccUnsyncedCount}
          cardName={ruleModalData.cardName}
          cardNameUnsyncedCount={ruleModalData.cardNameUnsyncedCount}
          selectedCategory={ruleModalData.selectedCategory}
          transaction={ruleModalData.transaction}
          connectedProvider={connectedProvider}
          onSave={(ruleData) => {
            console.log("Rule saved:", ruleData);
            closeCreateRuleModal();
          }}
        />
      )}
    </div>
  );
};

export default StrideCardTable;