import React, { useState } from "react";
import { X, Upload, Link, ArrowUpCircle, Download, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BulkInviteDrawer from "./BulkInviteDrawer";
import InviteEmployeeDrawer from "./InviteEmployeeDrawer";
import ConnectHRISDrawer from "./ConnectHRISDrawer";
import InvitePeopleHRIS from "./InvitePeopleHRIS";

const InvitePeopleDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showBulkInviteDrawer, setShowBulkInviteDrawer] = useState(false);
  const [showInviteEmployeeDrawer, setShowInviteEmployeeDrawer] = useState(false);
  const [showConnectHRISDrawer, setShowConnectHRISDrawer] = useState(false);
  const [showInvitePeopleHRIS, setShowInvitePeopleHRIS] = useState(false);
  const [selectedHRISProvider, setSelectedHRISProvider] = useState(null);
  
  const handleUploadCSV = () => {
    setShowBulkInviteDrawer(true);
  };

  const handleAddManually = () => {
    setShowInviteEmployeeDrawer(true);
  };
  
  const handleConnectHRIS = () => {
    setShowConnectHRISDrawer(true);
  };
  
  // Handler for when HRIS provider is connected and user wants to invite people
  const handleHRISInvitePeople = (provider) => {
    setSelectedHRISProvider(provider);
    setShowConnectHRISDrawer(false);
    setShowInvitePeopleHRIS(true);
  };
  
  // Handler for back button in InvitePeopleHRIS
  const handleInvitePeopleHRISBack = () => {
    setShowInvitePeopleHRIS(false);
    setShowConnectHRISDrawer(true);
  };
  
  return (
    <>
      {/* Overlay with blur effect */}
      {isOpen && !showBulkInviteDrawer && !showInviteEmployeeDrawer && !showConnectHRISDrawer && !showInvitePeopleHRIS && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
          onClick={onClose}
        ></div>
      )}
      
      {/* Bulk Invite Drawer */}
      <BulkInviteDrawer 
        isOpen={showBulkInviteDrawer}
        onClose={() => setShowBulkInviteDrawer(false)}
        onBack={() => setShowBulkInviteDrawer(false)}
        parentOnClose={onClose}
      />
      
      {/* Invite Employee Drawer */}
      <InviteEmployeeDrawer 
        isOpen={showInviteEmployeeDrawer}
        onClose={() => setShowInviteEmployeeDrawer(false)}
        onBack={() => setShowInviteEmployeeDrawer(false)}
        parentOnClose={onClose}
      />
      
      {/* Connect HRIS Drawer - with onInvitePeople handler */}
      <ConnectHRISDrawer
        isOpen={showConnectHRISDrawer}
        onClose={() => setShowConnectHRISDrawer(false)}
        onBack={() => setShowConnectHRISDrawer(false)}
        onInvitePeople={handleHRISInvitePeople}
      />
      
      {/* InvitePeopleHRIS Drawer - as a sibling */}
      <InvitePeopleHRIS 
        isOpen={showInvitePeopleHRIS}
        onClose={() => setShowInvitePeopleHRIS(false)}
        onBack={handleInvitePeopleHRISBack}
        connectedHRIS={selectedHRISProvider}
      />
      
      {/* Invite People Drawer */}
      <div 
        className={`fixed top-0 right-0 w-1/2 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen && !showBulkInviteDrawer && !showInviteEmployeeDrawer && !showConnectHRISDrawer && !showInvitePeopleHRIS ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Fixed header */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Invite people to Stride</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto" style={{height: "calc(100% - 80px)"}}>
          
          {/* HRIS Box */}
          <div className="mb-6 border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div className="flex-1 mr-8">
                <h3 className="font-medium text-gray-900">Invite people using your HRIS</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Connect your HR system to automatically import and invite team members
                </p>
              </div>
              <button 
                className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center font-medium hover:bg-gray-50 whitespace-nowrap"
                onClick={handleConnectHRIS}
              >
                <Link size={16} className="mr-2" />
                Sync HRIS
              </button>
            </div>
          </div>
          
          {/* CSV Box */}
          <div className="mb-6 border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div className="flex-1 mr-8">
                <h3 className="font-medium text-gray-900">Invite people by uploading a CSV file</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Upload a spreadsheet with your team's information to invite them in bulk
                </p>
              </div>
              <button 
                className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center font-medium hover:bg-gray-50 whitespace-nowrap"
                onClick={handleUploadCSV}
              >
                <Upload size={16} className="mr-2" />
                Upload CSV file
              </button>
            </div>
          </div>
          
          {/* Manual Invite Box */}
          <div className="mb-6 border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div className="flex-1 mr-8">
                <h3 className="font-medium text-gray-900">Invite people manually</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Add employee information to automatically invite team members
                </p>
              </div>
              <button 
                className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg flex items-center font-medium hover:bg-gray-50 whitespace-nowrap"
                onClick={handleAddManually}
              >
                <UserPlus size={16} className="mr-2" />
                Add manually
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvitePeopleDrawer;