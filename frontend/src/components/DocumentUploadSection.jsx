// src/components/DocumentUploadSection.jsx
import React, { useState } from 'react';
import { FileText, FilePlus, AlertTriangle, Info } from 'lucide-react';
import FileUploader from './FileUploader.jsx';

/**
 * Document upload section for invoice and attachment uploads
 * Provides a clean interface for adding multiple documents
 * to a bill or invoice record
 */
const DocumentUploadSection = ({ 
  onInvoiceUpload, 
  onAttachmentUpload,
  initialInvoice = null,
  initialAttachments = []
}) => {
  const [invoice, setInvoice] = useState(initialInvoice);
  const [attachments, setAttachments] = useState(initialAttachments);
  const [showAttachmentUploader, setShowAttachmentUploader] = useState(false);

  // Handle primary invoice upload
  const handleInvoiceUpload = (file, previewUrl) => {
    const newInvoice = file ? {
      file,
      preview: previewUrl,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString()
    } : null;
    
    setInvoice(newInvoice);
    
    if (onInvoiceUpload) {
      onInvoiceUpload(newInvoice);
    }
  };

  // Handle attachment upload
  const handleAttachmentUpload = (file, previewUrl) => {
    if (!file) return;
    
    const newAttachment = {
      file,
      preview: previewUrl,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      id: `attachment-${Date.now()}`
    };
    
    const updatedAttachments = [...attachments, newAttachment];
    setAttachments(updatedAttachments);
    setShowAttachmentUploader(false);
    
    if (onAttachmentUpload) {
      onAttachmentUpload(updatedAttachments);
    }
  };

  // Remove an attachment by id
  const handleRemoveAttachment = (attachmentId) => {
    const updatedAttachments = attachments.filter(a => a.id !== attachmentId);
    setAttachments(updatedAttachments);
    
    if (onAttachmentUpload) {
      onAttachmentUpload(updatedAttachments);
    }
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
      
      {/* Primary Invoice Upload */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Primary Invoice</h4>
        
        <FileUploader 
          onFileSelect={handleInvoiceUpload}
          acceptedFileTypes="image/*, application/pdf"
          maxSizeMB={10}
          label="Invoice Document"
          description="Upload the invoice or receipt document"
        />
        
        {!invoice && (
          <div className="mt-2 flex items-center text-amber-600 text-xs bg-amber-50 p-2 rounded">
            <AlertTriangle size={14} className="mr-1 flex-shrink-0" />
            <span>An invoice document is required to create a bill</span>
          </div>
        )}
      </div>
      
      {/* Supporting Attachments Section */}
      <div>
        <h4 className="text-md font-medium text-gray-700 mb-3">Supporting Documents</h4>
        
        {/* List of Attachments */}
        <div className="space-y-3 mb-4">
          {attachments.length === 0 ? (
            <div className="text-center text-gray-500 border border-dashed rounded-md p-4">
              <p className="text-sm">No supporting documents added</p>
            </div>
          ) : (
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div 
                  key={attachment.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center">
                    <FileText size={18} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-800 truncate max-w-xs">
                        {attachment.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(attachment.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAttachment(attachment.id)}
                    className="text-gray-400 hover:text-red-500 focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Add Attachment Button or Uploader */}
        {showAttachmentUploader ? (
          <div className="mt-4">
            <FileUploader 
              onFileSelect={handleAttachmentUpload}
              acceptedFileTypes="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              maxSizeMB={20}
              label="Supporting Document"
              description="Upload a supporting document or attachment"
            />
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setShowAttachmentUploader(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowAttachmentUploader(true)}
            className="mt-2 flex items-center text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            <FilePlus size={16} className="mr-1" />
            <span className="text-sm font-medium">Add Supporting Document</span>
          </button>
        )}
        
        {/* Document Tip */}
        <div className="mt-4 flex items-start text-gray-600 bg-blue-50 p-3 rounded text-sm">
          <Info size={16} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
          <p>
            Supporting documents help in processing and verification. Add purchase orders, 
            contracts, or any other relevant documents related to this bill.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadSection;