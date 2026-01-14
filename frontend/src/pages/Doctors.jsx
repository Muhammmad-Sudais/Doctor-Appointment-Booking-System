import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const specialities = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist',
  ];

  return (
    <section className="min-h-screen bg-white px-4 py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">
            Find Doctors
          </h1>
          <p className="text-lg text-gray-600">Connect with our trusted healthcare specialists</p>
        </div>

        {/* Mobile Filter Toggle */}
        <button
          className="sm:hidden bg-white border-2 border-blue-200 rounded-2xl px-6 py-3 mb-6 flex items-center gap-3 hover:bg-blue-50 hover:border-blue-300 text-blue-700 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 mx-auto"
          onClick={() => setShowFilter(!showFilter)}
        >
          <span className="font-semibold">Filter Specialities</span>
          <span className={`transform transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`}>▼</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-72 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm ${showFilter ? 'block' : 'hidden lg:block'} animate-fade-in-left`}>
            <h3 className="font-bold text-xl text-blue-900 mb-5">Specialities</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/doctors')}
                className={`w-full text-left px-5 py-3 rounded-xl border transition-all duration-300 ${!speciality ? 'bg-blue-600 text-white border-transparent' : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
              >
                <span className="font-medium">All Doctors ({doctors.length})</span>
              </button>
              {specialities.map((spec, index) => (
                <button
                  key={index}
                  onClick={() => navigate(`/doctors/${spec}`)}
                  className={`w-full text-left px-5 py-3 rounded-xl border transition-all duration-300 ${speciality === spec ? 'bg-blue-600 text-white border-transparent' : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                >
                  <span className="font-medium">{spec}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Cards */}
          <div className="flex-1">
            {speciality && (
              <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in-up">
                <p className="text-blue-800 font-medium">Showing {filterDoc.length} {speciality} specialist{filterDoc.length !== 1 ? 's' : ''}</p>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filterDoc.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    if (item.available) {
                      navigate(`/appointment/${item._id}`);
                      scrollTo(0, 0);
                    }
                  }}
                  className={`group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col ${
                    item.available ? 'hover:-translate-y-1 cursor-pointer' : 'cursor-not-allowed opacity-75'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-full bg-white rounded-t-xl overflow-hidden flex items-center justify-center p-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-auto max-h-56 object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </div>
                  {/* Info Section */}
                  <div className="p-5 flex flex-col justify-between flex-grow">
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
                    <p className="font-bold text-gray-800 text-lg group-hover:text-blue-700 transition-colors duration-300">{item.name}</p>
                    <p className="text-sm text-gray-600 mt-1 group-hover:text-blue-600 transition-colors duration-300">{item.speciality}</p>
                    <div className="mt-4 flex items-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                      <span className="text-sm font-semibold">
                        {item.available ? 'Book Appointment' : 'Not Available'}
                      </span>
                      {item.available && (
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {filterDoc.length === 0 && (
              <div className="text-center py-20 animate-fade-in-up">
                <div className="text-6xl mb-4 text-blue-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">No doctors found</h3>
                <p className="text-gray-500">Try selecting a different speciality</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctors;