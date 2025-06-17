import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube } from 'lucide-react';
import logo from '@/assets/images/logo.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center">
                <img src={logo} alt="PH Group Logo" className="h-full w-auto object-contain" />
              </Link>
              <div>
                <h4 className="text-xl font-bold text-white">PH Group</h4>
                <p className="text-sm text-gray-400">AI Marketing & E-commerce</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Giải pháp truyền thông số và thương mại điện tử hàng đầu Việt Nam với công nghệ AI tiên tiến.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/phgroup.media" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Dịch vụ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/media-services" className="text-gray-400 hover:text-white transition-colors">AI Marketing</Link></li>
              <li><Link to="/media-services" className="text-gray-400 hover:text-white transition-colors">Truyền thông số</Link></li>
              <li><Link to="/ecommerce" className="text-gray-400 hover:text-white transition-colors">Dropshipping</Link></li>
              <li><Link to="/ecommerce" className="text-gray-400 hover:text-white transition-colors">E-commerce Analytics</Link></li>
              <li><Link to="/media-services" className="text-gray-400 hover:text-white transition-colors">Content Creation</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Công ty</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">Giới thiệu</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Liên hệ</Link></li>
              <li><Link to="/recruitment" className="text-gray-400 hover:text-white transition-colors">Tuyển dụng</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Liên hệ</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📧 contact@phgcorporation.com</p>
              <p>📞 +84 123 456 789</p>
              <p>📍 Cư Xá Điện Lực 51 - 53 Trần Não, TP Thủ Đức</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-white">Các công ty con:</h5>
              <div className="text-sm text-gray-400 space-y-1">
                <p>• dropship.phgcorporation.com</p>
                <p>• analytics.phgcorporation.com</p>
                <p>• content.phgcorporation.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 PHG Corporation. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
