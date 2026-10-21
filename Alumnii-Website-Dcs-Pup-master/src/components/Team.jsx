import React, { useState } from "react";
import { FaLinkedinIn } from "react-icons/fa";
import { Sparkles, Code2, GraduationCap, Building2, UserCheck, ShieldCheck } from "lucide-react";

const members = [
  {
    id: 1,
    category: "faculty",
    img: "/images/vishalSir.jpg",
    name: "Dr. Vishal Goyal",
    title: "Professor & Project Mentor",
    courseSession: "Faculty & Research Mentor",
    roleBadge: "Project Mentor",
    badgeStyle: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    institution: "Department of Computer Science",
    university: "Punjabi University, Patiala",
    linkedIn: "https://www.linkedin.com/in/vishal-goyal-0012516/",
    bio: "Visionary academic leader guiding the digital transformation and global alumni outreach of DCS PUP.",
    highlightIcon: ShieldCheck,
  },
  {
    id: 2,
    category: "faculty",
    img: "/images/vipinKumar.jpg",
    name: "Mr. Vipin Kumar",
    title: "Technical Assistant",
    courseSession: "Department Technical Support",
    roleBadge: "Technical Support",
    badgeStyle: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    institution: "Department of Computer Science",
    university: "Punjabi University, Patiala",
    bio: "Providing critical technical infrastructure and administrative support for portal continuity.",
    highlightIcon: Building2,
  },
  {
    id: 3,
    category: "development",
    img: "/images/abhinash_alumni_lisst.jpg",
    name: "Abhinash",
    title: "Team Lead & Full Stack Developer",
    courseSession: "MCA • Session 2023–2025",
    roleBadge: "Team Lead",
    badgeStyle: "bg-blue/10 text-blue dark:bg-sky-400/10 dark:text-sky-300 border-blue/20 dark:border-sky-400/20",
    institution: "Department of Computer Science",
    university: "Punjabi University, Patiala",
    linkedIn: "https://www.linkedin.com/in/abhinash99/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    bio: "Architecting end-to-end portal full-stack architecture, secure REST APIs, and administrative modules.",
    highlightIcon: Code2,
  },
  {
    id: 4,
    category: "development",
    img: "/images/harman.jpg",
    name: "Harmandeep Singh",
    title: "Team Lead & Developer",
    courseSession: "MCA • Session 2023–2025",
    roleBadge: "Team Lead",
    badgeStyle: "bg-blue/10 text-blue dark:bg-sky-400/10 dark:text-sky-300 border-blue/20 dark:border-sky-400/20",
    institution: "Department of Computer Science",
    university: "Punjabi University, Patiala",
    linkedIn: "https://www.linkedin.com/in/harmandeep-singh-saggu-8562a12b4/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app",
    bio: "Spearheading modern frontend engineering, mobile responsiveness, and dynamic user interfaces.",
    highlightIcon: Code2,
  },
  {
    id: 5,
    category: "development",
    img: "/images/kanika.jpg",
    name: "Kanika Bhatia",
    title: "Frontend Developer",
    courseSession: "MCA • Session 2024–2026",
    roleBadge: "Core Developer",
    badgeStyle: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    institution: "Department of Computer Science",
    university: "Punjabi University, Patiala",
    linkedIn: "https://www.linkedin.com/in/kanika-bhatia08/",
    bio: "Crafting intuitive alumni experience components, responsive layouts, and interactive form workflows.",
    highlightIcon: GraduationCap,
  },
  {
    id: 6,
    category: "development",
    img: "/images/purvak.jpg",
    name: "Purvak Jindal", 
    title: "Developer",
    courseSession: "MCA • Session 2024–2026",
    roleBadge: "Core Developer",
    badgeStyle: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    institution: "Department of Computer Science",
    university: "Punjabi University, Patiala",
    linkedIn: "https://www.linkedin.com/in/purvak-jindal-6741682a1?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    bio: "Engineering backend database queries, alumni directories, and portal performance optimization.",
    highlightIcon: Code2,
  },
];

function TeamCard({ member, index }) {
  const HighlightIcon = member.highlightIcon || UserCheck;

  return (
    <div
      className="group relative bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-lg hover:shadow-2xl border border-slate-100 dark:border-slate-700/60 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center text-center overflow-hidden"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      {/* Background ambient hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue/5 via-sky-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Top Role Badge */}
      <div className="w-full flex justify-between items-center mb-4 relative z-10">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${member.badgeStyle}`}
        >
          <HighlightIcon className="w-3.5 h-3.5" />
          <span>{member.roleBadge}</span>
        </span>
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          #0{index + 1}
        </span>
      </div>

      {/* Profile Photo Frame with Glowing Ring */}
      <div className="relative mb-4 z-10">
        <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-blue via-sky-400 to-indigo-500 shadow-md group-hover:shadow-blue/30 group-hover:scale-105 transition-all duration-300">
          <img
            src={member.img}
            alt={member.name}
            className="w-full h-full rounded-full object-cover border-4 border-white dark:border-slate-800"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/user.png";
            }}
          />
        </div>
        {/* Active verified dot */}
        <div
          className="absolute bottom-1 right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800 shadow-sm flex items-center justify-center"
          title="Active Contributor"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        </div>
      </div>

      {/* Name & Academic Title */}
      <div className="relative z-10 flex-1 flex flex-col items-center w-full">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-mons tracking-tight group-hover:text-blue dark:group-hover:text-sky-300 transition-colors">
          {member.name}
        </h3>
        <p className="text-xs sm:text-sm font-semibold text-blue dark:text-sky-400 mt-0.5">
          {member.title}
        </p>

        {/* Course / Program & Session inside the card box */}
        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue/5 dark:bg-sky-400/10 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-blue/15 dark:border-sky-400/20">
          <GraduationCap className="w-3.5 h-3.5 text-blue dark:text-sky-400 shrink-0" />
          <span>{member.courseSession}</span>
        </div>

        {/* Department & Punjabi University Patiala inside the card box */}
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-snug max-w-[260px]">
          <p className="font-medium text-slate-600 dark:text-slate-300">{member.institution}</p>
          <p className="font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{member.university}</p>
        </div>

        {/* Short Contribution Bio */}
        {member.bio && (
          <p className="text-[11px] text-slate-400 dark:text-slate-400/80 max-w-[260px] mt-2 italic leading-snug">
            "{member.bio}"
          </p>
        )}
      </div>

      {/* LinkedIn Connect Button / Staff Tag */}
      <div className="relative z-10 mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-700/60 w-full flex justify-center">
        {member.linkedIn ? (
          <a
            href={member.linkedIn}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue/10 hover:bg-[#0A66C2] text-darkBlue hover:text-white dark:bg-sky-400/10 dark:text-sky-300 dark:hover:text-white dark:hover:bg-[#0A66C2] text-xs font-bold tracking-wide transition-all duration-300 shadow-sm hover:shadow-md active:scale-95 group/btn"
          >
            <FaLinkedinIn className="w-3.5 h-3.5 text-[#0A66C2] group-hover/btn:text-white dark:text-sky-300 dark:group-hover/btn:text-white transition-colors" />
            <span>Connect on LinkedIn</span>
          </a>
        ) : (
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>Department Staff</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Team() {
  const [activeTab, setActiveTab] = useState("all");

  const filteredMembers =
    activeTab === "all"
      ? members
      : members.filter((member) => member.category === activeTab);

  return (
    <section className="w-full max-w-[95%] md:max-w-[85%] mx-auto pt-2 sm:pt-4 pb-12 sm:pb-16 animate-fadeInTop">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue/10 dark:bg-sky-400/10 border border-blue/20 dark:border-sky-400/20 text-blue dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue dark:text-sky-400 animate-pulse" />
          <span>Core Development & Mentorship Team • Session 2024–26</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-darkBlue dark:text-white font-mons tracking-tight">
          The Driving Force <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue via-sky-500 to-indigo-600 bg-clip-text text-transparent">
            Behind The DCS Portal
          </span>
        </h2>

        <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-poppins">
          Guided by visionary departmental mentorship and engineered with passion by postgraduate computer science students to connect thousands of alumni worldwide.
        </p>

        {/* INTERACTIVE CATEGORY TABS */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm ${activeTab === "all"
                ? "bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 shadow-md scale-105"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
          >
            All Contributors ({members.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("faculty")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm ${activeTab === "faculty"
                ? "bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 shadow-md scale-105"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
          >
            Faculty & Mentors (2)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("development")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 shadow-sm ${activeTab === "development"
                ? "bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 shadow-md scale-105"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
          >
            Development Team (4)
          </button>
        </div>
      </div>

      {/* TEAM CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredMembers.map((member, index) => (
          <TeamCard key={member.id} member={member} index={index} />
        ))}
      </div>
    </section>
  );
}

export default Team;