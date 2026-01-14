import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Create the context
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "PKR";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ✅ Correct useState syntax
  const [doctors, setDoctors] = useState([]);

  const [token,setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):false)
  const [userData, setUserData ] = useState(false)

  // ✅ Fetch doctors from backend
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/doctor/list`);
      if (data.success) {
        setDoctors(data.doctors);
        // console.log("Doctors fetched:", data.doctors);
      } else {
        console.error("Failed to fetch doctors:", data.message);
        toast.error(data.message)
      }
    } catch (error) {
      console.error("Error fetching doctors:", error.message);
      toast.error(error.message)
    }
  };

 const loadUserProfileData = async () => {
  try {
    const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    if (data.success) {
      setUserData(data.userData)
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    toast.error(error.message)
  }
}

  // ✅ Optional: auto-fetch on mount
  useEffect(() => {
    getDoctorsData();
  }, []);

  // ✅ Provide everything needed in context
  const value = {
    doctors,getDoctorsData,
    setDoctors,
    currencySymbol,
    backendUrl,
    token,setToken,
    userData,setUserData,
    loadUserProfileData,
  };
  useEffect(()=> {
    if(token){
      loadUserProfileData()
    } else{
      setUserData(false)
    }
  },[token])


  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;