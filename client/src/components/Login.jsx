import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setUser } from '../redux/user/user.slice';

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        toast.error("Login failed. Please check your credentials.");
        return;
      }
      dispatch(setUser(data.user))
      toast.success("Login successful! Redirecting...");
      
      // Redirect based on role
      if (data.user.role === 'admin') {
        setTimeout(() => navigate('/admin'), 2000);
      } else {
        setTimeout(() => navigate('/user'), 2000);
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 via-blue-200 to-blue-50">
      <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-2xl p-8 md:p-12 w-full max-w-2xl">
        {/* Illustration/Icon */}
        <div className="hidden md:flex flex-col items-center justify-center pr-8 border-r border-blue-100 mr-8">
          <div className="bg-blue-100 rounded-full p-4 mb-4">
            <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><path fill="#3b82f6" d="M12 2a7 7 0 0 1 7 7v2.09c0 .24.09.47.26.65l1.34 1.34a2 2 0 0 1 0 2.83l-7.07 7.07a2 2 0 0 1-2.83 0l-7.07-7.07a2 2 0 0 1 0-2.83l1.34-1.34a.92.92 0 0 0 .26-.65V9A7 7 0 0 1 12 2Z"/></svg>
          </div>
          <span className="text-blue-500 font-bold text-lg">AddWise</span>
        </div>
        {/* Form Section */}
        <div className="flex-1 w-full">
          <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-2">Welcome Back!</h2>
          <p className="text-center text-gray-500 mb-6">Login to your AddWise account to access your dashboard and projects.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md bg-blue-50 px-3 py-2 text-base text-gray-900 outline outline-1 outline-blue-200 focus:outline-blue-400"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-blue-50 outline outline-1 outline-blue-200 focus:outline-blue-400 px-3 py-2 text-base text-gray-900"
                />
              </div>
              <div className="flex items-center justify-end mt-2">
                <Link to="/forgot-password" className="text-sm font-medium text-blue-500 hover:underline">Forgot password?</Link>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-base font-semibold text-white shadow hover:bg-blue-600 transition-colors"
              >
                Login
              </button>
            </div>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-blue-100"></div>
            <span className="mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-blue-100"></div>
          </div>
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-semibold text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </div>
        <ToastContainer position="top-center" autoClose={2000} theme="light" />
      </div>
    </div>
  );
};

export default Login;
