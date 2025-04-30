import axios from 'axios';

// Create an axios instance with the dynamic API URL from environment variables
// Fallback to the relative URL if environment variable is not set
const API_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle common request processing
api.interceptors.request.use(
  (config) => {
    // You can add authorization headers or other processing here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common response processing
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common error scenarios
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  bills: '/bills',
  bill: (id) => `/bills/${id}`,
  vendors: '/vendors',
  vendor: (id) => `/vendors/${id}`,
  vendorCheck: '/vendors/check-vendor',
  vendorFromInvoice: '/vendors/from-invoice',
  vendorSearch: '/vendors/search',
  categories: '/bills/categories',
  extractInvoice: '/bills/invoices/extract',
  uploadInvoice: '/bills/upload-invoice',
  submitForApproval: (id) => `/bills/${id}/submit-for-approval`,
  health: '/health',
  users: '/users',
  settings: '/settings',
  analytics: {
    summary: '/analytics/summary',
    byCategory: '/analytics/spend-by-category',
    overTime: '/analytics/spend-over-time',
    vendors: '/analytics/vendor-analysis',
  },
};

export default api;