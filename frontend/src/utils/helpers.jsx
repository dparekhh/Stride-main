/**
 * Helper utilities for the spend management platform
 */
import React from "react";
import { Eye, Download, PenLine, CheckCircle, XCircle } from "lucide-react";

/**
 * Validates if a file is of an allowed type (PDF, PNG, JPEG)
 * @param {File} file - The file to validate
 * @returns {boolean} - Whether the file is of an allowed type
 */
export const isAllowedFileType = (file) => {
  if (!file) return false;
  
  const allowedTypes = [
    'application/pdf', 
    'image/png', 
    'image/jpeg', 
    'image/jpg'
  ];
  
  const fileType = file.type.toLowerCase();
  return allowedTypes.includes(fileType);
};

/**
 * Validates if a PAN (Permanent Account Number) is valid according to Indian formats
 * @param {string} pan - The PAN to validate
 * @returns {boolean} - Whether the PAN is valid
 */
export const isValidPAN = (pan) => {
  if (!pan) return false;
  
  // PAN format: AAAPL1234C (where A is alpha, P is person type, L is first letter of last name, 1234 is sequential number, C is check digit)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

/**
 * Validates if a GSTIN (Goods and Services Tax Identification Number) is valid according to Indian formats
 * @param {string} gstin - The GSTIN to validate
 * @returns {boolean} - Whether the GSTIN is valid
 */
export const isValidGSTIN = (gstin) => {
  if (!gstin) return false;
  
  // GSTIN format: 22AAAAA0000A1Z5 
  // (where 22 is state code, AAAAA0000A is PAN, 1 is entity number, Z is default, 5 is check digit)
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};

/**
 * Formats a currency amount according to Indian standards (with lakhs and crores)
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: INR)
 * @returns {string} - The formatted amount
 */
export const formatIndianCurrency = (amount, currency = "INR") => {
  if (amount === null || amount === undefined) return "";
  
  // Format with Indian numbering system (lakhs and crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return formatter.format(amount);
};

/**
 * Alias for formatIndianCurrency to match existing Dashboard.jsx implementation
 * @param {number} amount - The amount to format 
 * @param {string} currency - The currency code (default: INR)
 * @returns {string} - The formatted amount
 */
export const formatCurrency = formatIndianCurrency;

/**
 * Formats file size in bytes to a human-readable format 
 * @param {number} bytes - The file size in bytes
 * @param {number} decimals - The number of decimal places to show
 * @returns {string} - The formatted file size (e.g., "2.5 MB")
 */
export const getHumanReadableFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Format a date string to a localized format (DD/MM/YYYY)
 * @param {string|Date} date - The date to format
 * @returns {string} - The formatted date
 */
export const formatDate = (date) => {
  if (!date) return "";
  
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Truncates text to a specified length and adds ellipsis if needed
 * @param {string} text - The text to truncate
 * @param {number} maxLength - The maximum length
 * @returns {string} - The truncated text
 */
export const truncateText = (text, maxLength = 30) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Returns the appropriate action buttons based on bill status
 * @param {Object} bill - The bill object
 * @returns {JSX.Element} - The action buttons
 */
export const getActionButton = (bill) => {
  if (!bill) return null;
  
  // Return different action buttons based on bill status
  switch (bill.status) {
    case "Draft":
      return (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800" title="Edit">
            <PenLine size={16} />
          </button>
          <button className="text-green-600 hover:text-green-800" title="Submit for Approval">
            <CheckCircle size={16} />
          </button>
          <button className="text-red-600 hover:text-red-800" title="Delete">
            <XCircle size={16} />
          </button>
        </div>
      );
    case "For Approval":
      return (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800" title="View">
            <Eye size={16} />
          </button>
          <button className="text-green-600 hover:text-green-800" title="Approve">
            <CheckCircle size={16} />
          </button>
          <button className="text-red-600 hover:text-red-800" title="Reject">
            <XCircle size={16} />
          </button>
        </div>
      );
    case "For Payment":
      return (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800" title="View">
            <Eye size={16} />
          </button>
          <button className="text-blue-600 hover:text-blue-800" title="Download">
            <Download size={16} />
          </button>
        </div>
      );
    default:
      return (
        <div className="flex space-x-2">
          <button className="text-blue-600 hover:text-blue-800" title="View">
            <Eye size={16} />
          </button>
        </div>
      );
  }
};