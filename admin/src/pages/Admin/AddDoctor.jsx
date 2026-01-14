import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!aToken) {
        toast.error("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }

      if (!docImg) {
        toast.error("Image Not Selected");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      const config = {
        headers: {
          Authorization: `Bearer ${aToken}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const { data } = await axios.post(
        `${backendUrl}/api/admin/add-doctor`,
        formData,
        config
      );

      if (data.success) {
        toast.success(data.message);
        resetForm();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Unauthorized: Token Invalid");
        } else if (error.response.status === 403) {
          toast.error("Forbidden: No permission");
        } else if (error.response.status === 400) {
          toast.error(error.response.data.message || "Invalid data");
        } else if (error.response.status === 500) {
          toast.error("Server error");
        } else {
          toast.error(error.response.data?.message || "Error occurred");
        }
      } else {
        toast.error("Unable to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDocImg(false);
    setName("");
    setEmail("");
    setPassword("");
    setExperience("1 Year");
    setFees("");
    setAbout("");
    setSpeciality("General physician");
    setDegree("");
    setAddress1("");
    setAddress2("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden">
      {/* Background Blur Decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-200 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="w-full px-4 py-6 relative z-10 flex items-start justify-center">
        <form
          onSubmit={onSubmitHandler}
          className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 lg:p-10 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Add New Doctor
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Fill out the doctor details to add them into the system
              </p>
            </div>
          </div>

          {/* Grid Layout - Responsive */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* LEFT SIDE */}
            <div className="flex flex-col gap-6">

              {/* Upload Image */}
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-6">
                <div className="flex items-center gap-6">
                  <label htmlFor="doc-img" className="relative cursor-pointer group">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-white rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 group-hover:border-blue-500 transition-all duration-300">
                      {docImg ? (
                        <img
                          src={URL.createObjectURL(docImg)}
                          alt="Doctor Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-center">
                          <svg className="w-8 h-8 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="text-xs text-gray-500">Upload Photo</span>
                        </div>
                      )}
                    </div>
                  </label>

                  <input
                    type="file"
                    id="doc-img"
                    hidden
                    accept="image/*"
                    onChange={(e) => setDocImg(e.target.files[0])}
                  />

                  <div>
                    <p className="font-medium text-gray-800">Doctor Photo</p>
                    <p className="text-xs text-gray-500">JPG or PNG — Max 2MB</p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white rounded-2xl border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>

                <div className="space-y-4">
                  <Input label="Full Name" value={name} setValue={setName} placeholder="Dr. John Doe" />
                  <Input label="Email Address" type="email" value={email} setValue={setEmail} placeholder="doctor@mail.com" />
                  <Input label="Password" type="password" value={password} setValue={setPassword} placeholder="••••••••" minLength={6} />
                </div>
              </div>

              {/* Professional */}
              <div className="bg-white rounded-2xl border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>

                <div className="space-y-4">
                  {/* Experience */}
                  <Select
                    label="Experience"
                    value={experience}
                    setValue={setExperience}
                    options={["1 Year", "2 Year", "3 Year", "4 Year", "5 Year", "6 Year", "7 Year", "8 Year", "9 Year", "10 Year"]}
                  />

                  {/* Fees */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consultation Fee</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={fees}
                        onChange={(e) => setFees(e.target.value)}
                        className="w-full border rounded-xl pl-8 py-3"
                        placeholder="100"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col gap-6">
              {/* Medical Info */}
              <div className="bg-white rounded-2xl border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>

                <div className="space-y-4">
                  <Select
                    label="Speciality"
                    value={speciality}
                    setValue={setSpeciality}
                    options={[
                      "General physician",
                      "Gynecologist",
                      "Dermatologist",
                      "Pediatricians",
                      "Neurologist",
                      "Gastroenterologist",
                    ]}
                  />

                  <Input label="Education & Degrees" value={degree} setValue={setDegree} placeholder="MBBS, MD..." />
                </div>
              </div>

              {/* Location */}
              <div className="bg-white rounded-2xl border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Location</h3>

                <div className="space-y-4">
                  <Input label="Address Line 1" value={address1} setValue={setAddress1} placeholder="Street / Building" />
                  <Input label="Address Line 2" value={address2} setValue={setAddress2} placeholder="City, Area (optional)" />
                </div>
              </div>

              {/* About */}
              <div className="bg-white rounded-2xl border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Doctor</h3>

                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full h-40 border rounded-xl p-4"
                  placeholder="Write about experience, expertise, and background..."
                  required
                ></textarea>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mt-10">
            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              {loading ? "Adding Doctor..." : "Add Doctor"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="px-10 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* Reusable Components */
const Input = ({ label, type = "text", value, setValue, placeholder, ...rest }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full border border-gray-300 rounded-xl px-4 py-3"
      placeholder={placeholder}
      {...rest}
    />
  </div>
);

const Select = ({ label, value, setValue, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="w-full border border-gray-300 rounded-xl px-4 py-3"
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default AddDoctor;
