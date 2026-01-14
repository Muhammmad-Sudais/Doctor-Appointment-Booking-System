import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorDashboard = () => {

  const {
    dToken,
    dashData,
    getDashData,
    completeAppointment,
    cancelAppointment
  } = useContext(DoctorContext)

  const { currencySymbol, slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (dToken) {
      getDashData()
      const interval = setInterval(() => {
        getDashData()
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [dToken])

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
              <img src={assets.doctor_icon} alt="" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Doctor Dashboard
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Overview of your earnings, patients, and latest bookings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={getDashData} className="px-4 py-2 bg-white border border-blue-100 hover:bg-blue-50 text-blue-700 text-sm font-medium rounded-full shadow-sm transition">
              Refresh
            </button>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 text-blue-700 text-sm font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

          {/* Earnings */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={assets.earning_icon} alt="" className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {currencySymbol} {dashData.earnings}
            </p>
            <p className="text-sm text-gray-600">Total Earnings</p>
          </div>

          {/* Appointments */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <img src={assets.appointments_icon} alt="" className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {dashData.appointments}
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
              {dashData.patients}
            </p>
            <p className="text-sm text-gray-600">Total Patients</p>
          </div>

        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">Latest Bookings</h2>
            <p className="text-sm text-gray-600">Recent appointment requests</p>
          </div>

          <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">

            {dashData.latestAppointments.map((item, idx) => {
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
                        <img src={assets.people_icon} alt="" className="w-5 h-5 text-blue-600" />
                      </div>

                      <div>
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{patientName}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{patientDate}</p>
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
                        <div className="flex gap-2">

                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>

                          <button
                            onClick={() => completeAppointment(item._id)}
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>

                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )
            })}

          </div>

        </div>

      </div>

    </div>
  )
}

export default DoctorDashboard
