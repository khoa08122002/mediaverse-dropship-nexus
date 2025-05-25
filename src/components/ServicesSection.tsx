
import React from 'react';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  const services = [
    {
      title: "AI Marketing & Analytics",
      description: "Tối ưu hóa chiến lược marketing với công nghệ AI, phân tích hành vi khách hàng và dự đoán xu hướng thị trường.",
      features: ["Phân tích dữ liệu thông minh", "Tự động hóa marketing", "Dự đoán xu hướng", "ROI tối ưu"],
      color: "from-blue-500 to-cyan-500",
      link: "/media-services"
    },
    {
      title: "Dropshipping Solutions",
      description: "Hệ thống dropshipping tự động hoá toàn bộ quy trình từ đặt hàng đến giao hàng, tối ưu lợi nhuận.",
      features: ["Tự động đồng bộ sản phẩm", "Quản lý đơn hàng thông minh", "Tích hợp đa nền tảng", "Báo cáo real-time"],
      color: "from-purple-500 to-pink-500",
      link: "/ecommerce"
    },
    {
      title: "Content Creation & SEO",
      description: "Tạo nội dung chất lượng cao với AI, tối ưu SEO và xây dựng thương hiệu mạnh mẽ trên các kênh số.",
      features: ["Tạo nội dung AI", "SEO tự động", "Quản lý thương hiệu", "Multi-channel marketing"],
      color: "from-green-500 to-teal-500",
      link: "/media-services"
    },
    {
      title: "E-commerce Optimization",
      description: "Tối ưu hóa store online, tăng tỷ lệ chuyển đổi và cải thiện trải nghiệm khách hàng toàn diện.",
      features: ["UX/UI optimization", "Conversion tracking", "A/B testing", "Performance analytics"],
      color: "from-orange-500 to-red-500",
      link: "/ecommerce"
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium mb-4 border border-blue-500/30">
            🎯 Dịch vụ chuyên nghiệp
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Giải pháp toàn diện cho
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> doanh nghiệp số</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Từ AI Marketing đến Dropshipping, chúng tôi cung cấp hệ sinh thái dịch vụ 
            hoàn chỉnh giúp doanh nghiệp phát triển bền vững trong kỷ nguyên số.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>
              
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Link 
                to={service.link}
                className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${service.color} text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium group-hover:translate-x-1`}
              >
                Tìm hiểu thêm
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Sẵn sàng bắt đầu hành trình số hóa?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Liên hệ ngay để được tư vấn miễn phí và nhận báo giá chi tiết cho dự án của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/contact" 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Tư vấn miễn phí
            </Link>
            <Link 
              to="/about" 
              className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Xem portfolio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
