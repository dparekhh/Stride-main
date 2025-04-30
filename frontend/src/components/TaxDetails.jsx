// src/components/TaxDetails.jsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Mail, User, Ban } from "lucide-react";

const TaxDetails = ({ onTaxDetailsChange, country }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [displayName, setDisplayName] = useState("Add tax details");
  const triggerRef = useRef(null);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    if (expanded && triggerRef.current) {
      // Add click outside handler
      const handleClickOutside = (event) => {
        if (triggerRef.current && !triggerRef.current.contains(event.target)) {
          // Check if the click target is not part of the dropdown content
          if (!event.target.closest('.dropdown-menu')) {
            setExpanded(false);
          }
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [expanded]);
  
  // Tax details form state
  const [taxDetails, setTaxDetails] = useState({
    gstin: "",
    pan: "",
    gstCertificate: null,
    gstCertificateName: "",
    panCertificate: null,
    panCertificateName: "",
    msmeCertificate: null,
    msmeCertificateName: "",
    itrDocument: null,
    itrDocumentName: ""
  });

  const toggleDropdown = () => {
    setExpanded(!expanded);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setDisplayName(option);
    setExpanded(false);
    
    // Pass the selection to parent component if callback exists
    if (onTaxDetailsChange) {
      onTaxDetailsChange(option);
    }
  };
  
  // Handle changes to tax details form fields
  const handleTaxDetailsChange = (field, value) => {
    const updatedTaxDetails = {
      ...taxDetails,
      [field]: value
    };
    
    setTaxDetails(updatedTaxDetails);
    
    // Pass tax details to parent component if callback exists
    if (onTaxDetailsChange) {
      onTaxDetailsChange("Enter manually", updatedTaxDetails);
    }
  };
  
  // Handle file uploads for different document types
  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      let updatedTaxDetails = { ...taxDetails };
      
      // Update the appropriate fields based on file type
      switch(fileType) {
        case 'gst':
          updatedTaxDetails.gstCertificate = file;
          updatedTaxDetails.gstCertificateName = file.name;
          break;
        case 'pan':
          updatedTaxDetails.panCertificate = file;
          updatedTaxDetails.panCertificateName = file.name;
          break;
        case 'msme':
          updatedTaxDetails.msmeCertificate = file;
          updatedTaxDetails.msmeCertificateName = file.name;
          break;
        case 'itr':
          updatedTaxDetails.itrDocument = file;
          updatedTaxDetails.itrDocumentName = file.name;
          break;
        default:
          return; // Invalid file type
      }
      
      setTaxDetails(updatedTaxDetails);
      
      // Pass tax details to parent component if callback exists
      if (onTaxDetailsChange) {
        onTaxDetailsChange("Enter manually", updatedTaxDetails);
      }
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-base font-medium mb-2">Tax details</h3>
      
      {/* Main dropdown button styled to match the design */}
      <div className="relative">
        <div 
          ref={triggerRef}
          className={`w-full flex justify-between items-center px-3 py-2 border border-gray-300 ${expanded ? 'rounded-t-md' : 'rounded-md'} bg-white cursor-pointer hover:border-gray-400`}
          onClick={toggleDropdown}
        >
          <span className={`${selectedOption ? 'text-gray-800' : 'text-gray-400'}`}>
            {displayName}
          </span>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${expanded ? 'transform rotate-180' : ''}`} />
        </div>
        
        {/* Dropdown menu - styled to match the PaymentDetails component */}
        {expanded && (
          <div 
            className="dropdown-menu absolute z-[1000] bg-white border border-gray-300 border-t-0 rounded-b-md shadow-lg overflow-visible"
            style={{
              width: '100%'
            }}>
            {/* Request from the vendor option */}
            <div className="px-4 py-3 bg-gray-50">
              <div className="flex items-start cursor-pointer" onClick={() => handleOptionSelect("Request from the vendor")}>
                <div className="mt-1 mr-3">
                  <input 
                    type="radio" 
                    id="request-vendor-tax" 
                    name="tax-option" 
                    checked={selectedOption === "Request from the vendor"} 
                    onChange={() => {}} 
                    className="appearance-none" 
                  />
                  <Mail 
                    size={18} 
                    className="text-black" 
                    strokeWidth={1.5}
                  />
                </div>
                <label htmlFor="request-vendor-tax" className="cursor-pointer flex-1">
                  <div className="font-medium text-gray-800">Request from the vendor</div>
                  <div className="text-sm text-gray-500">Stride will email the vendor for their tax information</div>
                </label>
                {selectedOption === "Request from the vendor" && (
                  <Check size={16} className="text-black mt-1" />
                )}
              </div>
            </div>
            
            {/* Enter manually option */}
            <div className="px-4 py-3 bg-gray-50">
              <div className="flex items-start cursor-pointer" onClick={() => handleOptionSelect("Enter manually")}>
                <div className="mt-1 mr-3">
                  <input 
                    type="radio" 
                    id="enter-manually-tax" 
                    name="tax-option" 
                    checked={selectedOption === "Enter manually"} 
                    onChange={() => {}} 
                    className="appearance-none" 
                  />
                  <User 
                    size={18} 
                    className="text-black" 
                    strokeWidth={1.5}
                  />
                </div>
                <label htmlFor="enter-manually-tax" className="cursor-pointer flex-1">
                  <div className="font-medium text-gray-800">Enter manually</div>
                  <div className="text-sm text-gray-500">Enter vendor tax information yourself</div>
                </label>
                {selectedOption === "Enter manually" && (
                  <Check size={16} className="text-black mt-1" />
                )}
              </div>
            </div>
            
            {/* Separator line before Skip for now */}
            <div className="border-t border-gray-300"></div>
            
            {/* Skip for now option */}
            <div className="px-4 py-3 bg-gray-100">
              <div className="flex items-start cursor-pointer" onClick={() => handleOptionSelect("Skip for now")}>
                <div className="mt-1 mr-3">
                  <input 
                    type="radio" 
                    id="skip-for-now-tax" 
                    name="tax-option" 
                    checked={selectedOption === "Skip for now"} 
                    onChange={() => {}} 
                    className="appearance-none" 
                  />
                  <Ban 
                    size={18} 
                    className="text-maroon-600" 
                    strokeWidth={1.5}
                  />
                </div>
                <label htmlFor="skip-for-now-tax" className="cursor-pointer flex-1">
                  <div className="font-medium text-maroon-600">Skip for now</div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* When "Enter manually" is selected and dropdown is closed, show tax details entry fields */}
      {selectedOption === "Enter manually" && !expanded && country === "India" && (
        <div className="mt-2 border border-gray-300 rounded-md p-3 bg-gray-50">
          <div className="text-gray-800 font-medium">Add tax details</div>
          <div className="mt-3 space-y-3">
            {/* GSTIN field and GST Certificate upload on same line */}
            <div>
              <div className="flex space-x-2 items-start">
                <div className="w-3/5">
                  <label htmlFor="gstin" className="block text-sm font-medium text-gray-700 mb-1">
                    GSTIN
                  </label>
                  <input 
                    id="gstin"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-gray-400"
                    placeholder="22AAAAA0000A1Z5"
                    value={taxDetails.gstin}
                    onChange={(e) => handleTaxDetailsChange('gstin', e.target.value)}
                  />
                </div>
                <div className="w-2/5">
                  <label htmlFor="gst-certificate" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload GST certificate
                  </label>
                  <input
                    id="gst-certificate"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'gst')}
                  />
                  <button
                    onClick={() => document.getElementById('gst-certificate').click()}
                    className="w-full h-[38px] border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:border-gray-400 flex items-center"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="mr-2 text-gray-500"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {taxDetails.gstCertificateName ? (
                      <span className="truncate text-gray-800">{taxDetails.gstCertificateName}</span>
                    ) : (
                      <span className="text-gray-500">Choose file</span>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Goods and Services Tax Identification Number</p>
            </div>
            
            {/* PAN field with Upload PAN Copy on same line */}
            <div>
              <div className="flex space-x-2 items-start">
                <div className="w-3/5">
                  <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">
                    PAN
                  </label>
                  <input 
                    id="pan"
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:border-gray-400"
                    placeholder="AAAAA0000A"
                    value={taxDetails.pan}
                    onChange={(e) => handleTaxDetailsChange('pan', e.target.value)}
                  />
                </div>
                <div className="w-2/5">
                  <label htmlFor="pan-certificate" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload PAN copy
                  </label>
                  <input
                    id="pan-certificate"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'pan')}
                  />
                  <button
                    onClick={() => document.getElementById('pan-certificate').click()}
                    className="w-full h-[38px] border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:border-gray-400 flex items-center"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="mr-2 text-gray-500"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {taxDetails.panCertificateName ? (
                      <span className="truncate text-gray-800">{taxDetails.panCertificateName}</span>
                    ) : (
                      <span className="text-gray-500">Choose file</span>
                    )}
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Permanent Account Number</p>
            </div>
            
            {/* MSME Certificate and Latest ITR on the same line (50/50 split) */}
            <div>
              <div className="flex space-x-2 items-start">
                <div className="w-1/2">
                  <label htmlFor="msme-certificate" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload MSME certificate
                  </label>
                  <input
                    id="msme-certificate"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'msme')}
                  />
                  <button
                    onClick={() => document.getElementById('msme-certificate').click()}
                    className="w-full h-[38px] border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:border-gray-400 flex items-center"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="mr-2 text-gray-500"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {taxDetails.msmeCertificateName ? (
                      <span className="truncate text-gray-800">{taxDetails.msmeCertificateName}</span>
                    ) : (
                      <span className="text-gray-500">Choose file</span>
                    )}
                  </button>
                </div>
                <div className="w-1/2">
                  <label htmlFor="itr-document" className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Latest ITR
                  </label>
                  <input
                    id="itr-document"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'itr')}
                  />
                  <button
                    onClick={() => document.getElementById('itr-document').click()}
                    className="w-full h-[38px] border border-gray-300 rounded-md px-3 py-2 bg-white hover:bg-gray-50 focus:outline-none focus:border-gray-400 flex items-center"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="mr-2 text-gray-500"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {taxDetails.itrDocumentName ? (
                      <span className="truncate text-gray-800">{taxDetails.itrDocumentName}</span>
                    ) : (
                      <span className="text-gray-500">Choose file</span>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="w-1/2">
                  <p className="text-xs text-gray-500 mt-1">Micro, Small and Medium Enterprises Certificate</p>
                </div>
                <div className="w-1/2">
                  <p className="text-xs text-gray-500 mt-1">Income Tax Return document</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Display a message if country is not India but "Enter manually" is selected */}
      {selectedOption === "Enter manually" && !expanded && country !== "India" && (
        <div className="mt-2 border border-gray-300 rounded-md p-3 bg-gray-50">
          <div className="text-gray-800 font-medium">Country-specific tax details</div>
          <p className="text-sm text-gray-600 mt-2">
            Tax details section is only applicable for Indian vendors. Select India as the country to view tax detail fields.
          </p>
        </div>
      )}
      
      {/* When "Request from the vendor" is selected and dropdown is closed, show info message */}
      {selectedOption === "Request from the vendor" && !expanded && (
        <div className="mt-2 border border-gray-300 rounded-md p-3 bg-gray-50">
          <div className="flex items-start">
            <Mail size={18} className="mr-3 text-black mt-1" strokeWidth={1.5} />
            <div>
              <div className="text-gray-800 font-medium">Request from the vendor</div>
              <div className="text-sm text-gray-500">
                Stride will email the vendor for their tax information
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxDetails;