import React, { useState } from 'react';
import API from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  Award,
  KeyRound,
  ShieldAlert,
  Server,
} from 'lucide-react';

export default function Login() {
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
      const res = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/Admindashboard');
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || 'Invalid administrative credentials. Please verify and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-start items-center px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-36 pb-16">
      {/* MAIN SPLIT CARD */}
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT COLUMN: DEPARTMENT ADMINISTRATIVE SHOWCASE */}
        <div className="lg:col-span-6 bg-gradient-to-br from-darkBlue via-[#00385c] to-[#001c30] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle glowing orb backgrounds */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

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
                <h3 className="text-xs uppercase font-extrabold tracking-widest text-sky-200">
                  Punjabi University, Patiala
                </h3>
                <h2 className="text-base sm:text-lg font-extrabold font-mons text-white">
                  Department of Computer Science
                </h2>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white shadow-xs">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Administrative Console • DCS PUP</span>
            </div>
          </div>

          {/* Middle: Admin Scope & System Capabilities */}
          <div className="my-8 relative z-10 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold font-mons tracking-tight text-white leading-snug">
              Secure Departmental{' '}
              <span className="bg-gradient-to-r from-amber-300 to-sky-200 bg-clip-text text-transparent">
                Administration
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-poppins">
              Authorized access point for department heads, faculty liaisons, and portal administrators to manage alumni records, verify registrations, and publish department events.
            </p>

            <div className="pt-2 space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5 text-sky-100">
                <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Alumni Verification & Directory Moderation</span>
              </div>
              <div className="flex items-center gap-2.5 text-sky-100">
                <Server className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Department Event & Career Board Management</span>
              </div>
              <div className="flex items-center gap-2.5 text-sky-100">
                <KeyRound className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>Role-Based Access Control & Audit Trails</span>
              </div>
            </div>
          </div>

          {/* Bottom: Security Notice & Quick Link */}
          <div className="relative z-10 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-blue-200">
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              <span>Authorized Personnel Only</span>
            </div>
            <Link
              to="/"
              className="hover:text-white transition flex items-center gap-1 text-sky-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Site</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: ATTRACTIVE ADMIN LOGIN SECTION */}
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white dark:bg-slate-900">
          {/* Top Role Selector Tabs */}
          <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 mb-6">
            <Link
              to="/UserLogin"
              className="flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-1.5 transition text-center"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Alumni / User</span>
            </Link>
            <button
              type="button"
              className="flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold bg-white dark:bg-slate-900 text-darkBlue dark:text-sky-400 shadow-sm flex items-center justify-center gap-1.5 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administrator</span>
            </button>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-mons text-slate-900 dark:text-white">
              Administrator Sign In
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-6">
              Enter your authorized administrative credentials to manage portal systems.
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
                Admin Username or Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@example.com"
                  data-gramm="false"
                  data-enable-grammarly="false"
                  spellCheck={false}
                  autoComplete="username"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue dark:focus:ring-sky-400 transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
                  Master Password <span className="text-red-500">*</span>
                </label>
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
                  data-gramm="false"
                  data-enable-grammarly="false"
                  spellCheck={false}
                  autoComplete="current-password"
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
                <span>Remember this terminal</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-darkBlue via-[#004875] to-darkBlueAlt hover:from-[#002f50] hover:to-blue shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <span>Access Admin Dashboard</span>
              )}
            </button>
          </form>

          {/* Department Access Notice */}
          <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
            <span>Forgot access credentials? </span>
            <span className="font-semibold text-darkBlue dark:text-sky-400">
              Contact Department Head Office (0175-5136313)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}