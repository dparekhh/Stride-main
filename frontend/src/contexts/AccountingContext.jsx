import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  CHART_OF_ACCOUNTS, 
  fetchChartOfAccounts, 
  assignCategoryToTransaction,
  filterAccountsBySearchTerm,
  validateCategory,
  initializeAccountVisibility,
  saveAccountVisibility,
  filterAccountsByVisibility,
  VISIBILITY_CACHE_KEY
} from '../utils/accountingData';
import {
  fetchTransactions,
  updateTransactionCategory,
  filterTransactionsBySearchTerm,
  filterTransactionsByDateRange
} from '../utils/AccountingStrideCardPage_StrideCardData';

// Create the accounting context
const AccountingContext = createContext();

// Constants
const CACHE_EXPIRY_TIME = 30 * 60 * 1000; // 30 minutes in milliseconds
const LOCAL_STORAGE_KEYS = {
  CHART_OF_ACCOUNTS_CACHE: 'stride_chart_of_accounts_cache',
  TRANSACTION_CATEGORIES: 'stride_transaction_categories',
  CONNECTION_STATE: 'accounting_connection_state',
  CUSTOM_PROVIDERS: 'custom_accounting_providers',
  TRANSACTIONS_CACHE: 'stride_transactions_cache',
  TRANSACTIONS_LAST_FETCH: 'stride_transactions_last_fetch'
};

/**
 * AccountingProvider component
 * 
 * This provider manages accounting data including:
 * - Chart of Accounts
 * - Transaction categories
 * - Accounting software integration
 * - Data fetching, caching, and error states
 */
export const AccountingProvider = ({ children }) => {
  // Chart of Accounts State - initialized with data, never needs loading
  const [chartOfAccounts, setChartOfAccounts] = useState(initializeAccountVisibility());
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [accountsError, setAccountsError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(new Date().getTime());
  const [showHiddenAccounts, setShowHiddenAccounts] = useState(false);
  
  // Transaction Categories State - no async operations needed
  const [transactionCategories, setTransactionCategories] = useState({});
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState(null);
  
  // Stride Card Transactions State - pre-loaded with static data
  const [transactions, setTransactions] = useState([]);
  const [transactionsTotal, setTransactionsTotal] = useState(0);
  const [transactionsPage, setTransactionsPage] = useState(1);
  const [transactionsPageSize, setTransactionsPageSize] = useState(10);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [transactionsError, setTransactionsError] = useState(null);
  const [transactionsLastFetchTime, setTransactionsLastFetchTime] = useState(new Date().getTime());
  const [transactionFilters, setTransactionFilters] = useState({
    searchTerm: '',
    dateRange: { startDate: null, endDate: null },
    statuses: []
  });
  
  // Connection State (existing)
  const [isConnected, setIsConnected] = useState(false);
  const [connectedProvider, setConnectedProvider] = useState({
    id: 'quickbooks',
    name: 'QuickBooks', 
    logo: '/assets/logos/quickbooks.png', 
    isCustom: false
  });
  const [connectionData, setConnectionData] = useState(null);
  
  // Available providers list (existing)
  const [availableProviders, setAvailableProviders] = useState([
    { id: 'quickbooks', name: 'QuickBooks', logo: '/assets/logos/quickbooks.png', isCustom: false },
    { id: 'xero', name: 'Xero', logo: '/assets/logos/xero.png', isCustom: false },
    { id: 'zohobooks', name: 'Zoho Books', logo: '/assets/logos/zohobooks.png', isCustom: false },
    { id: 'tally', name: 'Tally', logo: '/assets/logos/tally.png', isCustom: false },
    { id: 'netsuite', name: 'NetSuite', logo: '/assets/logos/netsuite.png', isCustom: false },
    { id: 'sap', name: 'SAP', logo: '/assets/logos/sap.png', isCustom: false },
    { id: 'dynamics365', name: 'Microsoft Dynamics 365', logo: '/assets/logos/dynamics365.png', isCustom: false },
    { id: 'odoo', name: 'Odoo', logo: '/assets/logos/odoo.png', isCustom: false },
    { id: 'sage', name: 'Sage', logo: '/assets/logos/sage.png', isCustom: false }
  ]);
  
  // Load Chart of Accounts from cache or fallback to initial state
  useEffect(() => {
    try {
      const cachedData = localStorage.getItem(LOCAL_STORAGE_KEYS.CHART_OF_ACCOUNTS_CACHE);
      
      if (cachedData) {
        const { accounts, timestamp } = JSON.parse(cachedData);
        const now = new Date().getTime();
        
        // Check if cache is still valid (not expired)
        if (accounts && timestamp && (now - timestamp < CACHE_EXPIRY_TIME)) {
          setChartOfAccounts(accounts);
          setLastFetchTime(timestamp);
          setIsLoadingAccounts(false);
          console.log('Using cached Chart of Accounts data');
          return;
        }
      }
      
      // If no valid cache, fetch fresh data
      loadChartOfAccounts();
    } catch (error) {
      console.error('Error loading Chart of Accounts from cache:', error);
      // If there's an error with cache, fetch fresh data
      loadChartOfAccounts();
    }
  }, []);
  
  // Load saved transaction categories from localStorage
  useEffect(() => {
    try {
      const savedCategories = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTION_CATEGORIES);
      if (savedCategories) {
        setTransactionCategories(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Error loading transaction categories:', error);
    }
  }, []);
  
  // Save transaction categories to localStorage when they change
  useEffect(() => {
    if (Object.keys(transactionCategories).length > 0) {
      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEYS.TRANSACTION_CATEGORIES, 
          JSON.stringify(transactionCategories)
        );
      } catch (error) {
        console.error('Error saving transaction categories:', error);
      }
    }
  }, [transactionCategories]);
  
  // Load transactions from cache or fetch new ones
  useEffect(() => {
    try {
      // Try to load transactions from cache first
      const cachedTransactions = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS_CACHE);
      const lastFetchTime = localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS_LAST_FETCH);
      
      if (cachedTransactions && lastFetchTime) {
        const parsedData = JSON.parse(cachedTransactions);
        const timestamp = parseInt(lastFetchTime, 10);
        const now = new Date().getTime();
        
        // Check if the cache is still valid
        if (parsedData && timestamp && now - timestamp < CACHE_EXPIRY_TIME) {
          setTransactions(parsedData.data || []);
          setTransactionsTotal(parsedData.total || 0);
          setTransactionsPage(parsedData.page || 1);
          setTransactionsPageSize(parsedData.pageSize || 10);
          setTransactionsLastFetchTime(timestamp);
          setIsLoadingTransactions(false);
          console.log('Using cached transaction data');
          return;
        }
      }
      
      // If no valid cache, load fresh data
      loadTransactions();
    } catch (error) {
      console.error('Error loading transactions from cache:', error);
      loadTransactions();
    }
  }, []);
  
  // Load connection state and custom providers from localStorage
  useEffect(() => {
    try {
      // Load any saved custom providers first
      const savedCustomProviders = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOM_PROVIDERS);
      if (savedCustomProviders) {
        const customProviders = JSON.parse(savedCustomProviders);
        if (Array.isArray(customProviders) && customProviders.length > 0) {
          console.log('Loading saved custom providers:', customProviders);
          
          // Add custom providers to the available providers list
          setAvailableProviders(prev => {
            // Filter out any existing custom providers to avoid duplicates
            const standardProviders = prev.filter(p => !p.isCustom);
            return [...standardProviders, ...customProviders];
          });
        }
      }
      
      // Then load connection state
      const savedConnectionState = localStorage.getItem(LOCAL_STORAGE_KEYS.CONNECTION_STATE);
      if (savedConnectionState) {
        const { isConnected, connectedProvider, connectionData } = JSON.parse(savedConnectionState);
        setIsConnected(isConnected);
        setConnectedProvider(connectedProvider);
        setConnectionData(connectionData);
      }
    } catch (error) {
      console.error('Error loading accounting connection state or custom providers:', error);
    }
  }, []);
  
  // Save connection state to localStorage when it changes
  useEffect(() => {
    if (isConnected && connectedProvider) {
      const connectionState = {
        isConnected,
        connectedProvider,
        connectionData
      };
      localStorage.setItem(LOCAL_STORAGE_KEYS.CONNECTION_STATE, JSON.stringify(connectionState));
    } else if (!isConnected) {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CONNECTION_STATE);
    }
  }, [isConnected, connectedProvider, connectionData]);
  
  /**
   * Load Chart of Accounts from the API or use fallback data
   * This function handles both online and offline scenarios
   */
  const loadChartOfAccounts = useCallback((forceRefresh = false) => {
    // Simply use the static data, no loading states or async needed
    const now = new Date().getTime();
    const accounts = initializeAccountVisibility();
    setChartOfAccounts(accounts);
    setLastFetchTime(now);
    setIsLoadingAccounts(false);
    setAccountsError(null);
    
    console.log('Chart of Accounts loaded directly');
    
    // Update local storage for cache
    try {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.CHART_OF_ACCOUNTS_CACHE, 
        JSON.stringify({
          accounts,
          timestamp: now
        })
      );
    } catch (error) {
      console.warn('Error caching Chart of Accounts:', error);
    }
  }, []);
  
  /**
   * Get accounts filtered by search term
   * This is memoized to prevent unnecessary filtering
   */
  const getFilteredAccounts = useCallback((searchTerm, visibilityFilter = true) => {
    // First filter by visibility if specified
    const visibleAccounts = visibilityFilter 
      ? filterAccountsByVisibility(chartOfAccounts, !showHiddenAccounts)
      : chartOfAccounts;
    
    // Then filter by search term
    return filterAccountsBySearchTerm(visibleAccounts, searchTerm);
  }, [chartOfAccounts, showHiddenAccounts]);
  
  /**
   * Toggle visibility of an account category
   * 
   * @param {number} accountId - ID of the account to toggle
   * @returns {boolean} - New visibility state
   */
  const toggleAccountVisibility = useCallback((accountId) => {
    if (!accountId) return false;
    
    setChartOfAccounts(prevAccounts => {
      const updatedAccounts = prevAccounts.map(account => {
        if (account.id === accountId) {
          return { 
            ...account, 
            visible: !account.visible, 
            lastModified: new Date().getTime() 
          };
        }
        return account;
      });
      
      // Save updated visibility state to localStorage
      saveAccountVisibility(updatedAccounts);
      
      return updatedAccounts;
    });
    
    // Return the new visibility state
    const account = chartOfAccounts.find(acc => acc.id === accountId);
    return account ? !account.visible : false;
  }, [chartOfAccounts]);
  
  /**
   * Toggle showing hidden accounts in dropdowns
   */
  const toggleShowHiddenAccounts = useCallback(() => {
    setShowHiddenAccounts(prev => !prev);
  }, []);
  
  /**
   * Assign a category to a transaction
   */
  const assignCategory = useCallback(async (transactionId, categoryName) => {
    if (!transactionId) {
      setCategoryError('Transaction ID is required');
      return { success: false, error: 'Transaction ID is required' };
    }
    
    if (!categoryName) {
      setCategoryError('Category name is required');
      return { success: false, error: 'Category name is required' };
    }
    
    setIsSavingCategory(true);
    setCategoryError(null);
    
    try {
      // Validate category exists in chart of accounts
      const isValid = validateCategory(categoryName);
      if (!isValid) {
        setCategoryError(`"${categoryName}" is not a valid account category`);
        setIsSavingCategory(false);
        return { 
          success: false, 
          error: `"${categoryName}" is not a valid account category` 
        };
      }
      
      // Attempt to save to API
      const response = await assignCategoryToTransaction(transactionId, categoryName);
      
      if (response.success) {
        // Update local state with the new category assignment
        setTransactionCategories(prev => ({
          ...prev,
          [transactionId]: categoryName
        }));
        
        return { success: true, data: response.data };
      } else {
        // Handle API error but still update local state for offline support
        setTransactionCategories(prev => ({
          ...prev,
          [transactionId]: categoryName
        }));
        
        setCategoryError('Changes saved locally but not synced with server');
        return { 
          success: true, 
          warning: 'Changes saved locally but not synced with server',
          error: response.error
        };
      }
    } catch (error) {
      console.error('Error assigning category:', error);
      
      // Still update local state for offline support
      setTransactionCategories(prev => ({
        ...prev,
        [transactionId]: categoryName
      }));
      
      setCategoryError('Error syncing with server. Changes saved locally.');
      return { 
        success: true, 
        warning: 'Error syncing with server. Changes saved locally.',
        error: error.message
      };
    } finally {
      setIsSavingCategory(false);
    }
  }, []);
  
  /**
   * Get the category assigned to a transaction
   */
  const getTransactionCategory = useCallback((transactionId) => {
    if (!transactionId) return null;
    return transactionCategories[transactionId] || null;
  }, [transactionCategories]);
  
  /**
   * Clear the error state
   */
  const clearErrors = useCallback(() => {
    setAccountsError(null);
    setCategoryError(null);
    setTransactionsError(null);
  }, []);
  
  /**
   * Load transactions from the API or use fallback data
   * This handles both online and offline scenarios
   */
  const loadTransactions = useCallback((options = {}, forceRefresh = false) => {
    // No async operations - just load static data directly
    setIsLoadingTransactions(false);
    setTransactionsError(null);
    
    // Simply use the mock data without any API call
    const response = fetchTransactions();
    
    if (response && response.data) {
      const now = new Date().getTime();
      setTransactions(response.data);
      setTransactionsTotal(response.pagination.total);
      setTransactionsPage(options.page || transactionsPage);
      setTransactionsPageSize(options.pageSize || transactionsPageSize);
      setTransactionsLastFetchTime(now);
      
      // Update filter settings if provided
      if (options.searchTerm !== undefined || options.startDate || options.endDate || options.statuses) {
        setTransactionFilters(prev => ({
          searchTerm: options.searchTerm !== undefined ? options.searchTerm : prev.searchTerm,
          dateRange: {
            startDate: options.startDate || prev.dateRange.startDate,
            endDate: options.endDate || prev.dateRange.endDate
          },
          statuses: options.statuses || prev.statuses
        }));
      }
      
      console.log('Using cached transaction data');
    }
  }, [transactionsPage, transactionsPageSize]);
  
  /**
   * Update a transaction's category
   * This manages both the API call and local state update
   */
  const updateTransactionCategory = useCallback(async (transactionId, categoryName) => {
    // Validate parameters
    if (!transactionId) {
      return { success: false, error: 'Transaction ID is required' };
    }
    
    if (!categoryName) {
      return { success: false, error: 'Category name is required' };
    }
    
    try {
      // First validate category against Chart of Accounts
      const isValid = validateCategory(categoryName);
      if (!isValid) {
        return { 
          success: false, 
          error: `"${categoryName}" is not a valid account category` 
        };
      }
      
      // Call the API to update the category
      const response = await updateTransactionCategory(transactionId, categoryName);
      
      if (response.success) {
        // Update local transactions state to reflect the change
        setTransactions(prev => 
          prev.map(tx => 
            tx.id.toString() === transactionId.toString() 
              ? { ...tx, accountingCategory: categoryName }
              : tx
          )
        );
        
        return { success: true, data: response.data };
      } else {
        // Handle API failure but still update local state for offline use
        setTransactions(prev => 
          prev.map(tx => 
            tx.id.toString() === transactionId.toString() 
              ? { ...tx, accountingCategory: categoryName }
              : tx
          )
        );
        
        return { 
          success: true, 
          warning: 'Changes saved locally but not synced with server',
          error: response.error
        };
      }
    } catch (error) {
      console.error('Error updating transaction category:', error);
      
      // Still update local state for offline support
      setTransactions(prev => 
        prev.map(tx => 
          tx.id.toString() === transactionId.toString() 
            ? { ...tx, accountingCategory: categoryName }
            : tx
        )
      );
      
      return { 
        success: true, 
        warning: 'Error syncing with server. Changes saved locally.',
        error: error.message
      };
    }
  }, []);
  
  /**
   * Set transaction filters and reload data
   * This is a convenience method to update filters and fetch data in one call
   */
  const setTransactionFilter = useCallback((filterType, value) => {
    setTransactionFilters(prev => {
      const newFilters = { ...prev };
      
      switch (filterType) {
        case 'searchTerm':
          newFilters.searchTerm = value;
          break;
        case 'dateRange':
          newFilters.dateRange = value;
          break;
        case 'startDate':
          newFilters.dateRange = {
            ...prev.dateRange,
            startDate: value
          };
          break;
        case 'endDate':
          newFilters.dateRange = {
            ...prev.dateRange,
            endDate: value
          };
          break;
        case 'status':
          // Single status filter for tabs (clears any existing statuses)
          newFilters.statuses = value ? [value] : [];
          break;
        case 'statuses':
          // For multiple status filters
          newFilters.statuses = value;
          break;
        default:
          console.warn(`Unknown filter type: ${filterType}`);
      }
      
      // Load transactions with the new filters
      loadTransactions({ 
        searchTerm: newFilters.searchTerm,
        startDate: newFilters.dateRange.startDate,
        endDate: newFilters.dateRange.endDate,
        statuses: newFilters.statuses,
        page: 1 // Reset to first page when changing filters
      });
      
      return newFilters;
    });
  }, [loadTransactions]);
  
  /**
   * Change the current page of transactions
   */
  const setTransactionPage = useCallback((pageNumber) => {
    if (pageNumber === transactionsPage) return;
    
    setTransactionsPage(pageNumber);
    loadTransactions({ page: pageNumber });
  }, [transactionsPage, loadTransactions]);
  
  /**
   * Change the page size for transactions
   */
  const setTransactionPageSize = useCallback((size) => {
    if (size === transactionsPageSize) return;
    
    setTransactionsPageSize(size);
    loadTransactions({ pageSize: size, page: 1 }); // Reset to first page when changing page size
  }, [transactionsPageSize, loadTransactions]);
  
  // Connect to an accounting provider (existing functionality)
  const connectProvider = (providerId, connectionDetails = {}) => {
    // Find the provider in the available providers list
    const provider = availableProviders.find(p => p.id === providerId);
    
    if (!provider) {
      throw new Error(`Provider with ID '${providerId}' not found`);
    }
    
    // In a real implementation, this would make API calls to establish the connection
    console.log(`Connecting to ${provider.name}...`, connectionDetails);
    
    // Update the state with the connected provider
    setConnectedProvider(provider);
    setConnectionData(connectionDetails);
    setIsConnected(true);
    
    return { success: true, provider };
  };
  
  // Connect to a custom provider (existing functionality)
  const connectCustomProvider = (providerName, connectionDetails = {}) => {
    // Generate a stable ID based on the provider name
    const providerId = `custom-${providerName.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Check if this custom provider already exists
    let customProvider = availableProviders.find(p => p.id === providerId);
    
    if (!customProvider) {
      // Create a new custom provider object if it doesn't exist
      customProvider = {
        id: providerId,
        name: providerName,
        logo: '/assets/logos/custom-provider.png',
        isCustom: true
      };
      
      // Add to available providers
      setAvailableProviders(prev => [...prev, customProvider]);
      
      // Log the new custom provider
      console.log(`Added new custom provider: ${providerName}`, customProvider);
    } else {
      console.log(`Using existing custom provider: ${providerName}`, customProvider);
    }
    
    // Connect to the custom provider
    setConnectedProvider(customProvider);
    setConnectionData(connectionDetails);
    setIsConnected(true);
    
    // Store custom providers list in localStorage for persistence
    try {
      // We need to get the latest state after adding the new provider
      setTimeout(() => {
        const updatedProviders = availableProviders.filter(p => p.isCustom);
        if (!updatedProviders.some(p => p.id === customProvider.id)) {
          updatedProviders.push(customProvider);
        }
        console.log('Saving custom providers to localStorage:', updatedProviders);
        localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOM_PROVIDERS, JSON.stringify(updatedProviders));
      }, 0);
    } catch (error) {
      console.error('Error saving custom providers:', error);
    }
    
    return { success: true, provider: customProvider };
  };
  
  // Disconnect from the current provider (existing functionality)
  const disconnectProvider = () => {
    // In a real implementation, this would make API calls to disconnect
    console.log('Disconnecting from accounting provider...');
    
    // Reset the state
    setConnectedProvider(null);
    setConnectionData(null);
    setIsConnected(false);
    
    return { success: true };
  };
  
  // Test the connection to the current provider (existing functionality)
  const testConnection = async () => {
    if (!isConnected || !connectedProvider) {
      return { success: false, error: 'No provider connected' };
    }
    
    // In a real implementation, this would make API calls to test the connection
    console.log(`Testing connection to ${connectedProvider.name}...`);
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Connection test successful' });
      }, 1000);
    });
  };
  
  // Update connection details for the current provider (existing functionality)
  const updateConnectionDetails = (newDetails) => {
    if (!isConnected || !connectedProvider) {
      return { success: false, error: 'No provider connected' };
    }
    
    // Merge new details with existing connection data
    setConnectionData(prev => ({ ...prev, ...newDetails }));
    
    return { success: true };
  };
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    // Chart of Accounts functionality
    chartOfAccounts,
    isLoadingAccounts,
    accountsError,
    lastFetchTime,
    loadChartOfAccounts,
    getFilteredAccounts,
    showHiddenAccounts,
    toggleShowHiddenAccounts,
    toggleAccountVisibility,
    
    // Transaction categories functionality
    assignCategory,
    getTransactionCategory,
    isSavingCategory,
    categoryError,
    clearErrors,
    
    // Stride Card Transactions functionality
    transactions,
    transactionsTotal,
    transactionsPage,
    transactionsPageSize,
    isLoadingTransactions,
    transactionsError,
    transactionsLastFetchTime,
    transactionFilters,
    loadTransactions,
    updateTransactionCategory,
    setTransactionFilter,
    setTransactionPage,
    setTransactionPageSize,
    
    // Connection functionality (existing)
    isConnected,
    connectedProvider,
    connectionData,
    availableProviders,
    connectProvider,
    connectCustomProvider,
    disconnectProvider,
    testConnection,
    updateConnectionDetails
  }), [
    // Chart of Accounts dependencies
    chartOfAccounts,
    isLoadingAccounts,
    accountsError,
    lastFetchTime,
    loadChartOfAccounts,
    getFilteredAccounts,
    showHiddenAccounts,
    toggleShowHiddenAccounts,
    toggleAccountVisibility,
    
    // Transaction categories dependencies
    assignCategory,
    getTransactionCategory,
    isSavingCategory,
    categoryError,
    clearErrors,
    
    // Stride Card Transactions dependencies
    transactions,
    transactionsTotal,
    transactionsPage,
    transactionsPageSize,
    isLoadingTransactions,
    transactionsError,
    transactionsLastFetchTime,
    transactionFilters,
    loadTransactions,
    updateTransactionCategory,
    setTransactionFilter,
    setTransactionPage,
    setTransactionPageSize,
    
    // Connection dependencies
    isConnected,
    connectedProvider,
    connectionData,
    availableProviders
  ]);
  
  return (
    <AccountingContext.Provider value={contextValue}>
      {children}
    </AccountingContext.Provider>
  );
};

// Custom hook to use the accounting context
export const useAccounting = () => {
  const context = useContext(AccountingContext);
  
  if (!context) {
    throw new Error('useAccounting must be used within an AccountingProvider');
  }
  
  return context;
};

export default AccountingContext;