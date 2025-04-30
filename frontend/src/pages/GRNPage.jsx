import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

const GRNPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess } = useNotification();
  
  // Get PO details from location state if available
  const poDetails = location.state?.poDetails || {};
  
  // State for form data
  const [formData, setFormData] = useState({
    poNumber: poDetails.poNumber || '',
    vendor: poDetails.vendor || '',
    date: new Date().toISOString().split('T')[0],
    grnNumber: '',
    memo: '',
  });
  
  // State for file upload
  const [file, setFile] = useState(null);
  
  // State for received items
  const [receivedItems, setReceivedItems] = useState([]);
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // Handle file drop
  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };
  
  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  
  // Handle checkbox change for items
  const handleItemCheck = (id) => {
    setReceivedItems(
      receivedItems.map(item => 
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      )
    );
  };
  
  // Handle GRN creation
  const handleAddGRN = () => {
    // Here you would typically send the data to your API
    console.log('Creating GRN with data:', {
      ...formData,
      file,
      receivedItems: receivedItems.filter(item => item.isChecked),
    });
    
    // Show success message
    showSuccess('GRN created successfully');
    
    // Navigate back to purchase orders
    navigate('/bill-pay/purchase-order');
  };
  
  // Handle close
  const handleClose = () => {
    navigate('/bill-pay/purchase-order');
  };
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex flex-col md:flex-row h-screen">
          {/* Left Side - File Upload */}
          <div className="w-1/2 p-4 flex flex-col">
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg flex-1 flex flex-col items-center justify-center cursor-pointer"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById('file-upload').click()}
            >
              <Upload className="text-gray-400 mb-6" size={48} />
              <p className="text-gray-600 mb-3 text-lg">Drop File or Click here to upload</p>
              <p className="text-gray-400">Upload your PDF, PNG, or JPG files.</p>
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>
          </div>
          
          {/* Right Side - Form */}
          <div className="w-1/2 p-4 border-l border-gray-200 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-medium text-gray-800">Goods Received Note</h2>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-500">
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-2">PO#</label>
                  <input
                    type="text"
                    name="poNumber"
                    value={formData.poNumber}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-3 py-2.5"
                    placeholder="Enter PO number"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-2">Vendor</label>
                  <input
                    type="text"
                    name="vendor"
                    value={formData.vendor}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-3 py-2.5"
                    placeholder="Enter vendor name"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-2">Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2.5 w-full pr-10"
                    />
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <label className="text-sm text-gray-600 mb-2">GRN Number</label>
                  <input
                    type="text"
                    name="grnNumber"
                    value={formData.grnNumber}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-3 py-2.5"
                    placeholder="Enter GRN number"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="text-sm text-gray-600 mb-2">Memo</label>
                  <textarea
                    name="memo"
                    value={formData.memo}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-3 py-2.5 w-full h-28 resize-none"
                    placeholder="Enter any additional notes or comments"
                  />
                </div>
              </div>
              
              {/* Received Items */}
              <div>
                <h3 className="text-lg font-medium mb-2">Received Items</h3>
                <p className="text-sm text-gray-600 mb-4">Select the items you received and their quantities, if applicable</p>
                
                <div className="border rounded-md shadow-sm" style={{ maxHeight: 'calc(100vh - 500px)', overflowY: 'auto' }}>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Receive
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item Receipt<br/>Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item Ordered<br/>Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                            Total PO Units<br/>Received
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                      {receivedItems.length > 0 ? (
                        receivedItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={item.isChecked}
                                onChange={() => handleItemCheck(item.id)}
                                className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                              />
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              Item {item.id}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {item.receiptQuantity}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              {item.orderedQuantity}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="mr-2">
                                  {item.totalReceived}/{item.orderedQuantity}
                                </span>
                                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-green-500 h-2.5 rounded-full"
                                    style={{ width: `${(item.totalReceived / item.orderedQuantity) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                            No items available. Please attach a PO document to load items.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Button - Fixed at bottom */}
            <div className="pt-3 mt-2 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  onClick={handleAddGRN}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md shadow-sm"
                >
                  Add GRN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GRNPage;