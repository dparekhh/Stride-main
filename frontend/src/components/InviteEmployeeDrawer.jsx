import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

const InviteEmployeeDrawer = ({ isOpen, onClose, onBack, parentOnClose }) => {
  const [email, setEmail] = useState("");
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
  
  // Back button returns user to the "Invite people to Stride" drawer
  const handleBack = () => {
    // Call the onBack function passed from the parent component
    // This should hide the InviteEmployeeDrawer and show the InvitePeopleDrawer
    onBack();
  };

  // Close button returns user to the "All" subtab of the people's tab
  const handleClose = () => {
    // Call the parentOnClose function passed from parent component
    // This should close all drawers and return to the main People tab
    parentOnClose();
  };

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
          <h2 className="text-2xl font-bold mt-4 mb-2">Invite Employee</h2>
          <p className="text-gray-600">
            Invite up to 20 people that share managers, departments, and locations. Once they sign
            up, issue them a card or have them request one.
          </p>
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
          
          {/* Invite via email section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Invite via email</h3>
            <div className="mb-1">
              <label className="text-sm text-gray-600 block">
                Enter or paste email addresses*
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder=""
              />
            </div>
            <p className="text-xs text-gray-500 mb-6">
              Tip: Invite up to 20 people at once with shared profile settings
            </p>
          </div>

          {/* Profile settings section */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Profile settings</h3>
            
            <div className="mb-4">
              <label className="text-sm text-gray-600 block mb-2">Manager</label>
              <div className="relative">
                <select className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                  <option value=""></option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <ChevronDown size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="text-sm text-gray-600 block mb-2">Department*</label>
                <div className="relative">
                  <select className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                    <option value=""></option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <label className="text-sm text-gray-600 block mb-2">Location*</label>
                <div className="relative">
                  <select className="w-full appearance-none border border-gray-300 rounded-md py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white">
                    <option value=""></option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Issue a card section */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Issue a card?</h3>
            <p className="text-sm text-gray-600 mb-4">
              You may pre-issue cards with your invite, available as users finish signing up
            </p>
            <button className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
              Add card
            </button>
          </div>
          
          {/* Add additional content to demonstrate scrolling */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Additional information</h3>
            <p className="text-sm text-gray-600 mb-4">
              New team members will receive an email invitation to join your Stride account.
              They will be able to set up their account and access the features assigned to their role.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">What happens after invitation?</h4>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Team members will receive an email with instructions</li>
                <li>They will create their own password</li>
                <li>Access will be granted based on their assigned role</li>
                <li>You can manage their permissions later from the People tab</li>
              </ul>
            </div>
          </div>
          
          <div className="h-12"></div>
        </div>

        {/* Footer - Fixed outside scrollable area */}
        <div className="absolute bottom-0 left-0 right-0 py-4 px-6 flex justify-end bg-white border-t border-gray-200">
          <button className="bg-primary hover:bg-primary-dark text-white font-medium px-6 py-2 rounded-lg">
            Send invite
          </button>
        </div>
      </div>
    </>
  );
};

export default InviteEmployeeDrawer;