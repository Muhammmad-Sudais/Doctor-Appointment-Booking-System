import React from 'react';
import { assets } from '../assets/assets';

const InfoCard = ({ icon, title, children }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-blue-900">{title}</h3>
    </div>
    <div className="pl-1">{children}</div>
  </div>
);

const Contact = () => {
  return (
    <section className="relative bg-white px-6 md:px-12 py-20 text-gray-800 overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-50 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3">
            Contact Us
          </h2>
          <div className="mt-3 w-16 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          {/* Illustration */}
          <div className="md:w-1/2 animate-fade-in-left">
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-50 rounded-2xl transform group-hover:scale-105 transition-all duration-500" />
              <img
                className="w-full rounded-2xl shadow-lg transform group-hover:scale-[1.03] transition-all duration-500 relative"
                src={assets.contact_image}
                alt="Contact Illustration"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:w-1/2 space-y-8 animate-fade-in-right">
            <InfoCard
              title="Our Office"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
            >
              <address className="not-italic text-gray-600 leading-relaxed">
                54709 Station<br />
                Mayar 23200, Mardan, Pakistan
              </address>
            </InfoCard>

            <InfoCard
              title="Contact Info"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <a href="tel:+923178527603" aria-label="Call us" className="text-blue-600 hover:underline hover:text-blue-700 transition-colors">
                    (+92) 317 8527603
                  </a>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <a href="mailto:muhammadsoodais@gmail.com" aria-label="Email us" className="text-blue-600 hover:underline hover:text-blue-700 transition-colors">
                    muhammadsoodais@gmail.com
                  </a>
                </div>
              </div>
            </InfoCard>

            {/* Careers Button */}
            <div className="text-center mt-6">
              <a
                href="#"
                className="group inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Explore Careers</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
