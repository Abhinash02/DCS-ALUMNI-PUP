import React, { useState, useEffect, useRef } from 'react';
import { FaUserGraduate, FaBuilding, FaGlobeAmericas, FaAward } from 'react-icons/fa';

const statsData = [
  {
    id: 1,
    target: 1500,
    suffix: '+',
    label: 'Verified Alumni',
    subtext: 'Graduates connected worldwide',
    icon: FaUserGraduate,
    color: 'from-blue-600 to-sky-400',
    iconBg: 'bg-white/15 text-white',
  },
  {
    id: 2,
    target: 300,
    suffix: '+',
    label: 'Hiring Companies',
    subtext: 'Global tech giants & startups',
    icon: FaBuilding,
    color: 'from-indigo-600 to-blue-500',
    iconBg: 'bg-white/15 text-white',
  },
  {
    id: 3,
    target: 20,
    suffix: '+',
    label: 'Global Nations',
    subtext: 'Alumni spread across 5 continents',
    icon: FaGlobeAmericas,
    color: 'from-cyan-600 to-teal-400',
    iconBg: 'bg-white/15 text-white',
  },
  {
    id: 4,
    target: 38,
    suffix: '+',
    label: 'Years of Legacy',
    subtext: 'Pioneering CS education since 1987',
    icon: FaAward,
    color: 'from-amber-600 to-yellow-400',
    iconBg: 'bg-white/15 text-white',
  },
];

const CounterCard = ({ stat, isVisible }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      // Ease out quad
      const progress = frame / totalFrames;
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (stat.target - start) * easeProgress);

      setCount(currentVal);

      if (frame >= totalFrames) {
        clearInterval(timer);
        setCount(stat.target);
      }
    }, frameRate);

    return () => clearInterval(timer);
  }, [isVisible, stat.target]);

  const Icon = stat.icon;

  return (
    <div className="relative group bg-gradient-to-br from-darkBlue via-[#004875] to-darkBlueAlt text-white backdrop-blur-md rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 border border-white/15 overflow-hidden flex flex-col items-center text-center">
      {/* Subtle hover gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-sky-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* Icon Badge */}
      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-4 transition-transform duration-300 group-hover:scale-110 shadow-md ${stat.iconBg}`}>
        <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
      </div>

      {/* Animated Number in Pure White */}
      <div className="text-xl xs:text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white flex items-center justify-center drop-shadow-sm">
        <span className="text-white">{count.toLocaleString()}</span>
        <span className="text-white ml-0.5">{stat.suffix}</span>
      </div>

      {/* Label in Pure White */}
      <h3 className="text-xs sm:text-base font-bold text-white mt-1 sm:mt-2 drop-shadow-sm">
        {stat.label}
      </h3>

      {/* Subtext */}
      <p className="text-[10px] sm:text-xs text-blue-100/90 mt-0.5 sm:mt-1 max-w-[170px] sm:max-w-[200px] leading-tight sm:leading-relaxed">
        {stat.subtext}
      </p>
    </div>
  );
};

export const StatsCounter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section ref={sectionRef} className="w-full max-w-[95%] md:max-w-[85%] mx-auto -mt-10 sm:-mt-20 relative z-20 px-1 sm:px-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
        {statsData.map((stat) => (
          <CounterCard key={stat.id} stat={stat} isVisible={isVisible} />
        ))}
      </div>
    </section>
  );
};

export default StatsCounter;
