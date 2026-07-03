import React from 'react';

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md min-h-[50vh]">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
        {/* Inner spinning ring */}
        <div className="absolute animate-[spin_1.5s_linear_infinite_reverse] rounded-full h-12 w-12 border-l-4 border-r-4 border-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
        {/* Center dot */}
        <div className="h-4 w-4 bg-blue-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(37,99,235,0.8)]"></div>
      </div>
      <p className="mt-8 text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 animate-pulse tracking-widest">
        LOADING...
      </p>
    </div>
  );
};

export default PageLoader;
