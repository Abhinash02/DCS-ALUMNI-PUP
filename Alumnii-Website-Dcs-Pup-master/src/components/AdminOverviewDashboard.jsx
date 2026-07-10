import React, { useMemo } from 'react';
import { Users, GraduationCap, Calendar, Clock, BookOpen, Award, CheckCircle, AlertCircle } from 'lucide-react';
import staticAlumniData from '../data/aluminiData.json';

const AdminOverviewDashboard = ({ approved = [], faculty = [], events = [], pending = [] }) => {

  // Combine dynamic and static alumni data
  const allAlumni = useMemo(() => {
    const dynamicAlumni = approved.map(a => ({
      name: a.name,
      course: (a.course || 'OTHER').toUpperCase(),
      batch: a.batch || 'Unknown Batch',
      source: 'dynamic'
    }));
    
    const staticAlumni = (staticAlumniData || []).map(a => ({
      name: a.Name,
      course: (a.Course || 'OTHER').toUpperCase(),
      batch: a.Batch || 'Unknown Batch',
      source: 'static'
    }));

    return [...dynamicAlumni, ...staticAlumni];
  }, [approved]);

  // Group alumni by course and then by batch
  const courseData = useMemo(() => {
    const courses = {};
    allAlumni.forEach(student => {
      const course = student.course;
      const batch = student.batch;
      
      if (!courses[course]) {
        courses[course] = { total: 0, batches: {} };
      }
      courses[course].total += 1;
      courses[course].batches[batch] = (courses[course].batches[batch] || 0) + 1;
    });

    // Convert to array and sort by total descending
    return Object.entries(courses).map(([name, data]) => ({
      name,
      total: data.total,
      batches: Object.entries(data.batches).sort((a, b) => b[0].localeCompare(a[0]))
    })).sort((a, b) => b.total - a.total);
  }, [allAlumni]);

  // Process data for faculty
  const facultyCount = faculty.length;
  const facultyByDesignation = useMemo(() => {
    const designations = {};
    faculty.forEach(f => {
      const des = f.Designation || 'Faculty';
      designations[des] = (designations[des] || 0) + 1;
    });
    return Object.entries(designations).sort((a, b) => b[1] - a[1]);
  }, [faculty]);

  // Process data for events
  const eventsCount = events.length;
  const recentEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  }, [events]);

  return (
    <div className="space-y-8 animate__animated animate__fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-900 p-8 shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
          <p className="text-blue-100 text-lg">A quick glance at the current status of the DCS Alumni Portal.</p>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-blue-400 opacity-20 rounded-full blur-3xl"></div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<CheckCircle className="w-8 h-8 text-green-400" />} 
          title="Total Alumni (All)" 
          value={allAlumni.length} 
          subtitle={`${courseData.length} Courses`}
          color="from-green-500/20 to-emerald-900/40"
          borderColor="border-green-500/30"
        />
        <StatCard 
          icon={<Clock className="w-8 h-8 text-yellow-400" />} 
          title="Pending Approvals" 
          value={pending.length} 
          subtitle="Needs review"
          color="from-yellow-500/20 to-orange-900/40"
          borderColor="border-yellow-500/30"
        />
        <StatCard 
          icon={<BookOpen className="w-8 h-8 text-purple-400" />} 
          title="Total Faculty" 
          value={facultyCount} 
          subtitle={`${facultyByDesignation.length} Designations`}
          color="from-purple-500/20 to-pink-900/40"
          borderColor="border-purple-500/30"
        />
        <StatCard 
          icon={<Calendar className="w-8 h-8 text-blue-400" />} 
          title="Total Events" 
          value={eventsCount} 
          subtitle="Organized"
          color="from-blue-500/20 to-cyan-900/40"
          borderColor="border-blue-500/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Alumni by Course & Batch */}
        <div className="lg:col-span-2 bg-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-xl flex flex-col max-h-[600px]">
          <div className="flex items-center gap-3 mb-6 shrink-0">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <GraduationCap className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Alumni by Course & Batch</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
            {courseData.length > 0 ? (
              courseData.map((course, idx) => (
                <div key={idx} className="bg-gray-900/40 rounded-xl p-5 border border-gray-700/50">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h4 className="text-lg font-bold text-blue-400">{course.name}</h4>
                    <span className="bg-blue-500/20 text-blue-300 py-1 px-3 rounded-full text-sm font-bold">
                      Total: {course.total}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {course.batches.map(([batch, count], bIdx) => (
                      <div key={bIdx} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30 hover:border-blue-500/50 transition-colors group">
                        <p className="text-gray-400 text-xs mb-1 group-hover:text-blue-300 transition-colors">Batch {batch}</p>
                        <p className="text-xl font-bold text-white flex items-baseline gap-1">
                          {count} <span className="text-[10px] font-normal text-gray-500">students</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <AlertCircle className="w-12 h-12 mb-3 opacity-20" />
                <p>No alumni data found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Faculty Breakdown */}
        <div className="bg-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-xl flex flex-col max-h-[600px]">
          <div className="flex items-center gap-3 mb-6 shrink-0">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Faculty Insights</h3>
          </div>
          
          <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {facultyByDesignation.length > 0 ? (
              facultyByDesignation.map(([des, count], idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-700/30">
                  <span className="text-gray-300 font-medium truncate mr-2" title={des}>{des}</span>
                  <span className="bg-purple-500/20 text-purple-300 py-1 px-3 rounded-full text-sm font-bold shrink-0">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No faculty data available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Events Snippet */}
      <div className="bg-gray-800/80 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-500/20 rounded-lg">
            <Award className="w-6 h-6 text-orange-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Recently Added Events</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentEvents.length > 0 ? (
            recentEvents.map((ev) => (
              <div key={ev._id} className="group rounded-xl overflow-hidden bg-gray-900 border border-gray-700 hover:border-orange-500/50 transition-all shadow-lg hover:shadow-orange-900/20">
                {ev.images && ev.images.length > 0 ? (
                  <div className="h-32 overflow-hidden">
                    <img src={ev.images[0].url} alt={ev.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-32 bg-gray-800 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-gray-600" />
                  </div>
                )}
                <div className="p-4">
                  <h4 className="text-white font-semibold truncate mb-1">{ev.title}</h4>
                  <p className="text-xs text-gray-400">{new Date(ev.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center py-6">No recent events to show.</p>
          )}
        </div>
      </div>

    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, subtitle, color, borderColor }) => (
  <div className={`relative overflow-hidden bg-gradient-to-br ${color} ${borderColor} border backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:-translate-y-1 transition-transform duration-300`}>
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className="p-3 bg-gray-900/50 rounded-xl shadow-inner">
        {icon}
      </div>
    </div>
    <div className="relative z-10">
      <h3 className="text-gray-300 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-white">{value}</span>
      </div>
      <p className="text-sm mt-2 text-gray-400 font-medium">{subtitle}</p>
    </div>
    <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white opacity-5 rounded-full blur-xl"></div>
  </div>
);

export default AdminOverviewDashboard;
