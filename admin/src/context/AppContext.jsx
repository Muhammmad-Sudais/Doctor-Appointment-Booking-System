import { createContext } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {
    const currency = "PKR"

    const calculateAge = (dob) => {
        if (!dob || dob === 'Not Selected' || dob === '') {
            return 'N/A'
        }
        
        try {
            const today = new Date()
            const birthDate = new Date(dob)
            
            // Check if date is valid
            if (isNaN(birthDate.getTime())) {
                return 'N/A'
            }
            
            let age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()
            
            // Adjust age if birthday hasn't occurred this year yet
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--
            }
            
            return age.toString()
        } catch (error) {
            return 'N/A'
        }
    }

    const value = {
        calculateAge,
        currency
    }
    
    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider