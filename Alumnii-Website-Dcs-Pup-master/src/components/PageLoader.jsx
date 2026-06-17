import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed top-0 left-0 z-[9999] w-full h-1 bg-transparent">
      {/* 
        This uses Tailwind classes to create an indeterminate progress bar 
        that slides across the very top of the screen (like YouTube/GitHub).
      */}
      <div className="h-full bg-blue-600 animate-pulse" style={{
        width: '50%',
        animation: 'slideRight 0.6s ease-in-out infinite alternate'
      }}>
        <style>
          {`
            @keyframes slideRight {
              0% { transform: translateX(-100%); width: 20%; }
              50% { width: 40%; }
              100% { transform: translateX(250%); width: 20%; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default PageLoader;
