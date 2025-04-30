import React, { useState, useRef } from "react";
import { X, Upload, Link, ArrowUpCircle, Download } from "lucide-react";

const BulkInviteDrawer = ({ isOpen, onClose, onBack, parentOnClose }) => {
  const [csvUploaded, setCsvUploaded] = useState(false);
  const fileInputRef = useRef(null);

  const handleBack = () => {
    onBack();
  };

  const handleClose = () => {
    parentOnClose();
  };

  const handleFileUpload = () => {
    // Trigger the hidden file input click event
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle the file upload logic here
      console.log("File selected:", file.name);
      setCsvUploaded(true);
    }
  };

  return (
    <>
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".csv" 
        style={{ display: 'none' }} 
      />

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
        }`}
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
          <h2 className="text-2xl font-bold mt-4 mb-2">Bulk invite via CSV</h2>
          <p className="text-gray-600">Follow the guide below to invite your entire company to Stride.</p>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 pt-0 overflow-y-auto" style={{height: "calc(100% - 160px)"}}>
          <div className="space-y-8 mt-8">
            {/* Step 1 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Step 1 — Download the template</h3>
              <button className="flex items-center border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50">
                <Download size={18} className="mr-2" />
                Download template
              </button>
            </div>

            {/* Step 2 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Step 2 — Fill out the fields</h3>
              <p className="text-gray-600 mb-4">If you specify a department or location that doesn't exist, we'll create it for you.</p>
              
              <ul className="space-y-3">
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">first_name</div>
                    <div className="text-sm text-gray-600">Employee's first name</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">last_name</div>
                    <div className="text-sm text-gray-600">Employee's last name</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">email</div>
                    <div className="text-sm text-gray-600">Employee's corporate email</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">role</div>
                    <div className="text-sm text-gray-600">One of: EMPLOYEE, MANAGER, BOOKKEEPER, IT_ADMIN, ADMIN, or GUEST</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">department</div>
                    <div className="text-sm text-gray-600">If you haven't created the department yet, we'll create it for you. Example: "Customer Success", "Engineering", or "Sales"</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">location</div>
                    <div className="text-sm text-gray-600">If you haven't created the location yet, we'll create it for you. Example: "San Francisco", "London", or "Miami"</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">manager_email</div>
                    <div className="text-sm text-gray-600">Email address of the employee's manager. This manager must already exist on Ramp or must be invited in the same file (optional)</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Step 3 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Step 3 — Issue cards to invited users (optional)</h3>
              <p className="text-gray-600 mb-4">Leave all columns in this section blank if you're not issuing one-off cards with invites. If you are issuing cards, the following fields are required (those marked as optional).</p>
              
              <ul className="space-y-3">
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">card_name</div>
                    <div className="text-sm text-gray-600">Name of the card. We recommend a descriptive name. Example: "TAF" or "Southwest"</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">issue_physical_card</div>
                    <div className="text-sm text-gray-600">Set to TRUE to issue a physical card. Set to FALSE to issue a virtual card. Guests cannot receive a physical card (Optional)</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">physical_card_enabled</div>
                    <div className="text-sm text-gray-600">Set to TRUE to allow employees to link their physical card if they have one, otherwise set to FALSE. Defaults to FALSE (Optional)</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">reimbursements_enabled</div>
                    <div className="text-sm text-gray-600">Set to TRUE to allow reimbursements to be submitted against the card limit, otherwise set to FALSE. Defaults to FALSE (Optional)</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">spend_limit_amount</div>
                    <div className="text-sm text-gray-600">Maximum amount to spend per frequency period. Example: 100, 500, 1000 (Optional)</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">spend_limit_currency</div>
                    <div className="text-sm text-gray-600">Three-letter ISO currency code for the currency of the spend limit amount. Defaults to USD for US dollar. (Optional)</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">frequency</div>
                    <div className="text-sm text-gray-600">How frequently the card will "reset" back to an empty balance. Options are DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY, ANNUAL, or TOTAL</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">autolock_date</div>
                    <div className="text-sm text-gray-600">Set a date to automatically lock the card. Example: 6/1/23, 06-15-23, June 15, 2023, or 2023-06-15 (Optional)</div>
                  </div>
                </li>
                <li className="flex">
                  <span className="text-gray-800 mr-2">•</span>
                  <div>
                    <div className="font-medium">max_transaction_amount</div>
                    <div className="text-sm text-gray-600">Maximum transaction amount for the card. Example: 50, 100 (Optional)</div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Step 4 */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Step 4 — Upload your file to send out the invites</h3>
              <p className="text-gray-600 mb-4">After you have filled out the template, upload it below:</p>
              <button 
                onClick={handleFileUpload}
                className="flex items-center border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <Upload size={18} className="mr-2" />
                Begin Import
              </button>
            </div>
          </div>
        </div>

        {/* Send Invites Button - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 py-4 px-6 flex justify-end bg-white border-t border-gray-200">
          <button 
            className={`px-6 py-2 rounded-lg font-medium ${
              csvUploaded 
                ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                : "bg-gray-200 text-gray-600 cursor-not-allowed"
            }`}
            disabled={!csvUploaded}
          >
            Send invites
          </button>
        </div>
      </div>
    </>
  );
};

export default BulkInviteDrawer;