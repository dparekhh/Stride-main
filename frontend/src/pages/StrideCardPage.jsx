// src/pages/StrideCardPage.jsx
import React from 'react';
import Accounting_StrideCardPage from './Accounting_StrideCardPage/index';

/**
 * Wrapper component that re-exports Accounting_StrideCardPage 
 * to maintain compatibility with existing imports
 */
const StrideCardPage = () => {
  return <Accounting_StrideCardPage />;
};

export default StrideCardPage;