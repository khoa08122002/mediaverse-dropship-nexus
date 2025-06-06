import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';

const Ecommerce = () => {
  const solutions = [
    {
      title: "Dropshipping Automation Platform",
      description: "Nền tảng dropshipping tự động hoá toàn bộ từ sourcing sản phẩm đến fulfillment, tối ưu profit margin.",
      features: [
        "Auto product sourcing từ 1000+ suppliers",
        "Dynamic pricing với AI optimization",
        "Automated order processing & tracking",
        "Inventory sync real-time với suppliers",
        "Multi-store management dashboard",
        "Customer service automation với chatbot"
      ],
      benefits: [
        "Tăng 400-600% profit margin",
        "Giảm 90% thời gian quản lý inventory",
        "Tăng 250% order processing speed",
        "Giảm 80% customer service workload"
      ],
      pricing: "Từ 20.000.000 VNĐ/tháng",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "E-commerce Analytics Intelligence",
      description: "Hệ thống phân tích thông minh cho e-commerce với predictive analytics và customer insights sâu sắc.",
      features: [
        "Customer lifetime value prediction",
        "Churn prediction và retention strategies",
        "Product recommendation engine",
        "Inventory forecasting với ML",
        "Conversion funnel optimization",
        "Competitive pricing intelligence"
      ],
      benefits: [
        "Tăng 300% customer retention",
        "Cải thiện 250% inventory turnover",
        "Tăng 180% average order value",
        "Giảm 60% inventory holding costs"
      ],
      pricing: "Từ 15.000.000 VNĐ/tháng",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Omnichannel Commerce Platform",
      description: "Giải pháp thương mại toàn kênh, tích hợp seamless giữa online và offline với unified customer experience.",
      features: [
        "Unified inventory across all channels",
        "Cross-channel customer journey tracking",
        "Centralized order management system",
        "Multi-channel marketing automation",
        "POS integration với real-time sync",
        "Customer data platform (CDP)"
      ],
      benefits: [
        "Tăng 350% cross-channel sales",
        "Cải thiện 200% customer experience",
        "Tăng 150% operational efficiency",
        "Giảm 70% inventory discrepancies"
      ],
      pricing: "Từ 25.000.000 VNĐ/tháng",
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Supply Chain Optimization",
      description: "Tối ưu hóa chuỗi cung ứng với AI, từ demand forecasting đến logistics optimization và supplier management.",
      features: [
        "AI-powered demand forecasting",
        "Supplier performance analytics",
        "Logistics route optimization",
        "Automated procurement workflows",
        "Quality control automation",
        "Risk management & compliance"
      ],
      benefits: [
        "Giảm 40% supply chain costs",
        "Tăng 200% delivery accuracy",
        "Cải thiện 150% supplier efficiency",
        "Giảm 60% stockout incidents"
      ],
      pricing: "Từ 18.000.000 VNĐ/tháng",
      color: "from-orange-500 to-red-500"
    }
  ];

  const platforms = [
    {
      name: "DropShip Pro",
      url: "dropship.mediatech.vn",
      description: "Nền tảng dropshipping #1 Việt Nam với 10,000+ sản phẩm hot trend",
      features: ["Auto product sync", "1-click store setup", "AI pricing", "24/7 support"]
    },
    {
      name: "Analytics Hub",
      url: "analytics.mediatech.vn", 
      description: "Business intelligence platform cho e-commerce với real-time insights",
      features: ["Real-time dashboard", "Predictive analytics", "Custom reports", "API integration"]
    }
  ];

  const successStories = [
    {
      company: "Fashion Plus Vietnam",
      industry: "Fashion E-commerce",
      challenge: "Quản lý 5000+ SKU across multiple channels với inventory accuracy thấp",
      solution: "Triển khai Omnichannel Commerce Platform với AI inventory optimization",
      results: [
        "Tăng 450% revenue từ cross-channel sales",
        "Cải thiện 95% inventory accuracy",
        "Giảm 70% operational costs",
        "Tăng 300% customer satisfaction score"
      ],
      timeline: "6 tháng implementation",
      roi: "380% ROI trong năm đầu"
    },
    {
      company: "TechGadget Store", 
      industry: "Electronics Dropshipping",
      challenge: "Scaling dropshipping business với manual processes và low margins",
      solution: "Dropshipping Automation Platform với dynamic pricing và auto-sourcing",
      results: [
        "Tăng 600% monthly revenue",
        "Cải thiện 280% profit margin", 
        "Giảm 90% manual workload",
        "Tăng 200% product catalog size"
      ],
      timeline: "3 tháng implementation",
      roi: "520% ROI trong 8 tháng"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-2 bg-purple-600/20 text-purple-300 rounded-full text-sm font-medium mb-6 border border-purple-500/30">
                🛒 Dropshipping & E-commerce Solutions
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Tương lai của
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> E-commerce </span>
                thông minh
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Giải pháp thương mại điện tử toàn diện với AI và automation, từ dropshipping 
                đến omnichannel commerce, giúp doanh nghiệp scale up nhanh chóng và bền vững.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/contact" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-semibold"
                >
                  Demo miễn phí
                </Link>
                <a 
                  href="#solutions" 
                  className="border-2 border-white/30 text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-semibold"
                >
                  Xem giải pháp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Showcase */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Nền tảng
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> chuyên biệt</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hệ sinh thái platforms được thiết kế riêng cho từng nhu cầu kinh doanh cụ thể.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {platforms.map((platform, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{platform.name}</h3>
                    <a 
                      href={`https://${platform.url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-700 font-mono text-sm"
                    >
                      {platform.url} ↗
                    </a>
                  </div>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">{platform.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    {platform.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <a 
                    href={`https://${platform.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                  >
                    Truy cập platform
                    <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Giải pháp E-commerce
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> toàn diện</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Từ dropshipping automation đến supply chain optimization, chúng tôi cung cấp 
                công nghệ tiên tiến nhất để scale business của bạn.
              </p>
            </div>

            <div className="space-y-16">
              {solutions.map((solution, index) => (
                <div key={index} className={`${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex gap-12 items-center`}>
                  <div className="lg:w-1/2">
                    <div className={`w-16 h-16 bg-gradient-to-r ${solution.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">{solution.title}</h3>
                    <p className="text-lg text-gray-600 mb-6 leading-relaxed">{solution.description}</p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Core Features:</h4>
                      <ul className="space-y-2">
                        {solution.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-purple-50 rounded-2xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Business Impact:</h4>
                      <ul className="space-y-2">
                        {solution.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center">
                            <span className="text-green-500 mr-2">📈</span>
                            <span className="text-gray-700 font-medium">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-purple-200">
                        <span className="text-sm text-gray-600">Investment: </span>
                        <span className="font-bold text-purple-600">{solution.pricing}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:w-1/2">
                    <div className={`bg-gradient-to-br ${solution.color} rounded-3xl p-8 text-white`}>
                      <div className="aspect-square bg-white/10 rounded-2xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                            <div className="w-12 h-12 bg-white/30 rounded-xl"></div>
                          </div>
                          <h4 className="text-xl font-bold mb-2">E-commerce Platform</h4>
                          <p className="text-white/80">Interactive Demo Available</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Success Stories
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent"> thực tế</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Những transformation stories từ các doanh nghiệp đã áp dụng thành công 
                giải pháp e-commerce của MediaTech.
              </p>
            </div>

            <div className="space-y-12">
              {successStories.map((story, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 lg:p-12 shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="mb-6">
                        <h3 className="text-3xl font-bold text-gray-900 mb-2">{story.company}</h3>
                        <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm font-medium">
                          {story.industry}
                        </span>
                      </div>
                      
                      <div className="space-y-4 mb-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Challenge:</h4>
                          <p className="text-gray-700">{story.challenge}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                          <p className="text-gray-700">{story.solution}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {story.results.map((result, idx) => (
                          <div key={idx} className="flex items-center bg-green-50 rounded-lg p-3">
                            <span className="text-green-500 mr-2">🏆</span>
                            <span className="text-gray-700 font-medium">{result}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4">Project Metrics</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-gray-600">Implementation Time</div>
                          <div className="text-xl font-bold text-purple-600">{story.timeline}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Return on Investment</div>
                          <div className="text-xl font-bold text-green-600">{story.roi}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to scale your E-commerce?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Đặt lịch demo để trải nghiệm trực tiếp sức mạnh của các platform e-commerce 
              và nhận consultation miễn phí từ experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Đặt lịch demo
              </Link>
              <a 
                href="https://dropship.mediatech.vn" 
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Try DropShip Pro Free
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Ecommerce;
