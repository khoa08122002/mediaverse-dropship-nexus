import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/images/logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const handleServicesMouseEnter = () => {
    setIsServicesOpen(true);
  };

  const handleServicesMouseLeave = () => {
    setIsServicesOpen(false);
  };

  return (
    <header className="fixed top-0 w-full bg-black/95 backdrop-blur-md shadow-lg z-50">
      <nav className="container mx-auto px-4">
        {/* Border */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-gray-800"></div>
        
        {/* Mobile Layout */}
        <div className="lg:hidden flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={logo}
              alt="PH Group Logo" 
              className="h-20 w-auto object-contain" 
            />
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="text-white z-20 relative p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center py-4 relative">
          {/* Logo - Desktop */}
          <Link to="/" className="absolute left-0 top-1/2 transform -translate-y-1/2 h-28 pb-2 z-10">
            <img 
              src={logo}
              alt="PH Group Logo" 
              className="h-full w-auto object-contain" 
            />
          </Link>
          
          <div className="flex items-center justify-between w-full">
            {/* Logo Spacing */}
            <div className="w-28"></div>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors font-medium">
                Trang chủ
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors font-medium">
                Giới thiệu
              </Link>

              {/* Dropdown full wrapper */}
              <div 
                className="relative"
                onMouseEnter={handleServicesMouseEnter}
                onMouseLeave={handleServicesMouseLeave}
              >
                <div className="flex flex-col">
                  {/* Trigger button */}
                  <button className="flex items-center text-gray-300 hover:text-white transition-colors font-medium">
                    Dịch vụ <ChevronDown className="ml-1 w-4 h-4" />
                  </button>

                  {/* Dropdown menu */}
                  {isServicesOpen && (
                    <div className="w-64 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-2 z-50 absolute top-full left-0">
                      <Link 
                        to="/media-services" 
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        AI Marketing & Truyền thông
                      </Link>
                      <Link 
                        to="/ecommerce" 
                        className="block px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        onClick={() => setIsServicesOpen(false)}
                      >
                        Dropshipping & E-commerce
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <Link to="/blog" className="text-gray-300 hover:text-white transition-colors font-medium">
                Blog
              </Link>
              <Link to="/recruitment" className="text-gray-300 hover:text-white transition-colors font-medium">
                Tuyển dụng
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors font-medium">
                Liên hệ
              </Link>
            </div>

            {/* CTA Button */}
            <div className="flex items-center space-x-4">
              <Link 
                to="/contact" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
              >
                Bắt đầu ngay
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-800">
            <div className="flex flex-col space-y-3 pt-4">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Trang chủ
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Giới thiệu
              </Link>
              <Link to="/media-services" className="text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                AI Marketing & Truyền thông
              </Link>
              <Link to="/ecommerce" className="text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Dropshipping & E-commerce
              </Link>
              <Link to="/blog" className="text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Blog
              </Link>
              <Link to="/recruitment" className="text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Tuyển dụng
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>
                Liên hệ
              </Link>
              <Link 
                to="/contact" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-center w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                Bắt đầu ngay
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
