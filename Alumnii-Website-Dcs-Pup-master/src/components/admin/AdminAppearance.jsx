import React, { useState } from 'react';
import { 
  Palette, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Sun, 
  Moon, 
  Eye, 
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdminAppearance = () => {
  const { 
    isDark, 
    toggleTheme, 
    activePaletteId, 
    changeColorPalette, 
    resetToDefaultColor,
    palettes 
  } = useTheme();

  const [notification, setNotification] = useState('');

  const handleSelectPalette = (paletteId) => {
    changeColorPalette(paletteId);
    const pal = palettes[paletteId];
    setNotification(`Applied "${pal.name}" as the active website color theme!`);
    setTimeout(() => {
      setNotification('');
    }, 3500);
  };

  const handleReset = () => {
    resetToDefaultColor();
    setNotification('Website color theme reset to Royal DCS Blue (Default)!');
    setTimeout(() => {
      setNotification('');
    }, 3500);
  };

  const currentPalette = palettes[activePaletteId] || palettes.default;

  return (
    <div className="space-y-8 animate__animated animate__fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 shadow-xl border border-blue-800 text-white">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/30">
              <Palette className="w-3.5 h-3.5 text-blue-300" />
              Theme & Styling Studio
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-amber-300 tracking-tight drop-shadow">
              Website Appearance & Colors
            </h2>
            <p className="text-white text-sm md:text-base mt-1.5 max-w-xl font-medium drop-shadow-sm">
              Switch the primary color scheme of the DCS Alumni Portal with one click. Changes apply instantly across all pages and persist for all visitors.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold backdrop-blur transition border border-white/20 active:scale-95"
              title="Reset to default Punjabi University Patiala blue"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Default</span>
            </button>

            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white text-sm font-semibold shadow transition border border-slate-600 active:scale-95"
              title="Toggle preview between Dark and Light mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
              <span>{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
            </button>
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-60 h-60 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Instant Notification */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 flex items-center justify-between gap-3 animate__animated animate__fadeInDown shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-medium">{notification}</span>
          </div>
          <button 
            onClick={() => setNotification('')}
            className="text-xs text-emerald-300 hover:text-white px-2 py-1 rounded bg-emerald-800/50"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Live Interactive Preview Box */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-md transition-colors duration-200">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Live Theme Component Preview</h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Active: <strong className="text-blue-700 dark:text-sky-300">{currentPalette.name}</strong>
          </span>
        </div>

        {/* Mock Preview Cards */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-gray-700/60 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Mock Navbar element */}
          <div className="p-4 rounded-xl bg-darkBlue text-white flex flex-col justify-between shadow-md">
            <div>
              <p className="text-xs text-white font-bold uppercase tracking-wider mb-1 drop-shadow-sm">Navbar Component</p>
              <h4 className="font-bold text-base text-white">DCS PUP Alumni Portal</h4>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white font-medium">Home</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue text-white font-semibold">Alumni</span>
            </div>
          </div>

          {/* Mock Primary Button & Badges */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-gray-700 flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-xs text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-semibold">Buttons & Badges</p>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-blue text-white text-xs font-semibold shadow">
                  Primary Button
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-hoverBlue text-blue text-xs font-semibold">
                  Subtle Action
                </button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 dark:text-kajal">Accent Glow</span>
              <span className="text-xs px-2 py-0.5 rounded bg-blue/10 text-blue-700 dark:text-lightBlue font-semibold">Verified</span>
            </div>
          </div>

          {/* Mock Card Preview */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-gray-700 text-slate-800 dark:text-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-blue">Batch 2023-2025</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-lightBlue/30 text-darkBlue font-bold">MCA</span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Alumni Member Card</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Software Engineer at MNC</p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 dark:border-gray-700 flex justify-between items-center text-xs">
              <span className="text-blue font-semibold">View Profile →</span>
              <span className="text-slate-400 text-[11px]">Patiala, Punjab</span>
            </div>
          </div>
        </div>
      </div>

      {/* Palette Choices Grid */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue" />
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">Choose Color Theme</h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click any card to apply instantly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(palettes).map((palette) => {
            const isActive = activePaletteId === palette.id;
            return (
              <div
                key={palette.id}
                onClick={() => handleSelectPalette(palette.id)}
                className={`relative group cursor-pointer rounded-2xl p-6 transition-all duration-300 border ${
                  isActive
                    ? 'bg-blue-50/50 dark:bg-slate-800 border-blue-600 ring-2 ring-blue-500/30 shadow-xl scale-[1.02]'
                    : 'bg-white dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-md hover:-translate-y-1'
                }`}
              >
                {/* Active Indicator Badge */}
                {isActive && (
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-xs font-bold shadow-sm">
                    <Check className="w-3.5 h-3.5" />
                    Active Theme
                  </div>
                )}

                {/* Color Swatch Circle */}
                <div className="flex items-center gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-2xl shadow-inner border border-white/20 flex items-center justify-center shrink-0 transition group-hover:scale-105"
                    style={{ backgroundColor: palette.primary }}
                  >
                    <Sparkles className="w-6 h-6 text-white/90" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-300 transition">
                      {palette.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">{palette.subtitle}</p>
                  </div>
                </div>

                {/* Color Multi-Bar Preview */}
                <div className="space-y-2 mb-5">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex justify-between font-mono">
                    <span>Palette Swatches</span>
                    <span>{palette.primary}</span>
                  </div>
                  <div className="h-4 rounded-xl overflow-hidden flex border border-slate-200 dark:border-white/10 shadow-inner">
                    <div className="h-full flex-1" style={{ backgroundColor: palette.primary }} title="Primary" />
                    <div className="h-full flex-1" style={{ backgroundColor: palette.darkBlue }} title="Dark Blue" />
                    <div className="h-full flex-1" style={{ backgroundColor: palette.lightBlue }} title="Light Blue" />
                    <div className="h-full flex-1" style={{ backgroundColor: palette.accent }} title="Accent" />
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPalette(palette.id);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                    isActive
                      ? 'bg-blue text-white shadow-md cursor-default'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Current Active Theme</span>
                    </>
                  ) : (
                    <span>Click to Apply Theme</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminAppearance;
