import React from 'react';

export const AlumniCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg overflow-hidden flex flex-col w-full animate-pulse">
      {/* Image Skeleton with Shimmer - exactly matching card height */}
      <div className="h-64 md:h-72 lg:h-96 bg-slate-200 dark:bg-slate-700 relative overflow-hidden w-full">
        <div className="absolute inset-0 -translate-x-full animate-loader-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Content Skeleton */}
      <div className="p-4 space-y-2.5 flex-1 bg-white dark:bg-slate-800 w-full">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        <div className="h-3.5 bg-slate-100 dark:bg-slate-700/60 rounded w-2/3" />
        <div className="h-3.5 bg-slate-100 dark:bg-slate-700/60 rounded w-3/5" />
        <div className="h-3.5 bg-slate-100 dark:bg-slate-700/60 rounded w-4/5" />
      </div>
    </div>
  );
};

export const AlumniGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <AlumniCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default AlumniCardSkeleton;
