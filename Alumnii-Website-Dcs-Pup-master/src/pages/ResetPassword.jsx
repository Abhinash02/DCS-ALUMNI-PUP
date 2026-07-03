import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/api';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleResetSubmit = async (e) => {
    e.preventDefault();

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
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md animate-fadeInTop">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
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
              <label className="block text-gray-700 text-sm xs:text-base font-medium mb-2 font-poppins">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue focus:border-darkBlue transition-all duration-200 font-poppins pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-darkBlue focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm xs:text-base font-medium mb-2 font-poppins">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue focus:border-darkBlue transition-all duration-200 font-poppins pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-darkBlue focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
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
