import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md min-h-[50vh]">
      <div className="relative flex items-center justify-center">
        {/* Spinning Ring */}
        <div className="absolute animate-spin rounded-full h-32 w-32 border-4 border-lightBlue border-t-blue"></div>
        {/* University Logo */}
        <img 
          src="/images/logo.png" 
          alt="University Logo" 
          className="h-20 w-20 object-contain animate-pulse" 
        />
      </div>
      <p className="mt-10 text-sm font-semibold text-blue animate-pulse tracking-wide">
        LOADING...
      </p>
    </div>
  );
};

export default PageLoader;
