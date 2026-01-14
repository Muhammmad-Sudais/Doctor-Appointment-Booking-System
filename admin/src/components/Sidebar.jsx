import React, { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { NavLink } from 'react-router-dom';
import { assets } from '../assets/assets';

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  const renderLink = (to, icon, label) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 py-3.5 px-3 md:px-8 md:min-w-[180px] cursor-pointer transition-colors duration-200 ${
          isActive ? 'bg-[#F2F3FF] border-r-4 border-[#5f6FFF]' : 'hover:bg-gray-50'
        }`
      }
    >
      <img src={icon} alt={label} className="w-5 h-5 sm:w-6 sm:h-6" />
      <p className="hidden md:block text-gray-700 font-medium">{label}</p>
    </NavLink>
  );

  return (
    <div className="h-[calc(100vh-60px)] bg-white shadow-lg sticky top-14 overflow-hidden">
      {aToken && (
        <ul className="text-[#515151] h-full flex flex-col">
          {renderLink('/admin-dashboard', assets.home_icon, 'Dashboard')}
          {renderLink('/all-appointments', assets.appointment_icon, 'Appointments')}
          {renderLink('/add-doctor', assets.add_icon, 'Add Doctor')}
          {renderLink('/doctor-list', assets.people_icon, 'Doctors List')}
        </ul>
      )}

      {dToken && (
        <ul className="text-[#515151] h-full flex flex-col">
          {renderLink('/doctor-dashboard', assets.home_icon, 'Dashboard')}
          {renderLink('/doctor-appointments', assets.appointment_icon, 'Appointments')}
          {renderLink('/doctor-profile', assets.people_icon, 'Profile')}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
