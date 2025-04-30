// src/pages/CreateBill.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Info, AlertCircle, Check, Plus, Calendar, ArrowRight, FileText, Zap, CircleHelp, File } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import SharedInvoicePreview from "../components/SharedInvoicePreview.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";

const CreateBill = ({
  showCreateBill,
  setShowCreateBill,
  uploadedInvoice,
  onBack
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const notification = useNotification();

  // Only get invoice data, don't depend on vendor data
  const locationInvoice = location.state?.uploadedInvoice;
  const finalUploadedInvoice = locationInvoice || uploadedInvoice;

  // Get source route information for navigation
  const sourceRoute = location.state?.sourceRoute;
  const fromVendorReview = location.state?.fromVendorReview || false;

  // Log detailed navigation state information
  console.log("CreateBill - received location state:", location.state);
  console.log("CreateBill - received source route:", sourceRoute);
  console.log("CreateBill - fromVendorReview flag:", fromVendorReview);
  console.log("CreateBill - full navigation path:", location.pathname);

  // Store initial state values to ensure they're available even if location state changes
  const [navigationState] = useState({
    initialSourceRoute: sourceRoute,
    initialFromVendorReview: fromVendorReview
  });

  // State for different sections
  const [activeSection, setActiveSection] = useState("vendor");
  const [isFormValid, setIsFormValid] = useState(false);
  const [lineItemsCollapsed, setLineItemsCollapsed] = useState(false);
  const [lineItemsExpanded, setLineItemsExpanded] = useState({});
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [pendingExitAction, setPendingExitAction] = useState(null);
  const [lineItems, setLineItems] = useState([
    { id: 1, description: null, quantity: null, unitPrice: null, amount: null, taxRate: null, taxAmount: null, categoryId: null, location: null, category: null, department: null, billing: null }
  ]);

  // State for form data
  const [formData, setFormData] = useState({
    billNumber: finalUploadedInvoice?.extractedData?.invoice_number || "",
    issueDate: "",  // Start empty
    dueDate: "",    // Start empty
    amount: finalUploadedInvoice?.extractedData?.total_amount || 0,
    currency: "INR",
    notes: "",
    accountType: "expense",
    paymentTerms: "net30",
    approver: "",
    vendorContact: "",
    purchaseOrder: "",
    goodsReceivedNote: "",
    creditPeriod: "",  // Start empty
    paymentReminder: "",
    customReminderDate: ""
  });

  // Calculate total values from line items
  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const taxTotal = lineItems.reduce((sum, item) => sum + (parseFloat(item.taxAmount) || 0), 0);
    const total = subtotal + taxTotal;

    return { subtotal, taxTotal, total };
  };

  const { subtotal, taxTotal, total } = calculateTotals();

  // Update lineItem amount when quantity or unit price changes
  const updateLineItem = (id, field, value) => {
    setLineItems(prevItems => 
      prevItems.map(item => {
        if (item.id !== id) return item;

        // Create a new line item with the updated field
        const updatedItem = { ...item, [field]: value };

        // Recalculate amount when quantity or unitPrice changes
        if (field === 'quantity' || field === 'unitPrice') {
          const quantity = field === 'quantity' ? value : item.quantity;
          const unitPrice = field === 'unitPrice' ? value : item.unitPrice;
          updatedItem.amount = (parseFloat(quantity) || 0) * (parseFloat(unitPrice) || 0);

          // Also recalculate tax amount based on the new amount
          if (updatedItem.taxRate > 0) {
            updatedItem.taxAmount = (updatedItem.amount * updatedItem.taxRate) / 100;
          }
        }

        // Recalculate tax amount when tax rate changes
        if (field === 'taxRate') {
          updatedItem.taxAmount = (updatedItem.amount * value) / 100;
        }

        return updatedItem;
      })
    );
  };

  // Add a new line item
  const addLineItem = () => {
    const newId = Math.max(...lineItems.map(item => item.id), 0) + 1;
    setLineItems([
      ...lineItems,
      {
        id: newId,
        description: null,
        quantity: null,
        unitPrice: null,
        amount: null,
        taxRate: null,
        taxAmount: null,
        categoryId: null,
        location: null,
        category: null,
        department: null,
        billing: null
      }
    ]);
  };

  // Remove a line item
  const removeLineItem = (id) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    } else {
      notification.showInfo("You need at least one line item");
    }
  };

  // Toggle expansion for a line item
  const toggleLineItemExpansion = (id) => {
    setLineItemsExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value
    };

    // Calculate due date based on issue date and credit period
    // Only calculate if both fields have values
    if ((name === 'issueDate' || name === 'creditPeriod') && 
        updatedFormData.issueDate && 
        updatedFormData.creditPeriod) {

      const issueDate = new Date(updatedFormData.issueDate);
      const creditPeriod = parseInt(updatedFormData.creditPeriod) || 0;

      if (!isNaN(issueDate.getTime())) {
        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + creditPeriod);
        updatedFormData.dueDate = dueDate.toISOString().split('T')[0];
      }
    }

    // Clear payment date if either invoice date or credit period is cleared
    if ((name === 'issueDate' || name === 'creditPeriod') && 
        (!updatedFormData.issueDate || !updatedFormData.creditPeriod)) {
      updatedFormData.dueDate = "";
    }

    setFormData(updatedFormData);
  };

  // Debug: Log state changes
  useEffect(() => {
    console.log("CreateBill component visibility:", showCreateBill);
    console.log("Vendor data:", "Not used - removed dependency");
    console.log("Invoice data:", finalUploadedInvoice);
    console.log("Location state:", location.state);

    // Check for data in sessionStorage (added from VendorReviewWrapper)
    try {
      // Check if there's a CreateBill transition ID in sessionStorage
      const transitionId = sessionStorage.getItem('createBillTransitionId');
      if (transitionId) {
        console.log("🔄 Found CreateBill transition data in sessionStorage with ID:", transitionId);

        // Get vendor data from sessionStorage
        const storedVendorData = sessionStorage.getItem('vendorData');
        const storedInvoiceData = sessionStorage.getItem('invoiceData');

        if (storedVendorData) {
          const parsedVendorData = JSON.parse(storedVendorData);
          console.log("Using vendor data from sessionStorage:", parsedVendorData);

          // If we have invoice data too, use it
          if (storedInvoiceData) {
            try {
              const parsedInvoiceData = JSON.parse(storedInvoiceData);
              console.log("Using invoice data from sessionStorage:", parsedInvoiceData);

              // Update state with data from sessionStorage
              notification.showInfo("Loading invoice data from previous page");
            } catch (parseError) {
              console.error("Error parsing invoice data from sessionStorage:", parseError);
            }
          }
        }

        // Clear the transition data from sessionStorage
        sessionStorage.removeItem('createBillTransitionId');
        sessionStorage.removeItem('vendorData');
        sessionStorage.removeItem('invoiceData');
      }
    } catch (error) {
      console.error("Error retrieving data from sessionStorage:", error);
    }
  }, [showCreateBill, finalUploadedInvoice, location.state, notification]);

  // Calculate due date based on issue date and credit period
  // Only update if both values are present
  useEffect(() => {
    if (formData.issueDate && formData.creditPeriod) {
      const issueDate = new Date(formData.issueDate);
      const creditPeriod = parseInt(formData.creditPeriod) || 0;

      if (!isNaN(issueDate.getTime())) {
        const dueDate = new Date(issueDate);
        dueDate.setDate(dueDate.getDate() + creditPeriod);

        const formattedDueDate = dueDate.toISOString().split('T')[0];
        if (formattedDueDate !== formData.dueDate) {
          setFormData(prev => ({
            ...prev,
            dueDate: formattedDueDate
          }));
        }
      }
    } else if (formData.dueDate) {
      // Clear payment date if either invoice date or credit period is missing
      setFormData(prev => ({
        ...prev,
        dueDate: ""
      }));
    }
  }, [formData.issueDate, formData.creditPeriod]);

  // Form validation is completely disabled per requirement
  // Always set form to valid regardless of content
  useEffect(() => {
    // Setting isFormValid to true regardless of form content
    // This allows the "Continue" button to be clickable at all times
    setIsFormValid(true);
    
    // Original validation logic completely removed to ensure no validation occurs
  }, [formData, lineItems]);

  // Don't add any backend logic or dependencies as requested

  // Check if we're accessing via a direct route
  const directRouteAccess = location.pathname === '/create-bill';

  // Only check showCreateBill if we're NOT accessing directly via route
  if (!showCreateBill && !directRouteAccess) {
    console.log("CreateBill hidden by showCreateBill=false, not on direct route");
    return null;
  }

  // Log how we're rendering
  console.log(`CreateBill rendering. showCreateBill=${showCreateBill}, directRouteAccess=${directRouteAccess}`);

  // Handle exit confirmation
  const handleExitConfirm = () => {
    if (pendingExitAction) {
      pendingExitAction();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Confirmation Modal */}
      <ConfirmationModal 
        show={showExitConfirmation}
        onClose={() => setShowExitConfirmation(false)}
        onConfirm={handleExitConfirm}
        message="Changes to the bill have not been saved. Are you sure you want to exit?"
        title="Unsaved Changes"
        confirmText="Yes"
        cancelText="No"
      />

      <div className="flex h-screen">
        {/* Left side - Invoice Preview */}
        <SharedInvoicePreview uploadedInvoice={finalUploadedInvoice} />

        {/* Right side - Bill Creation Form */}
        <div className="w-1/2 flex flex-col h-full overflow-auto">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
            <h2 className="text-xl font-bold">Create Bill</h2>
            <button
              onClick={() => {
                // Check if the form has been modified/filled
                const hasFormData = formData.billNumber || formData.issueDate || formData.dueDate || 
                  formData.amount > 0 || formData.notes || 
                  lineItems.some(item => item.description || item.quantity || item.unitPrice);

                if (hasFormData) {
                  // Prepare the exit action based on source route
                  const exitAction = () => {
                    console.log("Close (X) icon clicked with sourceRoute:", sourceRoute);
                    console.log("Navigation state values - initialSourceRoute:", navigationState.initialSourceRoute);
                    console.log("Navigation state values - initialFromVendorReview:", navigationState.initialFromVendorReview);

                    // Use both current and persisted navigation state for reliability
                    const isVendorRelated = 
                      sourceRoute === "existingVendor" || sourceRoute === "newVendor" || 
                      sourceRoute === "vendorReview" || fromVendorReview ||
                      navigationState.initialSourceRoute === "existingVendor" || 
                      navigationState.initialSourceRoute === "newVendor" || 
                      navigationState.initialSourceRoute === "vendorReview" || 
                      navigationState.initialFromVendorReview;

                    // Check for any vendor-related source route and navigate back
                    if (isVendorRelated) {
                      // Redirect back to previous screen (Vendor Review)
                      console.log("Navigating back to Vendor Review screen");
                      navigate(-1);
                    } else {
                      // Default behavior
                      console.log("Navigating back to default route (Bills)");
                      setShowCreateBill(false);
                      navigate("/bill-pay/bills");
                    }
                  };

                  // Store the pending action and show the confirmation modal
                  setPendingExitAction(() => exitAction);
                  setShowExitConfirmation(true);
                } else {
                  // No form data, just navigate
                  console.log("No form data, directly navigating with sourceRoute:", sourceRoute);
                  console.log("Navigation state values - initialSourceRoute:", navigationState.initialSourceRoute);
                  console.log("Navigation state values - initialFromVendorReview:", navigationState.initialFromVendorReview);

                  // Use both current and persisted navigation state for reliability
                  const isVendorRelated = 
                    sourceRoute === "existingVendor" || sourceRoute === "newVendor" || 
                    sourceRoute === "vendorReview" || fromVendorReview ||
                    navigationState.initialSourceRoute === "existingVendor" || 
                    navigationState.initialSourceRoute === "newVendor" || 
                    navigationState.initialSourceRoute === "vendorReview" || 
                    navigationState.initialFromVendorReview;

                  // Check for any vendor-related source route and navigate back
                  if (isVendorRelated) {
                    // Redirect back to previous screen (Vendor Review)
                    console.log("Navigating back to Vendor Review screen");
                    navigate(-1);
                  } else {
                    console.log("Navigating back to default route (Bills)");
                    setShowCreateBill(false);
                    navigate("/bill-pay/bills");
                  }
                }
              }}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Information Box - Auto-filled data notification */}
          <div className="p-4 m-4 mb-6 bg-gray-100 border border-gray-200 rounded-md">
            <div className="flex items-center">
              <Zap size={20} className="text-gray-600 mr-2" />
              <p className="text-base text-gray-700">
                Stride has retrieved data from the invoice and prefilled this bill
              </p>
            </div>
          </div>

          <div className="flex-grow p-4 overflow-y-auto pb-24">
            {/* Section 1: Who's it for? */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Who's it for?</h3>
              <div className="bg-white border border-gray-200 rounded-md">
                {/* Vendor Name */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                  <p className="text-gray-700">Vendor Name</p>
                  <div className="flex items-center">
                    <button className="p-1 rounded hover:bg-gray-100 mr-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <polyline points="9 21 3 21 3 15"></polyline>
                        <line x1="21" y1="3" x2="14" y2="10"></line>
                        <line x1="3" y1="21" x2="10" y2="14"></line>
                      </svg>
                    </button>
                    <button className="p-1 rounded hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                        <circle cx="12" cy="12" r="1"></circle>
                        <circle cx="19" cy="12" r="1"></circle>
                        <circle cx="5" cy="12" r="1"></circle>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Vendor Contact */}
                <div className="p-4 border-b border-gray-100 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 mr-2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      name="vendorContact"
                      value={formData.vendorContact}
                      onChange={handleChange}
                      className="w-full border-none p-0 focus:ring-0 text-gray-700 placeholder-gray-400 text-sm" 
                      placeholder="Enter vendor contact here"
                    />
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {/* Payment History */}
                <div className="p-4 flex items-center text-sm text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mr-2">
                    <path d="M12 2H2v10h10V2z"></path>
                    <path d="M22 12h-10v10h10V12z"></path>
                    <path d="M12 12H2v10h10V12z"></path>
                  </svg>
                  <span>No previous payments to this vendor.</span>
                </div>
              </div>
            </div>

            {/* Section 2: What for? */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">What for?</h3>
              <div className="bg-white border border-gray-200 rounded-md">
                {/* Invoice # */}
                <div className="p-4 border-b border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice #
                  </label>
                  <input
                    type="text"
                    name="billNumber"
                    value={formData.billNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="e.g. 501"
                  />
                </div>

                {/* Dates */}
                <div className="flex border-b border-gray-100">
                  <div className="flex-1 p-4 border-r border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="issueDate"
                        value={formData.issueDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md pr-8"
                      />
                      <Calendar size={16} className="absolute right-2 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div className="flex-1 p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bill due date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md pr-8"
                      />
                      <Calendar size={16} className="absolute right-2 top-3 text-black" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 border-b border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows="2"
                    placeholder="e.g. Invoice for October includes coffee beans and coffee machine parts"
                  ></textarea>
                </div>

                {/* Matching purchase order */}
                <div className="p-4 border-b border-gray-100">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matching purchase order
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="purchaseOrder"
                      value={formData.purchaseOrder || ""}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter PO#"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2 top-3 text-gray-400">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>

                {/* Matching goods received note */}
                <div className="p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matching goods received note
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="goodsReceivedNote"
                      value={formData.goodsReceivedNote || ""}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      placeholder="Enter GRN#"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2 top-3 text-gray-400">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Line Items */}
            <div className="mb-8">
              <div className="mb-3">
                <h3 className="text-lg font-medium">Line items</h3>
              </div>

              {/* Info message with grey background */}
              <div className="flex items-center justify-between mb-3 bg-gray-100 border border-gray-200 p-3 rounded-md">
                <div className="flex items-center">
                  <Zap size={16} className="text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    {lineItemsCollapsed 
                      ? "These line items have been collapsed" 
                      : "Stride can simplify these into a single line item"}
                  </span>
                </div>
                <button 
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 text-gray-600 hover:bg-gray-50 bg-white"
                  onClick={() => setLineItemsCollapsed(!lineItemsCollapsed)}
                >
                  {lineItemsCollapsed ? "Expand line items" : "Collapse line items"}
                </button>
              </div>

              {/* Collapsed view of line items */}
              {lineItemsCollapsed && (
                <div className="bg-white border border-gray-200 rounded-lg mb-0">
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex-grow"></div>
                      <div className="text-sm text-gray-500">Expense | Item</div>
                    </div>

                    <div className="flex justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-500">Amount</div>
                        <div className="text-sm mt-1">₹{total.toFixed(2)}</div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">{"{accounting software}"} Description</div>
                        <div className="text-sm text-gray-600 mt-1">Item description</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">{"{accounting software}"} Class</label>
                        <select
                          className="w-full p-2 pr-8 border border-gray-300 rounded-md text-sm appearance-none bg-white"
                        >
                          <option value="">Select class</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">{"{accounting software}"} Job</label>
                        <select
                          className="w-full p-2 pr-8 border border-gray-300 rounded-md text-sm appearance-none bg-white"
                        >
                          <option value="">Select job</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">{"{accounting software}"} Department</label>
                        <select
                          className="w-full p-2 pr-8 border border-gray-300 rounded-md text-sm appearance-none bg-white"
                        >
                          <option value="">Select department</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-500 mb-1">{"{accounting software}"} Billing</label>
                        <select
                          className="w-full p-2 pr-8 border border-gray-300 rounded-md text-sm appearance-none bg-white"
                        >
                          <option value="">Select billing</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Invoice total bar */}
                  <div className="border-t border-gray-200 p-3">
                    <div>
                      <div className="text-sm text-gray-500">Invoice total</div>
                      <div className="text-md font-semibold">₹{total.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Expanded line items view */}
              <div className={`p-5 bg-white border border-gray-200 rounded-lg ${lineItemsCollapsed ? 'hidden' : 'block'}`}>
                <div className="space-y-6">
                  {/* Line items start here */}

                  {/* Map through all line items */}
                  {lineItems.map((item, index) => (
                    <div key={item.id} className="mb-8 pb-6 border-b border-gray-200">
                      {/* Collapsible insights bar */}
                      <div className="border border-gray-300 bg-gray-50 rounded-md mb-4">
                        {/* Top row with insights and PO number */}
                        <div className="p-3 flex justify-between items-center">
                          <div className="flex items-center">
                            {/* Gradient blue sparkle icon */}
                            <div className="mr-2 text-blue-500">
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#blue-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <defs>
                                  <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#1e40af" />
                                  </linearGradient>
                                </defs>
                                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700">20 billed units have not been received</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-sm font-medium text-gray-700">PO#1437</span>
                            <button 
                              className="ml-2 p-1 hover:bg-gray-100 rounded"
                              onClick={() => window.open('#', '_blank')}
                              aria-label="Open PO details"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <polyline points="9 21 3 21 3 15"></polyline>
                                <line x1="21" y1="3" x2="14" y2="10"></line>
                                <line x1="3" y1="21" x2="10" y2="14"></line>
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Collapsible content */}
                        {lineItemsExpanded[item.id] && (
                          <div className="px-3 pb-3 grid grid-cols-4 gap-4">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Purchase Order</div>
                              <div className="text-sm font-semibold">50 Units</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Total Received</div>
                              <div className="text-sm font-semibold">30 Units</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Previous Bill</div>
                              <div className="text-sm font-semibold">0 Units</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Current Bill</div>
                              <div className="text-sm font-semibold">50 Units</div>
                            </div>
                          </div>
                        )}

                        {/* Collapse/expand button */}
                        <div className="px-3 py-1 flex justify-end border-t border-gray-200">
                          <button 
                            onClick={() => toggleLineItemExpansion(item.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {lineItemsExpanded[item.id] ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="18 15 12 9 6 15"></polyline>
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="6 9 12 15 18 9"></polyline>
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Line item header with delete button */}
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-md font-medium text-gray-700">Line item {index + 1}</h4>
                        {lineItems.length > 1 && (
                          <button 
                            onClick={() => removeLineItem(item.id)}
                            className="p-1 rounded-full hover:bg-gray-100"
                            aria-label="Delete line item"
                          >
                            <X size={18} className="text-gray-500" />
                          </button>
                        )}
                      </div>

                      {/* Category and Description Row */}
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-sm font-semibold text-gray-700 mb-1">{"{accounting software}"} Accounting Category</div>
                          <input
                            type="text"
                            value={item.categoryId || ""}
                            onChange={(e) => updateLineItem(item.id, 'categoryId', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-700 mb-1">{"{accounting software}"} Item Description</div>
                          <input
                            type="text"
                            value={item.description || ""}
                            onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
                          />
                        </div>
                      </div>

                      {/* Quantity, Rate, Amount Headers */}
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="text-sm font-semibold text-gray-700">Quantity</div>
                        <div className="text-sm font-semibold text-gray-700">Rate</div>
                        <div className="text-sm font-semibold text-gray-700">Amount</div>
                      </div>

                      {/* Quantity, Rate, Amount Input Fields */}
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <input
                            type="number"
                            value={item.quantity || ""}
                            onChange={(e) => updateLineItem(item.id, 'quantity', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute left-2 top-2 text-gray-500">₹</span>
                          <input
                            type="number"
                            value={item.unitPrice || ""}
                            onChange={(e) => updateLineItem(item.id, 'unitPrice', e.target.value)}
                            className="w-full p-2 pl-6 border border-gray-300 rounded-md text-sm bg-white"
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute left-2 top-2 text-gray-500">₹</span>
                          <input
                            type="number"
                            value={item.amount || ""}
                            readOnly
                            className="w-full p-2 pl-6 border border-gray-300 rounded-md text-sm bg-white"
                          />
                        </div>
                      </div>

                      {/* Department, Location, Category Row */}
                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <div className="mb-2 text-sm font-medium text-gray-700">{"{accounting software}"} Department</div>
                          <div className="relative">
                            <select
                              value={item.department || ""}
                              onChange={(e) => updateLineItem(item.id, 'department', e.target.value)}
                              className="w-full p-2 pr-8 border border-gray-300 rounded-md text-sm appearance-none bg-white"
                            >
                              <option value="">Select department</option>
                              <option value="Procurement">Procurement</option>
                              <option value="Sales">Sales</option>
                              <option value="Marketing">Marketing</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2 top-3 text-gray-500">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <div className="mb-2 text-sm font-medium text-gray-700">{"{accounting software}"} Location</div>
                          <div className="relative">
                            <select
                              value={item.location || ""}
                              onChange={(e) => updateLineItem(item.id, 'location', e.target.value)}
                              className="w-full p-2 pr-8 border border-gray-300 rounded-md text-sm appearance-none bg-white"
                            >
                              <option value="">Select location</option>
                              <option value="Warehouse">Warehouse</option>
                              <option value="Office">Office</option>
                              <option value="Retail">Retail</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2 top-3 text-gray-500">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                        </div>
                        <div>
                          <div className="mb-2 text-sm font-medium text-gray-700">{"{accounting software}"} Category</div>
                          <div className="relative">
                            <select
                              value={item.category || ""}
                              onChange={(e) => updateLineItem(item.id, 'category', e.target.value)}
                              className="w-full p-2 pr-8 border border-gray-300 rounded-md text-sm appearance-none bg-white"
                            >
                              <option value="">Select category</option>
                              <option value="Office Supplies">Office Supplies</option>
                              <option value="Technology">Technology</option>
                              <option value="Furniture">Furniture</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2 top-3 text-gray-500">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Customer & Billing Row */}
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="mb-2 text-sm font-medium text-gray-700">{"{accounting software}"} Customer</div>
                          <input
                            type="text"
                            value={item.customer || ""}
                            onChange={(e) => updateLineItem(item.id, 'customer', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md text-sm bg-white"
                            placeholder="Enter customer"
                          />
                        </div>
                        <div>
                          <div className="mb-2 text-sm font-medium text-gray-700">{"{accounting software}"} Billing</div>
                          <div className="relative">
                            <select
                              value={item.billing || ""}
                              onChange={(e) => updateLineItem(item.id, 'billing', e.target.value)}
                              className="w-full p-2 pr-8 border border-gray-300 rounded-md text-sm appearance-none bg-white"
                            >
                              <option value="">Select billing</option>
                              <option value="Billable">Billable</option>
                              <option value="Not Billable">Not Billable</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2 top-3 text-gray-500">
                              <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add Line Item Button */}
                  <div className="mt-4">
                    <button
                      onClick={addLineItem}
                      className="flex items-center px-3 py-2 border border-gray-200 rounded text-gray-700 font-medium hover:bg-gray-50"
                    >
                      <Plus size={16} className="mr-1" />
                      Add line item
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Schedule payment */}
            <div className="mb-8">
              <div className="flex items-center mb-3">
                <h3 className="text-lg font-medium">Schedule payment</h3>
                <div className="relative group ml-2">
                  <Info size={16} className="text-gray-500 cursor-help" />
                  <div className="absolute left-0 top-0 transform translate-x-6 w-64 p-2 bg-gray-50 text-gray-700 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 pointer-events-none border border-gray-200 shadow-sm">
                    Stride doesn't process payments yet, but we'll send you timely reminders so you don't miss them.
                  </div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-md">
                <div className="p-4">
                  {/* Schedule now section */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="h-5 w-5 rounded-full border border-green-500 flex items-center justify-center mr-2">
                        <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                      </div>
                      <span className="text-base font-medium">Schedule now</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 ml-7 mb-4">Enter credit period and set payment date</p>

                  {/* Remember preference checkbox */}
                  <div className="flex items-center ml-7 mb-4">
                    <input
                      type="checkbox"
                      id="remember-preference"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-preference" className="ml-2 text-sm text-gray-600">
                      Remember this preference for the next bill
                    </label>
                  </div>

                  {/* Payment schedule fields */}
                  <div className="flex items-center ml-7 max-w-3xl">
                    {/* Invoice date field */}
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">Invoice date *</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="issueDate"
                          value={formData.issueDate}
                          onChange={handleChange}
                          className="p-2 border border-gray-300 rounded-md pr-8 w-36"
                        />
                        <Calendar size={16} className="absolute right-2 top-3 text-gray-400" />
                      </div>
                    </div>

                    {/* Arrow between Invoice date and Credit period */}
                    <div className="mx-2 mt-6">
                      <ArrowRight size={20} className="text-gray-400" />
                    </div>

                    {/* Credit period field */}
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">Credit period</label>
                      <div className="relative">
                        <input
                          type="number"
                          name="creditPeriod"
                          value={formData.creditPeriod}
                          onChange={handleChange}
                          className="p-2 border border-gray-300 rounded-md w-28 pr-14"
                          placeholder="Enter days"
                        />
                        <span className="absolute right-2 top-3 text-sm text-gray-500">day(s)</span>
                      </div>
                    </div>

                    {/* Arrow between Credit period and Payment date */}
                    <div className="mx-2 mt-6">
                      <ArrowRight size={20} className="text-gray-400" />
                    </div>

                    {/* Payment date field */}
                    <div className="flex flex-col">
                      <label className="text-sm text-gray-600 mb-1">Payment date *</label>
                      <div className="relative">
                        <input
                          type="date"
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleChange}
                          className="p-2 border border-gray-300 rounded-md pr-8 w-36"
                          readOnly
                        />
                        <Calendar size={16} className="absolute right-2 top-3 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Payment reminder field */}
                  <div className="ml-7 mt-4">
                    <div className="flex items-center">
                      <label className="text-sm text-gray-600 mr-3">Set payment reminder</label>
                      <div className="relative inline-block">
                        <select
                          name="paymentReminder"
                          value={formData.paymentReminder || ''}
                          onChange={handleChange}
                          className="p-2 border border-gray-300 rounded-md pr-8 text-sm appearance-none"
                        >
                          <option value="">Select</option>
                          <option value="on-date">Remind on payment date</option>
                          <option value="1-day">Remind 1 day before payment date</option>
                          <option value="1-week">Remind 1 week before payment date</option>
                          <option value="15-days">Remind 15 days before payment date</option>
                          <option value="custom">Custom</option>
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute right-2 top-3 text-gray-500">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>

                      {/* Custom date picker - only shown when "Custom" is selected */}
                      {formData.paymentReminder === 'custom' && (
                        <div className="relative ml-3">
                          <input
                            type="date"
                            name="customReminderDate"
                            value={formData.customReminderDate || ''}
                            onChange={handleChange}
                            className="p-2 border border-gray-300 rounded-md pr-8 w-36"
                          />
                          <Calendar size={16} className="absolute right-2 top-3 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="border-t border-gray-200 my-6 mx-2"></div>

                  {/* Skip for now section */}
                  <div className="mb-2">
                    <div className="flex items-center">
                      <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center mr-2">
                        <div className="h-3 w-3 bg-white rounded-full"></div>
                      </div>
                      <span className="text-base font-medium">Skip for now</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 ml-7">Schedule a payment later</p>
                </div>
              </div>
            </div>

            {/* Section 5: Send for review to */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Send for review to</h3>
              <div className="bg-white border border-gray-200 rounded-md">
                <div className="p-4">
                  {/* Approver options list - numbered list style */}
                  <div className="space-y-4">
                    {/* Option 1 */}
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 mr-3">
                        <span className="text-gray-500 text-sm">1</span>
                      </div>
                      <span className="text-gray-500 mr-2">Require:</span>
                      <span className="text-gray-700 font-medium">Amy Adrion</span>
                    </div>

                    {/* Option 2 */}
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 mr-3">
                        <span className="text-gray-500 text-sm">2</span>
                      </div>
                      <span className="text-gray-500 mr-2">Require:</span>
                      <select
                        name="approver"
                        value={formData.approver}
                        onChange={handleChange}
                        className="text-gray-700 font-medium border-none p-0 bg-transparent focus:ring-0 appearance-none"
                      >
                        <option value="Amit">Amit (Finance Director)</option>
                        <option value="Priya">Priya (Procurement Manager)</option>
                        <option value="Vikram">Vikram (CEO)</option>
                      </select>
                    </div>

                    {/* Option 3 */}
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 mr-3">
                        <span className="text-gray-500 text-sm">3</span>
                      </div>
                      <span className="text-gray-500 mr-2">Require:</span>
                      <span className="text-gray-700 font-medium">David Watson, Jan Levinston, or Calvin Lee</span>
                      <CircleHelp size={14} className="ml-2 text-gray-400" />
                    </div>
                  </div>

                  {/* Approve bill button */}
                  <div className="mt-6 flex items-center">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <Check size={16} className="text-green-600" />
                    </div>
                    <span className="text-gray-700">Approve bill</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed bottom action buttons */}
          <div className="fixed bottom-0 right-0 w-1/2 p-4 bg-white border-t border-gray-200 flex justify-between">
            <button
              onClick={() => {
                // Log the action for debugging
                console.log("Save Draft button clicked");

                // Set flag in session storage
                sessionStorage.setItem("draftSaved", "true");

                // Show a toast notification
                notification.showSuccess("Bill draft saved", { autoClose: true, duration: 3000 });

                // Always redirect to the Bills interface when saving a draft
                // This behavior is different from the Close (X) icon navigation
                console.log("Navigating to Bills interface from Save Draft button");
                setShowCreateBill(false);
                navigate("/bill-pay/bills");
              }}
              className="flex items-center px-6 py-2 text-base font-medium text-gray-800 hover:bg-gray-50"
            >
              <File size={18} className="mr-2" />
              <span className="border-b border-gray-800">Save draft</span>
            </button>

            <button
              onClick={() => {
                // Log the action for debugging
                console.log("Continue button clicked - No validation as per requirements");

                // Handle the continue action here - show a notification
                notification.showSuccess("Bill details saved, proceeding to review", { autoClose: true, duration: 3000 });

                // Prepare bill data for review
                const billData = {
                  vendorName: vendorDetails?.name || "Unknown Vendor",
                  amount: parseFloat(formData.amount) || 0,
                  lineItems: lineItems.map(item => ({
                    description: item.description,
                    quantity: parseFloat(item.quantity) || 0,
                    unitPrice: parseFloat(item.unitPrice) || 0
                  })),
                  // Add other bill data as needed
                  billNumber: formData.billNumber,
                  issueDate: formData.issueDate,
                  dueDate: formData.dueDate,
                  currency: formData.currency
                };

                // Log that we're attempting to navigate
                console.log("CRITICAL: Navigating to BillReview page with bill data");
                
                // Pass bill data in the state to make it available in the BillReview component
                navigate("/bill-review", { 
                  replace: true,
                  state: {
                    billData: billData,
                    uploadedInvoice: finalUploadedInvoice
                  }
                });
                
                // Add debug logging to help diagnose issues
                console.log("Navigation attempted to /bill-review with state:", {
                  billData: billData,
                  uploadedInvoice: finalUploadedInvoice
                });
              }}
              className={`px-6 py-2 border border-transparent rounded-md text-base font-medium text-white bg-primary hover:bg-primary-dark`}
              data-testid="create-bill-submit"
            >
              Continue <ArrowRight size={16} className="inline-block ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBill;