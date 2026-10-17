import React from 'react';

const PageLoader = ({ 
  isExiting = false, 
  text = "DCS ALUMNI PORTAL", 
  subtext = "Punjabi University, Patiala" 
}) => {
  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-xl transition-all duration-300 ease-out ${
        isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'animate-loader-fade-in'
      }`}
      aria-label="Loading page content"
      role="status"
    >
      {/* Ambient Radial Glowing Orbs for Visual Depth */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-blue/20 via-sky-400/25 to-indigo-400/20 blur-3xl pointer-events-none animate-loader-aura -z-10" />
      <div className="absolute w-44 h-44 rounded-full bg-sky-300/20 blur-2xl pointer-events-none -z-10" />

      {/* Centerpiece Spinner and Medallion */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        
        {/* Outer Delicate Orbit Ring with Satellite Bead */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-loader-spin-reverse">
          <svg className="w-44 h-44" viewBox="0 0 176 176">
            <defs>
              <linearGradient id="outerOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#005b96" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#00BFFF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            <circle 
              cx="88" 
              cy="88" 
              r="82" 
              fill="none" 
              stroke="url(#outerOrbitGrad)" 
              strokeWidth="1.5" 
              strokeDasharray="6 8" 
            />
          </svg>
          {/* Glowing Satellite Dot */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_#38bdf8]" />
        </div>

        {/* Middle Vibrant Gradient Spinner Ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-loader-spin">
          <svg className="w-36 h-36" viewBox="0 0 144 144">
            <defs>
              <linearGradient id="middleSpinnerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#005b96" />
                <stop offset="60%" stopColor="#00BFFF" />
                <stop offset="100%" stopColor="#60A5FA" />
              </linearGradient>
            </defs>
            {/* Soft background track */}
            <circle 
              cx="72" 
              cy="72" 
              r="64" 
              fill="none" 
              stroke="#005b96" 
              strokeOpacity="0.08" 
              strokeWidth="3.5" 
            />
            {/* Glowing active arc */}
            <circle 
              cx="72" 
              cy="72" 
              r="64" 
              fill="none" 
              stroke="url(#middleSpinnerGrad)" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeDasharray="210 270" 
            />
          </svg>
        </div>

        {/* Inner Soft Halo Ring */}
        <div className="absolute w-28 h-28 rounded-full border border-sky-300/40 animate-loader-pulse-soft pointer-events-none" />

        {/* Floating Medallion with University Logo */}
        <div className="relative z-10 w-24 h-24 rounded-full bg-white/95 backdrop-blur-md shadow-[0_10px_25px_-5px_rgba(0,91,150,0.22),0_4px_10px_-2px_rgba(0,0,0,0.06)] border border-white/90 flex items-center justify-center p-3 animate-loader-float">
          {/* Subtle Glass Highlight */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/70 via-transparent to-transparent pointer-events-none" />
          <img 
            src="/images/logo.png" 
            alt="University Logo" 
            className="h-16 w-16 object-contain filter drop-shadow-sm select-none" 
          />
        </div>
      </div>

      {/* Prestigious Department & University Branding */}
      <div className="mt-7 flex flex-col items-center text-center">
        <h2 className="text-xs font-bold tracking-[0.24em] uppercase text-blue select-none">
          {text}
        </h2>
        <p className="text-[11px] font-medium text-slate-500 tracking-wider mt-1 select-none">
          {subtext}
        </p>

        {/* Smooth Shimmering Progress Bar */}
        <div className="mt-3.5 w-44 h-1.5 bg-blue/10 rounded-full overflow-hidden relative shadow-inner">
          <div className="absolute inset-y-0 w-24 rounded-full bg-gradient-to-r from-transparent via-blue to-sky-400 animate-loader-shimmer" />
        </div>

        {/* Staggered Smooth Wave Dots */}
        <div className="flex items-center space-x-1.5 mt-3">
          <span 
            className="w-1.5 h-1.5 rounded-full bg-blue" 
            style={{ animation: 'loaderDotBounce 1.2s infinite ease-in-out', animationDelay: '0ms' }} 
          />
          <span 
            className="w-1.5 h-1.5 rounded-full bg-blue" 
            style={{ animation: 'loaderDotBounce 1.2s infinite ease-in-out', animationDelay: '200ms' }} 
          />
          <span 
            className="w-1.5 h-1.5 rounded-full bg-blue" 
            style={{ animation: 'loaderDotBounce 1.2s infinite ease-in-out', animationDelay: '400ms' }} 
          />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
