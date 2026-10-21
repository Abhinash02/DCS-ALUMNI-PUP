import React from 'react'
import ParallaxSection from '../components/ParallaxSection'
import { Team } from '../components/Team'
import JobBoard from './JobBoard'
import StatsCounter from '../components/common/StatsCounter'
import DepartmentTimeline from '../components/common/DepartmentTimeline'
import ResearchInnovations from '../components/common/ResearchInnovations'
import CorporatePartners from '../components/common/CorporatePartners'
import { BookOpen, Quote, Award, Sparkles } from 'lucide-react'

export const Home = () => {
    return (
        <div className='w-full bg-no-repeat h-full mt-20 flex flex-col gap-24 sm:gap-32' >
            {/* HERO BANNER */}
            <div className='relative w-full h-full'>
                <div className='w-full mt-20'>
                    <img src='/images/banner.png' alt='students' className='w-full hidden md:block' />
                    <img src='/images/banner-mobile.png' alt='students' className='w-full md:hidden' />
                </div>
                <div className='absolute inset-0 flex flex-col justify-start pt-9 items-center text-center bg-white/50 dark:bg-slate-950/70 dark:backdrop-blur-[2px] transition-colors'>
                    <h1 className='text-4xl xs:text-5xl sm:text-6xl lg:text-8xl leading-none font-extrabold font-mons uppercase text-[#0091CD] dark:text-sky-400 dark:drop-shadow-[0_0_35px_rgba(56,189,248,0.4)] animate-fadeInTop'>
                        Celebrating <br />Excellence
                    </h1>
                    <h3 className='xs:text-xl sm:text-2xl lg:text-3xl italic font-bold text-slate-900 dark:text-white mt-4 drop-shadow-sm'>
                        {Array.from(`"Honoring Our Distinguished Alumni"`).map((char, index) => (
                            <span
                                key={index}
                                className="inline-block opacity-0 animate-typedLetter"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {char === ' ' ? '\u00A0' : char}
                            </span>
                        ))}
                    </h3>
                </div>
            </div>

            {/* Key Department & Alumni Statistics */}
            <StatsCounter />

            <div className='max-w-[95%] md:max-w-[85%] mx-auto flex flex-col gap-24 sm:gap-32'>
                {/* 1. OUR STORY SECTION */}
                <div className='grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center'>
                    {/* Left: Crest Showcase Card with Ambient Glow */}
                    <div className='md:col-span-5 hidden md:flex items-center justify-center p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-slate-50 to-blue/5 dark:from-slate-800/80 dark:to-slate-800/30 border border-slate-200/80 dark:border-slate-700/60 shadow-xl relative overflow-hidden group'>
                        <div className='absolute -inset-2 bg-gradient-to-r from-blue/20 via-sky-400/20 to-indigo-500/20 blur-2xl opacity-0 group-hover:opacity-100 dark:opacity-40 dark:group-hover:opacity-75 transition-opacity duration-500 pointer-events-none' />
                        <img src='/images/logo.png' alt='Punjabi University Crest' className='w-full max-w-[260px] drop-shadow-xl relative z-10 filter dark:brightness-110' />
                    </div>

                    {/* Right: Narrative & Highlights */}
                    <div className='md:col-span-7 flex flex-col gap-5 items-center md:items-start text-center md:text-left'>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue/10 dark:bg-sky-400/10 border border-blue/20 dark:border-sky-400/20 text-blue dark:text-sky-300 text-xs font-bold uppercase tracking-wider shadow-xs">
                            <BookOpen className="w-3.5 h-3.5 text-blue dark:text-sky-400" />
                            <span>Heritage & Academic Legacy</span>
                        </div>

                        <h3 className='text-3xl sm:text-4xl lg:text-5xl font-mons uppercase font-extrabold text-darkBlue dark:text-white tracking-tight'>
                            Our <span className="bg-gradient-to-r from-blue via-sky-500 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">Story</span>
                        </h3>

                        {/* Mobile Crest */}
                        <div className='md:hidden p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 shadow-md size-36 flex items-center justify-center mx-auto my-2'>
                            <img src='/images/logo.png' alt='Punjabi University Crest' className='w-full h-full object-contain filter dark:brightness-110' />
                        </div>

                        <p className='text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-poppins text-justify'>
                            Punjabi University, Patiala, founded under Punjab Act No. 35 of 1961 and inaugurated by Dr. S. Radhakrishnan on June 24, 1962, stands as a beacon of educational excellence. Established with the aim of promoting the Punjabi language, art, and literature, the University has grown into the largest in the state. As we celebrate our rich history and remarkable achievements, we take pride in honoring our distinguished alumni who have made significant contributions to society. Our campus now supports a vibrant community of over 14,000 students across various disciplines, from Humanities and Arts to Sciences and Engineering. This website is dedicated to recognizing and celebrating the accomplishments of our alumni, who continue to inspire and lead in diverse fields around the world.
                        </p>

                        <div className="pt-2 flex flex-wrap gap-2.5 justify-center md:justify-start text-xs font-semibold">
                            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80">
                                Est. 1962 • Punjab Act No. 35
                            </span>
                            <span className="px-3 py-1 rounded-full bg-blue/10 dark:bg-sky-400/10 text-blue dark:text-sky-300 border border-blue/20 dark:border-sky-400/20">
                                NAAC "A+" Grade (CGPA 3.37)
                            </span>
                            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                14,000+ Campus Community
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. WORDS OF WISDOM (HOD DESK) */}
                <div className='grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center'>
                    {/* Left/Main Column: Quote Card */}
                    <div className='md:col-span-8 flex flex-col gap-4'>
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 dark:bg-amber-400/10 border border-amber-500/20 dark:border-amber-400/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider self-start shadow-xs">
                            <Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                            <span>Head of Department Address</span>
                        </div>

                        <h3 className='text-3xl sm:text-4xl lg:text-5xl font-mons font-bold text-darkBlue dark:text-white tracking-tight'>
                            Words of <span className='font-extrabold bg-gradient-to-r from-amber-500 via-sky-500 to-blue dark:from-amber-400 dark:via-sky-400 dark:to-blue-300 bg-clip-text text-transparent'>WISDOM</span>
                        </h3>

                        {/* Mobile Avatar */}
                        <div className='md:hidden flex flex-col items-center mx-auto my-3'>
                            <div className='p-1 rounded-full bg-gradient-to-tr from-amber-400 via-sky-400 to-blue shadow-xl'>
                                <img src='/images/HOD.jpg' alt='Dr. Gagandeep' className='rounded-full size-36 object-cover border-2 border-white dark:border-slate-800' />
                            </div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-white font-mons mt-2">Dr. Gagandeep</h4>
                            <p className="text-xs text-blue dark:text-sky-400 font-semibold">Head & Professor • DCS PUP</p>
                        </div>

                        {/* Executive Quote Card */}
                        <div className='relative rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-xl backdrop-blur-md overflow-hidden'>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 dark:bg-sky-400/10 rounded-full blur-3xl pointer-events-none" />
                            <Quote className="w-8 h-8 text-blue/20 dark:text-sky-400/20 mb-3" />

                            <div className='text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-poppins space-y-3 text-justify relative z-10'>
                                <p>
                                    <strong className="text-slate-900 dark:text-white font-semibold">Dear alumni,</strong>
                                </p>
                                <p>
                                    We extend our heartfelt congratulations to each one of you who has carved a successful path in the IT sector. Your dedication, innovation, and resilience have not only brought you personal success but have also added immense pride to the Department of Computer Science at Punjabi University, Patiala.
                                </p>
                                <p>
                                    Each of you represents the spirit of our institution, and seeing you excel in your careers fills us with joy and admiration. Your achievements set a powerful example for current students, showing them what can be accomplished through hard work and passion.
                                </p>
                                <p>
                                    We consider you invaluable members of our university community and are grateful for the inspiration you provide. Remember, you are always welcome to return, share your knowledge, and reconnect with us. We look forward to celebrating many more milestones with you in the future.
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                                <div>
                                    <span className="font-extrabold text-slate-900 dark:text-white text-sm block font-mons">
                                        Dr. Gagandeep
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                                        Head & Professor • Department of Computer Science, Punjabi University, Patiala
                                    </span>
                                </div>
                                <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs shrink-0">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Leadership Desk</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Desktop Portrait) */}
                    <div className='md:col-span-4 hidden md:flex flex-col items-center justify-center shrink-0'>
                        <div className='relative p-1.5 rounded-3xl bg-gradient-to-tr from-amber-400 via-sky-400 to-blue shadow-2xl group transition-all duration-300 hover:shadow-blue/20'>
                            <div className='overflow-hidden rounded-2.5xl w-full max-w-[280px]'>
                                <img src='/images/hodMaam.jpg' alt='Dr. Gagandeep' className='w-full h-auto object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500' />
                            </div>
                        </div>
                        <div className="mt-3.5 text-center">
                            <h4 className="text-base font-bold text-slate-900 dark:text-white font-mons">Dr. Gagandeep</h4>
                            <p className="text-xs text-blue dark:text-sky-400 font-semibold mt-0.5">Head & Professor • DCS PUP</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 1. Department Heritage & Interactive Milestone Timeline */}
            <DepartmentTimeline />

            {/* 2. Research Breakthroughs, Patents & Copyrighted Software */}
            <ResearchInnovations />

            {/* 3. Official Corporate Partnerships & Campus Recruiters */}
            <CorporatePartners />

            <div>
                <ParallaxSection />
            </div>

            <Team />
            <div className="-mt-10 md:-mt-24">
                <JobBoard isComponent={true} />
            </div>



        </div>
    )
}
