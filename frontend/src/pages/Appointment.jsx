import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData, userData } = useContext(AppContext);
  const daysOfWeeks = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState({});

  // Handle time slot selection with login check
  const handleTimeSlotClick = (time, isBooked) => {
    if (!token) {
      toast.warn("Please login to select a time slot");
      navigate('/login');
      return;
    }
    if (!isBooked) {
      setSlotTime(time);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      navigate('/login');
      return;
    }

    if (!slotTime) {
      toast.error("Please select a time slot");
      return;
    }

    if (!userData || !userData._id) {
      toast.error("User data loading, please wait...");
      return;
    }

    // Check if doctor is available
    if (!docInfo.available) {
      toast.error("Doctor is currently unavailable for booking");
      return;
    }

    setLoading(true);

    try {
      const date = docSlots[slotIndex][0].datetime;
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = `${day}_${month}_${year}`;

      // Create complete appointment data with all required fields
      const appointmentData = {
        userId: userData._id,
        docId: docId,
        slotDate: slotDate,
        slotTime: slotTime,
        userData: {
          _id: userData._id,
          name: userData.name,
          email: userData.email
        },
        docData: {
          _id: docInfo._id,
          name: docInfo.name,
          speciality: docInfo.speciality,
          degree: docInfo.degree,
          fees: docInfo.fees,
          image: docInfo.image,
          experience: docInfo.experience
        },
        amount: docInfo.fees
      };

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        appointmentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        // Update booked slots locally
        updateBookedSlots(slotDate, slotTime);
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error('Booking error:', error);
      console.error('Error response:', error.response?.data);

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to book appointment");
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to update booked slots locally
  const updateBookedSlots = (date, time) => {
    setBookedSlots(prev => ({
      ...prev,
      [date]: [...(prev[date] || []), time]
    }));
  };

  // Refresh doctor data when component mounts to get latest slot availability
  useEffect(() => {
    getDoctorsData();
  }, []);

  // Load doctor's booked slots when doctor info is available
  useEffect(() => {
    if (docInfo && docInfo.slots_booked) {
      setBookedSlots(docInfo.slots_booked);
    }
  }, [docInfo]);

  useEffect(() => {
    if (doctors.length > 0) {
      const foundDoctor = doctors.find(doc => doc._id === docId);
      setDocInfo(foundDoctor || null);
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      generateSlots();
    }
  }, [docInfo]);

  const generateSlots = () => {
    const slots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      const timeSlots = [];
      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        const slotDateStr = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;
        const isBooked = bookedSlots[slotDateStr]?.includes(formattedTime);

        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
          isBooked: isBooked
        });

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      slots.push(timeSlots);
    }

    setDocSlots(slots);
  };

  // Regenerate slots when bookedSlots changes
  useEffect(() => {
    if (docInfo) {
      generateSlots();
    }
  }, [bookedSlots]);

  if (!docInfo) {
    return (
      <div className="text-center text-gray-500 mt-10">
        Doctor not found or loading...
      </div>
    );
  }

  // If doctor is unavailable, show message
  if (!docInfo.available) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Doctor Unavailable</h2>
          <p className="text-gray-600 mb-6">Dr. {docInfo.name} is currently not available for appointments. Please check back later or choose another doctor.</p>
          <button
            onClick={() => navigate('/doctors')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
          >
            Find Other Doctors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-100 rounded-full blur-3xl opacity-50" />

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Doctor Info Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Doctor Image */}
            <div className="md:w-80 lg:w-96 bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-white rounded-2xl opacity-80 blur-xl" />
                <img
                  className="relative w-64 h-64 object-cover rounded-2xl shadow-2xl border-4 border-white"
                  src={docInfo.image}
                  alt={docInfo.name}
                />
                {/* Availability Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${docInfo.available
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    {docInfo.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              </div>
            </div>

            {/* Doctor Details */}
            <div className="flex-1 p-8 lg:p-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {docInfo.name}
                    </h1>
                    <img className="w-6 h-6" src={assets.verified_icon} alt="Verified" />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="text-gray-700 font-medium">
                      {docInfo.degree}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-blue-600 font-semibold">
                      {docInfo.speciality}
                    </span>
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                      {docInfo.experience}
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <img src={assets.info_icon} alt="Info" className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">About</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
                  {docInfo.about}
                </p>
              </div>

              {/* Fee Section */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Consultation Fee</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {docInfo.fees} <span className="text-lg text-gray-600">{currencySymbol}</span>
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Slots Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 lg:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🗓️ Booking Slots</h2>
            <p className="text-gray-600">Select your preferred date and time</p>
          </div>

          {/* Date Selection */}
          <div className="mb-8">
            <div className="flex gap-3 overflow-x-auto pb-4">
              {docSlots.map((daySlots, index) => {
                const hasAvailableSlots = daySlots.some(slot => !slot.isBooked);
                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (hasAvailableSlots) {
                        setSlotIndex(index);
                        setSlotTime(null);
                      }
                    }}
                    className={`text-center px-5 py-4 min-w-24 rounded-2xl cursor-pointer transition-all duration-300 transform ${slotIndex === index
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl scale-105'
                      : hasAvailableSlots
                        ? 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-lg hover:-translate-y-1'
                        : 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                  >
                    <p className="font-bold text-lg mb-1">
                      {daySlots[0] ? daysOfWeeks[daySlots[0].datetime.getDay()] : 'N/A'}
                    </p>
                    <p className="text-2xl font-bold mb-1">
                      {daySlots[0] ? daySlots[0].datetime.getDate() : '--'}
                    </p>
                    {!hasAvailableSlots && (
                      <p className="text-xs text-red-500 font-medium mt-2">Fully Booked</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Time Slots */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Available Times</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.isArray(docSlots[slotIndex]) && docSlots[slotIndex].map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSlotClick(item.time, item.isBooked)}
                  disabled={item.isBooked}
                  className={`relative px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform ${item.time === slotTime
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                    : item.isBooked
                      ? 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed line-through'
                      : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                    }`}
                >
                  {item.time}
                  {item.isBooked && (
                    <span className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 rounded-xl">
                      <span className="text-xs text-white font-medium">Booked</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Slot Display */}
          {slotTime && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected Appointment</p>
                  <p className="text-xl font-bold text-gray-900">
                    {daysOfWeeks[docSlots[slotIndex][0].datetime.getDay()]}, {docSlots[slotIndex][0].datetime.getDate()} at {slotTime}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Book Button */}
          <div className="text-center">
            <button
              onClick={bookAppointment}
              disabled={!slotTime || loading || !userData}
              className={`px-12 py-4 rounded-full text-lg font-bold transition-all duration-300 transform ${!slotTime || loading || !userData
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1'
                }`}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Booking...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{!userData ? 'Loading...' : 'Book Appointment'}</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Related Doctors Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
        </div>
      </div>
    </div>
  );
};

export default Appointment;