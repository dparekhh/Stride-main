// src/components/InvoicePreview.jsx
import React, { useState, useEffect } from "react";
import { X, Info, Search, FileText, Edit2, CheckCircle } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner.jsx";

const InvoicePreview = ({
  showInvoicePreview,
  setShowInvoicePreview,
  uploadedInvoice,
  setUploadedInvoice
}) => {
  // Simplified state for frontend-only implementation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendorExists, setVendorExists] = useState(false);
  const [showVendorSearch, setShowVendorSearch] = useState(false);
  const [vendorSearchTerm, setVendorSearchTerm] = useState('');
  const [loadingVendors, setLoadingVendors] = useState(false);
  
  // Mock data for demonstration
  const mockVendors = [
    { id: 1, name: "Ace Mobile Manufacturer Pvt Ltd", gstin: "27AABCU9603R1ZX" },
    { id: 2, name: "Reliance Trends", gstin: "33AABCT3518Q1ZX" },
    { id: 3, name: "TechFirst Solutions", gstin: "07AAACR4849R1ZO" }
  ];
  
  const [allVendors, setAllVendors] = useState(mockVendors);
  const [vendorSearchResults, setVendorSearchResults] = useState(mockVendors);
  const [matchingVendors, setMatchingVendors] = useState([]);
  const [extractedData, setExtractedData] = useState(null);

  useEffect(() => {
    // Simulate invoice data extraction with mock data
    if (uploadedInvoice && uploadedInvoice.file) {
      simulateExtractInvoiceData();
    }
  }, [uploadedInvoice]);

  // Filter vendors based on search term
  useEffect(() => {
    if (!vendorSearchTerm.trim()) {
      setVendorSearchResults(allVendors);
      return;
    }
    
    const lowercaseSearchTerm = vendorSearchTerm.toLowerCase();
    const filteredVendors = allVendors.filter(vendor => 
      vendor.name.toLowerCase().includes(lowercaseSearchTerm) || 
      (vendor.gstin && vendor.gstin.toLowerCase().includes(lowercaseSearchTerm))
    );
    
    setVendorSearchResults(filteredVendors);
  }, [vendorSearchTerm, allVendors]);

  const simulateExtractInvoiceData = () => {
    setLoading(true);
    setError(null);
    
    // Simulate API delay
    setTimeout(() => {
      // Simulate extracted data (always show "vendor not found" for demonstration)
      const mockExtractedData = {
        vendor_name: "New Vendor Example Ltd",
        vendor_gstin: "29AADCB2230M1ZP",
        vendor_address: "123 Business Park, Mumbai, 400001",
        invoice_number: "INV-2023-04562",
        invoice_date: "2023-03-15",
        due_date: "2023-04-14",
        amount: 24500,
        description: "Mobile phone purchase for marketing team"
      };
      
      setExtractedData(mockExtractedData);
      
      // Always set vendorExists to false for demonstration
      setVendorExists(false);
      setMatchingVendors([]);
      setLoading(false);
    }, 1000);
  };

  // Toggle vendor search visibility
  const toggleVendorSearch = () => {
    setShowVendorSearch(!showVendorSearch);
    console.log('Change vendor clicked, toggling search view');
  };

  const getVendorInitials = (name) => {
    if (!name) return 'VN';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleCreateVendor = () => {
    if (!extractedData || !extractedData.vendor_name) return;
    
    // Simulate vendor creation with mock response
    const newVendor = {
      id: allVendors.length + 1,
      name: extractedData.vendor_name,
      gstin: extractedData.vendor_gstin || ''
    };
    
    setMatchingVendors([newVendor]);
    setVendorExists(true);
    setShowVendorSearch(false);
    
    // Update allVendors list with the new vendor
    setAllVendors(prevVendors => [...prevVendors, newVendor]);
  };
  
  // Handle selecting a vendor from the search results
  const handleSelectVendor = (vendor) => {
    console.log('Selected vendor:', vendor);
    setMatchingVendors([vendor]);
    setVendorExists(true);
    setShowVendorSearch(false);
    setVendorSearchTerm('');
  };

  if (!showInvoicePreview) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold">New bill</h2>
        <button
          onClick={() => {
            setShowInvoicePreview(false);
            setUploadedInvoice(null);
          }}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex h-[calc(100vh-70px)]">
        {/* Left side - Invoice Preview */}
        <div className="w-1/2 p-4 border-r overflow-auto bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Invoice Preview</h3>
          
          {uploadedInvoice && (
            <div className="h-full flex flex-col">
              <div className="flex-grow relative mb-4">
                {/* Styled Invoice Preview matching reference image */}
                <div className="w-full max-w-[500px] mx-auto bg-white rounded-lg overflow-hidden shadow-md">
                  {/* Invoice header */}
                  <div className="bg-slate-600 text-white p-6 flex justify-between">
                    <div>
                      <h2 className="text-2xl font-medium mb-1">Invoice</h2>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">Sassy SAAS Vendor, Inc.</p>
                      <p>123 Vendor Street</p>
                      <p>San Francisco, California</p>
                      <p>United States of America</p>
                      <p>94110</p>
                    </div>
                  </div>
                  
                  {/* Invoice content */}
                  <div className="p-6">
                    {/* To/From section */}
                    <div className="flex justify-between mb-8 text-sm">
                      <div>
                        <p className="uppercase text-gray-500 mb-1 text-xs">BILL TO:</p>
                        <p className="font-medium">New Rising Customer, LLC</p>
                        <p>4560 Oakwood Business Way</p>
                        <p>New York, NY 10012</p>
                        <p>United States of America</p>
                        <p>10012</p>
                      </div>
                      <div className="text-right">
                        <div className="mb-4">
                          <p className="uppercase text-gray-500 mb-1 text-xs">INVOICE #</p>
                          <p className="font-medium">0001</p>
                        </div>
                        <div className="mb-4">
                          <p className="uppercase text-gray-500 mb-1 text-xs">DATE</p>
                          <p className="font-medium">October 14, 2023</p>
                        </div>
                        <div>
                          <p className="uppercase text-gray-500 mb-1 text-xs">INVOICE DUE DATE</p>
                          <p className="font-medium">November 14, 2023</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Items table */}
                    <table className="w-full text-sm mb-6">
                      <thead>
                        <tr className="uppercase text-gray-500 text-xs border-b">
                          <th className="pb-2 text-left">ITEMS</th>
                          <th className="pb-2 text-left">DESCRIPTION</th>
                          <th className="pb-2 text-center">QUANTITY</th>
                          <th className="pb-2 text-right">PRICE</th>
                          <th className="pb-2 text-right">AMOUNT</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3">Business services</td>
                          <td className="py-3 text-gray-600">White-labeled sales portal with intro affiliate to send demo meetings</td>
                          <td className="py-3 text-center">1</td>
                          <td className="py-3 text-right">$950.00</td>
                          <td className="py-3 text-right">$950.00</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Premium engine</td>
                          <td className="py-3 text-gray-600">One year support team with auto-generated call directly to your higher tiered reps</td>
                          <td className="py-3 text-center">4</td>
                          <td className="py-3 text-right">$350.00</td>
                          <td className="py-3 text-right">$1400.00</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Stack integration</td>
                          <td className="py-3 text-gray-600">Automatically add entry requests in Slack with bots</td>
                          <td className="py-3 text-center">1</td>
                          <td className="py-3 text-right">$800.00</td>
                          <td className="py-3 text-right">$800.00</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3">Callback priority support</td>
                          <td className="py-3 text-gray-600">Getting your call queue staffed 24/7</td>
                          <td className="py-3 text-center">1</td>
                          <td className="py-3 text-right">$1200.00</td>
                          <td className="py-3 text-right">$1200.00</td>
                        </tr>
                      </tbody>
                    </table>
                    
                    {/* Notes and Total */}
                    <div className="flex mb-6">
                      <div className="w-2/3 pr-4">
                        <p className="uppercase text-gray-500 text-xs mb-1">NOTES:</p>
                        <p className="text-sm text-gray-600">Services for October services. Looking forward to helping your team thrive!</p>
                      </div>
                      <div className="w-1/3 bg-slate-600 text-white p-4 text-right">
                        <p className="uppercase text-xs mb-2">TOTAL</p>
                        <p className="text-2xl font-medium">$3420.00</p>
                      </div>
                    </div>
                    
                    {/* Account details */}
                    <div className="text-sm text-gray-600">
                      <p>Account number: 000000000</p>
                      <p>Routing number: 00000001</p>
                    </div>
                  </div>
                  
                  {/* Real file display (hidden by default since we're showing the styled preview) */}
                  <div className="hidden">
                    {uploadedInvoice.file.type.includes('image') ? (
                      <img 
                        src={uploadedInvoice.preview} 
                        alt="Invoice" 
                        className="max-w-full max-h-[70vh] object-contain"
                      />
                    ) : uploadedInvoice.file.type.includes('pdf') ? (
                      <div className="text-center">
                        <p className="text-gray-700 font-medium">{uploadedInvoice.file.name}</p>
                        <p className="text-gray-500 text-sm mt-1">PDF document</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-gray-700 font-medium">{uploadedInvoice.file.name}</p>
                        <p className="text-gray-500 text-sm mt-1">Document</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-white hover:bg-gray-50 flex-1 text-center">
                  Invoice
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 flex-1 text-center">
                  Documents
                </button>
              </div>
            </div>
          )}
          
          {/* Loading state for invoice data extraction */}
          {(loading || uploadedInvoice?.processing) && (
            <div className="mt-4 p-3 bg-blue-50 rounded flex items-center">
              <LoadingSpinner size="small" className="mr-2 text-primary" />
              <p className="text-sm text-blue-700">Extracting invoice data...</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 rounded">
              <p className="text-sm text-red-700">Error: {error}</p>
            </div>
          )}
        </div>

        {/* Right side - Invoice Details */}
        <div className="w-1/2 p-6 overflow-auto">
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Who's it for?</h3>
            
            {(loading || uploadedInvoice?.processing) ? (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-md mb-4 flex items-center">
                <LoadingSpinner size="small" className="mr-2 text-primary" />
                <p className="text-sm">Loading vendor information...</p>
              </div>
            ) : vendorExists ? (
              // Vendor exists - green success box with vendor info and edit option
              <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
                <div className="flex items-center">
                  <CheckCircle size={16} className="text-green-600 mr-2" />
                  <span>We found a matching vendor for this bill</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-100 flex items-center justify-center rounded mr-2">
                      <span className="text-xs">{getVendorInitials(matchingVendors[0].name)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{matchingVendors[0].name}</p>
                      {matchingVendors[0].gstin && (
                        <p className="text-xs text-gray-500">GSTIN: {matchingVendors[0].gstin}</p>
                      )}
                    </div>
                  </div>
                  <button 
                    className="px-2 py-1 text-sm border rounded hover:bg-gray-50 flex items-center"
                    onClick={toggleVendorSearch}
                  >
                    <Edit2 size={14} className="mr-1" />
                    <span>Change</span>
                  </button>
                </div>
              </div>
            ) : (
              // Vendor does not exist - orange warning box
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-md mb-4">
                <div className="flex items-center">
                  <Info size={16} className="text-orange-600 mr-2" />
                  <span>We couldn't find an existing vendor that matches this bill</span>
                </div>
                <p className="text-sm mt-1">Create a new vendor if this is your first time paying them, or select another vendor if one already exists.</p>
              </div>
            )}

            {/* Detailed debugging for "Create new vendor from invoice" section */}
            {console.log('DETAILED RENDER DEBUGGING STATE:',
              JSON.stringify({
                loading: loading,
                vendorExists: vendorExists,
                extractedData: extractedData,
                vendor_name: extractedData?.vendor_name || null,
                matchingVendors: matchingVendors,
                matchingVendorsLength: matchingVendors?.length || 0,
                showVendorSearch: showVendorSearch,
                conditions: {
                  notLoading: !loading,
                  notVendorExists: !vendorExists,
                  hasExtractedData: !!extractedData,
                  hasVendorName: extractedData ? !!extractedData.vendor_name : false,
                  allConditionsMet: !loading && !vendorExists && extractedData && extractedData.vendor_name
                }
              }, null, 2)
            )}
            
            {/* Create new vendor section - exactly matching design in reference image */}
            {/* Added checks for both local loading state and uploadedInvoice.processing */}
            {!loading && !uploadedInvoice?.processing && vendorExists === false && extractedData && extractedData.vendor_name && (
              <div className="mb-6">
                <h4 className="text-base font-medium mb-2">Create new vendor from invoice</h4>
                <div className="bg-orange-50 border border-orange-200 rounded-md p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    {/* Removed SVG icon to match Image 2 design */}
                    <span className="font-medium">{extractedData.vendor_name}</span>
                  </div>
                  <button 
                    className="px-3 py-1 border border-orange-300 rounded bg-orange-100 text-orange-800 hover:bg-orange-200 text-sm"
                    onClick={handleCreateVendor}
                  >
                    Create new vendor
                  </button>
                </div>
              </div>
            )}

            {/* Vendor search - show when no vendor exists or when toggle is on, and not in loading state */}
            {(!vendorExists || showVendorSearch) && !loading && !uploadedInvoice?.processing && (
              <div className="mb-6">
                <h4 className="text-base font-medium mb-2">
                  {vendorExists ? 'Change vendor' : 'Select another vendor'}
                </h4>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search or create a new vendor"
                    className="w-full p-2 pr-8 border rounded"
                    value={vendorSearchTerm}
                    onChange={(e) => setVendorSearchTerm(e.target.value)}
                  />
                  <div className="absolute right-2 top-2">
                    <Search size={16} className="text-gray-400" />
                  </div>
                </div>
                
                {/* Show loading indicator while fetching vendors */}
                {loadingVendors && (
                  <div className="mt-2 text-sm text-gray-500 flex items-center">
                    <LoadingSpinner size="small" className="mr-2 text-primary" />
                    <span>Loading vendors...</span>
                  </div>
                )}
                
                {/* Display search results when we have vendors */}
                {!loadingVendors && vendorSearchResults.length > 0 && (
                  <div className="mt-2 border rounded-md max-h-60 overflow-y-auto divide-y">
                    {vendorSearchResults.map((vendor) => (
                      <div 
                        key={vendor.id} 
                        className="p-2 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
                        onClick={() => handleSelectVendor(vendor)}
                      >
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-gray-100 flex items-center justify-center rounded mr-2">
                            <span className="text-xs">{getVendorInitials(vendor.name)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-sm">{vendor.name}</p>
                            {vendor.gstin && <p className="text-xs text-gray-500">GSTIN: {vendor.gstin}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* No results found */}
                {!loadingVendors && vendorSearchTerm && vendorSearchResults.length === 0 && (
                  <div className="mt-2 text-sm text-gray-500">
                    No vendors found matching "{vendorSearchTerm}"
                  </div>
                )}
              </div>
            )}
            
            {/* Multiple potential vendors section - show when we have potential matches and not loading */}
            {matchingVendors.length > 1 && !loading && !uploadedInvoice?.processing && (
              <div className="mt-4">
                <h4 className="text-base font-medium mb-2">Potential vendor matches</h4>
                <div className="border rounded-md divide-y">
                  {matchingVendors.map((vendor, index) => (
                    <div key={index} className="p-3 hover:bg-gray-50 flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded mr-2">
                          <span className="text-xs">{getVendorInitials(vendor.name)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{vendor.name}</p>
                          {vendor.gstin && <p className="text-xs text-gray-500">GSTIN: {vendor.gstin}</p>}
                        </div>
                      </div>
                      <button 
                        className="text-blue-600 text-sm"
                        onClick={() => {
                          // Select this vendor and update the state
                          setMatchingVendors([vendor]);
                          setVendorExists(true);
                          setShowVendorSearch(false);
                        }}
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Additional invoice detail fields would go here */}
          {extractedData && (
            <div>
              <h3 className="text-lg font-medium mb-3">Invoice Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {extractedData.invoice_number && (
                  <div>
                    <p className="text-sm text-gray-500">Invoice Number</p>
                    <p className="font-medium">{extractedData.invoice_number}</p>
                  </div>
                )}
                {extractedData.invoice_date && (
                  <div>
                    <p className="text-sm text-gray-500">Invoice Date</p>
                    <p className="font-medium">{extractedData.invoice_date}</p>
                  </div>
                )}
                {extractedData.total_amount && (
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-medium">{extractedData.total_amount}</p>
                  </div>
                )}
                {extractedData.due_date && (
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium">{extractedData.due_date}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;