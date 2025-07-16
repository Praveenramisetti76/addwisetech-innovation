import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { removeUser } from "../redux/user/user.slice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);
  console.log(user);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handlelogout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/logout`,
        {
          method: "get",
          credentials: "include",
        }
      );
      const data = await response.json();
      console.log(data);

      if (!response.ok) {
        toast.error("Logout failed. Please check your credentials.");
        return;
      }
      dispatch(removeUser());
      toast.success("Logout successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  // Smooth scroll to section
  const handleNavScroll = (e, sectionId) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="flex items-center justify-between border-b border-b-[#e3eefd] px-6 py-3 bg-[#f4f8fd] relative z-20">
        <div className="flex items-center gap-3 text-[#1c180d]">
          <span className="inline-block w-8 h-8 bg-gradient-to-tr from-blue-400 to-blue-500 rounded-full mr-2"></span>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Innovate</span>
        </div>
        <button className="md:hidden flex items-center px-3 py-2 border rounded text-[#1c180d] border-blue-400" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg className="fill-current h-5 w-5" viewBox="0 0 20 20"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
        </button>
        <nav className={`flex-col md:flex-row md:flex md:items-center md:static absolute top-full left-0 w-full md:w-auto bg-[#f4f8fd] md:bg-transparent shadow-md md:shadow-none transition-all duration-300 ease-in-out ${mobileOpen ? 'flex' : 'hidden'}`}>
          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-9 px-6 md:px-0 py-4 md:py-0">
            <Link to="/" className="text-[#1c180d] text-base font-medium hover:text-blue-500 transition-colors">Home</Link>
          </div>
          {!user.isLoggedIn ? (
            <div className="flex flex-col md:flex-row gap-2 px-6 md:px-0 pb-4 md:pb-0">
              <Link to="/login"><button className="w-full md:w-auto px-6 py-2 rounded-lg bg-blue-400 text-white font-bold hover:bg-blue-500 transition-colors">Login</button></Link>
              <Link to="/signup"><button className="w-full md:w-auto px-6 py-2 rounded-lg bg-[#e3eefd] text-[#1c180d] font-bold hover:bg-blue-100 transition-colors">Sign Up</button></Link>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-2 px-6 md:px-0 pb-4 md:pb-0">
              <Link to={user.user.role === "superadmin" ? "/superadmin" : user.user.role === "admin" ? "/admin" : "/user"}><button className="w-full md:w-auto px-6 py-2 rounded-lg bg-[#e3eefd] text-[#1c180d] font-bold hover:bg-blue-100 transition-colors">Dashboard</button></Link>
              <Link to="/scanner"><button className="w-full md:w-auto px-6 py-2 rounded-lg bg-blue-100 text-[#1c180d] font-bold hover:bg-blue-200 transition-colors">QR Scanner</button></Link>
              <button onClick={handlelogout} className="w-full md:w-auto px-6 py-2 rounded-lg bg-blue-400 text-white font-bold hover:bg-blue-500 transition-colors">Logout</button>
            </div>
          )}
        </nav>
      </header>
      <ToastContainer position="top-center" autoClose={2000} theme="light" />
    </>
  );
};

export default Navbar;
