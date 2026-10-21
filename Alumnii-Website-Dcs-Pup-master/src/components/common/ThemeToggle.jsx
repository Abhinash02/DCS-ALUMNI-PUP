import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

export const ThemeToggle = ({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center p-2 rounded-xl transition-all duration-300 hover:scale-105 active:scale-90 focus:outline-none focus:ring-2 focus:ring-blue/50 ${
        isDark 
          ? 'bg-slate-800/90 text-amber-400 hover:bg-slate-700 border border-slate-700/80 shadow-md shadow-amber-500/10' 
          : 'bg-slate-100/90 text-slate-700 hover:bg-slate-200 border border-slate-200/80 shadow-sm'
      } ${className}`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {/* Sun Icon */}
        <span
          className={`absolute transition-all duration-500 transform ${
            isDark
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-90 scale-50 pointer-events-none'
          }`}
        >
          <FaSun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
        </span>

        {/* Moon Icon */}
        <span
          className={`absolute transition-all duration-500 transform ${
            isDark
              ? 'opacity-0 rotate-90 scale-50 pointer-events-none'
              : 'opacity-100 rotate-0 scale-100 text-blue'
          }`}
        >
          <FaMoon className="w-4 h-4 text-blue" />
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;
