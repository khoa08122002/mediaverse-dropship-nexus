import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FeaturedArticleProps {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  slug: string;
}

const FeaturedArticle: React.FC<FeaturedArticleProps> = ({
  title,
  excerpt,
  author,
  date,
  readTime,
  imageUrl,
  slug
}) => {
  return (
    <div className="relative group overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 max-w-4xl mx-auto h-[160px]">
      <div className="grid md:grid-cols-2 h-full">
        {/* Content Section */}
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex flex-col h-full">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-300" />
              <span className="text-blue-100 text-sm font-medium">Bài viết nổi bật</span>
            </div>
            
            <h2 className="text-lg font-bold text-white mb-2 line-clamp-2 leading-tight">
              {title}
            </h2>
            
            <p className="text-blue-100 text-sm line-clamp-2 mb-2">
              {excerpt}
            </p>

            <div className="mt-auto flex items-center gap-2">
              <Link 
                to={`/blog/${slug}`}
                className="flex-1 text-center bg-white text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg font-medium transition-colors text-sm"
              >
                Đọc bài viết
              </Link>
              <Link
                to={`/blog/${slug}`}
                className="flex-1 text-center bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-medium backdrop-blur-sm transition-colors text-sm"
              >
                Xem thêm
              </Link>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative h-full">
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default FeaturedArticle; 