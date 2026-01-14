import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      
      {/* Background Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-[45%] h-[35%] bg-blue-200 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 w-[30%] h-[30%] bg-blue-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="w-full min-h-[calc(100vh-60px)] px-4 py-6 relative z-10 overflow-y-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                All Doctors
              </h1>
              <p className="text-sm text-gray-600">
                Manage doctor availability and profiles
              </p>
            </div>
          </div>

          {/* Stats - now responsive */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="text-center">
              <p className="text-xs text-gray-500">Total Doctors</p>
              <p className="text-2xl font-bold text-gray-800">{doctors?.length || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Available</p>
              <p className="text-2xl font-bold text-green-600">
                {doctors?.filter(d => d.available).length || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Unavailable</p>
              <p className="text-2xl font-bold text-red-600">
                {doctors?.filter(d => !d.available).length || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Total Doctors",
              count: doctors?.length || 0,
              color: "blue",
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857..." />
              ),
            },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-${s.color}-100 rounded-xl flex items-center justify-center`}>
                  <svg className={`w-5 h-5 text-${s.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {s.icon}
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-lg font-bold text-gray-900">{s.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Doctors List */}
        <div className="flex-1 overflow-hidden">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 h-full overflow-hidden flex flex-col">

            {/* Table Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">Doctors Directory</h2>
                <p className="text-blue-100 text-sm">{doctors?.length || 0} registered doctors</p>
              </div>

              <button onClick={() => getAllDoctors(true)} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition">
                Refresh
              </button>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {doctors && doctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {doctors.map((item, index) => (
                    <div
                      key={index}
                      className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                    >
                      
                      {/* Doctor Image */}
                      <div className="relative h-52 sm:h-60 md:h-64 bg-gray-50 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />

                        {/* Badge */}
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                            item.available ? 'bg-green-500' : 'bg-red-500'
                          }`}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 text-base mb-1 group-hover:text-blue-700 transition">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 group-hover:text-blue-600 transition">
                          {item.speciality}
                        </p>

                        {/* Toggle */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-xs font-medium ${item.available ? 'text-green-600' : 'text-red-600'}`}
                          >
                            {item.available ? 'Available' : 'Unavailable'}
                          </span>

                          <button
                            onClick={() => changeAvailability(item._id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                              item.available ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 rounded-full bg-white transform transition ${
                                item.available ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-700">No Doctors Found</h3>
                    <p className="text-gray-500">Add doctors to see them listed here</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorsList;
