import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, getAllAppointments, appointments, cancelAppointment } =
    useContext(AdminContext);
  const { currencySymbol } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
      const interval = setInterval(() => {
        getAllAppointments();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [aToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[60%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-[45%] h-[35%] bg-blue-200 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 w-[30%] h-[30%] bg-blue-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="w-full min-h-[calc(100vh-60px)] px-4 py-6 relative z-10 overflow-y-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 w-full">
          <div className="flex items-center gap-4 w-full">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
              <img src={assets.appointment_icon} alt="" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                All Appointments
              </h1>
              <p className="text-sm text-gray-600">
                Manage every appointment across the platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 w-full lg:w-auto">
            <div className="text-center flex-1 lg:flex-none">
              <p className="text-xs text-gray-500">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-800">
                {appointments.length}
              </p>
            </div>
            <div className="text-center flex-1 lg:flex-none">
              <p className="text-xs text-gray-500">Last Updated</p>
              <p className="text-sm font-medium text-gray-700">
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col w-full">

          {/* Table Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-white">Appointments List</h2>
              <p className="text-blue-100 text-sm">
                {appointments.length} total appointments
              </p>
            </div>

            <button onClick={() => getAllAppointments(true)} className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm transition w-full sm:w-auto">
              Refresh
            </button>
          </div>

          {/* Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4">

            {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <img src={assets.appointment_icon} alt="" className="w-10 h-10 text-gray-400 opacity-50" />
                </div>
                <h3 className="text-xl font-bold text-gray-700">No Appointments</h3>
                <p className="text-gray-500">Nothing scheduled at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">

                {appointments.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-gray-100 rounded-2xl p-5 bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition w-full"
                  >

                    {/* Left Section */}
                    <div className="flex items-start sm:items-center gap-4 flex-1 w-full">

                      <div className="relative shrink-0">
                        <img
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-blue-100 object-cover"
                          src={item.docData?.image}
                          alt=""
                        />
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${item.isCompleted
                            ? "bg-green-500"
                            : item.cancelled
                              ? "bg-red-500"
                              : "bg-orange-500"
                            }`}
                        />
                      </div>

                      <div className="flex-1 overflow-hidden">

                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <p className="text-gray-900 font-bold truncate max-w-[150px] sm:max-w-none">
                            {item.docData?.name}
                          </p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${item.isCompleted
                              ? "bg-green-50 text-green-700"
                              : item.cancelled
                                ? "bg-red-50 text-red-700"
                                : "bg-orange-50 text-orange-700"
                              }`}
                          >
                            {item.isCompleted
                              ? "Completed"
                              : item.cancelled
                                ? "Cancelled"
                                : "Pending"}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">

                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0" />
                            </svg>
                            <span>{item.userData?.name}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor">
                              <path strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10" />
                            </svg>
                            <span>{item.slotDate?.replace(/_/g, "/")}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor">
                              <path strokeWidth={2} d="M12 8v4l3 3" />
                            </svg>
                            <span>{item.slotTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center sm:items-end gap-4 w-full sm:w-auto justify-between sm:justify-end">

                      <div className="text-right">
                        <p className="text-xs text-gray-500">Amount</p>
                        <p className="text-lg font-bold text-gray-900">
                          {currencySymbol} {item.amount}
                        </p>
                      </div>

                      {!item.cancelled && !item.isCompleted && (
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 rounded-xl transition"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor">
                            <path strokeWidth={2} d="M19 7L18 20H6L5 7" />
                          </svg>
                          <span className="text-red-600 text-sm font-medium">
                            Cancel
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AllAppointments;
