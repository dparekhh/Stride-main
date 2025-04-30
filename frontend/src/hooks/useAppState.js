// hooks/useAppState.js
import { useState, useRef } from 'react';
import { useInitNotifications } from '../utils/notifications';
import { sampleBillsData, sampleAPClerks } from '../utils/data.js';

/**
 * Custom hook to manage application state
 * This centralizes all state management for the main App component
 */
export const useAppState = () => {
  // Initialize notifications utility
  useInitNotifications();
  
  // UI state
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showNewBillMenu, setShowNewBillMenu] = useState(false);
  const [showMoreOptionsMenu, setShowMoreOptionsMenu] = useState(false);
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("permissions");
  const [importTallyEnabled, setImportTallyEnabled] = useState(true);
  const [importPOEnabled, setImportPOEnabled] = useState(true);
  
  // Modal visibility state
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [showNewBill, setShowNewBill] = useState(false);
  const [showNewVendor, setShowNewVendor] = useState(false);
  
  // Document state
  const [uploadedInvoice, setUploadedInvoice] = useState(null);
  
  // Refs for DOM elements and dropdowns
  const newBillMenuRef = useRef(null);
  const moreOptionsMenuRef = useRef(null);
  const settingsModalRef = useRef(null);
  const fileInputRef = useRef(null);
  
  return {
    // UI state
    sidebarCollapsed, 
    setSidebarCollapsed,
    showFilter, 
    setShowFilter,
    showNewBillMenu, 
    setShowNewBillMenu,
    showMoreOptionsMenu, 
    setShowMoreOptionsMenu,
    
    // Settings state
    showSettings, 
    setShowSettings,
    activeSettingsTab, 
    setActiveSettingsTab,
    importTallyEnabled, 
    setImportTallyEnabled,
    importPOEnabled, 
    setImportPOEnabled,
    
    // Modal visibility state
    showInvoicePreview, 
    setShowInvoicePreview,
    showNewBill, 
    setShowNewBill,
    showNewVendor, 
    setShowNewVendor,
    
    // Document state
    uploadedInvoice, 
    setUploadedInvoice,
    
    // Sample data
    sampleBillsData,
    sampleAPClerks,
    
    // Refs
    newBillMenuRef,
    moreOptionsMenuRef,
    settingsModalRef,
    fileInputRef
  };
};