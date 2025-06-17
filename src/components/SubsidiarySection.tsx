
import React from 'react';

const SubsidiarySection = () => {
  const subsidiaries = [
    {
      name: "DropShip Pro",
      domain: "dropship.phgcorporation.com",
      description: "Nền tảng dropshipping tự động với hơn 10,000+ sản phẩm hot trend và hệ thống fulfillment thông minh.",
      features: ["Tự động đồng bộ sản phẩm", "Quản lý inventory real-time", "Tích hợp payment gateway", "Analytics dashboard"],
      color: "from-purple-500 to-pink-500",
      icon: "🚀"
    },
    {
      name: "Analytics Hub",
      domain: "analytics.phgcorporation.com",
      description: "Công cụ phân tích dữ liệu chuyên sâu với AI, giúp doanh nghiệp đưa ra quyết định kinh doanh thông minh.",
      features: ["AI-powered insights", "Real-time dashboard", "Predictive analytics", "Custom reports"],
      color: "from-blue-500 to-cyan-500",
      icon: "📊"
    },
    {
      name: "Content Studio",
      domain: "content.phgcorporation.com",
      description: "Studio sáng tạo nội dung số với đội ngũ chuyên gia và công nghệ AI, tạo ra content viral và engaging.",
      features: ["AI content generation", "Video production", "Social media content", "SEO optimization"],
      color: "from-green-500 to-teal-500",
      icon: "🎨"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium mb-4 border border-blue-500/30">
            🏢 Hệ sinh thái công ty con
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Mạng lưới
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> dịch vụ chuyên biệt</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Mỗi công ty con trong hệ sinh thái phgcorporation.com đều là chuyên gia trong lĩnh vực riêng, 
            mang đến giải pháp tối ưu cho từng nhu cầu cụ thể của khách hàng.
          </p>
        </div>

        {/* Subsidiaries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {subsidiaries.map((subsidiary, index) => (
            <div key={index} className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300">
              {/* Icon and Header */}
              <div className="mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${subsidiary.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {subsidiary.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{subsidiary.name}</h3>
                <div className="text-blue-300 text-sm font-mono">{subsidiary.domain}</div>
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">{subsidiary.description}</p>

              {/* Features */}
              <ul className="space-y-2 mb-6">
                {subsidiary.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a 
                href={`https://${subsidiary.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${subsidiary.color} text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium group-hover:translate-x-1`}
              >
                Khám phá platform
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Integration Benefits */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">Tích hợp liền mạch - Hiệu quả tối đa</h3>
            <p className="text-gray-300 text-lg">
              Tất cả các platform đều được thiết kế để hoạt động đồng bộ, tạo ra hệ sinh thái hoàn chỉnh
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔗</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Tích hợp thống nhất</h4>
              <p className="text-gray-300">Dữ liệu đồng bộ real-time giữa tất cả các platform</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Hiệu suất cao</h4>
              <p className="text-gray-300">Tối ưu hóa workflow và tăng năng suất lên 5x</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Chuyên biệt hóa</h4>
              <p className="text-gray-300">Mỗi platform tập trung vào expertise riêng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubsidiarySection;
