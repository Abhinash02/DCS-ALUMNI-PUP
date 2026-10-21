import React from 'react';
import { Globe, Users, Award, ExternalLink, Sparkles, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GlobalAlumniSpotlight = () => {
  return (
    <section className="w-full max-w-[95%] md:max-w-[85%] mx-auto py-10 sm:py-16">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue/10 dark:bg-sky-400/10 border border-blue/20 dark:border-sky-400/20 text-blue dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
          <Globe className="w-3.5 h-3.5 text-blue dark:text-sky-400 animate-pulse" />
          <span>Global Reach & Overseas Chapters</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-darkBlue dark:text-white font-mons tracking-tight">
          Connecting Punjabi University Alumni <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue via-sky-500 to-indigo-600 bg-clip-text text-transparent">
            Across 20+ Continents & Countries
          </span>
        </h2>

        <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-poppins">
          From Silicon Valley to Toronto, London, and Singapore, our alumni community continues to inspire, mentor, and lead transformative tech initiatives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* CARD 1: NAPAA CHAPTER SPOTLIGHT */}
        <div className="relative bg-gradient-to-br from-darkBlue via-[#004875] to-darkBlueAlt text-white rounded-3xl p-7 sm:p-9 shadow-xl flex flex-col justify-between overflow-hidden border border-white/15">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/15 border border-white/20 text-white shadow-xs">
                Overseas Chapter • Established 2006
              </span>
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white backdrop-blur-sm">
                <Globe className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold font-mons tracking-tight text-white">
              NAPAA — North America Chapter
            </h3>
            <p className="text-sm font-semibold text-sky-200 mt-1">
              North America Punjabi University Alumni Association
            </p>

            <p className="mt-4 text-sm sm:text-base text-blue-100/90 leading-relaxed font-poppins">
              Founded to connect hundreds of graduates settled in the United States and Canada, NAPAA provides an energetic international forum for professional networking, overseas mentorship, and departmental developmental projects.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-left">
              <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-sm">
                <div className="text-xs text-sky-200 font-bold uppercase tracking-wider">Active Members</div>
                <div className="text-xl font-extrabold text-white mt-0.5">500+ Overseas</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-3.5 border border-white/10 backdrop-blur-sm">
                <div className="text-xs text-sky-200 font-bold uppercase tracking-wider">Key Regions</div>
                <div className="text-xl font-extrabold text-white mt-0.5">US & Canada</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-white/15 flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              Official Global Chapter
            </span>
            <Link
              to="/Alumni"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-darkBlue hover:bg-sky-100 text-xs font-bold transition shadow-sm active:scale-95"
            >
              <span>Explore Directory</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* CARD 2: FEATURED ALUMNI SPEAKER SPOTLIGHT */}
        <div className="relative bg-white dark:bg-slate-800/90 rounded-3xl p-7 sm:p-9 shadow-lg hover:shadow-xl border border-slate-100 dark:border-slate-700/60 flex flex-col justify-between overflow-hidden transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-xs">
                Distinguished Alumni Keynote
              </span>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue to-darkBlue text-white flex items-center justify-center text-xl font-bold font-mons shadow-md shrink-0">
                AC
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mons tracking-tight">
                  Mr. Amandeep Chanana
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-blue dark:text-sky-400">
                  Engineering Leader • Toyota, North America
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  MCA Passout (Batch 1997–2000)
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 dark:bg-slate-700/40 p-4 border border-slate-200/60 dark:border-slate-600/50 mt-3">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Special Keynote: "Evolution of Data"</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-poppins">
                "Returned to the Department of Computer Science campus to deliver an interactive guest lecture and mentorship seminar for postgraduate students on enterprise data pipelines and AI."
              </p>
            </div>

            <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-poppins">
              Our alumni routinely conduct guest lectures, placement mentoring, and technical workshops, creating direct pathways for students into top Fortune 500 corporations.
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-blue" />
              Alumni Mentorship Series
            </span>
            <Link
              to="/Events"
              className="inline-flex items-center gap-1.5 text-blue dark:text-sky-400 font-bold hover:underline"
            >
              <span>Upcoming Meets</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalAlumniSpotlight;
