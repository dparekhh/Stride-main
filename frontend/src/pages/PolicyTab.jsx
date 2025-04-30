// src/pages/PolicyTab.jsx
import React, { useState, useRef } from 'react';
import { Upload, ChevronRight, Check, Trash2 } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';
import ExpenseRequirementsDrawer from '../components/ExpenseRequirementsDrawer';
import { PageLayout, PageHeader } from '../components/common/page-layout';

const PolicyTab = () => {
  const { showSuccess, showError } = useNotification();
  const [policyFile, setPolicyFile] = useState(null);
  const [signedBy, setSignedBy] = useState({
    count: 0,
    lastPerson: '',
    date: ''
  });
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [showExpenseRequirementsDrawer, setShowExpenseRequirementsDrawer] = useState(false);

  // Sample approval items for the left section
  const approvalItems = [
    {
      id: 'expenses',
      title: 'Expenses',
      description: 'Who needs to approve card transactions and reimbursements?'
    },
    {
      id: 'spend-requests',
      title: 'Spend requests',
      description: 'Who needs to approve requests for cards and purchase orders?'
    },
    {
      id: 'bills',
      title: 'Bills',
      description: 'Who needs to approve bills before they are paid?'
    },
    {
      id: 'vendors',
      title: 'Vendors',
      description: 'Who needs to approve changes made to vendors?'
    }
  ];

  // Sample submission items for the left section
  const submissionItems = [
    {
      id: 'expense-requirements',
      title: 'Expense requirements',
      description: 'Are receipts and memos required for card transactions and reimbursements?'
    }
  ];

  // Sample guidelines items for the left section
  const guidelineItems = [
    {
      id: 'travel',
      title: 'Travel',
      description: 'Set rules for flights, hotels, and per diem, and enable booking on Ramp'
    },
    {
      id: 'policy-rules',
      title: 'Policy rules',
      description: 'Want to flag a transaction or alert someone?'
    }
  ];

  // Handle file drop for drag and drop functionality
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle the dropped file
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection from the file input
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Process the selected file
  const handleFile = (file) => {
    // Check if the file is a PDF
    if (file.type === 'application/pdf' || file.type === 'image/jpeg' || file.type === 'image/png') {
      setPolicyFile(file);
      
      // Mock data for the signed by section
      setSignedBy({
        count: 127,
        lastPerson: 'David',
        date: '11/16/2024'
      });
      
      showSuccess('File successfully uploaded!');
    } else {
      showError('Please upload a PDF, JPEG, or PNG file');
    }
  };

  // Trigger the file input click
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  // Handle replace button click
  const handleReplace = () => {
    fileInputRef.current.click();
  };

  // Handle delete button click
  const handleDelete = () => {
    setPolicyFile(null);
    setSignedBy({
      count: 0,
      lastPerson: '',
      date: ''
    });
    showSuccess('Policy document deleted');
  };

  return (
    <PageLayout
      pageTitle="Settings"
      heading="Expense policy"
      showSearchBar={false}
      showActionButtons={false}
    >
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left column - Approvals, Submissions, Guidelines */}
        <div className="w-full md:w-1/2">
          
          {/* Approvals section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Approvals</h2>
            <div className="space-y-4">
              {approvalItems.map(item => (
                <div 
                  key={item.id}
                  className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <ChevronRight className="flex-shrink-0 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Submitting expenses section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Submitting expenses</h2>
            <div className="space-y-4">
              {submissionItems.map(item => (
                <div 
                  key={item.id}
                  className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    if (item.id === 'expense-requirements') {
                      setShowExpenseRequirementsDrawer(true);
                    }
                  }}
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <ChevronRight className="flex-shrink-0 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Spend guidelines section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Spend guidelines</h2>
            <div className="space-y-4">
              {guidelineItems.map(item => (
                <div 
                  key={item.id}
                  className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <ChevronRight className="flex-shrink-0 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right column - Policy document */}
        <div className="w-full md:w-1/2">
          <h2 className="text-lg font-semibold mb-4">Policy document</h2>
          
          {/* Policy document preview or upload area */}
          {policyFile ? (
            <div className="mb-4">
              <div className="border rounded-lg p-4 mb-4">
                {/* Mocked document preview */}
                <div className="bg-gray-100 h-80 flex items-center justify-center rounded">
                  <div className="text-center p-4">
                    <h3 className="font-bold text-center mb-2">Ramp Expense Policy</h3>
                    <div className="text-xs text-left space-y-2 max-w-md mx-auto">
                      <p>The purpose of this policy is to establish guidelines for business expenses, including purchase authorization, documentation, and reimbursement.</p>
                      <p>All employees are expected to adhere to this policy when incurring and submitting business expenses for payment or reimbursement.</p>
                      <p>1. Scope and Responsibilities</p>
                      <p>This policy applies to all employees of Ramp Financial Inc and its subsidiaries authorized to make purchases on behalf of the company.</p>
                      <p>2. Travel and Transportation</p>
                      <p>Employees are expected to use the most economical means of transportation available when traveling for business purposes. The company will reimburse for air travel at economy rates only.</p>
                    </div>
                  </div>
                </div>
                
                {/* Signature information */}
                <div className="flex items-center mt-4">
                  <div className="flex-1">
                    <p className="text-gray-700 text-sm">
                      {signedBy.count} employees have signed. Last edited by <span className="font-medium">{signedBy.lastPerson}</span> on {signedBy.date}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Replace/Delete buttons */}
              <div className="flex space-x-2">
                <button 
                  onClick={handleReplace}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Replace
                </button>
                <button 
                  onClick={handleDelete}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <div 
                className={`border-2 border-dashed rounded-lg p-6 h-80 flex flex-col items-center justify-center cursor-pointer transition-colors
                  ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                onClick={handleButtonClick}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
                
                <Upload className={`h-12 w-12 ${dragActive ? 'text-blue-500' : 'text-gray-400'} mb-4`} />
                <p className="text-gray-700 text-center mb-2">Drop your policy document here</p>
                <p className="text-gray-500 text-sm text-center">or click to browse</p>
                <p className="text-gray-400 text-xs mt-4">PDF, PNG, or JPG files only</p>
              </div>
              
              {/* Replace/Delete buttons - disabled when no file selected */}
              <div className="flex space-x-2 mt-4">
                <button 
                  onClick={handleReplace}
                  disabled={true}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-400 bg-gray-50 flex items-center cursor-not-allowed"
                >
                  <Upload size={16} className="mr-2" />
                  Replace
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={true}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-400 bg-gray-50 flex items-center cursor-not-allowed"
                >
                  <Trash2 size={16} className="mr-2" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Expense Requirements Drawer */}
      <ExpenseRequirementsDrawer 
        isOpen={showExpenseRequirementsDrawer}
        onClose={() => setShowExpenseRequirementsDrawer(false)}
      />
    </PageLayout>
  );
};

export default PolicyTab;