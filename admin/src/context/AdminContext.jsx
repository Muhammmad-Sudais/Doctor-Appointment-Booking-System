import { createContext, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify"


export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([])
    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)

    const getAllDoctors = async (manual = false) => {
        try {
            const { data } = await axios.post(backendUrl + "/api/admin/all-doctors", {}, { headers: { aToken } })
            if (data.success) {
                setDoctors(data.doctors)
                if (manual) toast.success('Doctors list refreshed')
                console.log(data.doctors)

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/change-availability', { docId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()

            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllAppointments = async (manual = false) => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })

            if (data.success) {
                setAppointments(data.appointments)
                if (manual) toast.success('Appointments list refreshed')
                console.log(data.appointments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)

        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/complete-appointment', { appointmentId }, { headers: { aToken } })
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
                getDashData(true) // Refresh dashboard to update revenue with manual flag
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashData = async (manual = false) => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })

            if (data.success) {
                setDashData(data.dashData)
                if (manual) toast.success('Dashboard data refreshed')
                console.log(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.error('Dashboard refresh error:', error)
            toast.error(error.response?.data?.message || 'Failed to refresh dashboard')
        }
    }
    const value = {
        aToken, setAToken,
        backendUrl, doctors,
        getAllDoctors,
        changeAvailability,
        appointments, setAppointments,
        getAllAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, getDashData
    }
    return (
        <AdminContext.Provider value={value} >
            {props.children}
        </AdminContext.Provider >
    )
}
export default AdminContextProvider