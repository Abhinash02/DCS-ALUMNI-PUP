import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  Award,
  FileSpreadsheet,
  Download,
  TrendingUp,
  Briefcase,
  RefreshCw,
  BarChart3,
  ShieldCheck
} from 'lucide-react';
import API from '../api/api';
import staticAlumniData from '../data/aluminiData.json';
import { exportAlumniToCSV } from '../utils/csvExport';

const AdminOverviewDashboard = ({
  approved: propApproved,
  faculty: propFaculty,
  events: propEvents,
  pending: propPending
}) => {
  const [approvedList, setApprovedList] = useState(propApproved || []);
  const [pendingList, setPendingList] = useState(propPending || []);
  const [facultyList, setFacultyList] = useState(propFaculty || []);
  const [eventsList, setEventsList] = useState(propEvents || []);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardData = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);

    try {
      const token = localStorage.getItem('token');
      const authHeader = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      const [approvedRes, pendingRes, facultyRes, eventsRes] = await Promise.allSettled([
        API.get('/alumni/approved', authHeader),
        API.get('/alumni/pending', authHeader),
        API.get('/faculty'),
        API.get('/events')
      ]);

      if (approvedRes.status === 'fulfilled' && Array.isArray(approvedRes.value.data)) {
        setApprovedList(approvedRes.value.data);
      }
      if (pendingRes.status === 'fulfilled' && Array.isArray(pendingRes.value.data)) {
        setPendingList(pendingRes.value.data);
      }
      if (facultyRes.status === 'fulfilled' && Array.isArray(facultyRes.value.data)) {
        setFacultyList(facultyRes.value.data);
      }
      if (eventsRes.status === 'fulfilled' && Array.isArray(eventsRes.value.data)) {
        setEventsList(eventsRes.value.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!propApproved) {
      fetchDashboardData();
    }
  }, [propApproved]);

  // Combine dynamic verified and static alumni directory
  const allAlumni = useMemo(() => {
    const dynamicMapped = (approvedList || []).map(a => ({
      ...a,
      name: a.name || 'Anonymous',
      course: String(a.course || 'OTHER').toUpperCase(),
      batch: String(a.batch || 'Unknown Batch'),
      profession: String(a.profession || 'Not Specified'),
      source: 'dynamic'
    }));

    const staticMapped = (staticAlumniData || []).map(a => ({
      ...a,
      name: a.Name || 'Anonymous',
      course: String(a.Course || 'OTHER').toUpperCase(),
      batch: String(a.Batch || 'Unknown Batch'),
      profession: String(a.Profession || a.Occupation || 'Not Specified'),
      source: 'static'
    }));

    return [...dynamicMapped, ...staticMapped];
  }, [approvedList]);

  // Course breakdown & calculations
  const courseData = useMemo(() => {
    const courses = {};
    allAlumni.forEach(student => {
      const course = String(student.course || 'OTHER');
      const batch = String(student.batch || 'Unknown Batch');

      if (!courses[course]) {
        courses[course] = { total: 0, batches: {} };
      }
      courses[course].total += 1;
      courses[course].batches[batch] = (courses[course].batches[batch] || 0) + 1;
    });

    return Object.entries(courses).map(([name, data]) => ({
      name,
      total: data.total,
      percentage: allAlumni.length > 0 ? Math.round((data.total / allAlumni.length) * 100) : 0,
      batches: Object.entries(data.batches).sort((a, b) => String(b[0]).localeCompare(String(a[0])))
    })).sort((a, b) => b.total - a.total);
  }, [allAlumni]);

  // Batch breakdown & top batches for chart
  const batchData = useMemo(() => {
    const counts = {};
    allAlumni.forEach(student => {
      const b = String(student.batch || 'Other').trim();
      counts[b] = (counts[b] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([batch, count]) => ({
        batch,
        count,
        percentage: allAlumni.length > 0 ? Math.round((count / allAlumni.length) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 batches
  }, [allAlumni]);

  // Top professions & career domains
  const professionData = useMemo(() => {
    const counts = {
      'Software & Web Dev': 0,
      'Data & AI / ML': 0,
      'Academia & Research': 0,
      'Quality & Testing': 0,
      'IT & Cloud Infrastructure': 0,
      'Product & Management': 0,
      'Other Disciplines': 0
    };

    allAlumni.forEach(student => {
      const p = String(student.profession || '').toLowerCase();
      if (p.includes('software') || p.includes('developer') || p.includes('frontend') || p.includes('backend') || p.includes('full stack') || p.includes('mern') || p.includes('react')) {
        counts['Software & Web Dev'] += 1;
      } else if (p.includes('data') || p.includes('ai') || p.includes('ml') || p.includes('analyst') || p.includes('machine learning')) {
        counts['Data & AI / ML'] += 1;
      } else if (p.includes('prof') || p.includes('teacher') || p.includes('faculty') || p.includes('research') || p.includes('phd') || p.includes('academic')) {
        counts['Academia & Research'] += 1;
      } else if (p.includes('qa') || p.includes('test') || p.includes('automation')) {
        counts['Quality & Testing'] += 1;
      } else if (p.includes('cloud') || p.includes('devops') || p.includes('admin') || p.includes('network') || p.includes('system')) {
        counts['IT & Cloud Infrastructure'] += 1;
      } else if (p.includes('manager') || p.includes('lead') || p.includes('product') || p.includes('consultant')) {
        counts['Product & Management'] += 1;
      } else {
        counts['Other Disciplines'] += 1;
      }
    });

    const maxCount = Math.max(...Object.values(counts), 1);

    return Object.entries(counts).map(([domain, count]) => ({
      domain,
      count,
      pctOfMax: Math.round((count / maxCount) * 100),
      percentage: allAlumni.length > 0 ? Math.round((count / allAlumni.length) * 100) : 0
    }));
  }, [allAlumni]);

  // Faculty designation breakdown
  const facultyByDesignation = useMemo(() => {
    const designations = {};
    (facultyList || []).forEach(f => {
      const des = String(f.Designation || 'Faculty');
      designations[des] = (designations[des] || 0) + 1;
    });
    return Object.entries(designations).sort((a, b) => b[1] - a[1]);
  }, [facultyList]);

  // Verification rate percentage
  const verificationRate = useMemo(() => {
    const totalRegistrations = (approvedList?.length || 0) + (pendingList?.length || 0);
    if (totalRegistrations === 0) return 100;
    return Math.round(((approvedList?.length || 0) / totalRegistrations) * 100);
  }, [approvedList, pendingList]);

  const maxBatchCount = useMemo(() => {
    return batchData.length > 0 ? Math.max(...batchData.map(b => b.count)) : 1;
  }, [batchData]);

  const maxCourseCount = useMemo(() => {
    return courseData.length > 0 ? Math.max(...courseData.map(c => c.total)) : 1;
  }, [courseData]);

  return (
    <div className="space-y-8 animate__animated animate__fadeIn">
      {/* Top Welcome Banner with Controls */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 shadow-xl border border-blue-800 text-white">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
              Administrative Command Center
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-amber-300 tracking-tight drop-shadow">
              Analytics & Portal Overview
            </h2>
            <p className="text-white text-sm md:text-base mt-1.5 max-w-2xl font-medium drop-shadow-sm">
              Live demographics, graduation trends, career distribution, and verified directory records of Punjabi University Patiala DCS Alumni.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur transition border border-white/20 active:scale-95 disabled:opacity-50"
              title="Refresh live metrics"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={() => exportAlumniToCSV(approvedList, `DCS_Approved_Alumni_${new Date().toISOString().slice(0, 10)}.csv`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-900/40 transition border border-emerald-400/30 active:scale-95"
              title="Export approved online alumni to CSV"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Verified ({approvedList.length})</span>
            </button>

            <button
              onClick={() => exportAlumniToCSV(allAlumni, `DCS_Full_Alumni_Directory_${new Date().toISOString().slice(0, 10)}.csv`)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-900/40 transition border border-blue-400/30 active:scale-95"
              title="Export all records (static + dynamic) to CSV"
            >
              <Download className="w-4 h-4" />
              <span>Export All ({allAlumni.length})</span>
            </button>
          </div>
        </div>

        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-60 h-60 bg-blue-400/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
          title="Total Alumni Directory"
          value={allAlumni.length.toLocaleString()}
          subtitle={`${approvedList.length} Online + ${staticAlumniData.length} Archival`}
          accent="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-50 dark:bg-blue-950/60"
        />
        <StatCard
          icon={<Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
          title="Pending Verifications"
          value={pendingList.length}
          subtitle={pendingList.length > 0 ? "Requires review & approval" : "Queue all cleared"}
          accent="text-amber-600 dark:text-amber-400"
          iconBg="bg-amber-50 dark:bg-amber-950/60"
        />
        <StatCard
          icon={<BookOpen className="w-6 h-6 text-purple-600 dark:text-purple-400" />}
          title="Department Faculty"
          value={facultyList.length}
          subtitle={`${facultyByDesignation.length} Academic Designations`}
          accent="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-50 dark:bg-purple-950/60"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
          title="Events & Meets"
          value={eventsList.length}
          subtitle={`Verification rate: ${verificationRate}%`}
          accent="text-emerald-600 dark:text-emerald-400"
          iconBg="bg-emerald-50 dark:bg-emerald-950/60"
        />
      </div>

      {/* Visual Analytics Row 1: Course Breakdown & Top Batches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Course Distribution Visual Chart */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-md flex flex-col transition-colors duration-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 dark:bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-700 dark:text-sky-300">Degree / Course Distribution</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Enrolled and graduated students by program</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20">
              {courseData.length} Programs
            </span>
          </div>

          <div className="space-y-3.5 flex-1">
            {courseData.length > 0 ? (
              courseData.map((course, idx) => {
                const fillWidth = Math.max(Math.round((course.total / maxCourseCount) * 100), 5);
                const colors = [
                  'from-blue-500 to-indigo-600',
                  'from-emerald-500 to-teal-600',
                  'from-purple-500 to-pink-600',
                  'from-amber-500 to-orange-600',
                  'from-cyan-500 to-blue-600',
                ];
                const gradient = colors[idx % colors.length];

                return (
                  <div key={idx} className="group p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-blue-50/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700/80 transition-all duration-200">
                    <div className="flex justify-between items-center text-sm mb-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-sky-300 transition">
                        {course.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono font-semibold">{course.percentage}%</span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-slate-800 dark:text-blue-300 border border-blue-200 dark:border-slate-700">
                          {course.total} students
                        </span>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
                        style={{ width: `${fillWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-sm text-center py-8">No course data available.</p>
            )}
          </div>
        </div>

        {/* Top Batches Graduation Timeline Chart */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-md flex flex-col transition-colors duration-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-300">Graduation Batches</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Highest alumni representation by batch</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/20">
              Top 8 Batches
            </span>
          </div>

          <div className="space-y-3.5 flex-1">
            {batchData.length > 0 ? (
              batchData.map((item, idx) => {
                const fillWidth = Math.max(Math.round((item.count / maxBatchCount) * 100), 6);
                return (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-indigo-50/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700/80 transition-all duration-200">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition">Batch {item.batch}</span>
                      <span className="text-slate-600 dark:text-slate-300 font-mono font-semibold">{item.count} alumni</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                        style={{ width: `${fillWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-slate-400 text-sm text-center py-8">No batch statistics recorded.</p>
            )}
          </div>
        </div>

      </div>

      {/* Visual Analytics Row 2: Career Fields & Faculty Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Career Fields & Industry Domains */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-md flex flex-col transition-colors duration-200">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-teal-50 dark:bg-teal-500/20 rounded-xl text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-teal-700 dark:text-teal-300">Alumni Career Domains</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Distribution across major technology & academic sectors</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <TrendingUp className="w-4 h-4" />
              <span>Industry Insights</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {professionData.map((item, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-teal-50/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between transition-all duration-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition">{item.domain}</span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-700">
                    {item.count}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-700"
                    style={{ width: `${item.pctOfMax}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Faculty Insights */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-md flex flex-col transition-colors duration-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-500/20 rounded-xl text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-purple-700 dark:text-purple-300">Faculty Breakdown</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">By academic designation</p>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
            {facultyByDesignation.length > 0 ? (
              facultyByDesignation.map(([des, count], idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold truncate mr-2" title={des}>
                    {des}
                  </span>
                  <span className="bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 py-0.5 px-2.5 rounded-full text-xs font-bold shrink-0 border border-purple-200 dark:border-purple-500/30">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-xs text-center py-6">No faculty designations recorded.</p>
            )}
          </div>
        </div>

      </div>

      {/* Recent Events Section */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-md transition-colors duration-200">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-orange-500/20 rounded-xl text-amber-600 dark:text-orange-400 border border-amber-200 dark:border-orange-500/30">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-700 dark:text-amber-300">Department Events & Alumni Meets</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Latest active gatherings, webinars, and reunions</p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-orange-500/10 text-amber-700 dark:text-orange-300 border border-amber-200 dark:border-orange-500/20">
            {eventsList.length} Total Events
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {eventsList.slice(0, 3).map((ev) => (
            <div key={ev._id} className="group rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition shadow-sm">
              {ev.images && ev.images.length > 0 ? (
                <div className="h-32 overflow-hidden bg-slate-200 dark:bg-gray-800">
                  <img src={ev.images[0].url} alt={ev.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="h-32 bg-slate-200 dark:bg-gray-800/80 flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-slate-400 dark:text-gray-600" />
                </div>
              )}
              <div className="p-4">
                <h4 className="text-slate-900 dark:text-amber-200 font-bold text-sm truncate mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition" title={ev.title}>
                  {ev.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {ev.date ? new Date(ev.date).toLocaleDateString() : (ev.createdAt ? new Date(ev.createdAt).toLocaleDateString() : 'Active Event')}
                </p>
              </div>
            </div>
          ))}
          {eventsList.length === 0 && (
            <p className="text-slate-400 text-xs col-span-3 text-center py-6">No recent events posted.</p>
          )}
        </div>
      </div>

    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ icon, title, value, subtitle, accent, iconBg }) => (
  <div className="relative overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-md hover:-translate-y-1 transition duration-300">
    <div className="flex justify-between items-start mb-3 relative z-10">
      <div className={`p-2.5 ${iconBg} rounded-xl shadow-inner border border-slate-200/50 dark:border-white/5`}>
        {icon}
      </div>
      <span className={`text-xs font-semibold ${accent}`}>● Active</span>
    </div>
    <div className="relative z-10">
      <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</span>
      </div>
      <p className="text-xs mt-1.5 text-slate-500 dark:text-slate-400 font-medium truncate">{subtitle}</p>
    </div>
  </div>
);

export default AdminOverviewDashboard;
