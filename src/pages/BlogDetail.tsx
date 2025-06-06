import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Tag, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { blogService } from '@/services/blogService';
import type { BlogData } from '@/types/blog';
import { toast } from 'react-hot-toast';
import logo from '@/assets/images/logo.png';

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [blogPost, setBlogPost] = useState<BlogData | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogData[]>([]);

  useEffect(() => {
    if (!slug) {
      navigate('/blog');
      return;
    }
    fetchBlogData();
  }, [slug, navigate]);

  const fetchBlogData = async () => {
    if (!slug) return;
    
    try {
      setLoading(true);
      const post = await blogService.getBlogBySlug(slug);
      
      // Parse featuredImage
      const processedPost = {
        ...post,
        featuredImage: typeof post.featuredImage === 'string'
          ? JSON.parse(post.featuredImage)
          : post.featuredImage
      };
      
      setBlogPost(processedPost);

      // Fetch related posts by category
      if (post.category) {
        const categoryPosts = await blogService.getBlogsByCategory(post.category);
        const processedRelatedPosts = categoryPosts
          .filter(p => p.id !== post.id)
          .map(p => ({
            ...p,
            featuredImage: typeof p.featuredImage === 'string'
              ? JSON.parse(p.featuredImage)
              : p.featuredImage
          }))
          .slice(0, 3);
          
        setRelatedPosts(processedRelatedPosts);
      }

      // Increment view count
      await blogService.incrementViews(post.id);
    } catch (error) {
      console.error('Error fetching blog data:', error);
      toast.error('Không thể tải bài viết');
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!blogPost) {
    return null;
  }

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <Link 
                to="/blog" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại Blog
              </Link>
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Logo" className="h-8" />
              </Link>
            </div>
            
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
                  <span>{blogPost.author.fullName}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{new Date(blogPost.createdAt).toLocaleDateString()}</span>
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
                src={blogPost.featuredImage.url} 
                alt={blogPost.featuredImage.alt}
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
                    className="text-gray-700 leading-relaxed [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-gray-900 [&>h2]:mt-8 [&>h2]:mb-4 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-gray-900 [&>h3]:mt-6 [&>h3]:mb-3 [&>p]:mb-4 [&>p]:leading-relaxed [&_img]:rounded-lg [&_img]:shadow-md [&_.my-8]:my-8 [&_.my-6]:my-6 [&_.grid]:grid [&_.grid-cols-1]:grid-cols-1 [&_.md\\:grid-cols-2]:md:grid-cols-2 [&_.md\\:grid-cols-3]:md:grid-cols-3 [&_.gap-4]:gap-4 [&_.w-full]:w-full [&_.h-64]:h-64 [&_.h-72]:h-72 [&_.h-80]:h-80 [&_.h-48]:h-48 [&_.h-40]:h-40 [&_.h-32]:h-32 [&_.object-cover]:object-cover [&_.shadow-lg]:shadow-lg [&_.shadow-md]:shadow-md [&_.text-center]:text-center [&_.text-sm]:text-sm [&_.text-gray-600]:text-gray-600 [&_.italic]:italic [&_.mt-2]:mt-2 [&_.w-3\\/4]:w-3/4 [&_.flex]:flex [&_.justify-center]:justify-center"
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
                        {blogPost.author.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{blogPost.author.fullName}</div>
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
      {relatedPosts.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Bài viết liên quan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((post) => (
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
      )}

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
  );
};

export default BlogDetail;
