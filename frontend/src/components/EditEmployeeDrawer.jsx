import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, Edit2 } from "lucide-react";
import ChangeRoleDrawer from "./ChangeRoleDrawer";
import RemoveEmployeeDrawer from "./RemoveEmployeeDrawer";
import Notification from "./Notification";

const EditEmployeeDrawer = ({ isOpen, onClose, onBack, employee }) => {
  const [firstName, setFirstName] = useState(employee?.name?.split(' ')[0] || "Arjun");
  const [lastName, setLastName] = useState(employee?.name?.split(' ')[1] || "Sharma");
  const [email, setEmail] = useState(employee?.email || "arjun.sharma@stride.com");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("IN (+91)");
  const [employeeRole, setEmployeeRole] = useState(employee?.role || "Employee");
  const [isDelegateApprover, setIsDelegateApprover] = useState(false);
  const [isAccountLocked, setIsAccountLocked] = useState(false);
  const [showChangeRoleDrawer, setShowChangeRoleDrawer] = useState(false);
  const [showRemoveEmployeeDrawer, setShowRemoveEmployeeDrawer] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const scrollableContentRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  
  // Handle scroll events to show/hide the scroll indicator
  useEffect(() => {
    const scrollableContent = scrollableContentRef.current;
    const scrollIndicator = scrollIndicatorRef.current;
    
    if (!scrollableContent || !scrollIndicator) return;
    
    const handleScroll = () => {
      // Show scroll indicator while scrolling
      scrollIndicator.style.opacity = "0.5";
      
      // Hide it after a short delay when scrolling stops
      clearTimeout(scrollIndicator.timeoutId);
      scrollIndicator.timeoutId = setTimeout(() => {
        scrollIndicator.style.opacity = "0";
      }, 1000);
    };
    
    // Check if content is scrollable
    const checkIfScrollable = () => {
      if (scrollableContent.scrollHeight > scrollableContent.clientHeight) {
        // Content is scrollable, briefly show the indicator
        scrollIndicator.style.opacity = "0.5";
        setTimeout(() => {
          scrollIndicator.style.opacity = "0";
        }, 1500);
      }
    };
    
    // Add scroll event listener
    scrollableContent.addEventListener("scroll", handleScroll);
    
    // Check if content is scrollable when drawer opens
    if (isOpen) {
      checkIfScrollable();
    }
    
    // Clean up
    return () => {
      scrollableContent.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollIndicator.timeoutId);
    };
  }, [isOpen]);
  
  // Back button returns to the Employee drawer
  const handleBack = () => {
    if (onBack) onBack();
  };

  // Close button returns user to the "All" subtab of the people's tab
  const handleClose = () => {
    if (onClose) onClose();
  };
  
  // Open Change Role drawer
  const handleEditRole = () => {
    setShowChangeRoleDrawer(true);
  };
  
  // Handle role change
  const handleRoleChange = (newRole) => {
    setEmployeeRole(newRole);
    setShowNotification(true);
  };
  
  // Handle remove account click
  const handleRemoveAccount = () => {
    // Open the RemoveEmployeeDrawer and hide this drawer
    setShowRemoveEmployeeDrawer(true);
    console.log("Opening RemoveEmployeeDrawer");
  };
  
  // Handle actual remove employee
  const handleRemoveEmployee = () => {
    // Here you would typically call an API to remove the account
    console.log("Handling employee removal");
    // Close the RemoveEmployeeDrawer
    setShowRemoveEmployeeDrawer(false);
    // Close the entire drawer system
    if (onClose) onClose();
  };
  
  // Get description based on role
  const getRoleDescription = (role) => {
    switch (role) {
      case "Admin":
        return "Super-users who can invite users, issue cards, set spend limits, create accounting rules, and modify all Stride company settings.";
      case "IT admin":
        return "IT admins can provision users, handle user management, set up and manage integrations and developer settings. They cannot view company spend or manage any spend controls.";
      case "Manager":
        return "Managers can invite other members of your company under them. They can review their team's spend, approve expenses, and request cards for team members.";
      case "Bookkeeper":
        return "Internal employees or assistants who are given access to activity data to help with expenses and accounting. They cannot issue cards or invite others.";
      case "Developer admin":
        return "Developer admins can provision other developer admins, handle user management, and manage developer settings. They cannot view company spend or manage any spend controls.";
      case "Employee":
      default:
        return "Employees can request or be issued virtual and/or physical cards, as well as submit expenses and reimbursements. They cannot issue cards or invite others.";
    }
  };

  // Return early if we need to show the Remove Employee Drawer instead
  if (isOpen && showRemoveEmployeeDrawer) {
    return (
      <RemoveEmployeeDrawer
        isOpen={true}
        onClose={handleClose}
        onBack={() => setShowRemoveEmployeeDrawer(false)}
        employee={{
          name: `${firstName} ${lastName}`,
          email: email,
          cards: 1
        }}
        onRemove={handleRemoveEmployee}
      />
    );
  }

  return (
    <>
      {/* Overlay with blur effect */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Fixed header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={handleBack}
              className="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <span className="mr-1">←</span> Back
            </button>
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold mt-4 mb-2">Manage {firstName}</h2>
          <p className="text-gray-500">{email}</p>
        </div>

        {/* Scrollable content area with scroll indicator */}
        <div 
          ref={scrollableContentRef}
          className="flex-1 overflow-y-auto px-6 pb-24 relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {/* Visual scroll indicator */}
          <div 
            ref={scrollIndicatorRef}
            className="absolute right-2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-0 transition-opacity duration-300 pointer-events-none scroll-indicator"
          ></div>
          
          {/* Employee role section */}
          <div className="mt-6 mb-6">
            <h3 className="text-lg font-medium mb-4">Role</h3>
            
            {/* Boxed employee role container with edit button */}
            <div className="border border-gray-200 rounded-lg p-4 mb-6 relative">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{employeeRole}</h4>
                  <p className="text-sm text-gray-500 mt-1 pr-8">
                    {getRoleDescription(employeeRole)}
                  </p>
                </div>
                <button 
                  onClick={handleEditRole}
                  className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
                >
                  <Edit2 size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Personal settings section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Personal settings</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm text-gray-600 block mb-2">First name*</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="text-sm text-gray-600 block mb-2">Last name*</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="text-sm text-gray-600 block mb-2">Email address</label>
              <div className="flex items-center">
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full border border-gray-300 rounded-md py-2 px-3 bg-gray-50 cursor-not-allowed"
                />
                <button className="ml-2 p-2 text-gray-500 hover:text-gray-700">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-sm text-gray-600 block mb-2">Country</label>
                <div className="relative">
                  <select 
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="US (+1)">🇺🇸 US (+1)</option>
                    <option value="IN (+91)">🇮🇳 IN (+91)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-600 block mb-2">Phone number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder=""
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="text-sm text-gray-600 block mb-2">Place of residence</label>
              <div className="relative">
                <select className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value=""></option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Used for mileage reimbursements and compliance.</p>
            </div>
          </div>

          {/* Account settings section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Account settings</h3>
            
            <div className="mb-4">
              <label className="text-sm text-gray-600 block mb-2">Manager</label>
              <div className="relative">
                <select className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value="">Priya Patel</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-sm text-gray-600 block mb-2">Department</label>
              <div className="relative">
                <select className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value="">Engineering</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="text-sm text-gray-600 block mb-2">Location</label>
              <div className="relative">
                <select className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value="">Bengaluru</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

          </div>

          {/* Delegate approver section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Delegate approver</h3>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Delegate approver</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      A delegate approver will see all requests and transactions requiring that 
                      person's review, so they can act on that person's behalf (e.g. for out of office, 
                      assistants, etc.)
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <div className="relative inline-block w-10 mr-2 align-middle select-none">
                        <input 
                          type="checkbox" 
                          checked={isDelegateApprover}
                          onChange={(e) => setIsDelegateApprover(e.target.checked)}
                          className="sr-only"
                          id="delegate-approver-toggle"
                        />
                        <label 
                          htmlFor="delegate-approver-toggle"
                          className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${isDelegateApprover ? 'bg-green-500' : 'bg-gray-300'}`}
                        >
                          <span 
                            className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${isDelegateApprover ? 'translate-x-4' : 'translate-x-0'}`}
                          ></span>
                        </label>
                      </div>
                    </div>
                    <button className="text-gray-500 p-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                        <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button className="text-gray-500 p-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-4 w-4">
                        <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger zone section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Danger zone</h3>
            
            <div className="bg-gray-100 border border-gray-200 rounded-lg mb-4 overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-start">
                    <div className="mr-2 mt-1">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-5 w-5 text-gray-500">
                        <path d="M12 15v-6m0 0V7m0 2v0M19 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Lock account</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        Users can still log in, but all of their virtual cards will be locked, and all of their
                        transactions will be automatically declined.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="relative inline-block w-10 mr-2 align-middle select-none">
                      <input 
                        type="checkbox" 
                        checked={isAccountLocked}
                        onChange={(e) => setIsAccountLocked(e.target.checked)}
                        className="sr-only"
                        id="lock-account-toggle"
                      />
                      <label 
                        htmlFor="lock-account-toggle"
                        className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${isAccountLocked ? 'bg-red-500' : 'bg-gray-300'}`}
                      >
                        <span 
                          className={`block h-6 w-6 rounded-full bg-white transform transition-transform duration-200 ease-in-out ${isAccountLocked ? 'translate-x-4' : 'translate-x-0'}`}
                        ></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button 
                onClick={handleRemoveAccount}
                className="border border-red-300 text-red-500 font-medium px-6 py-2 rounded-md hover:bg-red-50 bg-white"
              >
                Remove account
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Change Role Drawer */}
      <ChangeRoleDrawer
        isOpen={showChangeRoleDrawer}
        onClose={handleClose}
        onBack={() => setShowChangeRoleDrawer(false)}
        employee={{
          name: `${firstName} ${lastName}`,
          email: email,
          role: employeeRole
        }}
        onRoleChange={handleRoleChange}
      />
      
      {/* RemoveEmployeeDrawer is now handled at the top level component return */}
      
      {/* Success Notification */}
      {showNotification && (
        <Notification
          message="Successfully changed roles"
          type="success"
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  );
};

export default EditEmployeeDrawer;