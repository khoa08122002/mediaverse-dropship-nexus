import { useState } from "react";
import React, { useEffect } from 'react';
import logo from '@/assets/images/logo.png';

interface PreloaderProps {
  onLoadingComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        const nextProgress = prevProgress + Math.random() * 25;
        if (nextProgress >= 100) {
          clearInterval(timer);
          setTimeout(() => onLoadingComplete(), 200);
          return 100;
        }
        return nextProgress;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="mb-4 flex justify-center">
          <div className="relative">
            <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-30 animate-ping"></div>
          </div>
        </div>
        
        {/* Brand Name */}
        <h1 className="text-4xl font-bold text-white mb-2">PH Group</h1>
        <p className="text-gray-400 mb-8">AI Marketing & E-commerce</p>
        
        {/* Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="bg-gray-800 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-400 text-sm">Đang tải... {Math.round(progress)}%</p>
        </div>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-6">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-75"></div>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-150"></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;