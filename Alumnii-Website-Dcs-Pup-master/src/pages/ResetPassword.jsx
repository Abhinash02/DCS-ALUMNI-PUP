import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { toast } from 'react-toastify';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[@$!%*?&]/.test(newPassword);
  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const handleResetSubmit = async (e) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Password must include uppercase, lowercase, number, and special character');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const res = await API.post('/alumni/reset-password', { token, newPassword });
      toast.success(res.data.message || 'Password successfully reset!');
      setTimeout(() => navigate('/UserLogin'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
      <div className="w-full max-w-md animate-fadeInTop">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="bg-darkBlue p-6">
            <h2 className="text-xl xs:text-2xl font-bold text-center text-white font-poppins">
              Set New Password
            </h2>
            <p className="text-lightBlue text-center mt-2 text-sm xs:text-base font-poppins">
              Please enter your new password below.
            </p>
          </div>

          <form onSubmit={handleResetSubmit} className="p-6 space-y-6">
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-slate-300 text-sm xs:text-base font-medium mb-2 font-poppins">
                New Password <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue focus:border-darkBlue transition-all duration-200 font-poppins pr-10 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-darkBlue focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Requirement Indication in Red */}
              <div className="mt-2.5 p-3 rounded-xl bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400 mb-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                  <span>Password must include uppercase, lowercase, number, and special character</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-semibold">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                    hasMinLength 
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' 
                      : 'text-red-600 dark:text-red-400 bg-white/90 dark:bg-slate-800/90 border-red-200 dark:border-red-900/50'
                  }`}>
                    {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>}
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                    hasUpper 
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' 
                      : 'text-red-600 dark:text-red-400 bg-white/90 dark:bg-slate-800/90 border-red-200 dark:border-red-900/50'
                  }`}>
                    {hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>}
                    <span>Uppercase letter (A-Z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                    hasLower 
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' 
                      : 'text-red-600 dark:text-red-400 bg-white/90 dark:bg-slate-800/90 border-red-200 dark:border-red-900/50'
                  }`}>
                    {hasLower ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>}
                    <span>Lowercase letter (a-z)</span>
                  </div>
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                    hasNumber 
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' 
                      : 'text-red-600 dark:text-red-400 bg-white/90 dark:bg-slate-800/90 border-red-200 dark:border-red-900/50'
                  }`}>
                    {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>}
                    <span>Number (0-9)</span>
                  </div>
                  <div className={`sm:col-span-2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all ${
                    hasSpecial 
                      ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800' 
                      : 'text-red-600 dark:text-red-400 bg-white/90 dark:bg-slate-800/90 border-red-200 dark:border-red-900/50'
                  }`}>
                    {hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" /> : <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></span>}
                    <span>Special character (@$!%*?&)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 dark:text-slate-300 text-sm xs:text-base font-medium mb-2 font-poppins">
                Confirm Password <span className="text-red-500 font-bold">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue focus:border-darkBlue transition-all duration-200 font-poppins pr-10 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-darkBlue focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {confirmPassword && confirmPassword !== newPassword && (
                <p className="mt-1.5 text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> Passwords do not match
                </p>
              )}
              {confirmPassword && confirmPassword === newPassword && (
                <p className="mt-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 flex-shrink-0" /> Passwords match
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 font-poppins text-white bg-darkBlue hover:bg-blue-700 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
