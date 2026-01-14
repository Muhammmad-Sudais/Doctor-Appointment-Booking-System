import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const [dToken, setDToken] = useState(localStorage.getItem('dToken') ? localStorage.getItem('dToken') : '')

  const [appointments, setAppointments] = useState([])
  const [dashData, setDashData] = useState(false)
  const [profileData, setProfileData] = useState(false)

  const getAppointments = async (manual = false) => {
    try {

      const { data } = await axios.get(backendUrl + '/api/doctor/appointments', {
        headers: {
          Authorization: `Bearer ${dToken}`
        }
      })

      if (data.success) {
        setAppointments(data.appointments)
        if (manual) toast.success('Appointments refreshed')
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log('Get appointments error:', error);
      toast.error(error.response?.data?.message || error.message)
    }
  }

  const getDashData = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', {
        headers: {
          Authorization: `Bearer ${dToken}`
        }
      })
      if (data.success) {
        setDashData(data.dashData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const getProfileData = async () => {
    try {

      const { data } = await axios.get(backendUrl + '/api/doctor/profile', {
        headers: {
          Authorization: `Bearer ${dToken}`
        }
      })
      if (data.success) {
        setProfileData(data.profileData)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/cancel-appointment`,
        { appointmentId },
        {
          headers: {
            'Authorization': `Bearer ${dToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log('Cancel appointment error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('dToken');
        setDToken(null);
      } else {
        toast.error(error.response?.data?.message || 'Failed to cancel appointment');
      }
    }
  };

  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/doctor/complete-appointment`,
        { appointmentId },
        {
          headers: {
            'Authorization': `Bearer ${dToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log('Complete appointment error:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('dToken');
        setDToken(null);
      } else {
        toast.error(error.response?.data?.message || 'Failed to complete appointment');
      }
    }
  };

  const value = {
    dToken, setDToken,
    backendUrl,
    appointments, setAppointments, getAppointments, completeAppointment, cancelAppointment,
    dashData, setDashData, getDashData,
    profileData, setProfileData, getProfileData,
  }

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider