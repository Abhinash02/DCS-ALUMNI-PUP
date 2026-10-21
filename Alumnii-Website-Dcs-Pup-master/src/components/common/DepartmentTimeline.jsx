import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Award,
  BookOpen,
  Users,
  Cpu,
  Sparkles,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';

const milestones = [
  {
    year: '1987',
    badge: 'Foundation',
    title: 'Department Established & B.Tech CS Launch',
    description:
      'Established in July 1987 as one of the pioneer computer science departments in North India, launching the 4-year B.Tech in Computer Science.',
    icon: Cpu,
    color: 'from-blue-600 to-sky-500',
  },
  {
    year: '1991',
    badge: 'Postgraduate Milestone',
    title: 'Flagship MCA Degree Inception',
    description:
      'Commenced the 3-year Master of Computer Applications (MCA) program, creating industry-ready software engineering graduates who lead multinational tech giants today.',
    icon: BookOpen,
    color: 'from-indigo-600 to-blue-500',
  },
  {
    year: '1995',
    badge: 'Research Expansion',
    title: 'M.Tech Computer Science & Engineering',
    description:
      'Launched M.Tech (CSE) to foster advanced computing research, followed in 2006 by M.Tech in Information & Communication Technology (ICT).',
    icon: Award,
    color: 'from-purple-600 to-indigo-500',
  },
  {
    year: '2004–20',
    badge: 'National Recognition',
    title: 'UGC-SAP & DST-FIST Multi-Crore Grants',
    description:
      'Selected twice consecutively under UGC Special Assistance Programme (DRS-I, DRS-II, DRS-III) and DST-FIST (Level 1) for pathbreaking work in Punjabi NLP, OCR, and AI.',
    icon: Sparkles,
    color: 'from-amber-600 to-orange-500',
  },
  {
    year: '2006',
    badge: 'Global Outreach',
    title: 'Alumni Association & NAPAA Established',
    description:
      'Founded the official Departmental Alumni Association and its active overseas chapter NAPAA (North America Punjabi University Alumni Association).',
    icon: Users,
    color: 'from-cyan-600 to-teal-500',
  },
  {
    year: 'Present',
    badge: 'A+ Accredited',
    title: 'Global Alumni Network & NAAC A+ Grade',
    description:
      'Accredited with CGPA of 3.37 at "A+" grade by NAAC. Partner of Infosys (Advanced Partner), TCS, and IBM with alumni flourishing in 20+ countries.',
    icon: CheckCircle2,
    color: 'from-emerald-600 to-teal-500',
  },
];

export const DepartmentTimeline = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handlePrev = () => {
    setActiveTab((prev) => (prev === 0 ? milestones.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveTab((prev) => (prev === milestones.length - 1 ? 0 : prev + 1));
  };

  // Auto-swipe after 5 seconds on mobile (with pause on interaction)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === milestones.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, activeTab]);

  const currentMilestone = milestones[activeTab];
  const CurrentIcon = currentMilestone.icon;

  return (
    <section className="w-full max-w-[95%] md:max-w-[85%] mx-auto py-8 sm:py-14">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue/10 dark:bg-sky-400/10 border border-blue/20 dark:border-sky-400/20 text-blue dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-blue dark:text-sky-400" />
          <span>Heritage & Excellence Since 1987</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-darkBlue dark:text-white font-mons tracking-tight">
          38+ Years of <span className="bg-gradient-to-r from-blue via-sky-500 to-indigo-600 bg-clip-text text-transparent">Academic Legacy</span>
        </h2>

        <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-poppins">
          From establishing one of North India's earliest computing degree programs to leading national NLP breakthroughs and connecting thousands of global alumni.
        </p>
      </div>

      {/* MOBILE COMPACT INTERACTIVE VIEW (Less vertical scroll, high engagement) */}
      <div className="block md:hidden">
        {/* Horizontal Year Quick-Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none justify-start px-1 mb-4">
          {milestones.map((item, idx) => (
            <button
              key={item.year}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeTab === idx
                  ? 'bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 font-extrabold shadow-md scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              {item.year}
            </button>
          ))}
        </div>

        {/* Active Milestone Card for Mobile with Auto-Swipe and Touch Pause */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="relative rounded-3xl p-6 bg-gradient-to-br from-darkBlue via-[#004875] to-darkBlueAlt text-white shadow-xl border border-white/20 overflow-hidden"
        >
          {/* Top: Year, Badge & Story Progress Bars */}
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 text-white border border-white/30">
                {currentMilestone.year}
              </span>
              <span className="text-xs uppercase font-bold text-sky-200">
                {currentMilestone.badge}
              </span>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-white shadow-sm">
              <CurrentIcon className="w-5 h-5" />
            </div>
          </div>

          {/* Story-style Segmented Indicators */}
          <div className="grid grid-cols-6 gap-1.5 mb-4">
            {milestones.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveTab(idx)}
                aria-label={`Jump to milestone ${idx + 1}`}
                className="h-1 rounded-full overflow-hidden bg-white/25 transition-all"
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    idx === activeTab
                      ? 'bg-white shadow-sm'
                      : idx < activeTab
                      ? 'bg-sky-300'
                      : 'bg-transparent'
                  }`}
                />
              </button>
            ))}
          </div>

          <h3 className="text-xl font-bold font-mons text-white tracking-tight">
            {currentMilestone.title}
          </h3>

          <p className="mt-2.5 text-xs text-blue-100/95 leading-relaxed font-poppins min-h-[56px]">
            {currentMilestone.description}
          </p>

          {/* Stepper Navigation Controls + Auto Swipe Indicator */}
          <div className="mt-5 pt-3.5 border-t border-white/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-sky-200">
                {activeTab + 1} of {milestones.length}
              </span>

              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 hover:bg-white/25 text-[10px] text-sky-200 transition font-medium"
                title={isPaused ? 'Resume auto-swipe' : 'Pause auto-swipe'}
              >
                {isPaused ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
                <span>{isPaused ? 'Paused' : '5s Auto'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous milestone"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next milestone"
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center text-white transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP/LAPTOP GRID (Attractive 6-box view) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {milestones.map((item, index) => {
          const Icon = item.icon;
          const isSelected = activeTab === index;

          return (
            <div
              key={item.year}
              onClick={() => setActiveTab(index)}
              className={`group relative rounded-3xl p-6 sm:p-7 transition-all duration-300 cursor-pointer border flex flex-col justify-between overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-darkBlue via-[#004875] to-darkBlueAlt text-white shadow-xl -translate-y-1.5 border-blue/30'
                  : 'bg-white dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 hover:shadow-xl hover:-translate-y-1 border-slate-100 dark:border-slate-700/60'
              }`}
            >
              {/* Top Row: Year Pill and Icon */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-3.5 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase shadow-xs ${
                      isSelected
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'bg-blue/10 text-blue dark:bg-sky-400/10 dark:text-sky-300 border border-blue/20 dark:border-sky-400/20'
                    }`}
                  >
                    {item.year}
                  </span>

                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-gradient-to-tr ' + item.color + ' text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="text-[11px] font-bold uppercase tracking-wider mb-1.5 opacity-80">
                  {item.badge}
                </div>

                <h3
                  className={`text-lg font-bold font-mons tracking-tight ${
                    isSelected ? 'text-white' : 'text-slate-900 dark:text-white'
                  }`}
                >
                  {item.title}
                </h3>

                <p
                  className={`mt-2.5 text-xs sm:text-sm leading-relaxed ${
                    isSelected ? 'text-blue-100/90' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.description}
                </p>
              </div>

              {/* Status Indicator */}
              <div
                className={`mt-6 pt-3.5 border-t text-xs font-bold flex items-center justify-between ${
                  isSelected
                    ? 'border-white/20 text-sky-200'
                    : 'border-slate-100 dark:border-slate-700/60 text-blue dark:text-sky-400'
                }`}
              >
                <span>Department Milestone</span>
                <span className="text-[10px] uppercase font-semibold">Verified Archive</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DepartmentTimeline;
