import React from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl overflow-hidden my-12 mx-4 md:mx-8 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-6 sm:px-8 py-12 md:py-16 lg:py-20 relative z-10">
        {/* Left Side */}
        <div className="flex-1 text-white space-y-6 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Find & Book Appointment with <span className="text-blue-100">Expert Doctors</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto md:mx-0">
            Connect with certified healthcare professionals for in-person or virtual consultations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <button
              onClick={() => {
                navigate('/login');
                scrollTo(0, 0);
              }}
              className="bg-white text-blue-700 hover:bg-blue-50 font-medium text-base sm:text-lg px-8 py-3 rounded-full transition-colors duration-300 shadow-md"
            >
              Book Appointment
            </button>
            <button
              onClick={() => {
                navigate('/doctors');
                scrollTo(0, 0);
              }}
              className="border-2 border-white text-white hover:bg-white/10 font-medium text-base sm:text-lg px-8 py-3 rounded-full transition-colors duration-300"
            >
              View Doctors
            </button>
          </div>
        </div>

        {/* Right Side - Doctor Image */}
        <div className="mt-10 md:mt-0 md:ml-10 lg:ml-16 w-full max-w-md">
          <div className="relative">
            <img
              className="w-full h-auto rounded-xl shadow-xl"
              src={assets.appointment_img}
              alt="Doctor with patient"
            />
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-white/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Banner;