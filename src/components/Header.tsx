import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      <nav className="relative container mx-auto px-4 py-4">
        {/* Border that excludes logo area */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-gray-800"></div>
        
        <Link to="/" className="absolute left-0 top-1/2 transform -translate-y-1/2 h-28 pb-2 z-10">
          <img 
            src="./src/assets/images/logo.png" 
            alt="PH Group Logo" 
            className="h-full w-auto object-contain" 
          />
        </Link>
        <div className="flex items-center justify-between">
          {/* Logo Spacing */}
          <div className="w-24"></div>


          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors font-medium">
              Trang chủ
            </Link>
            <Link to="/about" className="text-gray-300 hover:text-white transition-colors font-medium">
              Giới thiệu
            </Link>

            {/* Dropdown full wrapper */}
            <div 
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
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
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors font-medium">
              Liên hệ
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link 
              to="/contact" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
            >
              Bắt đầu ngay
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-800">
            <div className="flex flex-col space-y-3 pt-4">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors font-medium">
                Trang chủ
              </Link>
              <Link to="/about" className="text-gray-300 hover:text-white transition-colors font-medium">
                Giới thiệu
              </Link>
              <Link to="/media-services" className="text-gray-300 hover:text-white transition-colors font-medium">
                AI Marketing & Truyền thông
              </Link>
              <Link to="/ecommerce" className="text-gray-300 hover:text-white transition-colors font-medium">
                Dropshipping & E-commerce
              </Link>
              <Link to="/blog" className="text-gray-300 hover:text-white transition-colors font-medium">
                Blog
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors font-medium">
                Liên hệ
              </Link>
              <Link 
                to="/contact" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-center w-fit"
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
