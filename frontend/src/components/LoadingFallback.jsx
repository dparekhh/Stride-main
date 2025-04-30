import React from 'react';

/**
 * Loading fallback component for Suspense boundaries
 * Displays a centered spinner with loading text
 */
const LoadingFallback = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-700 font-medium text-lg">Loading...</p>
    </div>
  );
};

export default LoadingFallback;