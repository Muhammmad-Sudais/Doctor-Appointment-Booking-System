import React from "react";
import { assets } from "../assets/assets";

const About = () => {
  return (
    <section className="relative bg-white px-6 md:px-10 py-20 text-gray-700 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">
            About Us
          </h2>
          <div className="mt-3 w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* About Content */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <div className="md:w-1/2 animate-fade-in-left">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-50 rounded-2xl transform group-hover:scale-105 transition-all duration-500"></div>
              <img
                className="w-full rounded-2xl shadow-lg transform group-hover:scale-[1.03] transition-all duration-500 relative"
                src={assets.about_image}
                alt="About DocBook"
              />
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col gap-6 text-base leading-relaxed animate-fade-in-right">
            <p className="text-gray-700">
              Welcome to <strong className="text-blue-700 font-semibold">DocBook</strong>, your trusted partner in managing healthcare needs conveniently and efficiently. We understand the challenges individuals face when it comes to scheduling doctor appointments and managing health records.
            </p>
            <p className="text-gray-700">
              DocBook is committed to excellence in healthcare technology. We continuously enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, DocBook is here to support you.
            </p>
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-2xl font-bold text-blue-900 mb-3">Our Vision</h3>
              <p className="text-gray-700">
                Our vision is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and providers, making it easier to access the care you need — when you need it.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-3">
            Why Choose Us
          </h2>
          <div className="mt-3 w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Card 1 */}
          <div className="group bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <span className="text-blue-600 text-2xl">⚡</span>
              </div>
              <div className="text-xl font-bold mb-3 group-hover:text-blue-800 transition-colors duration-300">Efficiency</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Streamlined appointment scheduling that fits into your busy lifestyle.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <span className="text-blue-600 text-2xl">📍</span>
              </div>
              <div className="text-xl font-bold mb-3 group-hover:text-blue-800 transition-colors duration-300">Convenience</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Access to a network of trusted healthcare professionals in your area.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                <span className="text-blue-600 text-2xl">🎯</span>
              </div>
              <div className="text-xl font-bold mb-3 group-hover:text-blue-800 transition-colors duration-300">Personalization</div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tailored recommendations and reminders to help you stay on top of your health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
