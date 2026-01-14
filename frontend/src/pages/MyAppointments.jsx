import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData, currencySymbol } =
    useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const navigate = useNavigate();

  const getAppointments = async () => {
    try {
      // Only set loading true on initial fetch if appointments are empty
      if (appointments.length === 0) setLoading(true);

      const { data } = await axios.get(
        `${backendUrl}/api/user/appointments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        // Filter out cancelled appointments
        setAppointments((data.appointments || []).filter(app => !app.cancelled));
      } else {
        toast.error(data.message || "Failed to load appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Don't show toast on polling errors to avoid spamming
      if (appointments.length === 0) {
        toast.error(
          error.response?.data?.message || "Failed to load appointments"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/razorpay/order`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!data.success) {
        toast.error(data.message || "Unable to initiate payment");
        return;
      }

      const order = data.order;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Appointment Payment",
        description: "Consultation Fee",
        order_id: order.id,
        handler: async (response) => {
          try {
            const verifyRes = await axios.post(
              `${backendUrl}/api/user/razorpay/verify`,
              {
                appointmentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful");
              getAppointments();
              getDoctorsData();
            } else {
              toast.error(
                verifyRes.data.message || "Payment verification failed"
              );
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("Payment verification failed");
          }
        },
        theme: {
          color: "#2563EB",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message || "Failed to initiate payment"
      );
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setCancellingId(appointmentId);
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message || "Appointment cancelled");
        getAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message || "Failed to cancel appointment");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel appointment"
      );
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    if (token) {
      getAppointments();
      const interval = setInterval(() => {
        getAppointments();
      }, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [token]);

  if (loading && appointments.length === 0) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-16">
        <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
          <div className="relative mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Loading your appointments
          </h2>
          <p className="text-gray-500 text-sm">
            Please wait while we fetch your latest appointments...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-12">
      {/* Background blobs for subtle depth */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Page header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Appointments
          </h1>
          <p className="text-gray-500 text-sm">
            Review your upcoming and past consultations.
          </p>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-3 rounded-full" />
        </div>

        {appointments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Appointments Yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm">
              You haven&apos;t booked any appointments yet. Browse our doctors
              to schedule your first consultation.
            </p>
            <button
              onClick={() => navigate("/doctors")}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Browse Doctors
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {appointments.map((item, index) => (
              <div
                key={item._id || index}
                className={`relative bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg
                  ${item.cancelled
                    ? "border-red-200 bg-red-50/60"
                    : item.isCompleted
                      ? "border-blue-200 bg-blue-50/60"
                      : item.paymentStatus === "paid"
                        ? "border-green-200 bg-green-50/60"
                        : "border-gray-100"
                  }`}
              >
                {/* Accent bar */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${item.cancelled
                    ? "bg-red-400"
                    : item.isCompleted
                      ? "bg-blue-500"
                      : item.paymentStatus === "paid"
                        ? "bg-green-500"
                        : "bg-blue-400"
                    }`}
                />

                <div className="p-5 md:p-6 pl-6">
                  {/* Header: doctor + status chip */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100 shadow-xs">
                          <img
                            src={item.docId?.image || "/default-doctor.png"}
                            alt={item.docId?.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "/default-doctor.png";
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900">
                          {item.docId?.name || "Doctor"}
                        </h3>
                        <p className="text-xs md:text-sm text-blue-600 font-medium">
                          {item.docId?.speciality || "Speciality"}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                          {item.docId?.degree || "Degree"}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${item.cancelled
                          ? "bg-red-100 text-red-700"
                          : item.isCompleted
                            ? "bg-blue-100 text-blue-700"
                            : item.paymentStatus === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current" />
                      {item.cancelled
                        ? "Cancelled"
                        : item.isCompleted
                          ? "Completed"
                          : item.paymentStatus === "paid"
                            ? "Paid"
                            : "Pending"}
                    </span>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    <div className="bg-white/70 rounded-xl border border-gray-100 p-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Date &amp; Time
                      </p>
                      <p className="text-gray-800 font-medium">
                        {item.slotDate
                          ? item.slotDate.replace(/_/g, "/")
                          : "N/A"}{" "}
                        - {item.slotTime || "N/A"}
                      </p>
                    </div>

                    <div className="bg-white/70 rounded-xl border border-gray-100 p-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Consultation Fee
                      </p>
                      <p className="text-green-600 font-semibold">
                        {item.amount || item.docId?.fees}{" "}
                        {currencySymbol || "PKR"}
                      </p>
                    </div>

                    <div className="bg-white/70 rounded-xl border border-gray-100 p-3">
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Experience
                      </p>
                      <p className="text-gray-800">
                        {item.docId?.experience
                          ? `${item.docId.experience} years`
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Extra doctor info */}
                  <div className="text-xs md:text-sm text-gray-600 mb-4">
                    <p className="font-medium text-gray-700 mb-1">
                      Doctor Information
                    </p>
                    <p>
                      Fees: {item.docId?.fees || item.amount}{" "}
                      {currencySymbol || "PKR"}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-100">
                    {!item.cancelled &&
                      !item.isCompleted &&
                      item.paymentStatus !== "paid" ? (
                      <>
                        <button
                          onClick={() => appointmentRazorpay(item._id)}
                          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          Pay Online
                        </button>
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          disabled={cancellingId === item._id}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs md:text-sm font-medium border transition-all duration-300 ${cancellingId === item._id
                            ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
                            : "bg-white text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                            }`}
                        >
                          {cancellingId === item._id ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-1 h-4 w-4 text-gray-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                              </svg>
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              Cancel
                            </>
                          )}
                        </button>
                      </>
                    ) : item.cancelled ? (
                      <span className="sm:min-w-40 inline-flex items-center justify-center px-4 py-2 rounded-lg border border-red-400 text-red-600 bg-red-50 text-xs md:text-sm font-medium">
                        Appointment Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className="sm:min-w-40 inline-flex items-center justify-center px-4 py-2 rounded-lg border border-blue-400 text-blue-600 bg-blue-50 text-xs md:text-sm font-medium">
                        Consultation Completed
                      </span>
                    ) : item.paymentStatus === "paid" ? (
                      <span className="sm:min-w-40 inline-flex items-center justify-center px-4 py-2 rounded-lg border border-green-400 text-green-600 bg-green-50 text-xs md:text-sm font-medium">
                        Payment Confirmed
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAppointments;