import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const Dashboard = () => {
  const [filter, setFilter] = useState('all') // 'all', 'completed'
  const { aToken, getDashData, cancelAppointment, completeAppointment, dashData } = useContext(AdminContext)
  const { currency, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
      const interval = setInterval(() => {
        getDashData()
      }, 10000)
      return () => clearInterval(interval)
    }
  }, [aToken])

  return dashData && (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-200 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Page Wrapper */}
      <div className="w-full min-h-[calc(100vh-60px)] px-4 py-6 overflow-y-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <img src={assets.appointment_icon} alt="" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Overview of system statistics and latest bookings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => getDashData(true)} className="px-4 py-2 bg-white border border-blue-100 hover:bg-blue-50 text-blue-700 text-sm font-medium rounded-full shadow-sm transition">
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

          {/* Doctors */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 border border-indigo-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={assets.doctor_icon} alt="" className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {dashData.doctors || 0}
            </p>
            <p className="text-sm text-gray-600">Total Doctors</p>
          </div>

          {/* Appointments */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={assets.appointments_icon} alt="" className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {dashData.appointments || 0}
            </p>
            <p className="text-sm text-gray-600">Total Appointments</p>
          </div>

          {/* Patients */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={assets.patients_icon} alt="" className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {dashData.patients || 0}
            </p>
            <p className="text-sm text-gray-600">Total Patients</p>
          </div>

          {/* Earnings */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={assets.earning_icon} alt="" className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {currency} {dashData.earnings || 0}
            </p>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>

        </div>

        {/* Latest Bookings Section */}
        <div className=" bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          <div className=" bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Latest Bookings</h2>
                <p className="text-sm text-gray-600">Recent appointment requests</p>
              </div>
              
              {/* Filter Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    filter === 'completed'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">

            {dashData.latestAppointments
              .filter(item => {
                if (filter === 'completed') return item.isCompleted && !item.cancelled
                return true // 'all' shows everything
              })
              .length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {filter === 'completed' && 'No completed appointments'}
                    {filter === 'all' && 'No appointments found'}
                  </p>
                </div>
              ) : (
                dashData.latestAppointments
                  .filter(item => {
                    if (filter === 'completed') return item.isCompleted && !item.cancelled
                    return true // 'all' shows everything
                  })
                  .map((item, idx) => {
              const patientName = item.userId?.name || item.userData?.name || "Patient"
              const patientDate =
                slotDateFormat
                  ? slotDateFormat(item.slotDate)
                  : item.slotDate.replace(/_/g, "/")

              return (
                <div key={idx} className="px-6 py-4 hover:bg-gray-50 transition">

                  <div className="flex items-center justify-between">

                    {/* Patient Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                        <img src={item.userData?.image || item.userId?.image} alt="" className="w-full h-full object-cover rounded-full" />
                      </div>

                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{patientName}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{patientDate}</p>
                        <p className="text-xs text-blue-600 font-medium">Dr. {item.docData?.name}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">

                      {item.cancelled ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          Cancelled
                        </span>
                      ) : item.isCompleted ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          Completed
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => completeAppointment(item._id)}
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition"
                            title="Complete Appointment"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                            title="Cancel Appointment"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )
              })
              )}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard
