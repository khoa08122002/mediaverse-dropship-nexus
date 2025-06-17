import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const MediaServices = () => {
  const services = [
    {
      title: "AI Marketing Automation",
      description: "Hệ thống marketing tự động hóa hoàn toàn với AI, từ phân khúc khách hàng đến tối ưu chiến dịch real-time.",
      features: [
        "Phân tích hành vi khách hàng bằng Machine Learning",
        "Tự động tạo và tối ưu content theo từng segment",
        "Dự đoán lifetime value và churn rate",
        "A/B testing tự động với statistical significance",
        "Multi-channel attribution modeling",
        "Real-time campaign optimization"
      ],
      benefits: [
        "Tăng ROI marketing lên 300-500%",
        "Giảm 80% thời gian quản lý campaign",
        "Tăng conversion rate 150-250%",
        "Cải thiện customer retention 40-60%"
      ],
      pricing: "Từ 15.000.000 VNĐ/tháng",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Content Intelligence Platform",
      description: "Nền tảng tạo và quản lý nội dung thông minh với AI, tối ưu SEO và engagement tự động.",
      features: [
        "AI content generation cho blog, social media",
        "SEO optimization tự động với keyword research",
        "Visual content creation với AI tools",
        "Content performance analytics",
        "Multi-language content localization",
        "Brand voice consistency checking"
      ],
      benefits: [
        "Tăng tốc content production 10x",
        "Cải thiện SEO ranking 200-400%",
        "Tăng social engagement 180-300%",
        "Giảm 90% cost per content piece"
      ],
      pricing: "Từ 8.000.000 VNĐ/tháng",
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Social Media Intelligence",
      description: "Giải pháp quản lý và tối ưu social media với AI, từ content planning đến community management.",
      features: [
        "AI-powered social listening và sentiment analysis",
        "Automated posting với optimal timing",
        "Influencer identification và outreach",
        "Social commerce integration",
        "Crisis management và reputation monitoring",
        "Competitor analysis và benchmarking"
      ],
      benefits: [
        "Tăng social media ROI 250-400%",
        "Cải thiện brand sentiment 60-80%",
        "Tăng follower growth rate 300-500%",
        "Giảm 70% social media management time"
      ],
      pricing: "Từ 12.000.000 VNĐ/tháng",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Digital Analytics & Insights",
      description: "Hệ thống phân tích dữ liệu toàn diện với AI, cung cấp insights sâu sắc cho decision making.",
      features: [
        "Cross-platform data integration",
        "Predictive analytics và forecasting",
        "Customer journey mapping với AI",
        "Real-time dashboard và alerting",
        "Custom KPI tracking và reporting",
        "Data visualization và storytelling"
      ],
      benefits: [
        "Cải thiện data-driven decisions 400%",
        "Tăng accuracy của forecasting 250%",
        "Giảm 80% time to insights",
        "Tăng business intelligence maturity 300%"
      ],
      pricing: "Từ 10.000.000 VNĐ/tháng",
      color: "from-orange-500 to-red-500"
    }
  ];

  const caseStudies = [
    {
      client: "TechViet Corporation",
      industry: "Technology",
      challenge: "Tăng trưởng user acquisition với budget marketing hạn chế",
      solution: "Triển khai AI Marketing Automation với predictive targeting",
      results: [
        "Tăng 350% qualified leads",
        "Giảm 60% cost per acquisition",
        "Tăng 280% marketing ROI",
        "Cải thiện 45% retention rate"
      ]
    },
    {
      client: "FashionPlus Vietnam",
      industry: "E-commerce Fashion",
      challenge: "Tối ưu content marketing và SEO cho 10,000+ sản phẩm",
      solution: "Content Intelligence Platform với AI-generated product descriptions",
      results: [
        "Tăng 400% organic traffic",
        "Cải thiện 250% content production speed",
        "Tăng 180% average session duration",
        "Tăng 320% conversion from organic"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-2 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium mb-6 border border-blue-500/30">
                🤖 AI Marketing & Truyền thông số
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Cách mạng hóa
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Marketing </span>
                với AI
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Tận dụng sức mạnh trí tuệ nhân tạo để tạo ra các chiến lược marketing thông minh, 
                tối ưu hóa ROI và mang lại trải nghiệm khách hàng vượt trội.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold"
                >
                  Tư vấn miễn phí
                </Link>
                <a 
                  href="#services" 
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-semibold"
                >
                  Xem dịch vụ
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Dịch vụ AI Marketing
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> chuyên nghiệp</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Giải pháp marketing thông minh toàn diện, từ automation đến analytics, 
                giúp doanh nghiệp tăng trưởng bền vững trong kỷ nguyên số.
              </p>
            </div>

            <div className="space-y-16">
              {services.map((service, index) => (
                <div key={index} className={`${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex gap-12 items-center`}>
                  <div className="lg:w-1/2">
                    <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Tính năng chính:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Lợi ích đạt được:</h4>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            <span className="text-gray-700 font-medium">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <span className="text-sm text-gray-600">Đầu tư: </span>
                        <span className="font-bold text-blue-600">{service.pricing}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2">
                    <div className={`bg-gradient-to-br ${service.color} rounded-3xl p-8 text-white`}>
                      <div className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/30 rounded-xl"></div>
                          </div>
                          <h4 className="text-xl font-bold mb-2">AI-Powered Platform</h4>
                          <p className="text-white/80">Interactive Dashboard Preview</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Case Studies
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> thành công</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Những câu chuyện thành công thực tế từ các doanh nghiệp đã áp dụng 
                giải pháp AI Marketing của PHG Corporation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {caseStudies.map((study, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{study.client}</h3>
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {study.industry}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Thách thức:</h4>
                      <p className="text-gray-700">{study.challenge}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Giải pháp:</h4>
                      <p className="text-gray-700">{study.solution}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Kết quả đạt được:</h4>
                      <ul className="space-y-2">
                        {study.results.map((result, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="text-green-500 mr-2">🎯</span>
                            <span className="text-gray-700 font-medium">{result}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Sẵn sàng tăng trưởng với AI Marketing?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Liên hệ ngay để được tư vấn miễn phí và nhận audit marketing chi tiết cho doanh nghiệp của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Đặt lịch tư vấn
              </Link>
              <a 
                href="tel:+84123456789" 
                className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Gọi ngay: +84 123 456 789
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MediaServices;
