
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';

const BlogDetail = () => {
  const { slug } = useParams();

  // Mock data for blog post (in real app, this would be fetched based on slug)
  const blogPost = {
    title: "Tương lai của AI Marketing: Xu hướng 2024 và dự báo 2025",
    content: `
      <h2>Giới thiệu về AI Marketing</h2>
      <p>AI Marketing đang thay đổi cách các doanh nghiệp tiếp cận khách hàng. Với sức mạnh của machine learning và data analytics, các chiến lược marketing trở nên cá nhân hóa và hiệu quả hơn bao giờ hết.</p>
      
      <h2>Xu hướng AI Marketing năm 2024</h2>
      <p>Năm 2024 đánh dấu bước ngoặt quan trọng trong việc ứng dụng AI vào marketing. Các xu hướng nổi bật bao gồm:</p>
      
      <h3>1. Personalization ở mức độ siêu chi tiết</h3>
      <p>AI cho phép phân tích hành vi khách hàng ở mức độ cá nhân, tạo ra những trải nghiệm được cá nhân hóa hoàn toàn. Từ nội dung email đến gợi ý sản phẩm, mọi thứ đều được tối ưu hóa cho từng người dùng cụ thể.</p>
      
      <h3>2. Chatbot và Virtual Assistant thông minh</h3>
      <p>Các chatbot AI hiện đại có thể hiểu ngữ cảnh, cảm xúc và đưa ra phản hồi tự nhiên như con người. Điều này giúp cải thiện đáng kể trải nghiệm khách hàng và tăng tỷ lệ conversion.</p>
      
      <h3>3. Predictive Analytics</h3>
      <p>AI có thể dự đoán hành vi khách hàng trong tương lai dựa trên dữ liệu lịch sử, giúp doanh nghiệp đưa ra quyết định marketing chính xác hơn.</p>
      
      <h2>Dự báo cho năm 2025</h2>
      <p>Nhìn về năm 2025, chúng ta có thể kỳ vọng những bước tiến đột phá:</p>
      
      <h3>Voice Commerce sẽ bùng nổ</h3>
      <p>Với sự phát triển của AI voice recognition, mua sắm bằng giọng nói sẽ trở thành xu hướng chủ đạo.</p>
      
      <h3>AI-Generated Content</h3>
      <p>Nội dung được tạo ra bởi AI sẽ trở nên tinh vi và khó phân biệt với nội dung do con người tạo ra.</p>
      
      <h2>Kết luận</h2>
      <p>AI Marketing không chỉ là xu hướng mà đã trở thành yếu tố quyết định sự thành công của các doanh nghiệp. Những ai nắm bắt và ứng dụng hiệu quả sẽ có lợi thế cạnh tranh vượt trội trong thời đại số.</p>
    `,
    author: "Nguyễn Minh Đức",
    date: "25/12/2024",
    readTime: "8 phút đọc",
    category: "AI Marketing",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=600&fit=crop",
    tags: ["AI", "Marketing", "Xu hướng 2024", "Machine Learning", "Digital Transformation"]
  };

  const relatedPosts = [
    {
      title: "Dropshipping 2024: Chiến lược thành công với AI Automation",
      slug: "dropshipping-2024-ai-automation",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=250&fit=crop",
      category: "E-commerce"
    },
    {
      title: "Content Marketing với AI: Tạo nội dung viral trong 30 phút",
      slug: "content-marketing-ai-viral",
      image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=250&fit=crop",
      category: "Content Marketing"
    },
    {
      title: "Social Media Analytics: Đo lường ROI thực tế với AI",
      slug: "social-media-analytics-roi-ai",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop",
      category: "Analytics"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Link 
                to="/blog" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại Blog
              </Link>
              
              <div className="mb-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
                  {blogPost.category}
                </span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  {blogPost.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{blogPost.author}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>{blogPost.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{blogPost.readTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {blogPost.tags.map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src={blogPost.image} 
                  alt={blogPost.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                  <article className="prose prose-lg max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ __html: blogPost.content }}
                      className="text-gray-700 leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>p]:leading-relaxed"
                    />
                  </article>

                  {/* Share Section */}
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Chia sẻ bài viết</h3>
                    <div className="flex space-x-4">
                      <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Facebook className="w-4 h-4 mr-2" />
                        Facebook
                      </button>
                      <button className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                        <Twitter className="w-4 h-4 mr-2" />
                        Twitter
                      </button>
                      <button className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                        <Linkedin className="w-4 h-4 mr-2" />
                        LinkedIn
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-8">
                    {/* Author Info */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Về tác giả</h3>
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {blogPost.author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{blogPost.author}</div>
                          <div className="text-sm text-gray-600">AI Marketing Expert</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        Chuyên gia về AI Marketing với hơn 5 năm kinh nghiệm trong lĩnh vực Digital Transformation.
                      </p>
                    </div>

                    {/* Quick Share */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Chia sẻ nhanh</h3>
                      <button className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                        <Share2 className="w-4 h-4 mr-2" />
                        Chia sẻ bài viết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Bài viết liên quan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((post, index) => (
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
                      <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                        <Link to={`/blog/${post.slug}`} className="hover:underline">
                          {post.title}
                        </Link>
                      </h3>
                      <Link 
                        to={`/blog/${post.slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Đọc thêm
                        <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
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

export default BlogDetail;
