import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  GraduationCap,
  Search,
  X,
  Mail,
  Phone,
  BookOpen,
  Award,
  Sparkles,
  Filter,
  ChevronRight,
  Building2,
  Copy,
  Check,
  Users,
  Cpu,
  RotateCcw,
  User,
  FlaskConical,
  Compass,
} from 'lucide-react';
import { toast } from 'react-toastify';
import API from '../api/api';
import facultyData from '../data/facultyData.json';

// Ultra-fast image optimizer for Cloudinary payloads (drops size from 2MB to ~10KB)
const getOptimizedImageUrl = (url, size = 240) => {
  if (!url || typeof url !== 'string') return '';
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    if (url.includes('/upload/f_auto,q_auto')) return url;
    return url.replace(
      '/upload/',
      `/upload/f_auto,q_auto,w_${size},h_${size},c_fill,g_face/`
    );
  }
  return url;
};

// Strict classification helpers
const isPhdScholar = (teacher) => {
  const title = (teacher.title || '').toLowerCase();
  const des = (teacher.Designation || '').toLowerCase();
  return (
    title.includes('phd') ||
    title.includes('scholar') ||
    des.includes('phd') ||
    des.includes('scholar') ||
    des.includes('fellow')
  );
};

const isTeachingFaculty = (teacher) => {
  if (isPhdScholar(teacher)) return false;
  const des = (teacher.Designation || '').toLowerCase();
  const title = (teacher.title || '').toLowerCase();
  return (
    des.includes('professor') ||
    title.includes('professor') ||
    title.includes('head') ||
    des.includes('faculty')
  );
};

const isTechnicalStaff = (teacher) => {
  return !isTeachingFaculty(teacher) && !isPhdScholar(teacher);
};

// Fast progressive image component with shimmer placeholder
const FacultyAvatar = ({ src, alt, size = 240, className = '' }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const optimizedSrc = useMemo(() => getOptimizedImageUrl(src, size), [src, size]);

  if (!src || error) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br from-blue/10 to-indigo-500/10 dark:from-sky-500/20 dark:to-indigo-500/20 text-blue dark:text-sky-300 font-bold font-mons text-xl ${className}`}>
        {alt ? (
          alt
            .split(' ')
            .map((n) => n[0])
            .slice(0, 2)
            .join('')
        ) : (
          <User className="w-8 h-8" />
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-slate-200 dark:bg-slate-800 overflow-hidden ${className}`}>
      {/* Shimmer skeleton while loading */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-slate-700/50 to-transparent animate-pulse" />
      )}
      <img
        src={optimizedSrc}
        alt={alt || 'Faculty'}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default function Faculty() {
  const [facultyList, setFacultyList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & State
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'teaching' | 'phd' | 'technical'
  const [selectedDesignation, setSelectedDesignation] = useState('All');
  const [expandedBios, setExpandedBios] = useState({});
  const [selectedFaculty, setSelectedFaculty] = useState(null); // Detail modal
  const [copiedEmail, setCopiedEmail] = useState(null);

  // Fetch Faculty Data while preserving the exact arranged series
  const fetchFaculty = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await API.get('/faculty');
      const mongoData = response.data.map((item, index) => ({
        ...item,
        id: item._id || `mongo_${index}`,
        name: item.name || 'Faculty Member',
        title: item.title || '',
        department: item.department || 'Department of Computer Science',
        email: item.email || '',
        phone: item.phone || '',
        expertise: Array.isArray(item.expertise)
          ? item.expertise.map((s) => s.trim()).filter(Boolean)
          : typeof item.expertise === 'string'
          ? item.expertise.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        bio: item.bio || '',
        image: item.image || '',
        Designation: item.Designation || 'Faculty',
        originalIndex: index,
      }));

      const localDataWithId = (facultyData || []).map((item, index) => ({
        ...item,
        id: `local_${index}`,
        department: item.department || 'Department of Computer Science',
        expertise: Array.isArray(item.expertise)
          ? item.expertise
          : typeof item.expertise === 'string'
          ? item.expertise.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        Designation: item.Designation || 'Faculty',
        originalIndex: 1000 + index,
      }));

      // Merge avoiding duplicate entries while strictly preserving arranged sequence
      const combined = [...mongoData, ...localDataWithId];
      const uniqueFaculty = Array.from(
        new Map(combined.map((item) => [(item.name + item.email).toLowerCase(), item])).values()
      );

      setFacultyList(uniqueFaculty);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch faculty:', err);
      setError('Unable to load from live database. Showing local faculty records.');
      const fallback = (facultyData || []).map((item, index) => ({
        ...item,
        id: `local_${index}`,
        department: item.department || 'Department of Computer Science',
        Designation: item.Designation || 'Faculty',
        originalIndex: index,
      }));
      setFacultyList(fallback);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaculty();
  }, [fetchFaculty]);

  // Distinct designations for dropdown filter
  const uniqueDesignations = useMemo(() => {
    const set = new Set(facultyList.map((f) => f.Designation).filter(Boolean));
    return ['All', ...Array.from(set).sort()];
  }, [facultyList]);

  // Card badge styling helper
  const getBadgeStyle = (category) => {
    if (category === 'teaching') {
      return {
        badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30 dark:border-amber-400/30',
        accent: 'from-amber-400 via-amber-500 to-amber-600',
        ring: 'hover:border-amber-400/50 dark:hover:border-amber-400/50',
      };
    }
    if (category === 'phd') {
      return {
        badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30 dark:border-purple-400/30',
        accent: 'from-purple-400 via-indigo-500 to-purple-600',
        ring: 'hover:border-purple-400/50 dark:hover:border-purple-400/50',
      };
    }
    return {
      badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 dark:border-emerald-400/30',
      accent: 'from-emerald-400 via-teal-500 to-emerald-600',
      ring: 'hover:border-emerald-400/50 dark:hover:border-emerald-400/50',
    };
  };

  // Group into the 3 distinct categories preserving their original arranged order
  const { teachingFaculty, phdScholars, technicalStaff } = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    const matches = (teacher) => {
      if (q !== '') {
        const nameMatch = teacher.name?.toLowerCase().includes(q);
        const titleMatch = teacher.title?.toLowerCase().includes(q);
        const desMatch = teacher.Designation?.toLowerCase().includes(q);
        const expMatch = teacher.expertise?.some((e) => e.toLowerCase().includes(q));
        const bioMatch = teacher.bio?.toLowerCase().includes(q);
        if (!nameMatch && !titleMatch && !desMatch && !expMatch && !bioMatch) {
          return false;
        }
      }
      if (selectedDesignation !== 'All') {
        if (teacher.Designation !== selectedDesignation) {
          return false;
        }
      }
      return true;
    };

    return {
      teachingFaculty: facultyList.filter(isTeachingFaculty).filter(matches),
      phdScholars: facultyList.filter(isPhdScholar).filter(matches),
      technicalStaff: facultyList.filter(isTechnicalStaff).filter(matches),
    };
  }, [facultyList, searchTerm, selectedDesignation]);

  const totalFilteredCount = teachingFaculty.length + phdScholars.length + technicalStaff.length;

  const toggleBio = (id) => {
    setExpandedBios((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopyEmail = (email, e) => {
    e.stopPropagation();
    if (!email) return;
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    toast.success(`Copied "${email}" to clipboard!`, { autoClose: 2000 });
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveTab('all');
    setSelectedDesignation('All');
  };

  // Reusable Faculty Card Component
  const FacultyCard = ({ teacher, category }) => {
    const badgeStyle = getBadgeStyle(category);
    const isBioExpanded = expandedBios[teacher.id];
    const isHOD =
      teacher.title?.toLowerCase().includes('head') ||
      teacher.Designation?.toLowerCase().includes('head');

    return (
      <div
        className={`group relative rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/70 shadow-md hover:shadow-2xl dark:shadow-slate-950/40 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden ${badgeStyle.ring}`}
      >
        {/* Top Accent Gradient Border */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${badgeStyle.accent}`} />

        <div className="p-5 sm:p-6 flex-1 flex flex-col">
          {/* Header Area: Avatar + Meta */}
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar with instant Cloudinary WebP thumbnail & lazy load */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-700 shadow-md bg-slate-100 dark:bg-slate-900 group-hover:scale-105 transition-transform duration-300">
                <FacultyAvatar
                  src={teacher.image}
                  alt={teacher.name}
                  size={240}
                  className="rounded-2xl"
                />
              </div>

              {/* HOD Special Star Badge */}
              {isHOD && (
                <div
                  className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800"
                  title="Head of Department"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Title & Info */}
            <div className="flex-1 min-w-0">
              <div className="mb-1.5">
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border tracking-wide uppercase ${badgeStyle.badge}`}
                >
                  {teacher.Designation || 'Faculty'}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold font-mons text-slate-900 dark:text-white truncate group-hover:text-blue dark:group-hover:text-sky-400 transition-colors">
                {teacher.name}
              </h3>

              {teacher.title && (
                <p className="text-xs font-semibold text-blue dark:text-sky-300 truncate mt-0.5">
                  {teacher.title}
                </p>
              )}

              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 truncate">
                <Building2 className="w-3 h-3 shrink-0" />
                <span className="truncate">{teacher.department}</span>
              </p>
            </div>
          </div>

          {/* Areas of Expertise Tags */}
          {teacher.expertise && teacher.expertise.length > 0 && (
            <div className="my-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">
                <Compass className="w-3.5 h-3.5 text-blue dark:text-sky-400" />
                <span>Specialization & Focus</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {teacher.expertise.slice(0, 3).map((area, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/70"
                  >
                    {area}
                  </span>
                ))}
                {teacher.expertise.length > 3 && (
                  <span
                    className="px-2 py-1 rounded-lg text-[11px] font-bold bg-blue/10 dark:bg-sky-400/10 text-blue dark:text-sky-300"
                    title={teacher.expertise.slice(3).join(', ')}
                  >
                    +{teacher.expertise.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Bio Preview */}
          <div className="my-2 flex-1">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed text-justify">
              {teacher.bio ? (
                isBioExpanded || teacher.bio.length <= 110 ? (
                  teacher.bio
                ) : (
                  `${teacher.bio.substring(0, 110)}...`
                )
              ) : (
                <span className="text-slate-400 italic">
                  Dedicated member of the Department of Computer Science.
                </span>
              )}
            </p>
            {teacher.bio && teacher.bio.length > 110 && (
              <button
                onClick={() => toggleBio(teacher.id)}
                className="mt-1 text-xs font-bold text-blue dark:text-sky-400 hover:underline inline-flex items-center gap-0.5"
              >
                <span>{isBioExpanded ? 'Read Less' : 'Read Full Bio'}</span>
                <ChevronRight
                  className={`w-3 h-3 transition-transform ${
                    isBioExpanded ? 'rotate-90' : ''
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* Card Footer Bar */}
        <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs gap-2">
          {/* Email Action */}
          <div className="flex items-center gap-1.5 min-w-0">
            {teacher.email ? (
              <>
                <a
                  href={`mailto:${teacher.email}`}
                  className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:text-blue dark:hover:text-sky-400 font-medium truncate py-1"
                  title={`Send email to ${teacher.email}`}
                >
                  <Mail className="w-3.5 h-3.5 shrink-0 text-blue dark:text-sky-400" />
                  <span className="truncate text-[11px]">{teacher.email}</span>
                </a>
                <button
                  onClick={(e) => handleCopyEmail(teacher.email, e)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
                  title="Copy email address"
                >
                  {copiedEmail === teacher.email ? (
                    <Check className="w-3 h-3 text-emerald-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </>
            ) : (
              <span className="text-slate-400 text-[11px] italic">No public email</span>
            )}
          </div>

          {/* View Details Button */}
          <button
            onClick={() => setSelectedFaculty(teacher)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-darkBlue hover:text-white dark:hover:bg-sky-500 dark:hover:text-slate-950 font-semibold text-[11px] shadow-xs transition-all shrink-0 ml-auto"
          >
            <span>Profile</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/60 dark:bg-[#0b1120] text-slate-800 dark:text-slate-100 transition-colors duration-300 pt-24 sm:pt-28 pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-white via-sky-50/20 to-slate-50/50 dark:from-slate-900/90 dark:via-[#002147]/20 dark:to-[#0b1120] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue/10 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue/10 dark:bg-sky-400/10 border border-blue/20 dark:border-sky-400/20 text-blue dark:text-sky-300 text-xs sm:text-sm font-semibold tracking-wide mb-5 shadow-xs">
            <GraduationCap className="w-4 h-4 text-blue dark:text-sky-400" />
            <span>Department of Computer Science • Punjabi University, Patiala</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-mons tracking-tight text-darkBlue dark:text-white max-w-4xl mx-auto leading-tight">
            Distinguished{' '}
            <span className="bg-gradient-to-r from-blue via-sky-500 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
              Faculty & Staff
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-poppins leading-relaxed">
            Meet our esteemed professors, doctoral research scholars, and dedicated technical personnel shaping educational excellence and technological advancement at DCS PUP.
          </p>

          {/* Quick Metrics */}
          <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-blue dark:text-sky-400 font-mons">
                {facultyList.length}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Total Team Members
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-500 dark:text-amber-400 font-mons">
                {facultyList.filter(isTeachingFaculty).length}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Teaching Faculty
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400 font-mons">
                {facultyList.filter(isPhdScholar).length}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                PhD Scholars
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-700/60 shadow-sm flex flex-col items-center">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mons">
                {facultyList.filter(isTechnicalStaff).length}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                Technical Staff
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FILTER & SEARCH CONTROLS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 shadow-lg backdrop-blur-md space-y-5">
          {/* Top Row: Search Input & Designation Select */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search by name, expertise (e.g. AI, Python), title, or bio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400 transition-all shadow-inner"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
              <select
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400 transition-all cursor-pointer shadow-inner"
              >
                {uniqueDesignations.map((des) => (
                  <option key={des} value={des}>
                    {des === 'All' ? 'All Designations' : des}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Tabs: All, Teaching Faculty, PhD Scholars, Technical Staff */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-slate-100 dark:border-slate-700/60">
            {[
              {
                id: 'all',
                label: 'All Faculty & Staff',
                icon: Users,
                count: facultyList.length,
              },
              {
                id: 'teaching',
                label: 'Teaching Faculty',
                icon: Award,
                count: facultyList.filter(isTeachingFaculty).length,
              },
              {
                id: 'phd',
                label: 'PhD Scholars',
                icon: FlaskConical,
                count: facultyList.filter(isPhdScholar).length,
              },
              {
                id: 'technical',
                label: 'Technical & Admin Staff',
                icon: Cpu,
                count: facultyList.filter(isTechnicalStaff).length,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 shadow-md shadow-blue/20 dark:shadow-sky-500/20 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700/70'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-white dark:text-slate-950' : 'text-slate-400 dark:text-slate-500'
                    }`}
                  />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-slate-950'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Filter Indicators */}
          {(searchTerm || activeTab !== 'all' || selectedDesignation !== 'All') && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span>Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue/10 text-blue dark:text-sky-300 font-medium">
                    Search: "{searchTerm}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchTerm('')} />
                  </span>
                )}
                {activeTab !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 font-medium">
                    Section: {activeTab === 'teaching' ? 'Teaching Faculty' : activeTab === 'phd' ? 'PhD Scholars' : 'Technical Staff'}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveTab('all')} />
                  </span>
                )}
                {selectedDesignation !== 'All' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 font-medium">
                    Designation: {selectedDesignation}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedDesignation('All')} />
                  </span>
                )}
              </div>

              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-blue dark:text-sky-400 hover:underline font-semibold ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. MAIN FACULTY SECTIONS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-16">
        {/* Error notification */}
        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-sm flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchFaculty}
              className="text-xs font-bold underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-200 dark:bg-slate-700 shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2" />
                  </div>
                </div>
                <div className="h-16 bg-slate-100 dark:bg-slate-700/50 rounded-xl" />
              </div>
            ))}
          </div>
        ) : totalFilteredCount === 0 ? (
          /* Empty Search State */
          <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-sm max-w-xl mx-auto my-6">
            <div className="w-16 h-16 rounded-3xl bg-blue/10 dark:bg-sky-400/10 text-blue dark:text-sky-400 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-mons text-slate-900 dark:text-white">
              No faculty or staff found
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any results matching your search or filter. Try clearing filters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 text-sm font-semibold shadow-md hover:opacity-90 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset all filters</span>
            </button>
          </div>
        ) : (
          <>
            {/* SECTION 1: TEACHING FACULTY (EXACT ARRANGE SERIES PRESERVED) */}
            {(activeTab === 'all' || activeTab === 'teaching') && teachingFaculty.length > 0 && (
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-700/70 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-mons text-slate-900 dark:text-white flex items-center gap-2.5">
                        <span>Teaching Faculty</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                          {teachingFaculty.length} Professors & Mentors
                        </span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Eminent professors, department leadership, and assistant professors arranged in official academic order.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                  {teachingFaculty.map((teacher) => (
                    <FacultyCard key={teacher.id} teacher={teacher} category="teaching" />
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 2: PHD SCHOLARS (DISTINCT DEDICATED CATEGORY) */}
            {(activeTab === 'all' || activeTab === 'phd') && phdScholars.length > 0 && (
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-700/70 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-500/10 dark:bg-purple-400/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-mons text-slate-900 dark:text-white flex items-center gap-2.5">
                        <span>PhD Scholars & Research Fellows</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold border border-purple-200 dark:border-purple-800">
                          {phdScholars.length} Researchers
                        </span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Doctoral research scholars, DST project fellows, and academic contributors pioneering frontier research.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                  {phdScholars.map((teacher) => (
                    <FacultyCard key={teacher.id} teacher={teacher} category="phd" />
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 3: TECHNICAL & ADMINISTRATIVE STAFF (DISTINCT) */}
            {(activeTab === 'all' || activeTab === 'technical') && technicalStaff.length > 0 && (
              <section className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200/80 dark:border-slate-700/70 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-mons text-slate-900 dark:text-white flex items-center gap-2.5">
                        <span>Technical & Administrative Staff</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                          {technicalStaff.length} Staff Members
                        </span>
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                        System administrators, programmers, technical assistants, and departmental office support staff.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
                  {technicalStaff.map((teacher) => (
                    <FacultyCard key={teacher.id} teacher={teacher} category="technical" />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      {/* 4. MODAL: FULL PROFILE PREVIEW */}
      {selectedFaculty && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedFaculty(null)}
        >
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header Banner */}
            <div className="relative bg-gradient-to-r from-darkBlue via-[#00385c] to-indigo-900 p-6 sm:p-8 text-white">
              <button
                onClick={() => setSelectedFaculty(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-white/20 shadow-xl bg-slate-800 shrink-0">
                  <FacultyAvatar
                    src={selectedFaculty.image}
                    alt={selectedFaculty.name}
                    size={480}
                  />
                </div>

                <div className="text-center sm:text-left flex-1 min-w-0">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/10 border border-white/20 mb-2">
                    {selectedFaculty.Designation}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold font-mons">
                    {selectedFaculty.name}
                  </h3>
                  {selectedFaculty.title && (
                    <p className="text-sky-300 font-semibold text-sm sm:text-base mt-1">
                      {selectedFaculty.title}
                    </p>
                  )}
                  <p className="text-slate-300 text-xs sm:text-sm mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                    <Building2 className="w-4 h-4 shrink-0 text-sky-400" />
                    <span>{selectedFaculty.department}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-200 font-poppins">
              {/* Areas of Expertise */}
              {selectedFaculty.expertise && selectedFaculty.expertise.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                    <Compass className="w-4 h-4 text-blue dark:text-sky-400" />
                    <span>Areas of Expertise & Specialization</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedFaculty.expertise.map((area, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue/10 dark:bg-sky-400/10 text-blue dark:text-sky-300 border border-blue/20 dark:border-sky-400/20"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio Statement */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue dark:text-sky-400" />
                  <span>Academic Profile</span>
                </h4>
                <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-300 text-justify">
                  {selectedFaculty.bio || (
                    <span className="italic text-slate-400">
                      No extended biographical sketch submitted yet.
                    </span>
                  )}
                </p>
              </div>

              {/* Contact Channels */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Communications & Location
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  {selectedFaculty.email && (
                    <a
                      href={`mailto:${selectedFaculty.email}`}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5 hover:border-blue dark:hover:border-sky-400 transition-colors"
                    >
                      <Mail className="w-4 h-4 text-blue dark:text-sky-400 shrink-0" />
                      <div className="truncate">
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Email</span>
                        <span className="font-semibold truncate block">{selectedFaculty.email}</span>
                      </div>
                    </a>
                  )}

                  {selectedFaculty.phone ? (
                    <a
                      href={`tel:${selectedFaculty.phone}`}
                      className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5 hover:border-blue dark:hover:border-sky-400 transition-colors"
                    >
                      <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="truncate">
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Office Phone</span>
                        <span className="font-semibold truncate block">{selectedFaculty.phone}</span>
                      </div>
                    </a>
                  ) : (
                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase font-bold">Location</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">DCS Main Building</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Bottom */}
            <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Department of Computer Science • Punjabi University, Patiala
              </span>
              <button
                onClick={() => setSelectedFaculty(null)}
                className="px-5 py-2 rounded-xl bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 font-bold text-xs shadow-md hover:opacity-90 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}