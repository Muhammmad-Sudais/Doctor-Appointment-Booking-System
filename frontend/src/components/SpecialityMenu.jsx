import React from 'react';
import { specialityData } from '../assets/assets';
import { Link } from 'react-router-dom';

const SpecialityMenu = () => {
  return (
    <section
      id="speciality"
      className="relative bg-white py-20 px-4 text-gray-800 overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl"></div>

      <div className="flex flex-col items-center gap-6 max-w-7xl mx-auto relative z-10">
        <div className="text-center space-y-3 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-blue-900">
            Find by Speciality
          </h1>
          <p className="max-w-2xl text-center text-base sm:text-lg text-gray-600 leading-relaxed">
            Connect with specialized healthcare professionals for personalized care.
          </p>
        </div>

        {/* Speciality Cards */}
        <div className="w-full flex justify-center mt-4">
          <div className="flex gap-6 pt-8 max-w-full overflow-x-auto scroll-smooth snap-x justify-center pb-4">
            {specialityData.map((item, index) => (
              <Link
                key={index}
                to={`/doctors/${item.speciality}`}
                onClick={() => scrollTo(0, 0)}
                className="group flex flex-col items-center text-center text-sm cursor-pointer flex-shrink-0 snap-start bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 px-6 py-8 min-w-[140px] sm:min-w-[160px] border border-gray-100 hover:border-blue-300 relative overflow-hidden transform hover:-translate-y-1.5"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-blue-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0.5 bg-gradient-to-br from-blue-100/80 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                <div className="absolute -inset-1 bg-blue-100/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-400">
                  <div className="p-3 bg-blue-50 rounded-full mb-4 group-hover:bg-white/80 transition-colors duration-300">
                    <img
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain transition-all duration-500 group-hover:scale-110"
                      src={item.image}
                      alt={item.speciality}
                    />
                  </div>
                </div>

                <p className="font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-300 relative z-10">
                  {item.speciality}
                </p>

                {/* Animated Border Glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                  <div className="absolute inset-0.5 rounded-2xl border-2 border-blue-300/50 group-hover:border-blue-400/70 transition-all duration-500"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpecialityMenu;