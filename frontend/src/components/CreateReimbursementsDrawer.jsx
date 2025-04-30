import React, { useState } from 'react';
import AppDrawer from './common/AppDrawer';
import DrawerPortal from './common/DrawerPortal';
import Upload_CreateReimbursementDrawer from './Upload_CreateReimbursementDrawer';
import Manual_CreateReimbursementDrawer from './Manual_CreateReimbursementDrawer';
import { Z_INDEX_LEVELS } from '../contexts/DrawerContext';

/**
 * CreateReimbursementsDrawer Component
 * 
 * A drawer for creating reimbursements with tabs for Upload and Manual entry,
 * using the reusable AppDrawer component
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the drawer is open
 * @param {Function} props.onClose - Function to call when drawer is closed
 */
const CreateReimbursementsDrawer = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  
  // Handle file upload
  const handleFileUpload = (file) => {
    setUploadedFile(file);
    // Additional processing can be added here
  };
  
  // Handle receipt upload for manual entry
  const handleReceiptUpload = (file) => {
    console.log('Receipt file:', file);
    // Process receipt file if needed
  };
  
  // Tab navigation component
  const headerActions = (
    <div>
      <nav className="flex -mb-px px-6" aria-label="Tabs">
        <button
          onClick={() => setActiveTab('upload')}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'upload'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } mr-8`}
        >
          Upload
        </button>
        <button
          onClick={() => setActiveTab('manual')}
          className={`py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === 'manual'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          Manual
        </button>
      </nav>
    </div>
  );
  
  return (
    <DrawerPortal>
      <AppDrawer
        isOpen={isOpen}
        onClose={onClose}
        title="Create reimbursement"
        headerActions={headerActions}
        width="max-w-xl"
        zIndex={Z_INDEX_LEVELS.BASE}
        usePortal={true}
      >
        {activeTab === 'upload' && (
          <Upload_CreateReimbursementDrawer 
            onFileUpload={handleFileUpload} 
          />
        )}
        
        {activeTab === 'manual' && (
          <Manual_CreateReimbursementDrawer 
            onReceiptUpload={handleReceiptUpload}
            onClose={onClose}
          />
        )}
      </AppDrawer>
    </DrawerPortal>
  );
};

export default CreateReimbursementsDrawer;