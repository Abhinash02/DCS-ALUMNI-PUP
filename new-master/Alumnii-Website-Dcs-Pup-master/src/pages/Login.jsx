import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Reusable input component
const FormInput = ({ label, type, value, onChange, placeholder, index }) => (
  <div
    className="mb-4 animate-slideIn"
    style={{ animationDelay: `${index * 0.1}s` }}
  >
    <label className="block text-gray-700 text-sm xs:text-base font-medium mb-2 font-poppins">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-darkBlue focus:border-darkBlue transition-all duration-200 hover:border-lightBlue font-poppins text-sm xs:text-base"
      placeholder={placeholder}
    />
  </div>
);

// Reusable button component
const Button = ({ type, onClick, children, isPrimary = true, disabled = false }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 font-poppins text-sm xs:text-base ${
      isPrimary
        ? "bg-darkBlue hover:bg-darkBlueAlt text-white shadow-md hover:shadow-lg hover:animate-scaleUp"
        : "bg-gray-200 hover:bg-gray-300 text-gray-800 hover:animate-scaleUp"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  >
    {children}
  </button>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Sending login request:', { email, password });
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      console.log('Login successful, token:', res.data.token);
      navigate('/Admindashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed. Please try again.';
      console.error('Login error:', err.response?.data);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md animate-fadeInTop">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-darkBlue p-6">
            <div className="flex items-center justify-center space-x-3">
              <img
                src="/images/logo.png"
                alt="Punjabi University"
                className="w-10 h-10 object-contain"
              />
              <h2 className="text-xl xs:text-2xl font-bold text-center text-white font-poppins">
                Admin Portal
              </h2>
            </div>
            <p className="text-lightBlue text-center mt-2 text-sm xs:text-base font-poppins">
              Welcome Admin, Punjabi University Patiala
            </p>
          </div>

          <form onSubmit={handleLogin} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm animate-pulse font-poppins">
                {error}
              </div>
            )}

            <FormInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              index={1}
            />

            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              index={2}
            />

            <div className="flex items-center justify-between text-sm font-poppins">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-darkBlue focus:ring-darkBlue border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-gray-700 text-sm xs:text-base">
                  Remember me
                </label>
              </div>

              <a href="#" className="text-darkBlue hover:text-lightBlueAlt font-medium hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" isPrimary={true} disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center text-gray-600 text-sm font-poppins">
              Need help? Contact Wia E-Mail {' '}
              <a href="mailto:csepupalumni@gmail.com" className="text-darkBlue hover:text-lightBlueAlt hover:underline">
                IT Support
              </a>
            </div>
          </form>
        </div>

        <div className="text-center mt-6 text-gray-600 text-sm font-poppins">
          © {new Date().getFullYear()} Punjabi University. All rights reserved.
        </div>
      </div>
    </div>
  );
}