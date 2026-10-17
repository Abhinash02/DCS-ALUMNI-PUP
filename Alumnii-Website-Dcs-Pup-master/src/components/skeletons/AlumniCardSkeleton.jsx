import React from 'react';

export const AlumniCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 flex flex-col animate-pulse">
      {/* Image Skeleton with Shimmer */}
      <div className="h-64 md:h-72 lg:h-80 bg-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-loader-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      </div>
      {/* Content Skeleton */}
      <div className="p-4 space-y-2.5 flex-1 bg-white">
        <div className="h-5 bg-slate-200 rounded-md w-3/4" />
        <div className="h-3.5 bg-slate-200 rounded w-1/2" />
        <div className="h-3.5 bg-slate-100 rounded w-2/3" />
        <div className="h-3.5 bg-slate-100 rounded w-4/5" />
        <div className="pt-2 flex gap-2">
          <div className="h-6 bg-slate-200 rounded-full w-20" />
          <div className="h-6 bg-slate-100 rounded-full w-16" />
        </div>
      </div>
    </div>
  );
};

export const AlumniGridSkeleton = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <AlumniCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default AlumniCardSkeleton;
