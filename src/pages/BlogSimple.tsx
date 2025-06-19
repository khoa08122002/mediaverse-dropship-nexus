import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const BlogSimple = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data
  const mockBlogs = [
    {
      id: "1",
      title: "Getting Started with React 19",
      slug: "getting-started-react-19",
      excerpt: "Discover the latest features in React 19",
      category: "Technology",
      author: { fullName: "Tech Team" },
      createdAt: "2025-01-15",
      featuredImage: {
        url: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop&crop=center",
        alt: "React development"
      }
    },
    {
      id: "2", 
      title: "The Future of Web Development",
      slug: "future-of-web-development",
      excerpt: "Exploring trends shaping the future of web development",
      category: "Industry",
      author: { fullName: "Editorial Team" },
      createdAt: "2025-01-20",
      featuredImage: {
        url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop&crop=center",
        alt: "Web development"
      }
    }
  ];

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setBlogs(mockBlogs);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Blog & Insights
            </h1>
            <p className="text-xl text-gray-600">
              Khám phá những kiến thức chuyên sâu về AI & E-commerce
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((post) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="relative">
                    <img 
                      src={post.featuredImage.url} 
                      alt={post.featuredImage.alt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="inline-block px-3 py-1 bg-white/90 text-gray-800 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      <Link to={`/blog/${post.slug}`} className="hover:text-blue-600">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.author.fullName}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogSimple; 