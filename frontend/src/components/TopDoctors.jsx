import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <section className="relative bg-white py-20 px-4 text-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 relative z-10">
        
        {/* Title */}
        <div className="text-center space-y-3 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900">
            Top Doctors to Book
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-gray-600 leading-relaxed">
            Connect with our experienced healthcare professionals.
          </p>
        </div>

        {/* Doctors Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 pt-8">
          {doctors.slice(0, 10).map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (item.available) {
                  navigate(`/appointment/${item._id}`);
                  scrollTo(0, 0);
                }
              }}
              className={`group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col ${
                item.available ? 'hover:-translate-y-1.5 cursor-pointer' : 'cursor-not-allowed opacity-75'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-full bg-white rounded-t-lg overflow-hidden flex items-center justify-center p-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-auto max-h-52 object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-sm mb-3">
                  <div className="relative">
                    <span className={`absolute w-3 h-3 rounded-full opacity-75 animate-ping ${
                      item.available ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    <span className={`relative w-2 h-2 rounded-full block ${
                      item.available ? 'bg-green-600' : 'bg-red-600'
                    }`}></span>
                  </div>
                  <p className={`font-medium ${
                    item.available ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </p>
                </div>

                <p className="font-bold text-gray-800 text-lg sm:text-xl group-hover:text-blue-700 transition-colors duration-300">
                  {item.name}
                </p>
                <p className="text-sm text-gray-600 mt-1 group-hover:text-blue-600 transition-colors duration-300">
                  {item.speciality}
                </p>

                <div className="mt-4 flex items-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <span className="text-sm font-semibold">
                    {item.available ? 'Book Appointment' : 'Not Available'}
                  </span>
                  {item.available && (
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <button
          onClick={() => {
            navigate("/doctors");
            scrollTo(0, 0);
          }}
          className="group mt-12 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold text-lg hover:from-blue-700 hover:to-blue-800 hover:shadow-lg hover:scale-105 transform transition-all duration-300 shadow-md relative overflow-hidden"
        >
          <span className="relative z-10">View All Doctors</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
        </button>

      </div>
    </section>
  );
};

export default TopDoctors;
