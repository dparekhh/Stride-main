// src/components/VendorReview.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, User, Mail, Phone, MapPin, Building2, FileText, Edit } from "lucide-react";
import SharedInvoicePreview from "./SharedInvoicePreview.jsx";

const VendorReview = ({ 
  formData,
  uploadedInvoice,
  onBack,
  onContinue, // Renamed from onCreateVendor for clarity
  isSubmitting,
  sourceRoute = "newVendor" // "newBill" or "newVendor"
}) => {
  const navigate = useNavigate();
  
  console.log("VendorReview rendered with sourceRoute:", sourceRoute);
  console.log(`Button label: ${sourceRoute === "newBill" ? "Continue" : "Create vendor"}`);
  console.log("Form data:", formData);
  
  // Default sourceRoute if not provided
  console.log("VendorReview received sourceRoute:", sourceRoute);
  if (!sourceRoute) {
    console.warn("sourceRoute not provided, defaulting to newVendor");
    sourceRoute = "newVendor";
  }
  console.log("Final sourceRoute value:", sourceRoute);
  
  // Handle edit button click
  const handleEdit = () => {
    console.log("---- EDIT BUTTON CLICKED ----");
    console.log("Edit button clicked, sourceRoute:", sourceRoute);
    console.log("Current formData:", formData);
    
    // Always navigate to the edit page regardless of source route
    try {
      console.log("Navigating to VendorInformation from VendorReview");
      
      // Using the normalized data structure to ensure consistency across components
      const standardizedData = {
        vendorName: formData?.vendorName || "New Vendor",
        addressLine1: formData?.addressLine1 || "",
        addressLine2: formData?.addressLine2 || "",
        city: formData?.city || "",
        state: formData?.state || "",
        country: formData?.country || "India",
        pinCode: formData?.pinCode || "",
        vendorOwner: formData?.vendorOwner || "",
        firstName: formData?.firstName || "",
        lastName: formData?.lastName || "",
        email: formData?.email || "",
        phoneCountry: formData?.phoneCountry || "+91",
        phoneNumber: formData?.phoneNumber || "",
        gstin: formData?.taxDetails?.gstin || formData?.gstin || "",
        pan: formData?.taxDetails?.pan || formData?.pan || ""
      };
      
      // Enhanced debugging for navigation
      console.log("About to navigate with standardized payload:", {
        formData: standardizedData,
        uploadedInvoice, 
        sourceRoute: sourceRoute || "newVendor"
      });
      
      // Store the data in sessionStorage for retrieval
      sessionStorage.setItem("vendorData", JSON.stringify({
        formData: standardizedData,
        uploadedInvoice,
        sourceRoute: sourceRoute || "newVendor"
      }));
      
      // Use React Router's navigate for better integration
      console.log(`Navigating to /vendor-information with from=${sourceRoute || "newVendor"}`);
      navigate(`/vendor-information?from=${encodeURIComponent(sourceRoute || "newVendor")}`);
      
      console.log("Navigation to /vendor-information triggered via React Router");
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const {
    vendorName,
    addressLine1,
    addressLine2,
    city,
    pinCode,
    country,
    state,
    vendorOwner,
    firstName,
    lastName,
    email,
    phoneCountry,
    phoneNumber,
    accountingSoftware,
    paymentMethod,
    paymentDetails,
    taxOption,
    taxDetails
  } = formData;

  // Determine button label based on sourceRoute
  let buttonLabel = "Create vendor";
  if (sourceRoute === "newBill") {
    buttonLabel = "Continue";
  } else if (sourceRoute === "newVendorCreated") {
    buttonLabel = "Continue";
  }
  const isExistingVendor = sourceRoute === "newBill" || sourceRoute === "newVendorCreated";

  return (
    <div className="fixed inset-0 z-50 flex bg-white">
      {/* Left side - Invoice Preview */}
      <SharedInvoicePreview uploadedInvoice={uploadedInvoice} />
      
      {/* Right side - Vendor Review */}
      <div className="w-1/2 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              className="mr-2 text-gray-600 hover:text-gray-900"
              onClick={(e) => {
                console.log("⬅️ BACK ARROW BUTTON CLICKED in VendorReview");
                console.log("Source route when back arrow clicked:", sourceRoute);
                onBack(e);
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800">
              {sourceRoute === "newVendorCreated" ? "Vendor Successfully Created" : 
               isExistingVendor ? "Review Existing Vendor" : "Review New Vendor"}
            </h2>
          </div>
        </div>
        
        {/* Review content */}
        <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
          {/* Vendor owner section */}
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-medium text-gray-800 mb-3">Vendor Owner</h3>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 mr-3">
                <User size={16} />
              </div>
              <div>
                <p className="font-medium text-gray-800">{vendorOwner || "Not specified"}</p>
                <p className="text-sm text-gray-500">Executive · {city || state || country || "Location not specified"}</p>
              </div>
            </div>
          </div>

          {/* Vendor contact section */}
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-medium text-gray-800 mb-3">Vendor Contact</h3>
            {(firstName || lastName || email || phoneNumber) ? (
              <div>
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                    <User size={16} />
                  </div>
                  <p className="font-medium text-gray-800">{`${firstName || ""} ${lastName || ""}`}</p>
                </div>
                {email && (
                  <div className="flex items-center mb-2 text-sm text-gray-600">
                    <Mail size={16} className="mr-2" />
                    <span>{email}</span>
                  </div>
                )}
                {phoneNumber && (
                  <div className="flex items-center mb-2 text-sm text-gray-600">
                    <Phone size={16} className="mr-2" />
                    <span>{`${phoneCountry || ""} ${phoneNumber}`}</span>
                  </div>
                )}
                {addressLine1 && (
                  <div className="flex items-start mb-2 text-sm text-gray-600">
                    <MapPin size={16} className="mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p>{addressLine1}</p>
                      {addressLine2 && <p>{addressLine2}</p>}
                      <p>{`${city || ""} ${pinCode || ""}`}</p>
                      <p>{`${state || ""}, ${country || ""}`}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No contact information provided</p>
            )}
          </div>

          {/* Payment details section */}
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-medium text-gray-800 mb-3">Payment Details</h3>
            {paymentMethod ? (
              <div>
                {paymentMethod === "Enter manually" && paymentDetails ? (
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                        <Building2 size={16} />
                      </div>
                      <p className="font-medium text-gray-800">{paymentDetails.bankName || "Bank details"}</p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {paymentDetails.accountHolderName && <p><span className="text-gray-500">Account holder:</span> {paymentDetails.accountHolderName}</p>}
                      {paymentDetails.accountNumber && <p><span className="text-gray-500">Account number:</span> {paymentDetails.accountNumber}</p>}
                      {paymentDetails.accountType && <p><span className="text-gray-500">Account type:</span> {paymentDetails.accountType}</p>}
                      {paymentDetails.branchName && <p><span className="text-gray-500">Branch:</span> {paymentDetails.branchName}</p>}
                      {paymentDetails.ifscCode && <p><span className="text-gray-500">IFSC:</span> {paymentDetails.ifscCode}</p>}
                      {paymentDetails.micrCode && <p><span className="text-gray-500">MICR:</span> {paymentDetails.micrCode}</p>}
                    </div>
                  </div>
                ) : paymentMethod === "Request from the vendor" ? (
                  <div className="flex items-center">
                    <Mail size={18} className="mr-3 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">Request from the vendor</p>
                      <p className="text-sm text-gray-600">Stride will email the vendor for their payment details</p>
                    </div>
                  </div>
                ) : paymentMethod === "Skip for now" ? (
                  <p className="text-gray-500">No payment details provided</p>
                ) : (
                  <p className="text-gray-500">{paymentMethod}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No payment details provided</p>
            )}
          </div>

          {/* Tax details section */}
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-base font-medium text-gray-800 mb-3">Tax Details</h3>
            {taxOption ? (
              <div>
                {taxOption === "Enter manually" && taxDetails ? (
                  <div>
                    <div className="flex items-center mb-3">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                        <FileText size={16} />
                      </div>
                      <p className="font-medium text-gray-800">{vendorName || "Vendor"} Tax Details</p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      {taxDetails.gstin && <p><span className="text-gray-500">GSTIN:</span> {taxDetails.gstin}</p>}
                      {taxDetails.pan && <p><span className="text-gray-500">PAN:</span> {taxDetails.pan}</p>}
                      {taxDetails.gstCertificateName && <p><span className="text-gray-500">GST Certificate:</span> {taxDetails.gstCertificateName}</p>}
                      {taxDetails.panCertificateName && <p><span className="text-gray-500">PAN Copy:</span> {taxDetails.panCertificateName}</p>}
                      {taxDetails.msmeCertificateName && <p><span className="text-gray-500">MSME Certificate:</span> {taxDetails.msmeCertificateName}</p>}
                      {taxDetails.itrDocumentName && <p><span className="text-gray-500">ITR Document:</span> {taxDetails.itrDocumentName}</p>}
                    </div>
                  </div>
                ) : taxOption === "Request from the vendor" ? (
                  <div className="flex items-center">
                    <Mail size={18} className="mr-3 text-purple-600" />
                    <div>
                      <p className="font-medium text-gray-800">Request from the vendor</p>
                      <p className="text-sm text-gray-600">Stride will email the vendor for their tax details</p>
                    </div>
                  </div>
                ) : taxOption === "Skip for now" ? (
                  <p className="text-gray-500">No tax details provided</p>
                ) : (
                  <p className="text-gray-500">{taxOption}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500">No tax details provided</p>
            )}
          </div>
        </div>
        
        {/* Footer with buttons */}
        <div className="p-4 border-t border-gray-200 flex justify-between items-center">
          <button
            className="flex items-center px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            onClick={handleEdit}
          >
            <Edit size={16} className="mr-1.5" />
            Edit
          </button>
          
          <button 
            className={`px-4 py-2 ${isSubmitting ? "bg-orange-500" : "bg-orange-500 hover:bg-orange-600"} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 flex items-center`}
            onClick={(e) => {
              console.log(`✅ '${buttonLabel.toUpperCase()}' BUTTON CLICKED in VendorReview`);
              console.log("Source route when continue/create button clicked:", sourceRoute);
              console.log("Button action will call onContinue handler");
              sessionStorage.setItem('lastButtonClicked', buttonLabel);
              sessionStorage.setItem('buttonClickTimestamp', new Date().toISOString());
              onContinue(e);
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="loading-text">
                  {sourceRoute === "newVendor" ? "Creating vendor..." : 
                   sourceRoute === "newVendorCreated" ? "Processing..." : "Processing..."}
                </span>
              </>
            ) : (
              buttonLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorReview;