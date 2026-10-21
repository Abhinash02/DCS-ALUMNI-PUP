import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUserFriends, FaBriefcase, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';

export const MobileBottomNav = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: FaHome },
    { label: 'Alumni', path: '/Alumni', icon: FaUserFriends },
    { label: 'Jobs', path: '/jobs', icon: FaBriefcase },
    { label: 'Events', path: '/Events', icon: FaCalendarAlt },
    { label: 'Profile', path: '/UserLogin', icon: FaUserCircle },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.toLowerCase().startsWith(path.toLowerCase());
  };

  return (
    <nav 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-5px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 transition-colors duration-300"
      aria-label="Mobile Bottom Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-95 ${
                active 
                  ? 'text-blue dark:text-sky-400 font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110 drop-shadow-[0_2px_8px_rgba(0,91,150,0.3)]' : ''}`} />
                {active && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue dark:bg-sky-400 shadow-sm" />
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight ${active ? 'font-semibold' : 'font-normal'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
