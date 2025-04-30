import React from 'react';
import { isDevelopmentMode } from '../utils/devHelpers';

/**
 * Development-only component to reset authentication state
 * Only renders in development environments
 * 
 * NOTE: Reset Auth button has been removed as per requirements
 */
const DevAuthReset = () => {
  // Always return null - Reset Auth button removed
  return null;
};

export default DevAuthReset;