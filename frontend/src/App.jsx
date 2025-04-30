// src/App.jsx
import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import SettingsModal from "./components/SettingsModal.jsx";
import InvoicePreview from "./components/InvoicePreview.jsx";
import NotificationContainer from "./components/NotificationContainer.jsx";
import { NotificationProvider, useNotification } from "./contexts/NotificationContext";
import { AccountingProvider } from "./contexts/AccountingContext";
import { DrawerProvider } from "./contexts/DrawerContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppState } from "./hooks/useAppState.js";
import { useFileUpload } from "./hooks/useFileUpload.js";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import VendorReview from "./components/VendorReview.jsx";
import VendorInformation from "./components/VendorInformation.jsx";
import RouteLogger from "./components/RouteLogger.jsx";
import RecurringBillVendor from "./components/RecurringBillVendor.jsx";
import RecurringBillVendorReview from "./components/RecurringBillVendorReview.jsx";
import RecurringBill from "./components/RecurringBill.jsx";
import RecurringBillReview from "./components/RecurringBillReview.jsx";
import RecurringBillSeries from "./components/RecurringBillSeries.jsx";
import LoadingFallback from "./components/LoadingFallback.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

// Example components
import WorkflowBuilderExample from "./examples/WorkflowBuilderExample.jsx";

// Import PageLayout for standardized layout
import { PageLayout } from "./components/common/page-layout";

// Wrapper components for vendor and bill flow
import VendorReviewWrapper from "./components/VendorReviewWrapper.jsx";
import VendorInformationWrapper from "./components/VendorInformationWrapper.jsx";

// Development utility components
import DevAuthReset from "./components/DevAuthReset.jsx";

// SpreadsheetUploadModal is used throughout the app, so not lazily loaded
import SpreadsheetUploadModal from "./components/SpreadsheetUploadModal.jsx";

// Lazy-loaded components for major route sections
// Bill Pay section
const BillPayPage = lazy(() => import("./pages/BillPayPage.jsx"));
const BillsPage = lazy(() => import("./pages/BillsPage.jsx"));
const VendorsPage = lazy(() => import("./pages/VendorsPage.jsx"));
const PurchaseOrderPage = lazy(() => import("./pages/PurchaseOrderPage.jsx"));
const NewBill = lazy(() => import("./pages/NewBill.jsx"));
const NewVendor = lazy(() => import("./pages/NewVendor.jsx"));
const CreateBill = lazy(() => import("./pages/CreateBill.jsx"));
const BillReview = lazy(() => import("./pages/BillReview.jsx"));
const GRNPage = lazy(() => import("./pages/GRNPage.jsx"));

// Accounting section
const AccountingSetup = lazy(() => import("./pages/AccountingSetup.jsx"));
const AccountingMain = lazy(() => import("./pages/AccountingMain.jsx"));
const AccountingDashboard = lazy(() => import("./pages/AccountingDashboard.jsx"));
const AccountingConnect = lazy(() => import("./pages/AccountingConnect.jsx"));
const AccountingSetupAccount = lazy(() => import("./pages/AccountingSetupAccount.jsx"));
const Accounting_ReimbursementsPage = lazy(() => import("./pages/Accounting_ReimbursementsPage.jsx"));
const Accounting_BillPayPage = lazy(() => import("./pages/Accounting_BillPayPage.jsx"));
const CustomProviderSetup = lazy(() => import("./pages/CustomProviderSetup.jsx"));

// Cards & Expenses section
const CardTransactionExpenses = lazy(() => import("./pages/CardTransactionExpenses.jsx"));
const ExpenseReimbursementsPage = lazy(() => import("./pages/ExpenseReimbursementsPage.jsx"));
const CardsPage = lazy(() => import("./pages/CardsPage.jsx"));
const StrideCardPage = lazy(() => import("./pages/StrideCardPage.jsx"));

// People section
const PeoplePage = lazy(() => import("./pages/PeoplePage.jsx"));

// Policy section
const PolicyTab = lazy(() => import("./pages/PolicyTab.jsx"));
const SubmissionPolicyBuilder = lazy(() => import("./pages/SubmissionPolicyBuilder.jsx"));

// Authentication section
const SignUpPage = lazy(() => import("./pages/SignUpPage.jsx"));
const EmailVerificationPage = lazy(() => import("./pages/EmailVerificationPage.jsx"));
const CompanySizePage = lazy(() => import("./pages/CompanySizePage.jsx"));
const SpendPage = lazy(() => import("./pages/SpendPage.jsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.jsx"));
const BusinessInfoPage = lazy(() => import("./pages/BusinessInfoPage.jsx"));
const LeadersInfoPage = lazy(() => import("./pages/LeadersInfoPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const KYCPage = lazy(() => import("./pages/KYCPage.jsx"));
const LogInRedirect = lazy(() => import("./pages/LogInRedirect.jsx"));

// Debug components (also lazy loaded to reduce bundle size)
const SimpleNewBill = lazy(() => import("./debug/SimpleNewBill.jsx"));
const SimpleVendorReviewWrapper = lazy(() => import("./debug/SimpleVendorReviewWrapper.jsx"));
const SimpleVendorInformationWrapper = lazy(() => import("./debug/SimpleVendorInformationWrapper.jsx"));

const AppContent = () => {
  const {
    sidebarCollapsed, setSidebarCollapsed,
    showFilter, setShowFilter,
    showNewBillMenu, setShowNewBillMenu,
    showMoreOptionsMenu, setShowMoreOptionsMenu,
    showSettings, setShowSettings,
    activeSettingsTab, setActiveSettingsTab,
    showInvoicePreview, setShowInvoicePreview,
    showNewBill, setShowNewBill,
    showNewVendor, setShowNewVendor,
    uploadedInvoice, setUploadedInvoice,
    importTallyEnabled, setImportTallyEnabled,
    importPOEnabled, setImportPOEnabled,
    sampleBillsData, sampleAPClerks,
    newBillMenuRef, moreOptionsMenuRef, settingsModalRef, fileInputRef
  } = useAppState();
  
  // State for spreadsheet upload modal
  const [showSpreadsheetUpload, setShowSpreadsheetUpload] = useState(false);
  
  // State for vendor review
  const [showVendorReview, setShowVendorReview] = useState(false);
  const [vendorReviewData, setVendorReviewData] = useState({
    vendor: null,
    invoice: null,
    sourceRoute: "newVendor" // Default source is newVendor
  });
  
  // State for bill review
  const [showBillReview, setShowBillReview] = useState(false);
  const [billReviewData, setBillReviewData] = useState({
    billData: null,
    invoice: null
  });
  
  // Log vendor review state changes for debugging
  useEffect(() => {
    console.log("Vendor Review State Changed:", { 
      showVendorReview, 
      vendorData: vendorReviewData?.vendor, 
      invoiceData: vendorReviewData?.invoice,
      sourceRoute: vendorReviewData?.sourceRoute  // Log sourceRoute for debugging
    });
  }, [showVendorReview, vendorReviewData]);

  const navigate = useNavigate();
  const notificationContext = useNotification();
  const { handleFileUpload, loading: fileProcessingLoading } = useFileUpload(setUploadedInvoice, notificationContext);
  
  // Redirect to bill-pay/bills by default or to appropriate sub-pages for tabs with subsections
  useEffect(() => {
    const path = window.location.pathname;
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    // Check if we're on the root path
    if (path === '/' || path === '') {
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      if (isAuthenticated) {
        console.log('Home path detected with authenticated user, redirecting to accounting dashboard');
        navigate('/accounting/dashboard', { replace: true });
      } else {
        console.log('Home path detected with unauthenticated user, redirecting to signup page');
        navigate('/signup', { replace: true });
      }
    } else if (path === '/signup' && isAuthenticated) {
      // If user is already authenticated and tries to access signup, redirect to dashboard
      console.log('Signup page accessed by authenticated user, redirecting to accounting dashboard');
      navigate('/accounting/dashboard');
    } else if (path === '/expense') {
      // Redirect to card-transactions page if Expenses tab is clicked directly
      navigate('/expense/card-transactions');
    } else if (path === '/accounting') {
      // Accounting tab should show the setup page or redirect to a sub-section based on integration status
      console.log('Accounting path detected, showing AccountingSetup component');
      // The AccountingSetup component will be rendered via the router
      // In the future, we could check for integration status here and redirect if needed
    } else if (path === '/accounting/connect') {
      // Allow direct navigation to accounting connect page
      console.log('Accounting Connect path detected, no redirection needed');
    } else if (path.startsWith('/cards')) {
      // Handle Cards path specifically - don't redirect to bill-pay
      console.log('Cards path detected, no redirection needed');
    }
    
    // Expose a global function for direct vendor review navigation
    window.openVendorReviewPage = (vendor, invoice) => {
      console.log("Global openVendorReviewPage called with:", vendor);
      if (vendor) {
        // Use React Router navigation to vendor-review
        setTimeout(() => {
          navigate('/vendor-review', { 
            state: { 
              formData: vendor, 
              uploadedInvoice: invoice || uploadedInvoice, 
              sourceRoute: "newVendor" 
            } 
          });
          console.log("Navigated to vendor-review route via global function");
        }, 100);
      }
    };
    
    return () => {
      // Clean up the global function
      delete window.openVendorReviewPage;
    };
  }, [navigate, uploadedInvoice]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (newBillMenuRef.current && !newBillMenuRef.current.contains(event.target)) {
        setShowNewBillMenu(false);
      }
      if (moreOptionsMenuRef.current && !moreOptionsMenuRef.current.contains(event.target)) {
        setShowMoreOptionsMenu(false);
      }
    }

    // Handle opening vendor review page
    function handleOpenVendorReview(event) {
      console.log("handleOpenVendorReview event triggered");
      const { vendor, invoice } = event.detail || {};
      console.log("Opening vendor review with:", { vendor, invoice });
      
      if (vendor) {
        console.log("Navigating to vendor-review route via event handler");
        // Use React Router navigation instead of component state
        navigate('/vendor-review', { 
          state: { 
            formData: vendor, 
            uploadedInvoice: invoice || uploadedInvoice, 
            sourceRoute: "newVendor" 
          } 
        });
        console.log("Navigation to vendor-review route triggered");
      } else {
        console.error("No vendor information in event payload");
        notificationContext.showError("Cannot proceed: No vendor information available");
      }
    }
    
    // Handle direct navigation to New Bill page
    function handleShowNewBill() {
      console.log("Show New Bill event received");
      // Navigate to new-bill route instead of using state
      navigate('/new-bill');
      console.log("Navigation to /new-bill route triggered by event");
    }
    
    // Handle showing the spreadsheet upload modal
    function handleShowSpreadsheetUpload() {
      console.log("Show Spreadsheet Upload event received");
      setShowSpreadsheetUpload(true);
      console.log("Spreadsheet upload modal should now be visible");
    }
    
    // Handle file processing complete event from useFileUpload
    function handleFileProcessingComplete(event) {
      const { success, error, source } = event.detail || { success: false, source: 'unknown' };
      console.log(`File processing ${success ? 'succeeded' : 'failed'} (source: ${source})`);
      
      // Navigate to new-bill route regardless of success/failure
      // The new-bill page will handle displaying the invoice with any extracted data
      setTimeout(() => {
        console.log('Navigating to /new-bill route after file processing');
        navigate('/new-bill');
      }, 1000);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("openSettings", handleOpenSettings);
    window.addEventListener("fileUploaded", handleFileUploaded);
    window.addEventListener("openVendorReview", handleOpenVendorReview);
    window.addEventListener("showNewBillPage", handleShowNewBill);
    window.addEventListener("showSpreadsheetUpload", handleShowSpreadsheetUpload);
    window.addEventListener("fileProcessingComplete", handleFileProcessingComplete);
    window.addEventListener("openSyncSettings", handleOpenSyncSettings);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("openSettings", handleOpenSettings);
      window.removeEventListener("fileUploaded", handleFileUploaded);
      window.removeEventListener("openVendorReview", handleOpenVendorReview);
      window.removeEventListener("showNewBillPage", handleShowNewBill);
      window.removeEventListener("showSpreadsheetUpload", handleShowSpreadsheetUpload);
      window.removeEventListener("fileProcessingComplete", handleFileProcessingComplete);
      window.removeEventListener("openSyncSettings", handleOpenSyncSettings);
    };
  }, [showSettings, uploadedInvoice, notificationContext]);

  // Handle custom openSettings event
  function handleOpenSettings(event) {
    const { tab } = event.detail || { tab: 'permissions' };
    setShowSettings(true);
    setActiveSettingsTab(tab);
  }
  
  // Handle SyncSettings drawer open event
  function handleOpenSyncSettings(event) {
    console.log("SyncSettings drawer opened", event.detail);
    // Just displaying a notification for now as placeholder
    notificationContext.showInfo("Sync Settings configuration will be available soon");
  }

  // Handle file uploaded event from BillsPage/BillManager
  function handleFileUploaded(event) {
    const file = event.detail.file;
    if (file) {
      console.log("File uploaded event received in App.jsx:", file.name);
      // Don't show any notification here - we'll show only one in useFileUpload.js
      try {
        handleFileUpload(file);
        
        // CRITICAL FIX: Force navigation to New Bill page after a delay
        // This ensures the user sees the New Bill form regardless of API response
        console.log("Setting up forced navigation to New Bill page via React Router");
        setTimeout(() => {
          console.log("FORCING navigation to /new-bill route");
          navigate('/new-bill');
          console.log("Navigation to /new-bill route triggered");
        }, 1500);
      } catch (error) {
        console.error("Error in handleFileUploaded:", error);
        // Still try to navigate to the new bill form even if there's an error
        setTimeout(() => {
          console.log("Error fallback: navigating to /new-bill route");
          navigate('/new-bill');
        }, 1000);
      }
    }
  }

  // Handle new bill options
  const handleNewBillOption = (option) => {
    console.log(`Selected option: ${option}`);
    if (option === "upload") {
      fileInputRef.current.click();
      setShowNewBillMenu(false);
    } else if (option === "manual") {
      notificationContext.showInfo("Opening manual bill creation form...");
      // Use React Router instead of direct component rendering
      navigate('/new-bill');
      setShowNewBillMenu(false);
    } else if (option === "spreadsheet") {
      notificationContext.showInfo("Create drafts via spreadsheet");
      setShowSpreadsheetUpload(true);
      setShowNewBillMenu(false);
    } else {
      setShowNewBillMenu(false);
    }
  };

  // Handle more options
  const handleMoreOption = (option) => {
    console.log(`Selected more option: ${option}`);
    setShowMoreOptionsMenu(false);
    if (option === "settings") {
      setShowSettings(true);
      setActiveSettingsTab("permissions");
    }
  };

  const handleCreateNewVendor = () => {
    console.log("handleCreateNewVendor called - navigating to new-vendor route");
    
    // Use React Router navigation instead of component state
    navigate('/new-vendor');
  };

  const handleVendorCreated = (vendorData) => {
    console.log("handleVendorCreated called with vendorData:", vendorData);
    
    // This function is now just a legacy handler maintained for compatibility
    // The actual vendor creation functionality is handled directly in the NewVendor component
    // which uses React Router for navigation to the vendor-review route (see lines ~438-447)
    notificationContext.showSuccess("Created new vendor successfully");
    
    // Format phone number with country code if available
    const phoneDisplay = vendorData?.phoneCountry && vendorData?.phoneNumber 
      ? `${vendorData.phoneCountry} ${vendorData.phoneNumber}`
      : vendorData?.phoneNumber || "";
    
    // Prepare vendor data in format expected by the vendor review page
    const vendorForReview = {
      name: vendorData?.vendorName || "New Vendor",
      address: vendorData?.addressLine1 || "",
      email: vendorData?.email || "",
      phone: phoneDisplay,
      gstin: vendorData?.taxDetails?.gstin || (vendorData?.taxOption === "Enter manually" ? vendorData?.gstin : "")
    };
    
    console.log("Navigating to vendor-review with data:", vendorForReview);
    
    // Navigate to vendor review page using React Router instead of state changes
    navigate('/vendor-review', { 
      state: { 
        formData: vendorForReview, 
        uploadedInvoice: uploadedInvoice, 
        sourceRoute: "newVendor" 
      } 
    });
  };

  // Handle file input change for direct file uploads
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Reset file input to allow selecting the same file again
      e.target.value = '';
      
      try {
        // Process the file - useFileUpload will handle all notifications
        // No need to show any notification here
        handleFileUpload(file);
        console.log('File passed to handleFileUpload');
        // Use navigation to new-bill route instead of setting showNewBill
        setTimeout(() => {
          console.log('Navigating to /new-bill route after file upload');
          navigate('/new-bill');
        }, 1500);
      } catch (error) {
        console.error('Error handling file:', error);
        // Only show error notifications here, success notifications are handled in useFileUpload
        notificationContext.showError(`Error processing file: ${error.message}`);
      }
    }
  };

  // Get current location
  const location = useLocation();
  // Hide sidebar on all auth pages (signup, login, email-verification, company-size, spend, register, business-info, leaders-info, kyc)
  const isAuthPage = location.pathname === '/signup' || location.pathname === '/login' || location.pathname === '/email-verification' || location.pathname === '/company-size' || location.pathname === '/spend' || location.pathname === '/register' || location.pathname === '/business-info' || location.pathname === '/leaders-info' || location.pathname === '/kyc' || location.pathname === '/login-redirect';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Global loading overlay for file processing */}
      {fileProcessingLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <LoadingSpinner size="large" className="text-primary mb-4" />
            <p className="text-lg font-medium">Processing document...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we extract information from your file.</p>
          </div>
        </div>
      )}

      {/* Hide sidebar on auth pages (signup, login, company-size, spend, register) */}
      {!isAuthPage && (
        <div className="fixed h-full overflow-y-auto z-10">
          <Sidebar
            sidebarCollapsed={sidebarCollapsed}
            toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
            setActiveView={(view) => navigate(`/${view}`)}
          />
        </div>
      )}
      
      {/* Route logger to debug navigation issues */}
      <RouteLogger />
      
      {/* Auth reset button for development testing */}
      <DevAuthReset />
      
      <div className={`flex-1 overflow-y-auto ${isAuthPage ? '' : (sidebarCollapsed ? 'ml-16' : 'ml-64')}`}>
        <ErrorBoundary>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Bill Pay Routes - Using the new page component architecture */}
              <Route path="/bill-pay" element={<BillPayPage />}>
                <Route index element={<BillsPage />} />
                <Route path="bills" element={<BillsPage />} />
                <Route path="vendors" element={<VendorsPage />} />
                <Route path="purchase-order" element={<PurchaseOrderPage />} />
              </Route>
              
              {/* New Routes for Vendor Review Integration */}
              <Route path="/new-bill" element={
                <NewBill
                  showNewBill={true}
                  setShowNewBill={() => {}}
                  uploadedInvoice={uploadedInvoice}
                  setUploadedInvoice={setUploadedInvoice}
                  onCreateNewVendor={handleCreateNewVendor}
                  openVendorReview={(vendor, invoice) => {
                    navigate('/vendor-review', { 
                      state: { 
                        formData: vendor, 
                        uploadedInvoice: invoice || uploadedInvoice, 
                        sourceRoute: "newBill" 
                      } 
                    });
                  }}
                />
              } />
              
              <Route path="/new-vendor" element={
                <NewVendor 
                  showNewVendor={true}
                  uploadedInvoice={uploadedInvoice}
                  notification={notificationContext}
                  onClose={() => {
                    // Use consistent path variable to prevent JavaScript compilation issues
                    const createBillPath = "/create-bill";
                    navigate(createBillPath);
                  }}
                  onVendorCreated={(vendorData) => {
                    navigate('/vendor-review', { 
                      state: { 
                        formData: vendorData, 
                        uploadedInvoice: uploadedInvoice, 
                        sourceRoute: "newVendor" 
                      } 
                    });
                  }}
                />
              } />
              
              <Route path="/vendor-review" element={<VendorReviewWrapper />} />
              <Route path="/vendor-information" element={<VendorInformationWrapper />} />
              <Route path="/recurring-bill-vendor" element={<RecurringBillVendor onBack={() => navigate('/bill-pay/bills')} />} />
              <Route path="/recurring-bill-vendor-review" element={<RecurringBillVendorReview onBack={() => navigate('/recurring-bill-vendor')} />} />
              <Route path="/recurring-bill" element={<RecurringBill onBack={() => navigate('/recurring-bill-vendor-review')} />} />
              <Route path="/recurring-bill-review" element={<RecurringBillReview onBack={() => navigate('/recurring-bill')} />} />
              <Route path="/recurring-bill-series/:id" element={<RecurringBillSeries />} />
              <Route path="/create-bill" element={
                <CreateBill
                  showCreateBill={true}
                  setShowCreateBill={() => navigate('/bill-pay/bills')}
                  uploadedInvoice={uploadedInvoice}
                  onBack={() => navigate(-1)}
                />
              } />
              <Route path="/bill-review" element={
                <BillReview />
              } />
              
              {/* Old route handler kept for compatibility but not used
                <BillReview
                  showBillReview={true}
                  setShowBillReview={(value) => {
                    console.log("Route BillReview - setShowBillReview called with:", value);
                    // If explicitly set to false, navigate away
                    if (value === false) {
                      navigate('/bill-pay/bills');
                    }
                  }}
                  uploadedInvoice={uploadedInvoice}
                  onBack={() => {
                    console.log("Route BillReview - onBack called");
                    // Navigate to create-bill as a fallback
                    navigate('/create-bill');
                  }}
                />
              } />
              <Route path="/new-bill/details" element={<div>Bill Details - Coming Soon</div>} />
              
              {/* Debug Routes for Troubleshooting */}
              <Route path="/debug" element={<div className="p-8">
                <h1 className="text-2xl font-bold mb-6">Debug Navigation</h1>
                <div className="flex flex-col space-y-4">
                  <button 
                    onClick={() => navigate('/simple-new-bill')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-64"
                  >
                    Test Simple New Bill
                  </button>
                  <button 
                    onClick={() => navigate('/simple-vendor-review')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-64"
                  >
                    Test Simple Vendor Review
                  </button>
                  <button 
                    onClick={() => navigate('/simple-vendor-information')}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-64"
                  >
                    Test Simple Vendor Information
                  </button>
                  
                  <button 
                    onClick={() => {
                      console.log("Debug: Navigating to Bill Review page");
                      navigate('/bill-review', {
                        state: {
                          billData: {
                            vendorName: "Test Vendor Ltd",
                            amount: 12500,
                            lineItems: [
                              { description: "Test Product", quantity: 5, unitPrice: 2000 },
                              { description: "Service Fee", quantity: 1, unitPrice: 2500 }
                            ],
                            billNumber: "TEST-123",
                            issueDate: "2025-03-21",
                            dueDate: "2025-04-21",
                            currency: "INR"
                          },
                          uploadedInvoice: null
                        }
                      });
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 w-64"
                  >
                    Test Bill Review
                  </button>
                  
                  <button 
                    onClick={() => {
                      console.log("Debug: Direct rendering of BillReview test");
                      navigate('/test-bill-review');
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 w-64 mt-3"
                  >
                    Test Independent BillReview
                  </button>

                </div>
              </div>} />
              
              <Route path="/simple-new-bill" element={<SimpleNewBill />} />
              <Route path="/simple-vendor-review" element={<SimpleVendorReviewWrapper />} />
              <Route path="/simple-vendor-information" element={<SimpleVendorInformationWrapper />} />
              <Route path="/test-bill-review" element={<BillReview />} />
              
              {/* Examples Routes */}
              <Route path="/examples/workflow-builder" element={<WorkflowBuilderExample />} />
              
              {/* GRN Route */}
              <Route path="/grn" element={<GRNPage />} />
              
              {/* Auth Routes */}
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/email-verification" element={<EmailVerificationPage />} />
              <Route path="/company-size" element={<CompanySizePage />} />
              <Route path="/spend" element={<SpendPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/business-info" element={<BusinessInfoPage />} />
              <Route path="/leaders-info" element={<LeadersInfoPage />} />
              <Route path="/kyc" element={<KYCPage />} />
              <Route path="/login-redirect" element={<LogInRedirect />} />
              <Route path="/login" element={<LoginPage />} /> {/* Using new LoginPage component */}
              <Route path="/" element={<SignUpPage />} /> {/* Make SignUpPage the default landing page */}
              
              {/* Existing Routes */}
              {/* Bill Pay Vendors route removed - now handled by the nested routing in BillPayPage */}
              <Route path="/inbox" element={<div>Inbox - Placeholder</div>} />
              <Route path="/insights" element={<div>Insights - Placeholder</div>} />
              <Route
                path="/expense/card-transactions"
                element={
                  <div className={`flex-1 overflow-hidden ${showSettings ? 'opacity-30' : ''}`}>
                    <CardTransactionExpenses 
                      showFilter={showFilter}
                      setShowFilter={setShowFilter}
                      showMoreOptionsMenu={showMoreOptionsMenu}
                      setShowMoreOptionsMenu={setShowMoreOptionsMenu}
                      moreOptionsMenuRef={moreOptionsMenuRef}
                      handleMoreOption={handleMoreOption}
                      fileInputRef={fileInputRef}
                    />
                    {/* Hidden file input for uploads */}
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      ref={fileInputRef}
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                }
              />
              <Route
                path="/expense/reimbursements"
                element={
                  <div className={`flex-1 overflow-hidden ${showSettings ? 'opacity-30' : ''}`}>
                    <ExpenseReimbursementsPage />
                  </div>
                }
              />
              <Route 
                path="/accounting" 
                element={
                  <div className={`flex-1 overflow-hidden ${showSettings ? 'opacity-30' : ''}`}>
                    <AccountingMain />
                  </div>
                }
              />
              <Route 
                path="/accounting/dashboard" 
                element={
                  <div className={`flex-1 overflow-hidden ${showSettings ? 'opacity-30' : ''}`}>
                    <AccountingDashboard 
                      showFilter={showFilter}
                      setShowFilter={setShowFilter}
                      showMoreOptionsMenu={showMoreOptionsMenu}
                      setShowMoreOptionsMenu={setShowMoreOptionsMenu}
                      moreOptionsMenuRef={moreOptionsMenuRef}
                      handleMoreOption={handleMoreOption}
                    />
                  </div>
                }
              />
              <Route 
                path="/accounting/stride-card" 
                element={
                  <div className={`flex-1 overflow-hidden ${showSettings ? 'opacity-30' : ''}`}>
                    <StrideCardPage />
                  </div>
                }
              />
              <Route 
                path="/accounting/reimbursements" 
                element={
                  <div className={`flex-1 overflow-hidden ${showSettings ? 'opacity-30' : ''}`}>
                    <Accounting_ReimbursementsPage />
                  </div>
                }
              />
              <Route 
                path="/accounting/bill-payment" 
                element={
                  <div className={`flex-1 overflow-hidden ${showSettings ? 'opacity-30' : ''}`}>
                    <Accounting_BillPayPage />
                  </div>
                }
              />

              <Route 
                path="/accounting/connect" 
                element={
                  <AccountingConnect />
                }
              />
              <Route 
                path="/accounting/setup-account" 
                element={
                  <AccountingSetupAccount />
                }
              />
              <Route 
                path="/accounting/custom-provider-setup" 
                element={
                  <CustomProviderSetup />
                }
              />
              {/* Duplicate route removed - using the one above */}
              <Route
                path="/cards"
                element={<CardsPage />}
              />
              <Route path="/people" element={<PeoplePage />} />
              {/* BulkInvitePage removed as it's now a drawer component */}
              <Route 
                path="/policy" 
                element={
                  <div className={`flex-1 overflow-hidden ${showSettings ? 'opacity-30' : ''}`}>
                    <PolicyTab />
                  </div>
                }
              />
              <Route
                path="/submission-policy-builder"
                element={<SubmissionPolicyBuilder />}
              />
              {/* Enhanced catch-all route with navigation diagnostics and recovery options */}
              <Route path="*" element={
                <div className="p-8 max-w-5xl mx-auto">
                  <div className="flex items-center mb-6">
                    <div className="bg-red-100 p-2 rounded-full mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-red-600">Navigation Diagnostics</h1>
                  </div>
            
                  <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
                    <h2 className="font-semibold text-lg mb-4 border-b pb-2">The system attempted to navigate to an invalid or missing route</h2>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <h3 className="font-medium mb-2 text-yellow-800">Technical Information:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                        <div><span className="font-medium">Current Path:</span> <code className="bg-yellow-100 px-2 py-1 rounded">{window.location.pathname}</code></div>
                        <div><span className="font-medium">Timestamp:</span> {new Date().toISOString()}</div>
                        <div><span className="font-medium">Referrer:</span> {document.referrer || 'None'}</div>
                        <div><span className="font-medium">Query Parameters:</span> {window.location.search || 'None'}</div>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-medium mb-1 text-yellow-800">Session Storage Keys:</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {Object.keys(sessionStorage).map(key => (
                            <span key={key} className="inline-block bg-white px-2 py-1 text-xs rounded border border-yellow-300">{key}</span>
                          ))}
                          {Object.keys(sessionStorage).length === 0 && <span className="text-gray-500 text-xs italic">No session storage keys found</span>}
                        </div>
                      </div>
                    </div>
              
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                      <h3 className="font-medium mb-3 text-blue-800">Navigation Recovery Options</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        It looks like you encountered a navigation issue. Here are some quick recovery options to get you back on track:
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <button 
                          onClick={() => {
                            console.log("Emergency navigation to /bill-pay/bills");
                            navigate('/bill-pay/bills');
                          }}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Return to Bills
                        </button>
                        <button 
                          onClick={() => {
                            // Use consistent path variable to prevent JavaScript compilation issues
                            const createBillPath = "/create-bill";
                            console.log(`Emergency navigation to ${createBillPath}`);
                            navigate(createBillPath);
                          }}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Go to Create Bill
                        </button>
                        <button 
                          onClick={() => {
                            console.log("Emergency navigation to /new-vendor");
                            navigate('/new-vendor');
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Go to New Vendor
                        </button>
                        <button 
                          onClick={() => {
                            console.log("Going back to previous page");
                            navigate(-1);
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Go Back
                        </button>
                      </div>
                    </div>
                    
                    <details className="text-sm border rounded mb-4">
                      <summary className="cursor-pointer p-3 bg-gray-50 font-medium">View Complete Diagnostic Data</summary>
                      <pre className="bg-gray-100 p-4 overflow-auto max-h-60 rounded-b text-xs">
                        {JSON.stringify({
                          path: window.location.pathname,
                          search: window.location.search,
                          hash: window.location.hash,
                          referrer: document.referrer,
                          timestamp: new Date().toISOString(),
                          sessionStorageKeys: Object.keys(sessionStorage),
                          sessionStorageData: Object.fromEntries(
                            Object.keys(sessionStorage).map(key => [key, sessionStorage.getItem(key)])
                          ),
                          navigationType: window.performance && window.performance.navigation ? 
                            ['navigate', 'reload', 'back_forward', 'prerender'][window.performance.navigation.type] : 'unknown',
                          userAgent: navigator.userAgent,
                        }, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              } />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </div>
      
      <SettingsModal
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        activeSettingsTab={activeSettingsTab}
        setActiveSettingsTab={setActiveSettingsTab}
        sampleAPClerks={sampleAPClerks}
        importTallyEnabled={importTallyEnabled}
        setImportTallyEnabled={setImportTallyEnabled}
        importPOEnabled={importPOEnabled}
        setImportPOEnabled={setImportPOEnabled}
        settingsModalRef={settingsModalRef}
      />
      
      {/* Spreadsheet Upload Modal */}
      <SpreadsheetUploadModal 
        show={showSpreadsheetUpload}
        onClose={() => setShowSpreadsheetUpload(false)}
      />
      
      <InvoicePreview
        showInvoicePreview={showInvoicePreview}
        setShowInvoicePreview={setShowInvoicePreview}
        uploadedInvoice={uploadedInvoice}
        setUploadedInvoice={setUploadedInvoice}
      />
      
      {/* Direct instance of NewBill has been removed to prevent component duplication 
       * All NewBill functionality now uses React Router via the /new-bill route
       */}
      
      <NewVendor
        uploadedInvoice={uploadedInvoice}
        showNewVendor={showNewVendor}
        notification={notificationContext}
        onClose={() => {
          console.log("Closing vendor form and navigating to create bill");
          console.log("Current uploaded invoice data:", uploadedInvoice ? "Present" : "None");
          
          // First close the vendor form
          setShowNewVendor(false);
          
          // Store invoice data in session storage as a fallback
          try {
            if (uploadedInvoice) {
              sessionStorage.setItem('pendingInvoiceData', JSON.stringify(uploadedInvoice));
              console.log("Stored invoice data in sessionStorage for fallback recovery");
            }
          } catch (error) {
            console.error("Error storing invoice data:", error);
          }
          
          // Log navigation intent
          console.log("Initiating navigation to /create-bill from NewVendor close");
          
          // Navigate to create-bill with router state if possible
          // Use consistent path variable to prevent JavaScript compilation issues
          const createBillPath = "/create-bill";
          console.log(`Navigating to ${createBillPath} from NewVendor close`);
          navigate(createBillPath, {
            state: {
              uploadedInvoice,
              sourceRoute: "newVendorClosed",
              timestamp: new Date().toISOString()
            },
            replace: true // Force replace to avoid history conflicts
          });
          
          console.log(`Navigation to ${createBillPath} triggered at:`, new Date().toISOString());
        }}
        onVendorCreated={handleVendorCreated}
      />
      
      <NotificationContainer
        notifications={notificationContext.notifications}
        removeNotification={notificationContext.removeNotification}
      />
      
      {/* Hidden file input for document upload */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".pdf,.jpg,.jpeg,.png" 
        onChange={handleFileInputChange} 
      />
      
      {/* Bill Review component - Direct rendering outside of router */}
      {showBillReview && (
        <BillReview />
      )}
      
      {/* Old implementation kept for reference but not used
        <BillReview
          showBillReview={showBillReview}
          setShowBillReview={setShowBillReview}
          billData={billReviewData.billData}
          uploadedInvoice={billReviewData.invoice || uploadedInvoice}
          onBack={() => {
            console.log("Going back from BillReview");
            setShowBillReview(false);
            // Navigate back to previous screen or to create-bill if needed
            navigate(-1);
          }}
        />
      )}
      
      {/* Vendor Review component - Modified to ensure it always renders when showVendorReview is true */}
      {showVendorReview && (
        <VendorReview
          formData={{
            vendorName: vendorReviewData?.vendor?.name || "New Vendor",
            addressLine1: vendorReviewData?.vendor?.address || "",
            firstName: "",
            lastName: "",
            email: vendorReviewData?.vendor?.email || "",
            phoneNumber: vendorReviewData?.vendor?.phone || "",
            taxDetails: {
              gstin: vendorReviewData?.vendor?.gstin || ""
            }
          }}
          uploadedInvoice={vendorReviewData?.invoice || uploadedInvoice}
          sourceRoute={vendorReviewData?.sourceRoute || "newVendor"} // This determines the button text
          onBack={() => {
            console.log("Going back from VendorReview to NewBill");
            // Use React Router navigation instead of component state
            navigate('/new-bill');
          }}
          onContinue={() => {
            console.log("Button clicked with sourceRoute:", vendorReviewData?.sourceRoute);
            
            // Log the current state for debugging
            console.log("onContinue button clicked with full state:", {
              sourceRoute: vendorReviewData?.sourceRoute,
              vendorDataPresent: !!vendorReviewData?.vendor,
              invoiceDataPresent: !!vendorReviewData?.invoice || !!uploadedInvoice,
              timestamp: new Date().toISOString()
            });
            
            if (vendorReviewData?.sourceRoute === "newBill") {
              // When coming from New Bill page with an existing vendor
              console.log("Continue button clicked - from newBill flow with existing vendor");
              notificationContext.showSuccess("Continuing with vendor details");
              
              // Store data in session storage as fallback
              try {
                if (vendorReviewData?.vendor) {
                  sessionStorage.setItem('pendingVendorData', JSON.stringify(vendorReviewData.vendor));
                }
                if (vendorReviewData?.invoice || uploadedInvoice) {
                  sessionStorage.setItem('pendingInvoiceData', JSON.stringify(vendorReviewData?.invoice || uploadedInvoice));
                }
                sessionStorage.setItem('pendingSourceRoute', 'newBill');
                console.log("Stored data in sessionStorage (newBill flow)");
              } catch (error) {
                console.error("Error storing data in sessionStorage:", error);
              }
              
              // Navigate to the create bill page
              setShowVendorReview(false);
              
              // Navigate to the Create Bill page (fixed flow - direct to create-bill)
              // Make sure the compiled JS uses the correct path
              const createBillPath = "/create-bill";
              console.log(`Navigating to ${createBillPath} from newBill flow`);
              navigate(createBillPath, {
                state: {
                  vendorData: vendorReviewData?.vendor,
                  uploadedInvoice: vendorReviewData?.invoice || uploadedInvoice,
                  sourceRoute: "newBill",
                  timestamp: new Date().toISOString()
                },
                replace: true // Force replace to avoid history conflicts
              });
            } else {
              // When coming from New Vendor page
              console.log("Create vendor button clicked - from newVendor flow");
              notificationContext.showSuccess("Vendor created successfully");
              
              // Store data in session storage as fallback
              try {
                if (vendorReviewData?.vendor) {
                  sessionStorage.setItem('pendingVendorData', JSON.stringify(vendorReviewData.vendor));
                }
                if (vendorReviewData?.invoice || uploadedInvoice) {
                  sessionStorage.setItem('pendingInvoiceData', JSON.stringify(vendorReviewData?.invoice || uploadedInvoice));
                }
                sessionStorage.setItem('pendingSourceRoute', 'newVendor');
                console.log("Stored data in sessionStorage (newVendor flow)");
              } catch (error) {
                console.error("Error storing data in sessionStorage:", error);
              }
              
              // Close the vendor review screen
              setShowVendorReview(false);
              
              // Log navigation intent
              console.log("Received request to navigate from Review New Vendor page");
              
              // MODIFICATION: Navigate to Vendor Review after creating a vendor
              // This allows the user to review the vendor before proceeding to the Create Bill page
              const vendorReviewPath = "/vendor-review";
              console.log(`Navigating to ${vendorReviewPath} from newVendor flow`);
              navigate(vendorReviewPath, {
                state: {
                  formData: vendorReviewData?.vendor,
                  uploadedInvoice: vendorReviewData?.invoice || uploadedInvoice,
                  sourceRoute: "newVendorCreated", // Special source route to indicate vendor was just created
                  timestamp: new Date().toISOString()
                },
                replace: true // Force replace to avoid history issues
              });
            }
          }}
          isSubmitting={false}
        />
      )}
    </div>
  );
};

// Main App component with NotificationProvider and Router
const App = () => {
  return (
    <NotificationProvider>
      <AccountingProvider>
        <DrawerProvider>
          <Router>
            <AppContent />
            <ToastContainer />
          </Router>
        </DrawerProvider>
      </AccountingProvider>
    </NotificationProvider>
  );
};

export default App;