import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b border-blue-100">
      {/* Top blue gradient bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600" />

      <div className="flex items-center justify-between text-sm py-4 px-4 md:px-6 lg:px-10 max-w-7xl mx-auto">
        {/* DocBook logo with SVG */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-transform duration-300"
        >
          {/* SVG icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Simple medical book icon */}
              <path d="M6 4h9a2 2 0 0 1 2 2v12H8a2 2 0 0 0-2-2V4z" />
              <path d="M6 18a2 2 0 0 1 2 2h9" />
              <path d="M11 9h2" />
              <path d="M12 8v3" />
            </svg>
          </div>

          {/* Text logo */}
          <div className="flex flex-col leading-tight">
            <span className="text-xl font-black tracking-wide text-gray-900">
              DocBook
            </span>
            <span className="text-[11px] uppercase tracking-[0.24em] text-blue-500">
              Patient Portal
            </span>
          </div>
        </div>

        {/* Desktop Menu - More compact on medium screens, full spacing on large */}
        <ul className="hidden lg:flex items-center gap-3 xl:gap-8 font-semibold text-gray-700 text-xs xl:text-sm">
          <NavLink to={"/"} className="group">
            <li className="py-2 relative whitespace-nowrap">
              HOME
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-700 group-hover:w-full transition-all duration-300" />
            </li>
          </NavLink>

          <NavLink to={"/doctors"} className="group">
            <li className="py-2 relative whitespace-nowrap">
              ALL DOCTORS
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-500 to-blue-600 group-hover:w-full transition-all duration-300" />
            </li>
          </NavLink>

          {token && (
            <NavLink to={"/my-appointments"} className="group">
              <li className="py-2 relative whitespace-nowrap">
                MY APPOINTMENTS
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 group-hover:w-full transition-all duration-300" />
              </li>
            </NavLink>
          )}

          <NavLink to={"/about"} className="group">
            <li className="py-2 relative whitespace-nowrap">
              ABOUT
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-600 group-hover:w-full transition-all duration-300" />
            </li>
          </NavLink>

          <NavLink to={"/contact"} className="group">
            <li className="py-2 relative whitespace-nowrap">
              CONTACT
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300" />
            </li>
          </NavLink>
        </ul>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 lg:gap-4">
          {!token && (
            <a
              href="http://localhost:5174/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-3 md:px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-semibold hidden md:block hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-300 text-[10px] xl:text-xs whitespace-nowrap"
            >
              Admin Panel
            </a>
          )}

          {token && userData ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <img
                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full border-2 border-blue-400 group-hover:border-blue-600 transition-all duration-300 shadow-md"
                src={userData.image}
                alt="Profile"
              />
              <img
                className="w-2.5 hidden lg:block"
                src={assets.dropdown_icon}
                alt="Dropdown"
              />

              {/* Dropdown Menu */}
              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-700 z-20 hidden group-hover:block">
                <div className="min-w-48 bg-white rounded-2xl shadow-2xl flex flex-col gap-2 p-4 border border-blue-100">
                  <p
                    onClick={() => navigate("my-profile")}
                    className="hover:bg-blue-50 hover:text-blue-700 cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 text-sm"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("my-appointments")}
                    className="hover:bg-sky-50 hover:text-sky-700 cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 text-sm"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={logout}
                    className="hover:bg-red-50 hover:text-red-700 cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 text-sm"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 md:px-6 lg:px-8 py-2 lg:py-3 rounded-full font-semibold hidden md:block hover:shadow-xl hover:-translate-y-0.5 transform transition-all duration-300 text-[10px] xl:text-xs whitespace-nowrap"
            >
              Create Account
            </button>
          )}

          {/* Mobile Menu Icon - Shows on medium and small screens */}
          <img
            onClick={() => setShowMenu(true)}
            className="w-6 lg:hidden cursor-pointer hover:scale-110 transition-transform duration-300"
            src={assets.menu_icon}
            alt="Menu"
          />
        </div>

        {/* Mobile Menu */}
        <div
          className={`${showMenu ? "fixed w-full h-screen" : "h-0 w-0"
            } lg:hidden right-0 top-0 bottom-0 z-50 overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100 transition-all duration-500`}
        >
          <div className="flex items-center justify-between px-6 py-4 bg-white/85 backdrop-blur-md border-b border-blue-200">
            <div className="flex items-center gap-2">
              {/* SVG icon */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Simple medical book icon */}
                  <path d="M6 4h9a2 2 0 0 1 2 2v12H8a2 2 0 0 0-2-2V4z" />
                  <path d="M6 18a2 2 0 0 1 2 2h9" />
                  <path d="M11 9h2" />
                  <path d="M12 8v3" />
                </svg>
              </div>
              <span className="text-lg font-black text-gray-900">DocBook</span>
            </div>
            <img
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt="Close"
              className="h-6 w-6 cursor-pointer hover:rotate-90 transition-transform duration-300"
            />
          </div>

          <ul className="flex flex-col gap-6 px-6 py-12 text-lg font-semibold text-gray-700 items-center">
            <NavLink to="/" onClick={() => setShowMenu(false)}>
              <p className="px-6 py-3 rounded-full hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-105">
                HOME
              </p>
            </NavLink>
            <NavLink to="/doctors" onClick={() => setShowMenu(false)}>
              <p className="px-6 py-3 rounded-full hover:bg-sky-500 hover:text-white transition-all duration-300 transform hover:scale-105">
                ALL DOCTORS
              </p>
            </NavLink>
            {token && (
              <NavLink
                to="/my-appointments"
                onClick={() => setShowMenu(false)}
              >
                <p className="px-6 py-3 rounded-full hover:bg-emerald-500 hover:text-white transition-all duration-300 transform hover:scale-105">
                  MY APPOINTMENTS
                </p>
              </NavLink>
            )}
            <NavLink to="/about" onClick={() => setShowMenu(false)}>
              <p className="px-6 py-3 rounded-full hover:bg-indigo-500 hover:text-white transition-all duration-300 transform hover:scale-105">
                ABOUT
              </p>
            </NavLink>
            <NavLink to="/contact" onClick={() => setShowMenu(false)}>
              <p className="px-6 py-3 rounded-full hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-105">
                CONTACT
              </p>
            </NavLink>

            {!token && (
              <a
                href="http://localhost:5174/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMenu(false)}
              >
                <p className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-sm">
                  Admin Panel
                </p>
              </a>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
