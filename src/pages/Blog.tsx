import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { blogService } from '@/services/blogService';
import type { BlogData } from '@/types/blog';
import { toast } from 'react-hot-toast';
import FeaturedArticle from '@/components/FeaturedArticle';
import { User, Calendar, Clock } from 'lucide-react';

const Blog = () => {
  const [loading, setLoading] = useState(false);
  const [featuredPost, setFeaturedPost] = useState<BlogData | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const categories = [
    "Tất cả",
    "AI Marketing", 
    "E-commerce",
    "Content Marketing",
    "Analytics",
    "Supply Chain",
    "Case Studies"
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [featured, allPosts] = await Promise.all([
        blogService.getFeaturedBlog(),
        blogService.getAllBlogs()
      ]);
      
      // Only show published posts
      const publishedPosts = allPosts.filter(post => post.status === 'published');
      
      setFeaturedPost(featured);
      setBlogPosts(publishedPosts);
    } catch (error) {
      console.error('Error fetching blog data:', error);
      toast.error('Không thể tải dữ liệu bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (category: string) => {
    try {
      setLoading(true);
      setSelectedCategory(category);
      
      let posts;
      if (category === 'Tất cả') {
        posts = await blogService.getAllBlogs();
      } else {
        posts = await blogService.getBlogsByCategory(category);
      }

      // Filter for published posts only
      const publishedPosts = posts.filter(post => post.status === 'published');
      setBlogPosts(publishedPosts);
    } catch (error) {
      console.error('Error filtering by category:', error);
      toast.error('Không thể lọc bài viết theo danh mục');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

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
        {featuredPost && featuredPost.status === 'published' && featuredPost.isFeatured && (
          <section className="py-12 px-4">
            <div className="container mx-auto">
              <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 max-w-4xl mx-auto h-[240px]">
                <div className="grid md:grid-cols-2 h-full">
                  {/* Content Section */}
                  <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600">
                    <div className="flex flex-col h-full">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-blue-100 text-sm font-medium">⭐ Bài viết nổi bật</span>
                        </div>
                        
                        <h2 className="text-3xl font-bold text-white mb-4 line-clamp-2 leading-tight">
                          {featuredPost.title}
                        </h2>
                        
                        <p className="text-blue-100 text-lg line-clamp-3 mb-8">
                          {featuredPost.excerpt}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-blue-100">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{featuredPost.author.fullName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(featuredPost.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{featuredPost.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Image Section */}
                  <div className="relative h-full">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                    <img 
                      src={featuredPost.featuredImage.url} 
                      alt={featuredPost.featuredImage.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Read Button - Absolute positioned at the bottom right */}
                  <div className="absolute bottom-6 right-6 z-10">
                    <Link 
                      to={`/blog/${featuredPost.slug}`}
                      className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors text-lg"
                    >
                      Đọc bài viết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Categories Filter */}
        <section className="py-10 bg-gray-50 border-y border-gray-200">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                      category === selectedCategory
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
                {blogPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                    <div className="relative">
                      <img 
                        src={post.featuredImage.url} 
                        alt={post.featuredImage.alt}
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
                          <span>{post.author.fullName}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
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
