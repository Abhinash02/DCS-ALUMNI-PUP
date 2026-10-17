import React from 'react';

export const JobCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-slate-100 relative overflow-hidden animate-pulse flex flex-col justify-between">
      {/* Shimmer sweep overlay */}
      <div className="absolute inset-0 -translate-x-full animate-loader-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

      <div className="space-y-4">
        {/* Header: Company Avatar & Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-4 bg-slate-200 rounded w-28" />
              <div className="h-3 bg-slate-100 rounded w-20" />
            </div>
          </div>
          <div className="w-16 h-6 bg-slate-100 rounded-full" />
        </div>

        {/* Job Title */}
        <div className="h-5 bg-slate-200 rounded w-3/4" />

        {/* Details Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          <div className="h-6 bg-slate-100 rounded-md w-24" />
          <div className="h-6 bg-slate-100 rounded-md w-20" />
          <div className="h-6 bg-slate-100 rounded-md w-28" />
        </div>

        {/* Description lines */}
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-slate-100 rounded w-full" />
          <div className="h-3 bg-slate-100 rounded w-5/6" />
        </div>
      </div>

      {/* Button footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
        <div className="h-4 bg-slate-100 rounded w-20" />
        <div className="h-9 bg-slate-200 rounded-lg w-28" />
      </div>
    </div>
  );
};

export const JobGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
};

export default JobCardSkeleton;
