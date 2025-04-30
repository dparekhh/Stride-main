import React from 'react';
import FileUploadZone from './common/FileUploadZone';

/**
 * Upload_CreateReimbursementDrawer Component
 * 
 * Reusable component for the Upload tab in the Create Reimbursement drawer
 * 
 * @param {Object} props
 * @param {Function} props.onFileUpload - Function to handle uploaded file
 * @returns {React.ReactElement} Upload tab content
 */
const Upload_CreateReimbursementDrawer = ({ onFileUpload }) => {
  return (
    <div className="min-h-[400px]"> {/* Increased height by approximately 2x */}
      <FileUploadZone 
        onFileUpload={onFileUpload}
        tipText="Stride's AI algorithm will process reimbursements for you if you send them to reimbursements@stride.com"
        className="h-full min-h-[400px]"
      />
    </div>
  );
};

export default Upload_CreateReimbursementDrawer;