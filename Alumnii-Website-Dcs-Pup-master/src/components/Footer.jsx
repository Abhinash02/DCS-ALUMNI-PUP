import React from 'react'
import { FiMail } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLink } from "react-icons/fa";
import { Link, NavLink } from 'react-router-dom';


export const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-darkBlue to-[#001c30] dark:from-[#0a1120] dark:via-[#070b14] dark:to-[#030712] text-[#fff] border-t border-slate-200/20 dark:border-slate-800/80 mt-12 transition-colors">
            <div className="mx-auto max-w-[95%] md:max-w-[85%] py-5 pt-10">
                <div className="lg:flex justify-between items-center">
                    <div className="flex flex-col gap-4">
                        <Link to="/">
                            <img src='/images/logo.png' className="filter dark:brightness-110" alt="Logo" />
                        </Link>
                        <p className='w-full lg:w-[85%] sm:mt-0 3xl:text-xl text-justify text-blue-100/90 dark:text-slate-300 font-normal leading-relaxed'>"Founded in 1962, Punjabi University, Patiala, is a leading institution promoting Punjabi language, culture, and education. It offers a wide range of academic programs and is committed to excellence in research and student development."</p>
                    </div>
                    <div className="grid grid-cols-2 sm:flex sm:flex-row gap-6 sm:gap-20 w-full justify-between sm:justify-start lg:justify-end font-mons mt-8 lg:mt-0">
                        <div>
                            <h2 className="mb-6 text-lg 3xl:text-2xl font-semibold uppercase">Explore</h2>
                            <ul className="font-medium 3xl:text-xl flex flex-col gap-2 md:gap-4 text-sm sm:text-base">
                                <li>
                                    <NavLink to="/" className="hover:border-b-2">Home</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/Alumni" className="hover:border-b-2">Alumni</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/Events" className="hover:border-b-2">Events</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/ReachUs" className="hover:border-b-2">Reach Us</NavLink>
                                </li>
                                <li>
                                   
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-lg 3xl:text-2xl font-semibold uppercase">Contact us</h2>
                            <ul className="font-medium flex flex-col gap-2 md:gap-4 3xl:text-xl text-xs sm:text-base">
                                <li className="flex items-center gap-2">
                                    <FiMail className="shrink-0" />
                                    <span className="break-all sm:break-normal">csepupalumni@gmail.com</span>
                                </li>
                                <li className='flex items-center gap-2'>
                                    <FaPhoneAlt className="shrink-0" />
                                    <span>+91-175-3046313</span>
                                </li>
                                <li>
                                    <Link to="https://punjabiuniversity.ac.in/pages/DepartmentPunjabi.aspx?dsenc=19" target='blank' className='flex items-center gap-2 hover:text-amber-300 transition'>
                                        <FaLink className="shrink-0" />
                                        <span>DCS Official Page</span>
                                    </Link>
                                </li>
                                <li>
                                    <a href="http://CSC.punjabiuniversity.ac.in" target='_blank' rel="noopener noreferrer" className='flex items-center gap-2 hover:text-amber-300 transition'>
                                        <FaLink className="shrink-0" />
                                        <span>CSC Department Portal</span>
                                    </a>
                                </li>
                                <div className="flex mt-2">
                                    <a href="https://www.linkedin.com/school/punjabi-university-patiala/" className="text-white hover:text-amber-300 text-xl transition" target='blank'>
                                        <FaLinkedin />
                                    </a>
                                    <a href="https://www.instagram.com/pbiunipatiala/profilecard/?igsh=emYyY3FueW1lbmxy" className="text-white hover:text-amber-300 text-xl ms-4 transition" target='blank'>
                                        <FaInstagram />
                                    </a>
                                </div>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className=" border-gray-200/30 sm:mx-auto my-6" />
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/90">
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span>Accredited with CGPA of 3.37 at "A+" Grade by NAAC</span>
                        </div>
                    
                    </div>
                    <span className="text-center sm:text-right">
                        ©{new Date().getFullYear()}{' '}
                        <a href="https://punjabiuniversity.ac.in" target="_blank" rel="noopener noreferrer" className="hover:underline font-semibold text-white">
                            Punjabi University, Patiala
                        </a>
                        . Department of Computer Science. All Rights Reserved.
                    </span>
                </div>
            </div>
        </footer>
    )
}
