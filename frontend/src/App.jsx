import React, { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Doctors from './pages/Doctors.jsx'
import Login from './pages/Login.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import MyProfile from './pages/MyProfile.jsx'
import Appointment from './pages/Appointment.jsx'
import MyAppointments from './pages/MyAppointments.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import LoadingBar from './components/LoadingBar.jsx'
import { ToastContainer, toast } from 'react-toastify';

const App = () => {
  const location = useLocation()
  const hideFooter = ['/login', '/my-profile'].includes(location.pathname)
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

  return (
    <div className='mx-4 sm:mx-[10%]'>
      {isLoading && <LoadingBar />}
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
      </Routes>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default App