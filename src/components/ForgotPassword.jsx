// src/components/ForgotPassword.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'test@admin.com') {
      navigate('/verify-code', { state: { email } });
    } else {
      setError("We can't seem to find the right email address for you, resend the email that you have registered");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-lg">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Forgot Password?</h1>
          <p className="text-gray-500 text-sm">No worries, we'll send you reset instructions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#a955f7]"
              required
            />
          </div>
          
          {error && (
            <div className="bg-yellow-50 p-3 rounded-xl text-sm text-yellow-800">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#a955f7] text-white p-3 rounded-xl hover:bg-[rgba(169,85,247,0.85)] transition-colors"
          >
            Reset Password
          </button>
        </form>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full flex items-center justify-center gap-2 text-gray-600"
          >
            <span>←</span> Back to Login
          </button>
          
          <div className="text-center text-sm text-gray-500">
            Don't have account? 
            <button onClick={() => navigate('/login')} className="text-[#a955f7] ml-1 hover:underline">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ForgotPassword;