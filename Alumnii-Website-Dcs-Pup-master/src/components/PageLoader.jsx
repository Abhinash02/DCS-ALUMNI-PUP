import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
      <div className="flex flex-col items-center">
        {/* Sleek Circular Spinner */}
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        
        {/* Loading Text */}
        <p className="mt-4 text-lg font-semibold text-blue-800 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
