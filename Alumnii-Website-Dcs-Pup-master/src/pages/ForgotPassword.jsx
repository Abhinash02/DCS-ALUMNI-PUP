import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await API.post('/alumni/forgot-password', { email });
      toast.success(res.data.message || 'Password reset link sent!');
      setTimeout(() => navigate('/UserLogin'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send reset link.');
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
              Forgot Password
            </h2>
            <p className="text-lightBlue text-center mt-2 text-sm xs:text-base font-poppins">
              Enter your registered email address to receive a reset link.
            </p>
          </div>

          <form onSubmit={handleForgotSubmit} className="p-6 space-y-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm xs:text-base font-medium mb-2 font-poppins">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue focus:border-darkBlue transition-all duration-200 font-poppins"
                placeholder="yourname@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 font-poppins text-white bg-darkBlue hover:bg-blue-700 shadow-md hover:shadow-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <div className="text-center mt-4">
              <Link
                to="/UserLogin"
                className="text-sm font-medium text-darkBlue hover:text-blue transition-colors duration-200 font-poppins"
              >
                Back to Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
