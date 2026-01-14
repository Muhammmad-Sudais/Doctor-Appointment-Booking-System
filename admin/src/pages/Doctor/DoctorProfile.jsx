import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData, backendUrl } = useContext(DoctorContext)
  const { currencySymbol } = useContext(AppContext)

  const [isEdit, setIsEdit] = useState(false)

  const updateProfile = async () => {
    try {
      const updateData = {
        address: profileData.address,
        fees: profileData.fees,
        available: profileData.available
      }

      const { data } = await axios.post(
        backendUrl + '/api/doctor/update-profile',
        updateData,
        { headers: { Authorization: `Bearer ${dToken}` } }
      )

      if (data.success) {
        toast.success(data.message)
        setIsEdit(false)
        getProfileData()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    }
  }

  useEffect(() => {
    if (dToken) getProfileData()
  }, [dToken])

  return profileData && (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-200 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="w-full min-h-[calc(100vh-60px)] px-4 py-6 overflow-y-auto relative z-10 flex justify-center">
        <div className="w-full max-w-6xl">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
                <p className="text-sm text-gray-600 mt-1">Manage your professional information</p>
              </div>
            </div>

            <button
              onClick={() => setIsEdit(!isEdit)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 text-lg"
            >
              {isEdit ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </>
              )}
            </button>
          </div>

          {/* Content Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">

            {/* Top Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative">
                  <img 
                    className="w-28 h-28 sm:w-36 sm:h-36 object-cover rounded-2xl border-4 border-white shadow-xl"
                    src={profileData.image}
                    alt="Doctor"
                  />
                  <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-2xl font-bold text-white">{profileData.name}</h2>
                  <p className="text-blue-100 text-sm mb-3">
                    {profileData.degree} • {profileData.speciality}
                  </p>

                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      profileData.available ? 'bg-white/20 text-white' : 'bg-red-500/20 text-red-100'
                    }`}>
                      {profileData.available ? 'Available' : 'Unavailable'}
                    </span>

                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                      {profileData.experience} Years
                    </span>

                    <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium">
                      {currencySymbol} {profileData.fees}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* ABOUT */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl">
                      {profileData.about}
                    </p>
                  </div>

                  {/* FEES */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      Consultation Fee
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      {isEdit ? (
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold">{currencySymbol}</span>
                          <input
                            type="number"
                            className="text-2xl font-bold bg-white border border-gray-300 rounded-lg px-3 py-2 w-32 focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))}
                            value={profileData.fees}
                          />
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-gray-900">
                          {currencySymbol} {profileData.fees}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ADDRESS + AVAILABILITY */}
                <div className="space-y-6">

                  {/* ADDRESS */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      Clinic Address
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      {isEdit ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg"
                            onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))}
                            value={profileData.address.line1}
                            placeholder="Address Line 1"
                          />
                          <input
                            type="text"
                            className="w-full px-4 py-2 border rounded-lg"
                            onChange={(e) => setProfileData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))}
                            value={profileData.address.line2}
                            placeholder="Address Line 2"
                          />
                        </div>
                      ) : (
                        <div className="text-gray-900">
                          <p>{profileData.address.line1}</p>
                          {profileData.address.line2 && <p>{profileData.address.line2}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AVAILABILITY */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      Availability Status
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={profileData.available}
                            onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                            disabled={!isEdit}
                          />
                          <div className={`relative w-12 h-6 rounded-full transition-all ${
                            profileData.available ? 'bg-green-500' : 'bg-gray-300'
                          } ${!isEdit && 'opacity-50 cursor-not-allowed'}`}>
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              profileData.available ? 'translate-x-6' : 'translate-x-0'
                            }`} />
                          </div>
                        </label>
                        <span className="text-gray-900 font-medium">
                          {profileData.available ? 'Available for appointments' : 'Currently unavailable'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              {isEdit && (
                <div className="flex flex-col sm:flex-row gap-4 mt-8 border-t pt-6">
                  <button
                    onClick={updateProfile}
                    className="w-full sm:w-auto flex-1 px-6 py-3 bg-green-600 text-white rounded-xl shadow-lg hover:bg-green-700"
                  >
                    Save Changes
                  </button>

                  <button
                    onClick={() => {
                      setIsEdit(false)
                      getProfileData()
                    }}
                    className="w-full sm:w-auto flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default DoctorProfile
