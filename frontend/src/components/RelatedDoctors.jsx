import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const RelatedDoctors = ({ speciality, docId }) => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [relDoc, setRelDoc] = useState([]);

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorData = doctors.filter(
        doc => doc.speciality === speciality && doc._id !== docId
      );
      setRelDoc(doctorData);
    }
  }, [doctors, speciality, docId]);

  return (
    <div className="relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-100 rounded-full blur-3xl opacity-50" />
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Related Doctors to Book
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse through our extensive list of trusted healthcare professionals
          </p>
        </div>

        {/* Doctor Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
          {relDoc.slice(0, 5).map((item, index) => (
            <div
              key={index}
              onClick={() => {
                if (item.available) {
                  navigate(`/appointment/${item._id}`);
                  scrollTo(0, 0);
                }
              }}
              className={`group relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-500 ${
                item.available 
                  ? 'cursor-pointer hover:shadow-2xl hover:-translate-y-2' 
                  : 'cursor-not-allowed opacity-75'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Hover Overlay */}
              {item.available && (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
              
              {/* Doctor Image */}
              <div className="relative h-48 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={item.image}
                  alt={item.name}
                />
                {/* Availability Badge */}
                <div className="absolute top-3 right-3">
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold shadow-md ${
                    item.available 
                      ? 'bg-green-500 text-white' 
                      : 'bg-red-500 text-white'
                  }`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              </div>
              
              {/* Doctor Info */}
              <div className="p-5">
                {/* Status Indicator */}
                <div className={`flex items-center gap-2 mb-3 ${
                  item.available ? 'text-green-600' : 'text-red-600'
                }`}>
                  <div className="relative">
                    <span className={`absolute w-2 h-2 rounded-full opacity-75 animate-ping ${
                      item.available ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    <span className={`relative w-1.5 h-1.5 rounded-full block ${
                      item.available ? 'bg-green-600' : 'bg-red-600'
                    }`}></span>
                  </div>
                  <p className="text-xs font-medium">
                    {item.available ? 'Available' : 'Unavailable'}
                  </p>
                </div>
                
                {/* Name and Speciality */}
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-blue-700 transition-colors duration-300">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                  {item.speciality}
                </p>
                
                {/* Book Button */}
                <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  item.available
                    ? 'bg-blue-600 text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}>
                  {item.available ? (
                    <>
                      <span>Book Now</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  ) : (
                    <span>Not Available</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button
            onClick={() => {
              navigate('/doctors');
              scrollTo(0, 0);
            }}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          >
            <span>View All Doctors</span>
            <svg 
              className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedDoctors;