import React, { useContext, useEffect, useState } from 'react'
import Login from './pages/Login.jsx'
import { ToastContainer, toast } from 'react-toastify';
import { AdminContext } from './context/AdminContext.jsx';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import LoadingBar from './components/LoadingBar.jsx';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard.jsx';
import AllAppointments from './pages/Admin/AllAppointments.jsx';
import AddDoctor from './pages/Admin/AddDoctor.jsx';
import DoctorsList from './pages/Admin/DoctorsList.jsx';
import { DoctorContext } from './context/DoctorContext.jsx';
import DoctorDashboard from './pages/Doctor/DoctorDashboard.jsx';
import DoctorAppointments from './pages/Doctor/DoctorAppointments.jsx';
import DoctorProfile from './pages/Doctor/DoctorProfile.jsx';

const App = () => {
  const location = useLocation()
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPath, setCurrentPath] = useState(location.pathname)

  useEffect(() => {
    if (location.pathname !== currentPath) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
        setCurrentPath(location.pathname)
      }, 800) // Show loading for 800ms
      
      return () => clearTimeout(timer)
    }
  }, [location.pathname, currentPath])

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      {isLoading && <LoadingBar />}
      <ToastContainer />
      <Navbar />
      <div className='grid grid-cols-[auto_1fr] items-start'>
        <Sidebar />
        <Routes>
          {/* //admin route */}
          <Route path='/' element={aToken ? <Navigate to='/admin-dashboard' /> : <Navigate to='/doctor-dashboard' />} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          {/* doctor route  */}
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
        </Routes>
      </div>
    </div>
  ) : (
    <>
      {isLoading && <LoadingBar />}
      <Login />
      <ToastContainer />
    </>
  )
}

export default App