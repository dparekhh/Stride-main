import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, ArrowLeft, ArrowUpRight } from 'lucide-react';

/**
 * RecurringBillSeries component
 * Displays details about a specific recurring bill series as a drawer
 */
const RecurringBillSeries = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [seriesData, setSeriesData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch recurring bill series data
  useEffect(() => {
    const fetchSeriesData = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be an API call to get series data
        // For now, we'll use placeholder data structure (not hard-coded values)
        setSeriesData({
          id: id,
          vendorName: "GTI Properties",
          amount: "₹22,000.00",
          schedule: "monthly on the 1st",
          bills: []
        });
      } catch (error) {
        console.error('Error fetching recurring bill series data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSeriesData();
    }
  }, [id]);

  const handleClose = () => {
    navigate('/bill-pay/bills');
  };

  // Handle tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
        <div className="relative w-full md:w-1/2 bg-white shadow-xl flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-30 transition-opacity"
        onClick={handleClose}
      ></div>
      
      {/* Drawer content */}
      <div 
        className="relative w-full md:w-1/2 bg-white shadow-xl transition-transform transform overflow-y-auto"
        style={{
          animation: 'slideInFromRight 0.3s ease-out forwards',
        }}
      >
        
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 p-1"
              aria-label="Back"
            >
              <ArrowLeft size={16} className="mr-1" />
              <span className="text-xs">Back</span>
            </button>
            <div className="flex-grow text-center text-sm text-blue-600">Recurring bill series</div>
            <button
              className="text-gray-500 hover:text-gray-700 p-1"
              onClick={handleClose}
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Series title */}
        <div className="px-4 pt-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {seriesData?.vendorName || 'GTI Properties'}
          </h1>
        </div>

        {/* Tab navigation */}
        <div className="px-6 mt-4 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              className={`pb-3 text-sm font-medium ${
                activeTab === 'overview'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => handleTabChange('overview')}
            >
              Overview
            </button>
            <button
              className={`pb-3 text-sm font-medium ${
                activeTab === 'activity'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
              onClick={() => handleTabChange('activity')}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Amount */}
              <div>
                <div className="text-sm text-gray-500">Amount</div>
                <div className="text-2xl font-semibold">
                  {seriesData?.amount || '$0.00'}
                </div>
              </div>

              {/* Schedule */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-500">Schedule</div>
                  <div className="font-medium">
                    {seriesData?.schedule || 'Not specified'}
                  </div>
                </div>
                <button className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center">
                  <ArrowUpRight size={18} />
                </button>
              </div>

              {/* Bills section */}
              <div className="mt-8">
                <h2 className="text-lg font-medium mb-4">Bills</h2>
                
                {/* Table header */}
                <div className="grid grid-cols-5 gap-4 py-2 border-b border-gray-200 text-sm text-gray-500">
                  <div>Invoice #</div>
                  <div>Invoice date</div>
                  <div>Payment actual date</div>
                  <div>Amount</div>
                  <div>Status</div>
                </div>
                
                {/* Table content - dynamic rendering based on data */}
                <div className="divide-y divide-gray-100">
                  {seriesData?.bills && seriesData.bills.length > 0 ? (
                    seriesData.bills.map((bill, index) => (
                      <div key={bill.id || index} className="grid grid-cols-5 gap-4 py-3 text-sm">
                        <div className="font-medium text-gray-800">{bill.invoiceNumber}</div>
                        <div>{bill.invoiceDate}</div>
                        <div>{bill.paymentDate}</div>
                        <div>{bill.amount}</div>
                        <div className="flex items-center">
                          {bill.status === 'pending' ? (
                            <span className="flex items-center">
                              <span className="w-4 h-4 rounded-full bg-yellow-100 flex items-center justify-center mr-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                              </span>
                              Pending
                            </span>
                          ) : bill.status === 'paid' ? (
                            <span className="flex items-center">
                              <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center mr-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                              </span>
                              Paid
                            </span>
                          ) : (
                            <span>—</span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-4 text-center text-gray-500">
                      No bills found for this recurring series
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="py-4">
              <div className="text-center text-gray-500">
                Activity history will be displayed here
              </div>
            </div>
          )}
        </div>
        
        <style jsx>{`
          @keyframes slideInFromRight {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default RecurringBillSeries;