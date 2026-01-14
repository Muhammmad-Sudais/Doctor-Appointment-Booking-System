import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isDoctorRoute = location.pathname.startsWith("/doctor");
  const isAdminRoute = location.pathname.startsWith("/admin");

  const handleLogout = () => {
    navigate("/");
    if (aToken) {
      setAToken("");
      localStorage.removeItem("aToken");
      toast.success("Logged out successfully");
    }
    if (dToken) {
      setDToken("");
      localStorage.removeItem("dToken");
      toast.success("Logged out successfully");
    }
  };

  const roleLabel = isDoctorRoute ? "Doctor Panel" : "Admin Panel";

  return (
    <div className="w-full flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 bg-white/90 backdrop-blur-md border-b border-blue-50 shadow-sm">

      {/* Left Side */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Icon */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center shadow-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 4v6a4 4 0 0 0 8 0V4" />
            <path d="M8 4h4" />
            <path d="M14 11a4 4 0 1 0 4 4v-2" />
            <circle cx="18" cy="7" r="2" />
          </svg>
        </div>

        {/* Brand Text */}
        <div className="flex flex-col leading-tight">
          <span className="text-lg sm:text-xl font-black tracking-wide text-gray-900">
            DocBook
          </span>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.24em] text-blue-500">
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Right Side */}
      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white text-blue-700 text-xs sm:text-sm font-medium border border-blue-200 shadow-sm hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-0.5 transition-all duration-200"
      >
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
          />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Navbar;
