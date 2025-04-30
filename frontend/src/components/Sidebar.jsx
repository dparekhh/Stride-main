import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Mail, Zap, IndianRupee, BookOpen, FileText,
  CreditCard, File, ChevronLeft, ChevronRight,
  ChevronDown, Users
} from "lucide-react";
import { useAccounting } from "../contexts/AccountingContext";

const Sidebar = ({ sidebarCollapsed, toggleSidebar, setActiveView }) => {
  const [billPayExpanded, setBillPayExpanded] = useState(true);
  const [expenseExpanded, setExpenseExpanded] = useState(false);
  const [accountingExpanded, setAccountingExpanded] = useState(false);
  const [isAccountingConnected, setIsAccountingConnected] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const accountingContext = useAccounting();
  
  // Check if accounting software is connected
  useEffect(() => {
    if (accountingContext && accountingContext.isConnected) {
      setIsAccountingConnected(true);
    } else {
      setIsAccountingConnected(false);
    }
  }, [accountingContext]);
  
  // Helper to check if a path is active with special handling for accounting pages
  const isActive = (path) => {
    // Special case for accounting dashboard
    if (path === '/accounting' && currentPath === '/accounting') {
      return true;
    }
    
    // For specific accounting subpaths, require exact match
    if (path.startsWith('/accounting/')) {
      return currentPath === path;
    }
    
    // For other paths, either exact match or starting with the path
    return currentPath === path || 
           (currentPath.startsWith(path) && path !== '/accounting');
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    if (section === 'bill-pay') {
      setBillPayExpanded(!billPayExpanded);
    } else if (section === 'expense') {
      setExpenseExpanded(!expenseExpanded);
    } else if (section === 'accounting') {
      setAccountingExpanded(!accountingExpanded);
    }
  };
  
  // Navigation items with their paths and icons for DRY code
  const mainNavItems = [
    { id: 'inbox', path: '/inbox', icon: Mail, label: 'Inbox' },
    { id: 'insights', path: '/insights', icon: Zap, label: 'Insights' },
    { id: 'expense', path: '/expense/card-transactions', icon: IndianRupee, label: 'Expenses', 
      expanded: expenseExpanded,
      subItems: [
        { id: 'card-transactions', path: '/expense/card-transactions', label: 'Card Transactions' },
        { id: 'reimbursements', path: '/expense/reimbursements', label: 'Reimbursements' }
      ]
    },
    { id: 'accounting', path: '/accounting', icon: BookOpen, label: 'Accounting',
      expanded: accountingExpanded,
      subItems: isAccountingConnected ? [
        { id: 'dashboard', path: '/accounting', label: 'Dashboard' },
        { id: 'stride-card', path: '/accounting/stride-card', label: 'Stride Card' },
        { id: 'reimbursements', path: '/accounting/reimbursements', label: 'Reimbursements' },
        { id: 'bill-payment', path: '/accounting/bill-payment', label: 'Bill Payment' }
      ] : [
        { id: 'dashboard', path: '/accounting', label: 'Dashboard' }
      ]
    },
    { id: 'bill-pay', path: '/bill-pay', icon: FileText, label: 'Bill Pay',
      expanded: billPayExpanded,
      subItems: [
        { id: 'bills', path: '/bill-pay/bills', label: 'Bills' },
        { id: 'purchase-order', path: '/bill-pay/purchase-order', label: 'Purchase Order' },
        { id: 'vendors', path: '/bill-pay/vendors', label: 'Vendors' }
      ]
    },
    { id: 'cards', path: '/cards', icon: CreditCard, label: 'Cards' },
    { id: 'policy', path: '/policy', icon: File, label: 'Policy' },
    { id: 'people', path: '/people', icon: Users, label: 'People' }
  ];
  
  // Handle navigation item click
  const handleNavClick = (path) => {
    // Remove leading slash to work with setActiveView
    const viewPath = path.startsWith('/') ? path.substring(1) : path;
    setActiveView(viewPath);
    
    // Also navigate to the path using react-router
    console.log(`Navigating to path: ${path}`);
    navigate(path);
  };
  
  return (
    <div className={`sidebar bg-white border-r border-gray-200 h-full transition-all duration-300 ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex flex-col h-full overflow-hidden">
        {/* Logo and brand */}
        <div className="flex-shrink-0 relative">
          {!sidebarCollapsed && <h1 className="text-xl font-bold text-primary">Stride</h1>}
          
          {/* Toggle button inside the sidebar */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-0 bg-white border rounded-full p-1 shadow-md z-50"
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        
        {/* Scrollable navigation area */}
        <div className="flex-grow overflow-y-auto mt-8 pr-1">
          {sidebarCollapsed ? (
            // Collapsed view - show only icons for principal tabs
            <ul className="space-y-4 flex flex-col items-center">
              {mainNavItems.map((item) => (
                <li
                  key={item.id}
                  className={`p-2 rounded-lg cursor-pointer ${
                    isActive(item.path) ? 'bg-orange-100 text-primary' : 'hover:bg-gray-200'
                  }`}
                  onClick={() => handleNavClick(item.path)}
                  title={item.label}
                >
                  <item.icon size={20} className="text-current" />
                </li>
              ))}
            </ul>
          ) : (
            // Expanded view - show full navigation with icons and nested items
            <ul className="space-y-2">
              {mainNavItems.map((item) => (
                <React.Fragment key={item.id}>
                  <li
                    className={`font-medium flex items-center justify-between cursor-pointer p-2 rounded-lg ${
                      isActive(item.path) ? 'text-primary bg-orange-50' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => item.subItems ? toggleSection(item.id) : handleNavClick(item.path)}
                  >
                    <div className="flex items-center">
                      <item.icon size={16} className="mr-2 text-current" /> 
                      <span>{item.label}</span>
                    </div>
                    
                    {item.subItems && (
                      <ChevronDown 
                        size={16} 
                        className={`transition-transform duration-200 ${item.expanded ? 'rotate-180' : ''}`} 
                      />
                    )}
                  </li>
                  
                  {/* Render subItems if they exist and section is expanded */}
                  {item.subItems && item.expanded && (
                    <ul className="ml-6 mt-1 space-y-1 text-sm text-gray-600">
                      {item.subItems.map((subItem) => (
                        <li
                          key={subItem.id}
                          className={`hover:text-primary hover:bg-gray-50 cursor-pointer p-2 rounded-md ${
                            isActive(subItem.path) ? 'text-primary font-semibold bg-orange-50' : ''
                          }`}
                          onClick={() => handleNavClick(subItem.path)}
                        >
                          {subItem.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </React.Fragment>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
