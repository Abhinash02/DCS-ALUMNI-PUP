import React from 'react';
import { Building2, Award, CheckCircle2, TrendingUp, Handshake } from 'lucide-react';

const partners = [
  {
    name: 'Infosys Technologies',
    role: 'Advanced Partner',
    desc: 'Accredited under the Infosys Campus Connect Programme for industry-aligned computer science training.',
    badge: 'Campus Connect Advanced',
    color: 'from-blue-600 to-indigo-600',
  },
  {
    name: 'Tata Consultancy Services (TCS)',
    role: 'Academic Alliance',
    desc: 'Regular premier on-campus placement and collaborative technical workshops for DCS postgraduates.',
    badge: 'Strategic Academic Partner',
    color: 'from-cyan-600 to-blue-600',
  },
  {
    name: 'IBM Corporation',
    role: 'Enterprise Academic Partner',
    desc: 'Curriculum development and access to enterprise tools in cloud architecture and cognitive systems.',
    badge: 'Enterprise Alliance',
    color: 'from-indigo-600 to-purple-600',
  },
];

const recruitersRow1 = [
  'Infosys',
  'Tata Consultancy Services',
  'IBM',
  'Tech Mahindra',
  'Microsoft',
  'Amazon',
  'Cognizant',
  'Toyota North America',
  'Oracle',
  'Capgemini',
];

const recruitersRow2 = [
  'Wipro Technologies',
  'HCL Technologies',
  'Newgen Software',
  'ATOS',
  'Accenture',
  'Dell Technologies',
  'Samsung R&D',
  'L&T Technology Services',
  'Adobe',
  'Nagarro',
];

export const CorporatePartners = () => {
  return (
    <section className="w-full max-w-[95%] md:max-w-[85%] mx-auto -mt-16 sm:-mt-24 pt-0 pb-10 sm:pb-14">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue/10 dark:bg-sky-400/10 border border-blue/20 dark:border-sky-400/20 text-blue dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
          <Handshake className="w-3.5 h-3.5 text-blue dark:text-sky-400" />
          <span>Industry Accreditations & Placements</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-darkBlue dark:text-white font-mons tracking-tight">
          Official Corporate Partnerships <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue via-sky-500 to-indigo-600 bg-clip-text text-transparent">
            & Campus Recruiters
          </span>
        </h2>

        <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-poppins">
          Punjabi University Patiala DCS is an Advanced Partner of Infosys Technologies and holds strategic academic alliances with top multinational giants.
        </p>
      </div>

      {/* STRATEGIC ALLIANCE CARDS (2 in Row 1, 3rd Centered in Row 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {partners.map((partner, index) => {
          const isThird = index === 2;
          return (
            <div
              key={partner.name}
              className={`group relative bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-lg hover:shadow-2xl border border-slate-100 dark:border-slate-700/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden ${
                isThird ? 'md:col-span-2 md:max-w-xl md:mx-auto w-full' : ''
              }`}
            >
            <div className="absolute inset-0 bg-gradient-to-br from-blue/5 via-sky-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue/10 text-blue dark:bg-sky-400/10 dark:text-sky-300 border border-blue/20 dark:border-sky-400/20">
                  {partner.badge}
                </span>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-darkBlue to-blue text-white flex items-center justify-center shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-mons tracking-tight group-hover:text-blue dark:group-hover:text-sky-300 transition-colors">
                {partner.name}
              </h3>
              <p className="text-xs font-bold text-blue dark:text-sky-400 mt-0.5">
                {partner.role}
              </p>

              <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-poppins">
                {partner.desc}
              </p>
            </div>

            <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Official University Partnership</span>
            </div>
          </div>
        );
      })}
      </div>

      {/* RECRUITERS TICKER / CHIP GRID */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-blue/5 dark:from-slate-800/80 dark:to-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white font-mons">
              Trusted by 300+ Global Tech Employers
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Top multinational companies hiring our MCA, M.Tech, and Ph.D. graduates regularly
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>High Placement Track Record</span>
          </div>
        </div>

        {/* MARQUEE TICKER LAYOUT */}
        <div className="relative overflow-hidden py-1 space-y-3">
          {/* Edge gradient fade masks for clean visual integration */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-50 dark:from-slate-800 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-50 dark:from-slate-800 to-transparent z-10" />

          {/* Row 1: Leftward scroll */}
          {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
          <marquee
            behavior="scroll"
            direction="left"
            scrollamount="7"
            onMouseEnter={(e) => e.currentTarget.stop && e.currentTarget.stop()}
            onMouseLeave={(e) => e.currentTarget.start && e.currentTarget.start()}
            className="py-1 block"
          >
            <div className="inline-flex items-center gap-3">
              {recruitersRow1.map((recruiter) => (
                <div
                  key={recruiter}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-blue/50 dark:hover:border-sky-400/50 hover:shadow-md transition-all duration-200 cursor-pointer select-none"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue/10 dark:bg-sky-400/10 flex items-center justify-center text-blue dark:text-sky-400 shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                    {recruiter}
                  </span>
                </div>
              ))}
            </div>
          </marquee>

          {/* Row 2: Rightward scroll */}
          {/* eslint-disable-next-line jsx-a11y/no-distracting-elements */}
          <marquee
            behavior="scroll"
            direction="right"
            scrollamount="6"
            onMouseEnter={(e) => e.currentTarget.stop && e.currentTarget.stop()}
            onMouseLeave={(e) => e.currentTarget.start && e.currentTarget.start()}
            className="py-1 block"
          >
            <div className="inline-flex items-center gap-3">
              {recruitersRow2.map((recruiter) => (
                <div
                  key={recruiter}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-blue/50 dark:hover:border-sky-400/50 hover:shadow-md transition-all duration-200 cursor-pointer select-none"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-400/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                    {recruiter}
                  </span>
                </div>
              ))}
            </div>
          </marquee>
        </div>
      </div>
    </section>
  );
};

export default CorporatePartners;
