import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Blog = () => {
  const featuredPost = {
    title: "Tương lai của AI Marketing: Xu hướng 2024 và dự báo 2025",
    excerpt: "Khám phá những xu hướng mới nhất trong lĩnh vực AI Marketing và cách các doanh nghiệp có thể tận dụng để tăng trưởng exponential.",
    author: "Nguyễn Minh Đức",
    date: "25/12/2024",
    readTime: "8 phút đọc",
    category: "AI Marketing",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    tags: ["AI", "Marketing", "Xu hướng 2024", "Machine Learning"],
    slug: "tuong-lai-ai-marketing-2024-2025"
  };

  const blogPosts = [
    {
      title: "Dropshipping 2024: Chiến lược thành công với AI Automation",
      excerpt: "Hướng dẫn chi tiết cách xây dựng hệ thống dropshipping tự động với AI, từ product sourcing đến customer service.",
      author: "Trần Thị Lan",
      date: "22/12/2024",
      readTime: "12 phút đọc",
      category: "E-commerce",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      tags: ["Dropshipping", "AI", "Automation", "E-commerce"],
      slug: "dropshipping-2024-ai-automation"
    },
    {
      title: "Content Marketing với AI: Tạo nội dung viral trong 30 phút",
      excerpt: "Khám phá cách sử dụng AI tools để tạo ra content chất lượng cao, tối ưu SEO và có khả năng viral trên social media.",
      author: "Lê Văn Tâm",
      date: "20/12/2024", 
      readTime: "6 phút đọc",
      category: "Content Marketing",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop",
      tags: ["Content Marketing", "AI", "SEO", "Social Media"],
      slug: "content-marketing-ai-viral"
    },
    {
      title: "Omnichannel Commerce: Unified Customer Experience Strategy",
      excerpt: "Chiến lược tích hợp đa kênh bán hàng hiệu quả, tạo ra trải nghiệm khách hàng seamless từ online đến offline.",
      author: "Phạm Thị Mai",
      date: "18/12/2024",
      readTime: "10 phút đọc", 
      category: "E-commerce Strategy",
      image: "https://images.unsplash.com/photo-1556155092-490a1ba16284?w=400&h=250&fit=crop",
      tags: ["Omnichannel", "CX", "Strategy", "Retail"],
      slug: "omnichannel-commerce-strategy"
    },
    {
      title: "Social Media Analytics: Đo lường ROI thực tế với AI",
      excerpt: "Hướng dẫn sử dụng AI analytics để đo lường hiệu quả social media marketing một cách chính xác và actionable.",
      author: "Võ Minh Khôi",
      date: "15/12/2024",
      readTime: "8 phút đọc",
      category: "Analytics",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
      tags: ["Social Media", "Analytics", "ROI", "AI"],
      slug: "social-media-analytics-roi-ai"
    },
    {
      title: "Supply Chain 4.0: Tối ưu hóa với AI và IoT",
      excerpt: "Cách mạng hóa chuỗi cung ứng với công nghệ AI và IoT, từ demand forecasting đến logistics optimization.",
      author: "Đặng Văn Hùng",
      date: "12/12/2024",
      readTime: "15 phút đọc",
      category: "Supply Chain",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop",
      tags: ["Supply Chain", "AI", "IoT", "Logistics"],
      slug: "supply-chain-4-ai-iot"
    },
    {
      title: "Customer Data Platform: Unified View của khách hàng",
      excerpt: "Xây dựng Customer Data Platform hiệu quả để có cái nhìn 360 độ về khách hàng và personalize experience.",
      author: "Ngô Thị Hương",
      date: "10/12/2024",
      readTime: "9 phút đọc",
      category: "Data Analytics",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      tags: ["CDP", "Data", "Personalization", "CRM"],
      slug: "customer-data-platform"
    }
  ];

  const categories = [
    "Tất cả",
    "AI Marketing", 
    "E-commerce",
    "Content Marketing",
    "Analytics",
    "Supply Chain",
    "Case Studies"
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
                📝 Blog & Insights
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Kiến thức
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> chuyên sâu </span>
                AI & E-commerce
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Khám phá những insights mới nhất về AI Marketing, E-commerce Automation 
                và Digital Transformation từ đội ngũ experts của MediaTech.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-8 lg:p-12 text-white">
                    <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                      ⭐ Featured Article
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                      {featuredPost.title}
                    </h2>
                    <p className="text-blue-100 mb-6 leading-relaxed text-lg">
                      {featuredPost.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPost.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <div className="font-semibold">{featuredPost.author}</div>
                          <div className="text-blue-200 text-sm">
                            {featuredPost.date} • {featuredPost.readTime}
                          </div>
                        </div>
                      </div>
                      <Link 
                        to={`/blog/${featuredPost.slug}`}
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                      >
                        Đọc bài viết
                      </Link>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <img 
                      src={featuredPost.image} 
                      alt={featuredPost.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Filter */}
        <section className="py-10 bg-gray-50 border-y border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                      index === 0 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                  <article key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                    <div className="relative">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-3 py-1 bg-white/90 text-gray-800 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                        <Link to={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>{post.date}</span>
                          <span>•</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold">
                  Xem thêm bài viết
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Nhận insights mới nhất
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Đăng ký newsletter để nhận những bài viết chuyên sâu về AI, E-commerce 
                và Digital Marketing mỗi tuần.
              </p>
              
              <div className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Nhập email của bạn"
                    className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white focus:outline-none"
                  />
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap">
                    Đăng ký
                  </button>
                </div>
                <p className="text-sm text-blue-200 mt-3">
                  Miễn phí • Không spam • Có thể hủy bất cứ lúc nào
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
