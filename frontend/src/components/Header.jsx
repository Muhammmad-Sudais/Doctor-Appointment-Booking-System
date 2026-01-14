import React from 'react';
import { assets } from '../assets/assets';

const Header = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-700 to-blue-900 rounded-3xl overflow-hidden px-6 md:px-10 lg:px-20 py-12 md:py-24 text-white shadow-2xl">
      <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
        {/* -------- Left Side -------- */}
        <div className="md:w-1/2 flex flex-col justify-center gap-6 animate-fade-in-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100 animate-pulse-slow">
            Book Appointment <br /> With Trusted Doctors
          </h1>
          <div className="flex flex-col md:flex-row items-center gap-3 text-sm font-light animate-fade-in-up">
            <div className="relative group">
              <div className="absolute -inset-1 bg-blue-400/20 rounded-full blur-md group-hover:opacity-100 opacity-0 transition-opacity duration-300"></div>
              <img
                src={assets.group_profiles}
                alt="Group Profiles"
                className="relative w-20 transform group-hover:scale-110 transition-all duration-300 group-hover:rotate-3"
              />
            </div>
            <p className="max-w-md text-blue-50 leading-relaxed">
              Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
            </p>
          </div>
          <a
            href="#speciality"
            className="group flex items-center gap-3 bg-white text-blue-700 px-10 py-4 rounded-full text-base font-semibold hover:bg-blue-50 hover:shadow-xl transform hover:scale-105 transition-all duration-300 shadow-lg w-fit"
          >
            Book Appointment
            <img
              className="w-4 group-hover:translate-x-2 transition-transform duration-300"
              src={assets.arrow_icon}
              alt="Arrow"
            />
          </a>
        </div>

        {/* -------- Right Side -------- */}
        <div className="md:w-1/2 flex justify-center items-center">
          <div className="relative group">
            <img
              className="w-full max-w-md h-auto object-contain rounded-2xl shadow-lg transform group-hover:scale-103 transition-all duration-500"
              src={assets.header_img}
              alt="Header Illustration"
            />
            {/* Subtle blue glow on hover */}
            <div className="absolute inset-0 bg-blue-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        </div>
      </div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-500/20 to-pink-400/30 pointer-events-none animate-gradient-shift"></div>

      {/* Floating Particles */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl animate-float-slow"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-300/20 rounded-full blur-3xl animate-float-slower"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300/20 rounded-full blur-2xl animate-pulse-slow"></div>

      {/* Decorative Shapes */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-3xl animate-spin-slow"></div>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl animate-spin-slower"></div>
    </section>
  );
};

export default Header;