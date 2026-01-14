import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointment, cancelAppointment } =
    useContext(DoctorContext);
  const { calculateAge, currencySymbol } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
      const interval = setInterval(() => {
        getAppointments();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [dToken, getAppointments]);

  const handleCompleteAppointment = async (appointmentId) => {
    if (window.confirm('Mark this appointment as completed?')) {
      await completeAppointment(appointmentId);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      await cancelAppointment(appointmentId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-200 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="w-full min-h-[calc(100vh-60px)] px-4 py-6 relative z-10 overflow-y-auto">
        <div className="w-full max-w-7xl mx-auto">

          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <img src={assets.appointment_icon} alt="" className="w-6 h-6 text-white" />
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Appointments</h1>
                <p className="text-sm text-gray-600 mt-1">Manage and track your patient appointments</p>
              </div>
            </div>

            <button onClick={() => getAppointments(true)} className="px-4 py-2 bg-white border border-blue-100 hover:bg-blue-50 text-blue-700 text-sm font-medium rounded-full shadow-sm transition h-fit">
              Refresh
            </button>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-3 sm:gap-4 mb-8">
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
              <p className="text-xs text-gray-600">Total</p>
              <p className="text-lg font-bold text-gray-900">
                {appointments?.length || 0}
              </p>
            </div>

            <div className="bg-green-50 rounded-xl px-4 py-2 border border-green-100">
              <p className="text-xs text-green-600">Completed</p>
              <p className="text-lg font-bold text-green-700">
                {appointments?.filter((a) => a.isCompleted).length || 0}
              </p>
            </div>

            <div className="bg-orange-50 rounded-xl px-4 py-2 border border-orange-100">
              <p className="text-xs text-orange-600">Pending</p>
              <p className="text-lg font-bold text-orange-700">
                {appointments?.filter((a) => !a.isCompleted && !a.cancelled).length || 0}
              </p>
            </div>
          </div>

          {/* Main Appointments Table */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

            {/* Table Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 py-4 border-b border-gray-200">
              <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_2fr_2fr_1fr_1.5fr] gap-4 text-gray-700 text-sm font-semibold">
                <div className="text-center">#</div>
                <div>Patient</div>
                <div className="text-center">Payment</div>
                <div>Age</div>
                <div>Date & Time</div>
                <div className="text-center">Fees</div>
                <div className="text-center">Status</div>
              </div>

              <div className="sm:hidden text-gray-700 text-sm font-semibold mb-3">
                Appointments List
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              {appointments && appointments.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {appointments.map((item, index) => (
                    <div key={item._id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition">

                      {/* ---------------- DESKTOP VIEW ---------------- */}
                      <div className="hidden sm:grid grid-cols-[0.5fr_3fr_1fr_2fr_2fr_1fr_1.5fr] gap-4 items-center">

                        {/* Index */}
                        <div className="text-center text-gray-500">{index + 1}</div>

                        {/* Patient Info */}
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.userId?.image ||
                              'https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=U'
                            }
                            alt={item.userId?.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{item.userId?.name || 'N/A'}</p>
                            <p className="text-xs text-gray-500">{item.userId?.email || 'No email'}</p>
                          </div>
                        </div>

                        {/* Payment */}
                        <div className="text-center">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${item.paymentStatus === 'paid' || item.paymentStatus === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                              }`}
                          >
                            {item.paymentStatus === 'paid' || item.paymentStatus === 'completed'
                              ? 'Online'
                              : 'CASH'}
                          </span>
                        </div>

                        {/* Age */}
                        <div className="text-gray-600">
                          {item.userId?.dob && item.userId.dob !== 'Not Selected'
                            ? `${calculateAge(item.userId.dob)} years`
                            : 'N/A'}
                        </div>

                        {/* Date & Time */}
                        <div className="text-gray-600">
                          <p>{item.slotDate?.replace(/_/g, '/')}</p>
                          <p className="text-xs text-gray-500">{item.slotTime}</p>
                        </div>

                        {/* Fees */}
                        <div className="text-center">
                          <span className="font-semibold">
                            {currencySymbol}
                            {item.amount || '0'}
                          </span>
                        </div>

                        {/* Status / Actions */}
                        <div className="flex justify-center">
                          {item.cancelled ? (
                            <span className="px-3 py-1 rounded-full text-xs bg-red-100 text-red-700">
                              Cancelled
                            </span>
                          ) : item.isCompleted ? (
                            <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                              Completed
                            </span>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCancelAppointment(item._id)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"
                              >
                                ✕
                              </button>

                              <button
                                onClick={() => handleCompleteAppointment(item._id)}
                                className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg"
                              >
                                ✓
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* ---------------- MOBILE VIEW ---------------- */}
                      <div className="sm:hidden space-y-3">

                        {/* Top Row */}
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                item.userId?.image ||
                                'https://via.placeholder.com/40x40/3B82F6/FFFFFF?text=U'
                              }
                              className="w-10 h-10 rounded-full border"
                              alt=""
                            />

                            <div>
                              <p className="font-medium text-gray-900">{item.userId?.name}</p>
                              <p className="text-xs text-gray-500">
                                {item.userId?.dob
                                  ? `${calculateAge(item.userId.dob)} years`
                                  : 'N/A'}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold">
                              {currencySymbol}
                              {item.amount}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.slotDate?.replace(/_/g, '/')}
                            </p>
                          </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex justify-between items-center pt-2 border-t">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${item.paymentStatus === 'paid' || item.paymentStatus === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                                }`}
                            >
                              {item.paymentStatus === 'paid' ? 'Online' : 'CASH'}
                            </span>

                            <span className="text-xs text-gray-500">{item.slotTime}</span>
                          </div>

                          <div className="flex gap-2">
                            {item.cancelled ? (
                              <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs">
                                Cancelled
                              </span>
                            ) : item.isCompleted ? (
                              <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                                Completed
                              </span>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleCancelAppointment(item._id)}
                                  className="p-2 bg-red-50 text-red-600 rounded-lg"
                                >
                                  ✕
                                </button>

                                <button
                                  onClick={() => handleCompleteAppointment(item._id)}
                                  className="p-2 bg-green-50 text-green-600 rounded-lg"
                                >
                                  ✓
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center py-16 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <img src={assets.appointment_icon} alt="" className="w-8 h-8 text-gray-400 opacity-50" />
                  </div>
                  <p className="text-lg font-medium">No appointments found</p>
                  <p className="text-sm text-gray-500">There are no appointments to display.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
