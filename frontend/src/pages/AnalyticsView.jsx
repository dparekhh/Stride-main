import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, ChartLine } from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

/**
 * Analytics & Reports view component
 * Displays various charts and data visualizations for financial insights
 */
function AnalyticsView() {
  const [loading, setLoading] = useState(true);
  const [categoryData, setCategoryData] = useState(null);
  const [spendingTrend, setSpendingTrend] = useState(null);
  const [topVendors, setTopVendors] = useState(null);
  
  // Load analytics data on component mount
  useEffect(() => {
    fetchAnalyticsData();
    
    // Clean up charts when component unmounts
    return () => {
      // Clean up charts if necessary
    };
  }, []);
  
  // Fetch analytics data from API
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch data in parallel
      const [categoryResponse, trendResponse, vendorResponse] = await Promise.all([
        axios.get('/api/analytics/spend-by-category?period=month'),
        axios.get('/api/analytics/spend-over-time?period=month&granularity=day'),
        axios.get('/api/analytics/vendor-analysis')
      ]);
      
      setCategoryData(categoryResponse.data);
      setSpendingTrend(trendResponse.data);
      setTopVendors(vendorResponse.data.top_vendors);
      
      // Initialize charts after data is loaded
      setTimeout(() => {
        initializeCategoryChart(categoryResponse.data);
        initializeSpendingTrendChart(trendResponse.data);
        initializeVendorChart(vendorResponse.data.top_vendors);
        setLoading(false);
      }, 500);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setLoading(false);
    }
  };
  
  // Create the category chart
  const initializeCategoryChart = (data) => {
    if (!data || !data.data || !document.getElementById('category-chart')) return;
    
    console.log('Initializing category chart with data:', data);
    
    // This would use Chart.js to create the actual chart
    // For this implementation, we'll just log that a chart would be created
  };
  
  // Create the spending trend chart
  const initializeSpendingTrendChart = (data) => {
    if (!data || !data.data || !document.getElementById('spending-trend-chart')) return;
    
    console.log('Initializing spending trend chart with data:', data);
    
    // This would use Chart.js to create the actual chart
    // For this implementation, we'll just log that a chart would be created
  };
  
  // Create the top vendors chart
  const initializeVendorChart = (data) => {
    if (!data || !document.getElementById('vendor-chart')) return;
    
    console.log('Initializing vendor chart with data:', data);
    
    // This would use Chart.js to create the actual chart
    // For this implementation, we'll just log that a chart would be created
  };

  return (
    <div className="w-full px-8 py-6 space-y-6">
      {/* Header with Export/Report buttons */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Analytics & Reports</h2>
        <div className="flex space-x-3">
          <button className="btn-secondary flex items-center">
            <Download size={16} className="mr-2" />
            Export
          </button>
          <button className="btn-primary flex items-center">
            <ChartLine size={16} className="mr-2" />
            Create Report
          </button>
        </div>
      </div>
      
      {/* Main charts - 2 column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category spending chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin mr-2 h-5 w-5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <span className="text-gray-500">Loading chart...</span>
            </div>
          ) : (
            <div className="h-64" id="category-chart"></div>
          )}
        </div>
        
        {/* Monthly trend chart */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Monthly Spending Trend</h3>
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin mr-2 h-5 w-5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <span className="text-gray-500">Loading chart...</span>
            </div>
          ) : (
            <div className="h-64" id="spending-trend-chart"></div>
          )}
        </div>
      </div>
      
      {/* Top vendors chart */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Top Vendors by Spend</h3>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin mr-2 h-5 w-5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <span className="text-gray-500">Loading chart...</span>
          </div>
        ) : (
          <>
            <div className="h-64" id="vendor-chart"></div>
            {topVendors && topVendors.length > 0 && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Vendor', 'Total Spend', 'Bill Count', 'Average Bill'].map(header => (
                        <th key={header} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {topVendors.map(vendor => (
                      <tr key={vendor.id}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">{vendor.name}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {formatCurrency(vendor.total_spend)}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">{vendor.bill_count}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          {formatCurrency(vendor.average_bill)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AnalyticsView;