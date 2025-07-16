import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    adminCode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Registration failed. Please try again.");
        return;
      }

      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
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
          <h2 className="text-3xl font-extrabold text-blue-600 text-center mb-2">Create Your AddWise Account</h2>
          <p className="text-center text-gray-500 mb-6">Sign up to start using secure authentication and access your dashboard.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">Name</label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-blue-50 px-3 py-2 text-base text-gray-900 outline outline-1 outline-blue-200 focus:outline-blue-400"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
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
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-blue-50 px-3 py-2 text-base text-gray-900 outline outline-1 outline-blue-200 focus:outline-blue-400"
                />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-900">Role</label>
              <div className="mt-2">
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full rounded-md bg-blue-50 px-3 py-2 text-base text-gray-900 outline outline-1 outline-blue-200 focus:outline-blue-400"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
            </div>
            {formData.role === 'admin' && (
              <div>
                <label htmlFor="adminCode" className="block text-sm font-medium text-gray-900">Admin Code</label>
                <div className="mt-2">
                  <input
                    id="adminCode"
                    name="adminCode"
                    type="password"
                    required
                    placeholder="Enter admin code"
                    value={formData.adminCode}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-blue-50 px-3 py-2 text-base text-gray-900 outline outline-1 outline-blue-200 focus:outline-blue-400"
                  />
                </div>
              </div>
            )}
            {formData.role === 'superadmin' && (
              <div>
                <label htmlFor="adminCode" className="block text-sm font-medium text-gray-900">Super Admin Code</label>
                <div className="mt-2">
                  <input
                    id="adminCode"
                    name="adminCode"
                    type="password"
                    required
                    placeholder="Enter super admin code"
                    value={formData.adminCode}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-blue-50 px-3 py-2 text-base text-gray-900 outline outline-1 outline-blue-200 focus:outline-blue-400"
                  />
                </div>
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-blue-500 px-3 py-2 text-base font-semibold text-white shadow hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Signing up...' : 'Sign up'}
              </button>
            </div>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-blue-100"></div>
            <span className="mx-4 text-gray-400 text-sm">or</span>
            <div className="flex-grow border-t border-blue-100"></div>
          </div>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-500 hover:underline">Login</Link>
          </p>
        </div>
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      </div>
    </div>
  );
};

export default Signup;
