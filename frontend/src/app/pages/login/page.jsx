'use client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'; 
import { loginUser, signupUser } from '@/app/utils/apiClient';
import { login } from '@/app/redux/userSlice';

const AuthForm = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({ name: '', email: '', password: '' });
    setError('');
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignup) {
        const data = await signupUser(formData);
        if (data.token && data.user) {
          localStorage.setItem('HousingToken', data.token);
          dispatch(login(data.user));
          setFormData({ name: '', email: '', password: '' }); 
          router.push('/');
          setIsSignup(false);
        } else {
          throw new Error('Invalid response from signup');
        }
      } else {
        const data = await loginUser(formData);
        if (data.token && data.user) {
          localStorage.setItem('HousingToken', data.token);
          dispatch(login(data.user)); 
          setFormData({ name: '', email: '', password: '' }); 
          router.push('/');
        } else {
          throw new Error('Invalid response from login');
        }
      }
    } catch (err) {
      
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </h2>

        {error && (
          <div
            className="text-red-600 text-center mb-4"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isSignup && (
            <div>
              <label htmlFor="name" className="block text-sm mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-required="true"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 flex items-center justify-center"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  />
                </svg>
                Please wait...
              </>
            ) : isSignup ? (
              'Sign Up'
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="text-blue-600 hover:underline font-medium"
          >
            {isSignup ? 'Login here' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;