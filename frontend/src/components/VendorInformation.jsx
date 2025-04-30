// src/components/VendorInformation.jsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, User, Mail, Phone, MapPin, Building2, FileText } from "lucide-react";
import SharedInvoicePreview from "./SharedInvoicePreview";

const VendorInformation = ({ 
  initialData, 
  uploadedInvoice, 
  onSaveChanges, 
  onDiscardChanges 
}) => {
  // Ensure initialData is an object even if it's undefined or null
  const safeInitialData = initialData || {};
  
  // Log initial data for debugging
  useEffect(() => {
    console.log("VendorInformation received initialData:", safeInitialData);
    console.log("VendorInformation received uploadedInvoice:", uploadedInvoice);
  }, [safeInitialData, uploadedInvoice]);
  
  // Use standardized field names to prevent issues with data consistency
  const [formData, setFormData] = useState(() => {
    // Normalize field names from different possible sources
    return {
      vendorName: safeInitialData.vendorName || safeInitialData.name || "",
      firstName: safeInitialData.firstName || "",
      lastName: safeInitialData.lastName || "",
      email: safeInitialData.email || "",
      phoneCountry: safeInitialData.phoneCountry || "+91",
      phoneNumber: safeInitialData.phoneNumber || safeInitialData.phone || "",
      addressLine1: safeInitialData.addressLine1 || safeInitialData.address || "",
      addressLine2: safeInitialData.addressLine2 || "",
      city: safeInitialData.city || "",
      state: safeInitialData.state || "",
      country: safeInitialData.country || "India",
      pinCode: safeInitialData.pinCode || safeInitialData.zipCode || "",
      gstin: safeInitialData.gstin || (safeInitialData.taxDetails && safeInitialData.taxDetails.gstin) || "",
      pan: safeInitialData.pan || (safeInitialData.taxDetails && safeInitialData.taxDetails.pan) || "",
      vendorOwner: safeInitialData.vendorOwner || ""
    };
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log(`Field '${name}' updated to: ${value}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-white">
      {/* Left side - Invoice Preview */}
      <SharedInvoicePreview uploadedInvoice={uploadedInvoice} />
      
      {/* Right side - Vendor Information Form */}
      <div className="w-1/2 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="mr-2 text-gray-600 hover:text-gray-900"
              onClick={() => {
                console.log("Back button clicked, discarding changes");
                onDiscardChanges();
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">Vendor Information</h2>
          </div>
        </div>
        
        {/* Form content */}
        <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
          {/* Vendor Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Vendor Name</label>
            <input
              type="text"
              name="vendorName"
              value={formData.vendorName || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Contact Information */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1 || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Pin Code</label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={formData.state || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Additional Tax Information */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">GSTIN</label>
            <input
              type="text"
              name="gstin"
              value={formData.gstin || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">PAN</label>
            <input
              type="text"
              name="pan"
              value={formData.pan || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>
        
        {/* Footer with buttons */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <button
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            onClick={() => {
              console.log("Discard Changes clicked. Reverting to original data.");
              try {
                onDiscardChanges();
              } catch (error) {
                console.error("Error discarding vendor changes:", error);
                // Handle error if needed
              }
            }}
          >
            Discard Changes
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600"
            onClick={() => {
              console.log("Save Changes clicked. Data being saved:", formData);
              try {
                onSaveChanges(formData);
              } catch (error) {
                console.error("Error saving vendor changes:", error);
                // Handle error if needed
              }
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorInformation;