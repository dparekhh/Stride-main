import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { formatCurrency } from '../utils/helpers';

/**
 * Dashboard component displaying summary metrics and recent activity
 * @param {Object} props - Component props
 * @param {Array} props.bills - Optional bills data to use instead of fetching
 */
function Dashboard({ bills = [] }) {
  const [summaryData, setSummaryData] = useState({
    billsToPay: 0,
    paidThisMonth: 0,
    approvalsNeeded: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize summary data on component mount
  useEffect(() => {
    if (bills && bills.length) {
      updateSummaryData(bills);
      setLoading(false);
    } else {
      fetchDashboardData();
    }
    
    // Initialize spending chart
    initializeSpendingChart();

    // Cleanup on unmount
    return () => {
      // Clean up any charts if needed
    };
  }, [bills]);
  
  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/bills');
      const fetchedBills = response.data.bills;
      updateSummaryData(fetchedBills);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };
  
  // Update summary data based on bills
  const updateSummaryData = (billsData) => {
    // Calculate bills to pay (pending bills)
    const pendingBills = billsData.filter(b => b.status === 'pending');
    const pendingAmount = pendingBills.reduce((acc, bill) => acc + bill.amount, 0);
    
    // Calculate paid this month
    const currentMonth = new Date().getMonth();
    const paidThisMonth = billsData.filter(b => 
      b.status === 'paid' && 
      b.paid_date && 
      new Date(b.paid_date).getMonth() === currentMonth
    );
    const paidAmount = paidThisMonth.reduce((acc, bill) => acc + bill.amount, 0);
    
    // Count approvals needed
    const approvalsCount = billsData.filter(b => b.status === 'approval_pending').length;
    
    // Set summary data
    setSummaryData({
      billsToPay: pendingAmount,
      paidThisMonth: paidAmount,
      approvalsNeeded: approvalsCount
    });
    
    // Set recent activity (most recent 5 bills)
    setRecentActivity(billsData.slice(0, 5));
  };
  
  // Initialize spending chart with Chart.js
  const initializeSpendingChart = () => {
    // This would normally initialize a Chart.js chart
    // Since we don't have direct DOM access in this environment, 
    // we'll set up a callback for when the chart container is available
    setTimeout(() => {
      const chartContainer = document.getElementById('spending-chart');
      if (!chartContainer) return;
      
      // Here, Chart.js would be used to create the actual chart
      console.log('Chart container is ready for initialization');
    }, 500);
  };
  
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Bills to Pay card */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Bills to Pay</h3>
          {loading ? 
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div> :
            <>
              <p className="text-3xl font-bold text-orange-500">
                {formatCurrency(summaryData.billsToPay)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {bills.filter(b => b.status === 'pending').length} pending bills
              </p>
            </>
          }
        </div>
        
        {/* Paid This Month card */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Paid This Month</h3>
          {loading ? 
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div> :
            <>
              <p className="text-3xl font-bold text-green-500">
                {formatCurrency(summaryData.paidThisMonth)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {bills.filter(b => b.status === 'paid' && new Date(b.paid_date).getMonth() === new Date().getMonth()).length} bills paid
              </p>
            </>
          }
        </div>
        
        {/* Approvals Needed card */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-2">Approvals Needed</h3>
          {loading ? 
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div> :
            <>
              <p className="text-3xl font-bold text-yellow-500">
                {summaryData.approvalsNeeded}
              </p>
              <p className="text-sm text-gray-500 mt-2">Awaiting approval</p>
            </>
          }
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        {loading ? 
          // Loading state for recent activity
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => 
              <div key={i} className="animate-pulse flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            )}
          </div> :
          // Actual data
          <div className="space-y-4">
            {recentActivity.length > 0 ?
              recentActivity.map((bill) => 
                <div key={bill.id} className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      bill.status === 'paid' ? 'bg-green-100 text-green-600' : 
                      bill.status === 'pending' ? 'bg-orange-100 text-orange-600' : 
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                        className="w-5 h-5"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        {bill.status === 'paid' ? 
                          <path d="M20 6L9 17l-5-5" /> : 
                          bill.status === 'pending' ? 
                          <circle cx="12" cy="12" r="10" /> :
                          <path d="M12 9v2M12 15h.01" />
                        }
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">{bill.vendor_name}</p>
                      <p className="text-sm text-gray-500">INV-{bill.invoice_number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(bill.amount)}</p>
                    <p className="text-sm text-gray-500">{new Date(bill.due_date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              ) :
              <p className="text-center py-6 text-gray-500">No recent activity</p>
            }
          </div>
        }
      </div>
      
      {/* Spending by Category chart */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Spending by Category</h3>
        </div>
        <div className="h-64 flex items-center justify-center" id="spending-chart">
          {loading ? 
            <div className="animate-pulse">
              <div className="h-40 w-full bg-gray-200 rounded"></div>
            </div> :
            <p className="text-gray-500">Loading chart...</p>
          }
        </div>
      </div>
    </div>
  );
}

export default Dashboard;