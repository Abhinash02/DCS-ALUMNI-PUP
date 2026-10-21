import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  GraduationCap,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await API.post('/alumni/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('alumni', JSON.stringify(res.data.alumni));
      navigate('/profile');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-16">
      {/* MAIN SPLIT CARD */}
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT COLUMN: DEPARTMENT SHOWCASE & BRANDING */}
        <div className="lg:col-span-6 bg-gradient-to-br from-darkBlue via-[#004875] to-[#002b47] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glowing orb backgrounds */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top: University Crest & Department Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 p-2 backdrop-blur-sm flex items-center justify-center shadow-md shrink-0">
                <img
                  src="/images/logo.png"
                  alt="Punjabi University Logo"
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
              <div>
                <h3 className="text-[11px] sm:text-xs uppercase font-extrabold tracking-widest text-sky-200">
                  Punjabi University, Patiala
                </h3>
                <h2 className="text-sm sm:text-base font-extrabold font-mons text-white">
                  Department of Computer Science
                </h2>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white shadow-xs mb-2">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>NAAC "A+" Grade (CGPA 3.37)</span>
            </div>
          </div>

          {/* Middle: Mission & Key Department Highlights */}
          <div className="my-5 relative z-10 space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-mons tracking-tight text-white leading-snug">
              Welcome Back to Your{' '}
              <span className="bg-gradient-to-r from-sky-300 to-teal-200 bg-clip-text text-transparent">
                Alma Mater
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-poppins">
              Reconnect with thousands of DCS alumni worldwide, mentor future tech leaders, discover exclusive career opportunities, and stay part of our lasting computing legacy.
            </p>

            <div className="pt-2 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-sky-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>38+ Years of Academic Excellence (Est. 1987)</span>
              </div>
              <div className="flex items-center gap-2.5 text-sky-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Global Community across 20+ Nations</span>
              </div>
              <div className="flex items-center gap-2.5 text-sky-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Infosys Advanced Partner & Top Campus Recruiters</span>
              </div>
            </div>
          </div>

          {/* Bottom: Inspiring Note & Quick Link */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-200">
            <div className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>DCS PUP Alumni Portal</span>
            </div>
            <Link
              to="/"
              className="hover:text-white transition flex items-center gap-1 text-sky-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home Page</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: ATTRACTIVE LOGIN SECTION */}
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white dark:bg-slate-900">
          {/* Top Role Selector Tabs */}
          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 mb-6">
            <button
              type="button"
              className="flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 text-darkBlue dark:text-sky-400 shadow-sm flex items-center justify-center gap-1.5 transition"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Alumni / User</span>
            </button>
            <Link
              to="/Login"
              className="flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 transition text-center"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator</span>
            </Link>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mons text-slate-900 dark:text-white">
              Alumni Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
              Enter your registered credentials to access your profile and alumni network.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs sm:text-sm flex items-center gap-2">
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="alumni@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                  Password <span className="text-red-500">*</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-blue dark:text-sky-400 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-darkBlue focus:ring-darkBlue border-slate-300 dark:border-slate-600 dark:bg-slate-700"
                />
                <span>Remember this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-darkBlue via-blue to-darkBlueAlt hover:from-[#002f50] hover:to-blue shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to Alumni Portal</span>
              )}
            </button>
          </form>

          {/* Registration Redirect */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <span>Don't have an alumni account? </span>
            <Link
              to="/Register"
              className="font-bold text-blue dark:text-sky-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Register Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}