
import React, { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-gray-100">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-bold text-gray-900">MediaTech</h1>
              <p className="text-xs text-gray-500">AI Marketing & E-commerce</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Trang chủ
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Giới thiệu
            </Link>
            <div className="relative">
              <button 
                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors font-medium"
                onMouseEnter={() => setIsServicesOpen(true)}
                onMouseLeave={() => setIsServicesOpen(false)}
              >
                Dịch vụ <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              {isServicesOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <Link to="/media-services" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                    AI Marketing & Truyền thông
                  </Link>
                  <Link to="/ecommerce" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-blue-600">
                    Dropshipping & E-commerce
                  </Link>
                </div>
              )}
            </div>
            <Link to="/blog" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
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
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3 pt-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Trang chủ
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Giới thiệu
              </Link>
              <Link to="/media-services" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                AI Marketing & Truyền thông
              </Link>
              <Link to="/ecommerce" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Dropshipping & E-commerce
              </Link>
              <Link to="/blog" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Blog
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
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
