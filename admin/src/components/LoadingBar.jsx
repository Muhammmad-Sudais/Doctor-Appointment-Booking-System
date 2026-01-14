import React from 'react'

const LoadingBar = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
      <div className="h-full bg-blue-600 animate-pulse">
        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 animate-loading-bar"></div>
      </div>
      <style jsx>{`
        @keyframes loading-bar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default LoadingBar
