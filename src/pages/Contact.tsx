import React, { useState } from 'react';
import Header from '../components/Header';
import { useToast } from '../hooks/use-toast';
import { contactService } from '@/services/contactService';

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await contactService.createContact({
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        subject: formData.service || 'Yêu cầu tư vấn'
      });
      
      toast({
        title: "✅ Gửi yêu cầu thành công!",
        description: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!",
        variant: "default"
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        budget: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "❌ Có lỗi xảy ra",
        description: "Có lỗi xảy ra. Vui lòng thử lại sau!",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const services = [
    "AI Marketing & Analytics",
    "Content Intelligence Platform", 
    "Social Media Intelligence",
    "Dropshipping Automation",
    "E-commerce Analytics",
    "Omnichannel Commerce",
    "Supply Chain Optimization",
    "Tư vấn tổng thể"
  ];

  const budgetRanges = [
    "Dưới 50 triệu VNĐ",
    "50-100 triệu VNĐ", 
    "100-500 triệu VNĐ",
    "500 triệu - 1 tỷ VNĐ",
    "Trên 1 tỷ VNĐ",
    "Cần tư vấn"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
                📞 Liên hệ tư vấn
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Bắt đầu hành trình
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> số hóa </span>
                của bạn
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Liên hệ ngay với đội ngũ chuyên gia PHG Corporation để được tư vấn miễn phí 
                và nhận proposal chi tiết cho dự án của bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="tel:+84123456789" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
                >
                  📞 +84 123 456 789
                </a>
                <a 
                  href="mailto:contact@PHG Corporation.vn" 
                  className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-all duration-300 font-semibold"
                >
                  ✉️ contact@phgcorporation.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Gửi yêu cầu tư vấn
                </h2>
                <p className="text-gray-600 mb-8">
                  Điền thông tin chi tiết để chúng tôi có thể tư vấn chính xác nhất cho nhu cầu của bạn.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nguyễn Văn A"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="email@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Số điện thoại *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+84 123 456 789"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Công ty
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tên công ty"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Dịch vụ quan tâm *
                      </label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn dịch vụ</option>
                        {services.map((service, index) => (
                          <option key={index} value={service}>{service}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Ngân sách dự kiến
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Chọn ngân sách</option>
                        {budgetRanges.map((range, index) => (
                          <option key={index} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-medium mb-2">
                        Mô tả chi tiết nhu cầu *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={8}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Mô tả chi tiết về dự án, mục tiêu, thời gian mong muốn và các yêu cầu đặc biệt..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                        <span>Đang gửi...</span>
                      </div>
                    ) : (
                      'Gửi yêu cầu tư vấn'
                    )}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Thông tin liên hệ
                </h2>

                <div className="space-y-6 mb-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Địa chỉ văn phòng</h3>
                      <p className="text-gray-600">
                        Tầng 12, Tòa nhà ABC<br />
                        123 Đường Nguyễn Văn Linh<br />
                        Quận 7, TP. Hồ Chí Minh
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-xl">📞</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Hotline</h3>
                      <p className="text-gray-600">
                        <a href="tel:+84123456789" className="hover:text-blue-600">+84 123 456 789</a><br />
                        <a href="tel:+84987654321" className="hover:text-blue-600">+84 987 654 321</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-600 text-xl">✉️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">
                        <a href="mailto:contact@phgcorporation.com" className="hover:text-blue-600">contact@phgcorporation.com</a><br />
                        <a href="mailto:sales@phgcorporation.com" className="hover:text-blue-600">sales@phgcorporation.com</a>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 text-xl">⏰</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Giờ làm việc</h3>
                      <p className="text-gray-600">
                        Thứ 2 - Thứ 6: 8:00 - 18:00<br />
                        Thứ 7: 8:00 - 12:00<br />
                        Chủ nhật: Nghỉ
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subsidiaries */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Các nền tảng con</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium text-gray-900">DropShip Pro</div>
                      <a 
                        href="https://dropship.phgcorporation.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-700 text-sm"
                      >
                        dropship.phgcorporation.com ↗
                      </a>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Analytics Hub</div>
                      <a 
                        href="https://analytics.phgcorporation.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm"
                      >
                        analytics.phgcorporation.com ↗
                      </a>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Content Studio</div>
                      <a 
                        href="https://content.phgcorporation.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 text-sm"
                      >
                        content.phgcorporation.com ↗
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Câu hỏi thường gặp
                </h2>
                <p className="text-xl text-gray-600">
                  Những thắc mắc phổ biến từ khách hàng về dịch vụ của chúng tôi
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Thời gian triển khai dự án thường là bao lâu?
                  </h3>
                  <p className="text-gray-600">
                    Tùy thuộc vào quy mô và độ phức tạp, thời gian triển khai từ 2-6 tháng. 
                    Các dự án AI Marketing thường 2-3 tháng, E-commerce platform 3-6 tháng.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Chi phí dịch vụ được tính như thế nào?
                  </h3>
                  <p className="text-gray-600">
                    Chi phí dựa trên scope công việc, công nghệ sử dụng và thời gian triển khai. 
                    Chúng tôi cung cấp báo giá chi tiết và minh bạch sau khi phân tích yêu cầu.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Có hỗ trợ sau khi bàn giao dự án không?
                  </h3>
                  <p className="text-gray-600">
                    Có, chúng tôi cung cấp gói bảo hành và hỗ trợ kỹ thuật 24/7. 
                    Đồng thời có training team nội bộ và documentation chi tiết.
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Các nền tảng con có thể tích hợp với hệ thống hiện tại không?
                  </h3>
                  <p className="text-gray-600">
                    Tất cả platforms đều có API mở và hỗ trợ tích hợp với các hệ thống phổ biến 
                    như ERP, CRM, POS. Chúng tôi có team technical integration chuyên nghiệp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
