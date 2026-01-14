import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateUserProfileData = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", userData.name || "");
      formData.append("phone", userData.phone || "");
      formData.append("gender", userData.gender || "");
      formData.append("dob", userData.dob || "");

      if (userData.address) {
        formData.append(
          "address",
          JSON.stringify({
            line1: userData.address.line1 || "",
            line2: userData.address.line2 || "",
          })
        );
      } else {
        formData.append(
          "address",
          JSON.stringify({ line1: "", line2: "" })
        );
      }

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (isEdit) {
      updateUserProfileData();
    } else {
      setIsEdit(true);
    }
  };

  const handleCancel = () => {
    setIsEdit(false);
    setImage(null);
    loadUserProfileData();
  };

  const handleInputChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value,
      },
    }));
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-10 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Profile Image Section */}
              <div className="flex flex-col items-center md:items-start">
                {isEdit ? (
                  <label htmlFor="image" className="cursor-pointer group">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 p-1">
                        <img
                          className="w-full h-full rounded-full object-cover border-4 border-white transition-all duration-300 group-hover:border-blue-200"
                          src={
                            image
                              ? URL.createObjectURL(image)
                              : userData.image
                          }
                          alt="Profile preview"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-300">
                        <div className="bg-white/90 p-2 rounded-full transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <img
                            className="w-6 h-6"
                            src={assets.upload_icon}
                            alt="Upload"
                          />
                        </div>
                      </div>
                    </div>
                    <input
                      onChange={(e) => setImage(e.target.files[0])}
                      type="file"
                      id="image"
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 p-1">
                      <img
                        src={userData.image}
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover border-4 border-white transition-all duration-300 group-hover:border-blue-200"
                      />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                )}
              </div>

              {/* User Info Section */}
              <div className="flex-1 text-center md:text-left">
                {isEdit ? (
                  <input
                    type="text"
                    value={userData.name || ""}
                    onChange={(e) =>
                      handleInputChange("name", e.target.value)
                    }
                    className="text-3xl font-bold text-gray-900 border-b-2 border-transparent focus:border-blue-500 focus:outline-none w-full bg-transparent transition-all duration-300"
                    placeholder="Enter your name"
                  />
                ) : (
                  <div className="flex flex-col md:flex-row items-center gap-3">
                    <h2 className="text-3xl font-bold text-gray-900">
                      {userData.name}
                    </h2>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Active
                    </span>
                  </div>
                )}
                <p className="text-gray-600 mt-2">{userData.email}</p>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 justify-center md:justify-start">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5 ${
                      isEdit
                        ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg hover:shadow-green-100"
                        : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-100"
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        Saving...
                      </>
                    ) : isEdit ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Changes
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit Profile
                      </>
                    )}
                  </button>
                  {isEdit && (
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="px-6 py-2.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
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
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="group">
                <label className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                  Phone Number
                </label>
                {isEdit ? (
                  <input
                    type="tel"
                    value={userData.phone || ""}
                    onChange={(e) =>
                      handleInputChange("phone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="text-gray-800 mt-1 group-hover:text-gray-900 transition-colors duration-300">
                    {userData.phone || "Not provided"}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                  Email Address
                </label>
                <p className="text-gray-800 mt-1 group-hover:text-gray-900 transition-colors duration-300">
                  {userData.email}
                </p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="group">
                <label className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                  Gender
                </label>
                {isEdit ? (
                  <select
                    value={userData.gender || ""}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="text-gray-800 mt-1 group-hover:text-gray-900 transition-colors duration-300">
                    {userData.gender || "Not specified"}
                  </p>
                )}
              </div>

              <div className="group">
                <label className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                  Date of Birth
                </label>
                {isEdit ? (
                  <input
                    type="date"
                    value={userData.dob || ""}
                    onChange={(e) =>
                      handleInputChange("dob", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                  />
                ) : (
                  <p className="text-gray-800 mt-1 group-hover:text-gray-900 transition-colors duration-300">
                    {userData.dob || "Not specified"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6 hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            Address Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group">
              <label className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                Address Line 1
              </label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.address?.line1 || ""}
                  onChange={(e) =>
                    handleAddressChange("line1", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter address line 1"
                />
              ) : (
                <p className="text-gray-800 mt-1 group-hover:text-gray-900 transition-colors duration-300">
                  {userData.address?.line1 || "Not provided"}
                </p>
              )}
            </div>

            <div className="group">
              <label className="text-sm font-medium text-gray-500 group-hover:text-blue-600 transition-colors duration-300">
                Address Line 2
              </label>
              {isEdit ? (
                <input
                  type="text"
                  value={userData.address?.line2 || ""}
                  onChange={(e) =>
                    handleAddressChange("line2", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300"
                  placeholder="Enter address line 2"
                />
              ) : (
                <p className="text-gray-800 mt-1 group-hover:text-gray-900 transition-colors duration-300">
                  {userData.address?.line2 || "Not provided"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;