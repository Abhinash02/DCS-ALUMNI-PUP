import React, { useState, useEffect, useCallback } from 'react';
import {
  Award,
  ShieldCheck,
  Sparkles,
  Binary,
  FileCheck,
  Layers,
  Eye,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from 'lucide-react';

const innovations = [
  {
    id: 1,
    title: 'Indian Sign Language (ISL) 3D Animation System',
    type: 'Patented Technology',
    regNo: 'SW-12425/2019 & SW-11865/2018',
    inventors: 'Prof. (Dr.) Vishal Goyal & Dr. Lalit Goyal',
    description:
      'Pioneering assistive technology that translates English text and speech into synthetic 3D animated avatars performing Indian Sign Language for hearing-impaired people.',
    tag: 'Assistive AI',
    icon: Binary,
    tagColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  },
  {
    id: 2,
    title: 'Hindi to Punjabi Machine Translation System',
    type: 'Government Copyright',
    regNo: 'SW-4764/2011 (Govt. of India)',
    inventors: 'Prof. (Dr.) G. S. Lehal & Prof. (Dr.) Vishal Goyal',
    description:
      'National award-winning translation system providing high-accuracy automated transliteration and semantic translation from Hindi into Punjabi.',
    tag: 'NLP & Translation',
    icon: Layers,
    tagColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-sky-300',
  },
  {
    id: 3,
    title: 'Gurmukhi & Sindhi Optical Character Recognition (OCR)',
    type: 'Proprietary Research Tool',
    regNo: 'UGC-SAP & MeitY Funded',
    inventors: 'Prof. (Dr.) G. S. Lehal & Research Scholars',
    description:
      'Benchmark OCR system capable of scanning, extracting, and digitizing printed and handwritten Gurmukhi script and degraded archival manuscripts.',
    tag: 'Computer Vision',
    icon: Eye,
    tagColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  {
    id: 4,
    title: 'Punjabi Word Processor & Intelligent Spell Checker',
    type: 'Software Copyright',
    regNo: 'Official Punjab State Adoption',
    inventors: 'Prof. (Dr.) G. S. Lehal',
    description:
      'First full-fledged linguistic software suite designed for the Punjabi language, providing morphological analysis, spell-checking, and layout editing.',
    tag: 'Language Processing',
    icon: FileCheck,
    tagColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  {
    id: 5,
    title: 'Plagiarism Detection Tool for Indian Languages',
    type: 'MeitY Funded Project',
    regNo: 'Ministry of Electronics & IT',
    inventors: 'Prof. (Dr.) Vishal Goyal',
    description:
      'Advanced semantic plagiarism detection engine engineered for Indian multilingual documents, with dedicated focus on Hindi and Punjabi academic corpora.',
    tag: 'Information Security',
    icon: ShieldCheck,
    tagColor: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  },
  {
    id: 6,
    title: 'Janchak: State Typing Test Evaluation Platform',
    type: 'State Utility Software',
    regNo: 'Used in Punjab Government Recruitment',
    inventors: 'Department of Computer Science',
    description:
      'Official typing speed and accuracy evaluation software widely deployed across Punjab government bodies, schools, and recruitment boards.',
    tag: 'State Software',
    icon: Award,
    tagColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  },
];

export const ResearchInnovations = () => {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDir, setSlideDir] = useState('next');
  const [touchStartX, setTouchStartX] = useState(null);
  const [dragOffset, setDragOffset] = useState(0);

  const total = innovations.length;

  const triggerNext = useCallback(() => {
    if (isSliding) return;
    setSlideDir('next');
    setIsSliding(true);
    setTimeout(() => {
      setMobileIndex((prev) => (prev + 1) % total);
      setIsSliding(false);
      setDragOffset(0);
    }, 320);
  }, [isSliding, total]);

  const triggerPrev = useCallback(() => {
    if (isSliding) return;
    setSlideDir('prev');
    setIsSliding(true);
    setTimeout(() => {
      setMobileIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
      setIsSliding(false);
      setDragOffset(0);
    }, 320);
  }, [isSliding, total]);

  const jumpToCard = (idx) => {
    if (isSliding || idx === mobileIndex) return;
    setSlideDir(idx > mobileIndex ? 'next' : 'prev');
    setIsSliding(true);
    setTimeout(() => {
      setMobileIndex(idx);
      setIsSliding(false);
      setDragOffset(0);
    }, 320);
  };

  // 5s Auto-swipe for mobile 3D card deck
  useEffect(() => {
    if (isPaused || isSliding) return;

    const timer = setInterval(() => {
      triggerNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused, isSliding, triggerNext]);

  // Touch gesture handlers for mobile swipe
  const handleTouchStart = (e) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    setIsPaused(false);
    if (dragOffset < -50) {
      triggerNext();
    } else if (dragOffset > 50) {
      triggerPrev();
    }
    setTouchStartX(null);
    setDragOffset(0);
  };

  return (
    <section className="w-full max-w-[95%] md:max-w-[85%] mx-auto -mt-16 sm:-mt-24 pt-0 pb-10 sm:pb-14">
      {/* SECTION HEADER */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue/10 dark:bg-sky-400/10 border border-blue/20 dark:border-sky-400/20 text-blue dark:text-sky-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue dark:text-sky-400 animate-pulse" />
          <span>Pioneering Research & Intellectual Property</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-darkBlue dark:text-white font-mons tracking-tight">
          Groundbreaking Innovations <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue via-sky-500 to-indigo-600 bg-clip-text text-transparent">
            Born at DCS PUP
          </span>
        </h2>

        <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-poppins">
          Internationally recognized computational linguistic software, patents, and assistive systems engineered by department faculty and scholars.
        </p>
      </div>

      {/* MOBILE 3D LAYERED CARD DECK (Unique depth-stacked cards with auto-shuffle) */}
      <div className="block md:hidden">
        {/* Category Jump Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none px-1 mb-3">
          {innovations.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => jumpToCard(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                mobileIndex === idx
                  ? 'bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 font-extrabold shadow-md scale-105'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              {item.tag}
            </button>
          ))}
        </div>

        {/* 3D Stack Container */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative w-full h-[370px] select-none touch-pan-y"
        >
          {innovations.map((item, index) => {
            const Icon = item.icon;
            const offset = (index - mobileIndex + total) % total;

            // Only render visible cards in stack (top 3 + exiting card)
            if (offset > 2 && !(isSliding && offset === 3)) return null;

            let cardStyle = {};
            const isTop = offset === 0;

            if (isSliding && isTop) {
              cardStyle = {
                transform: slideDir === 'next'
                  ? 'translate3d(-110%, 15px, 0) rotate(-14deg)'
                  : 'translate3d(110%, 15px, 0) rotate(14deg)',
                opacity: 0,
                zIndex: 40,
                pointerEvents: 'none',
              };
            } else if (isSliding) {
              if (offset === 1) {
                cardStyle = {
                  transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
                  opacity: 1,
                  zIndex: 30,
                };
              } else if (offset === 2) {
                cardStyle = {
                  transform: 'translate3d(0, 14px, 0) scale(0.95) rotate(-1.5deg)',
                  opacity: 0.8,
                  zIndex: 20,
                };
              } else if (offset === 3) {
                cardStyle = {
                  transform: 'translate3d(0, 26px, 0) scale(0.90) rotate(1.5deg)',
                  opacity: 0.45,
                  zIndex: 10,
                };
              }
            } else if (isTop && dragOffset !== 0) {
              cardStyle = {
                transform: `translate3d(${dragOffset}px, 0, 0) rotate(${dragOffset * 0.05}deg)`,
                opacity: Math.max(0.4, 1 - Math.abs(dragOffset) / 320),
                zIndex: 30,
                pointerEvents: 'auto',
              };
            } else {
              if (offset === 0) {
                cardStyle = {
                  transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
                  opacity: 1,
                  zIndex: 30,
                  pointerEvents: 'auto',
                };
              } else if (offset === 1) {
                cardStyle = {
                  transform: 'translate3d(0, 14px, 0) scale(0.95) rotate(-1.5deg)',
                  opacity: 0.8,
                  zIndex: 20,
                  pointerEvents: 'none',
                };
              } else if (offset === 2) {
                cardStyle = {
                  transform: 'translate3d(0, 26px, 0) scale(0.90) rotate(1.5deg)',
                  opacity: 0.45,
                  zIndex: 10,
                  pointerEvents: 'none',
                };
              }
            }

            return (
              <div
                key={item.id}
                style={cardStyle}
                className={`absolute inset-x-0 top-0 bg-white dark:bg-slate-800/95 rounded-3xl p-6 shadow-2xl border border-slate-200/90 dark:border-slate-700/80 flex flex-col justify-between overflow-hidden transition-all duration-300 ease-out ${
                  isTop ? 'cursor-grab active:cursor-grabbing ring-1 ring-blue/20' : ''
                }`}
              >
                {/* Glowing subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue/5 via-sky-400/5 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  {/* Top Badge & Deck Number */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="inline-flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border border-current/15 ${item.tagColor}`}
                      >
                        {item.tag}
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-slate-500">
                        0{index + 1} / 0{total}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-2xl bg-blue/10 dark:bg-sky-400/10 text-blue dark:text-sky-300 flex items-center justify-center shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mons tracking-tight leading-snug">
                    {item.title}
                  </h3>

                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-[11px] font-semibold text-blue dark:text-sky-300 border border-slate-200/80 dark:border-slate-600/50">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{item.type}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-600 dark:text-slate-300 font-mono text-[10px] truncate max-w-[150px]">{item.regNo}</span>
                  </div>

                  <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-poppins min-h-[52px]">
                    {item.description}
                  </p>
                </div>

                {/* Inventors Footer */}
                <div className="relative z-10 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                      Chief Investigator / Author
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs">
                      {item.inventors}
                    </span>
                  </div>

                  <div className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
                    Official IP
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Deck Navigation Controls & Auto-swipe Indicator */}
        <div className="mt-4 px-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Deck {mobileIndex + 1} of {total}
            </span>

            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[10px] text-slate-600 dark:text-slate-300 transition font-medium border border-slate-200/80 dark:border-slate-700"
              title={isPaused ? 'Resume auto-swipe' : 'Pause auto-swipe'}
            >
              {isPaused ? <Play className="w-2.5 h-2.5" /> : <Pause className="w-2.5 h-2.5" />}
              <span>{isPaused ? 'Paused' : '5s Auto'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* 6 Indicator Dots */}
            <div className="flex items-center gap-1.5 mr-2">
              {innovations.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => jumpToCard(idx)}
                  aria-label={`Jump to card ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    mobileIndex === idx
                      ? 'w-5 bg-blue dark:bg-sky-400'
                      : 'w-1.5 bg-slate-300 dark:bg-slate-600'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={triggerPrev}
              aria-label="Previous card"
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={triggerNext}
              aria-label="Next card"
              className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP/LAPTOP CARDS GRID (Attractive 6-box view) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {innovations.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.id}
              className="group relative bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-lg hover:shadow-2xl border border-slate-100 dark:border-slate-700/60 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden"
            >
              {/* Subtle hover gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue/5 via-sky-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div>
                {/* Top Badge & Category */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border border-current/15 ${item.tagColor}`}
                  >
                    {item.tag}
                  </span>
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-blue dark:text-sky-400 shadow-inner">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mons tracking-tight group-hover:text-blue dark:group-hover:text-sky-300 transition-colors">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs font-semibold text-blue dark:text-sky-400">
                  {item.type} • <span className="text-slate-500 dark:text-slate-400">{item.regNo}</span>
                </p>

                <p className="mt-2.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-poppins">
                  {item.description}
                </p>
              </div>

              {/* Inventors Footer */}
              <div className="mt-6 pt-3.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                    Chief Investigator / Author
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 text-xs">
                    {item.inventors}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ResearchInnovations;
