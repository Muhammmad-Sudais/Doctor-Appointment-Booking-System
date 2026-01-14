import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (currentState === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });

        if (data.success) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          toast.success("Account created successfully");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });

        if (data.success) {
          setToken(data.token);
          localStorage.setItem("token", data.token);
          toast.success("Login successful");
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4 py-10 flex items-center justify-center">
      {/* Background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left: DocBook info */}
        <div className="hidden md:flex flex-col gap-6">
          <div className="flex items-center gap-3">
            {/* DocBook logo with SVG */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 flex items-center justify-center shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Stethoscope-like icon */}
                <path d="M6 4v6a4 4 0 0 0 8 0V4" />
                <path d="M8 4h4" />
                <path d="M14 11a4 4 0 1 0 4 4v-2" />
                <circle cx="18" cy="7" r="2" />
              </svg>
            </div>
            <div className="flex flex-col leading-tight">
              <h1 className="text-2xl font-black text-gray-900">
                DocBook
              </h1>
              <p className="text-[11px] uppercase tracking-[0.24em] text-blue-500">
                Patient Portal
              </p>
            </div>
          </div>

          <div className="bg-white/80 border border-blue-50 rounded-2xl shadow-sm p-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Book appointments with ease
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Find doctors, schedule appointments, and manage your health
              records—all from one place.
            </p>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px]">
                  ✓
                </span>
                <span>Search and book trusted doctors.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px]">
                  ✓
                </span>
                <span>View appointment history and prescriptions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-[10px]">
                  ✓
                </span>
                <span>Secure online payments and reminders.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right: Auth card */}
        <div className="w-full">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 max-w-md mx-auto">
            {/* Toggle Login / Sign Up */}
            <div className="flex mb-6 rounded-full bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => setCurrentState("Sign Up")}
                className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  currentState === "Sign Up"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => setCurrentState("Login")}
                className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all duration-300 ${
                  currentState === "Login"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Login
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {currentState === "Sign Up" ? "Create Account" : "Welcome Back"}
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              {currentState === "Sign Up"
                ? "Join DocBook to start booking appointments."
                : "Enter your credentials to access your account."}
            </p>

            <form onSubmit={onSubmitHandler} className="space-y-4">
              {currentState === "Sign Up" && (
                <div>
                  <label
                    className="block text-xs font-medium text-gray-600 mb-1"
                    htmlFor="name"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label
                  className="block text-xs font-medium text-gray-600 mb-1"
                  htmlFor="email"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  className="block text-xs font-medium text-gray-600 mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ${
                  loading ? "opacity-80 cursor-not-allowed hover:translate-y-0" : ""
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
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
                    {currentState === "Sign Up" ? "Creating..." : "Signing in..."}
                  </>
                ) : (
                  currentState === "Sign Up" ? "Create Account" : "Login"
                )}
              </button>
            </form>

            <p className="mt-4 text-[11px] text-gray-500 text-center">
              By continuing, you agree to DocBook’s{" "}
              <span className="text-blue-600 font-medium">Terms</span> and{" "}
              <span className="text-blue-600 font-medium">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;