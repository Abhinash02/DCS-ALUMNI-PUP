import React, { useState, useEffect } from 'react';
import API from '../api/api';
import { toast } from 'react-toastify';
import {
    MapPin,
    Navigation,
    ExternalLink,
    Send,
    Loader2,
    CheckCircle2,
} from 'lucide-react';

export const ReachUs = () => {
    const [formData, setFormData] = useState({
        from_fname: '',
        from_lname: '',
        from_email: '',
        message: '',
        selected_option: 'How Alumni Can Help Us', // Default dropdown title
    });

    const [popup, setPopup] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedName, setSubmittedName] = useState('');

    const dropdownOptions = [
        'Monitory Contribution',
        'Workshop',
        'Counselling',
        'Industrial Visit',
        'Mentoring Projects',
        'Placements',
        'Internships',
        'Other',
    ];

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Handle dropdown option selection
    const handleDropdownSelect = (option) => {
        setFormData((prevState) => ({
            ...prevState,
            selected_option: option,
        }));
        setDropdownOpen(false);
    };

    const sendEmail = async (e) => {
        e.preventDefault();

        // Ensure the dropdown has a valid selection
        if (formData.selected_option === 'How Alumni Can Help Us') {
            toast.warn('Please select how you would like to collaborate or help from the dropdown!');
            return;
        }

        // Validate form fields
        if (!formData.from_fname?.trim() || !formData.from_email?.trim() || !formData.message?.trim()) {
            toast.warn('Please fill out all required fields (First Name, Email, and Message)!');
            return;
        }

        setIsSubmitting(true);
        const senderFullName = `${formData.from_fname} ${formData.from_lname || ''}`.trim();

        try {
            // Submit to internal backend API (stores in MongoDB and sends notifications via backend nodemailer)
            const response = await API.post('/contact', formData, { timeout: 10000 });
            if (response.data?.success || response.status === 200) {
                setSubmittedName(senderFullName);
                setPopup(true);
                toast.success('Your message has been delivered successfully!');
            } else {
                throw new Error(response.data?.error || 'Failed to submit inquiry.');
            }
        } catch (error) {
            console.error('Contact submission error:', error);
            const errMsg = error.response?.data?.error || error.message;
            toast.error(errMsg || 'Unable to send message right now. Please email csepupalumni@gmail.com directly.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Close the popup and reset form fields
    const handleClosePopup = () => {
        setPopup(false);
        setFormData({
            from_fname: '',
            from_lname: '',
            from_email: '',
            message: '',
            selected_option: 'How Alumni Can Help Us',
        });
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.dropdown')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);


    return (
        <div className="max-w-[85%] mx-auto mt-28">
            <div>
                <h1 className="text-4xl sm:text-6xl font-extrabold font-mons py-4 text-darkBlue dark:text-white">
                    Get in <span className="bg-gradient-to-r from-blue via-sky-500 to-indigo-600 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">Touch!</span>
                </h1>
                <div className="flex flex-col lg:flex-row mx-auto justify-between gap-8 lg:gap-12 items-start">
                    {/* Left Column: Official Leadership & Verified Department Information */}
                    <div className="w-full lg:w-[48%] flex flex-col gap-6 mt-6 md:mt-10">
                        {/* Official Leadership Card */}
                        <div className="rounded-3xl bg-gradient-to-br from-darkBlue via-[#004875] to-darkBlueAlt text-white p-6 sm:p-8 shadow-xl border border-white/15 relative overflow-hidden">
                            <div className="flex items-center justify-between mb-4">
                                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/15 border border-white/20 text-white shadow-xs">
                                    NAAC "A+" Grade (CGPA 3.37)
                                </span>
                                <span className="text-xs text-sky-200 font-semibold">DCS PUP</span>
                            </div>

                            <h2 className="text-2xl font-extrabold font-mons text-white">
                                Department Leadership
                            </h2>
                            <p className="text-xs text-blue-100/90 mt-1">
                                Department of Computer Science, Punjabi University, Patiala
                            </p>

                            <div className="mt-5 space-y-4 text-xs sm:text-sm">
                                <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                                    <div className="text-[11px] uppercase font-bold text-sky-200 tracking-wider">Head of the Department</div>
                                    <div className="text-base font-extrabold text-white mt-0.5">Prof. (Dr.) Gagandeep</div>
                                    <div className="text-xs text-blue-100 mt-1 flex items-center gap-1.5">
                                        <span>Phone:</span>
                                        <a href="tel:01755136313" className="text-sky-300 font-semibold hover:underline">0175-5136313</a>
                                    </div>
                                </div>

                                <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                                    <div className="text-[11px] uppercase font-bold text-sky-200 tracking-wider">Website Liaison & Alumni Incharge</div>
                                    <div className="text-base font-extrabold text-white mt-0.5">Prof. (Dr.) Vishal Goyal</div>
                                    <div className="text-xs text-blue-100 mt-1">
                                        Professor, Department of Computer Science
                                    </div>
                                </div>

                                <div className="bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-sm">
                                    <div className="text-[11px] uppercase font-bold text-sky-200 tracking-wider">Official Department Subdomain</div>
                                    <a
                                        href="http://CSC.punjabiuniversity.ac.in"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-bold text-sky-300 hover:text-white transition flex items-center gap-1.5 mt-0.5"
                                    >
                                        <span>http://CSC.punjabiuniversity.ac.in</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Verified Contact Details Card */}
                        <div className="rounded-3xl bg-white dark:bg-slate-800/90 p-6 sm:p-7 shadow-lg border border-slate-100 dark:border-slate-700/60 text-slate-800 dark:text-slate-100">
                            <h3 className="text-lg font-bold font-mons text-slate-900 dark:text-white mb-4">
                                Verified Contact Information
                            </h3>

                            <div className="space-y-3.5 text-xs sm:text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="font-bold text-blue dark:text-sky-400 min-w-[70px]">Address:</span>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        Department of Computer Science, Punjabi University, Patiala - 147002, Punjab, India.
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-blue dark:text-sky-400 min-w-[70px]">Phone:</span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium">
                                        0175-5136313 / +91-175-3046313
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-blue dark:text-sky-400 min-w-[70px]">Alumni Email:</span>
                                    <a href="mailto:csepupalumni@gmail.com" className="text-blue dark:text-sky-400 hover:underline font-semibold">
                                        csepupalumni@gmail.com
                                    </a>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-blue dark:text-sky-400 min-w-[70px]">Hours:</span>
                                    <span className="text-slate-600 dark:text-slate-300">
                                        Monday – Friday, 9:00 AM – 5:00 PM IST
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Alumni Contact Form */}
                    {/* Right Column: Interactive Alumni Contact Form (Lowered nicely) */}
                    <form
                        className="w-full lg:w-[48%] text-md mt-6 lg:mt-10 font-medium bg-white/70 dark:bg-slate-800/80 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-lg backdrop-blur-sm"
                        onSubmit={sendEmail}
                        data-gramm="false"
                        data-enable-grammarly="false"
                        spellCheck="false"
                    >
                        <h2 className="text-2xl font-bold font-mons text-slate-900 dark:text-white mb-1">Send us a Message</h2>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">Have questions or want to collaborate? Fill out the form below and our team will get back to you promptly.</p>

                        <div className="mb-5 flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                id="fName"
                                className="shadow-xs rounded-xl focus:ring-2 focus:ring-darkBlue focus:border-darkBlue block w-full p-3.5 3xl:p-5 3xl:text-xl placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-lightBlue dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                                placeholder="First Name *"
                                name="from_fname"
                                value={formData.from_fname}
                                onChange={handleInputChange}
                                data-gramm="false"
                                data-enable-grammarly="false"
                                spellCheck="false"
                                autoComplete="given-name"
                                required
                            />
                            <input
                                type="text"
                                id="lName"
                                className="shadow-xs rounded-xl focus:ring-2 focus:ring-darkBlue focus:border-darkBlue block w-full p-3.5 3xl:p-5 3xl:text-xl placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-lightBlue dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                                placeholder="Last Name"
                                name="from_lname"
                                value={formData.from_lname}
                                onChange={handleInputChange}
                                data-gramm="false"
                                data-enable-grammarly="false"
                                spellCheck="false"
                                autoComplete="family-name"
                            />
                        </div>
                        <div className="mb-5">
                            <input
                                type="email"
                                id="email"
                                className="shadow-xs rounded-xl focus:ring-2 focus:ring-darkBlue focus:border-darkBlue block w-full p-3.5 3xl:p-5 3xl:text-xl placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-lightBlue dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                                placeholder="Email Address *"
                                name="from_email"
                                value={formData.from_email}
                                onChange={handleInputChange}
                                data-gramm="false"
                                data-enable-grammarly="false"
                                spellCheck="false"
                                autoComplete="email"
                                required
                            />
                        </div>
                        <div className="relative mb-5 dropdown">
                            <button
                                type="button"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className={`w-full bg-lightBlue dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-darkBlue text-darkBlue dark:text-sky-300 rounded-xl p-3.5 3xl:p-5 3xl:text-xl text-center flex justify-between items-center font-medium`}
                            >
                                <span>{formData.selected_option}</span>
                                <svg
                                    className="w-2.5 h-2.5 ms-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 10 6"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 4 4 4-4"
                                    />
                                </svg>
                            </button>
                            {dropdownOpen && (
                                <div className="absolute z-10 bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full border border-slate-200 dark:border-slate-700 mt-1 overflow-hidden">
                                    <ul className="text-slate-700 dark:text-slate-200 text-sm">
                                        {dropdownOptions.map((option, index) => (
                                             <li key={index}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDropdownSelect(option)}
                                                    className="block w-full text-left px-4 py-2.5 hover:bg-blue/10 dark:hover:bg-slate-700 transition"
                                                >
                                                    {option}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                        <div className="flex items-start mb-5">
                            <textarea
                                id="message"
                                rows="6"
                                className="resize-none block p-3.5 w-full shadow-xs rounded-xl 3xl:p-5 3xl:text-xl focus:ring-2 focus:ring-darkBlue placeholder:text-slate-500 dark:placeholder:text-slate-400 bg-lightBlue dark:bg-slate-900/60 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700"
                                placeholder="Share your message, thoughts, or collaboration proposal... *"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                data-gramm="false"
                                data-enable-grammarly="false"
                                spellCheck="false"
                                required
                            ></textarea>
                        </div>
                        <div className="w-full items-end justify-end flex">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="text-white cursor-pointer bg-darkBlue hover:bg-darkBlueAlt disabled:opacity-50 disabled:cursor-not-allowed font-semibold rounded-xl text-sm sm:text-base px-6 py-3 3xl:px-8 3xl:py-4 transition shadow-md hover:shadow-lg inline-flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Submitting Message...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Department Map Location Card (Rectangle Format) */}
                <div className="w-full rounded-3xl bg-white dark:bg-slate-800/90 p-5 sm:p-7 shadow-xl border border-slate-100 dark:border-slate-700/60 mt-12 sm:mt-16 mb-16">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                        <div className="flex items-start gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-blue/10 dark:bg-sky-400/10 flex items-center justify-center text-blue dark:text-sky-400 shrink-0 mt-0.5 shadow-xs">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-xl sm:text-2xl font-extrabold font-mons text-slate-900 dark:text-white">
                                    Department Campus Location
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
                                    Department of Computer Science, Punjabi University, Patiala, Punjab - 147002, India
                                </p>
                            </div>
                        </div>
                        <a
                            href="https://maps.google.com/?q=Department+of+Computer+Science,+Punjabi+University,+Patiala"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-darkBlue hover:bg-darkBlueAlt text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 shrink-0"
                        >
                            <Navigation className="w-4 h-4" />
                            <span>Open in Google Maps</span>
                            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                        </a>
                    </div>

                    {/* Responsive Map Iframe in Rectangle Shape */}
                    <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-200/90 dark:border-slate-700 shadow-inner relative">
                        <iframe
                            title="Department of Computer Science Punjabi University Patiala Map"
                            src="https://maps.google.com/maps?q=Department+of+Computer+Science,+Punjabi+University,+Patiala&t=&z=16&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                        />
                    </div>
                </div>
            </div>

            {/* Success Popup Modal */}
            {popup && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
                    onClick={handleClosePopup}
                >
                    <div
                        className="bg-white dark:bg-slate-900 p-7 sm:p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 text-center max-w-md w-full relative z-10 transform transition-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-9 h-9" />
                        </div>
                        <h2 className="text-2xl font-bold font-mons text-slate-900 dark:text-white mb-2">
                            Message Received!
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                            {submittedName ? `Thank you, ${submittedName}! ` : 'Thank you! '}
                            Your inquiry has been successfully recorded. A confirmation email has been dispatched and our department coordinator will get back to you shortly.
                        </p>
                        <button
                            type="button"
                            onClick={handleClosePopup}
                            className="w-full py-3 rounded-xl bg-darkBlue dark:bg-sky-500 text-white dark:text-slate-950 font-bold text-sm shadow-md hover:opacity-90 transition-all"
                        >
                            Got it, thanks!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};