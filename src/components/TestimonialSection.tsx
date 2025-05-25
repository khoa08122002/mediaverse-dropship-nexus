
import React from 'react';

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Nguyễn Văn A",
      position: "CEO, TechViet Corp",
      content: "MediaTech đã giúp chúng tôi tăng trưởng doanh thu 300% chỉ trong 6 tháng thông qua giải pháp AI Marketing và Dropshipping tự động.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Trần Thị B",
      position: "Marketing Director, Fashion Plus",
      content: "Hệ thống dropshipping của MediaTech hoàn toàn thay đổi cách chúng tôi vận hành. Tự động hóa 90% quy trình và tăng hiệu quả vượt bậc.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Lê Minh C",
      position: "Founder, StartupXYZ",
      content: "Đội ngũ MediaTech rất chuyên nghiệp và hiểu rõ thị trường Việt Nam. Content SEO và chiến lược marketing của họ thực sự hiệu quả.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-green-100 text-green-600 rounded-full text-sm font-medium mb-4">
            💬 Khách hàng nói gì về chúng tôi
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Những câu chuyện
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> thành công</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hơn 500+ doanh nghiệp đã tin tưởng và đạt được kết quả vượt ngoài mong đợi 
            cùng với các giải pháp của MediaTech.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
              {/* Rating */}
              <div className="flex space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.position}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Dự án hoàn thành</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">99%</div>
              <div className="text-blue-100">Khách hàng hài lòng</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5</div>
              <div className="text-blue-100">Năm kinh nghiệm</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Hỗ trợ khách hàng</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
