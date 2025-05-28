import React, { useState, useRef } from 'react';
import { Plus, Edit, Trash, Eye, Search, Upload, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { marked } from 'marked';
import { Editor } from '@tinymce/tinymce-react';

const BlogManager = () => {
  const editorRef = useRef(null);
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'AI trong Marketing: Tương lai đã đến',
      excerpt: 'Khám phá cách AI đang thay đổi ngành marketing, từ việc tự động hóa quy trình đến cá nhân hóa trải nghiệm khách hàng. Tìm hiểu các xu hướng mới nhất và cách áp dụng AI vào chiến lược marketing của doanh nghiệp.',
      content: `# 1. Giới thiệu

Trong thời đại số hóa ngày nay, Trí tuệ nhân tạo (AI) đang dần trở thành một phần không thể thiếu trong hoạt động marketing của doanh nghiệp. Bài viết này sẽ đi sâu vào việc phân tích các xu hướng AI Marketing đang định hình lại cách thức doanh nghiệp tiếp cận và tương tác với khách hàng.

## 1.1. Tầm quan trọng của AI trong Marketing

AI đang mang đến một cuộc cách mạng trong cách doanh nghiệp thực hiện marketing:
- Tự động hóa các quy trình marketing
- Cá nhân hóa trải nghiệm khách hàng
- Tối ưu hóa chiến dịch quảng cáo
- Phân tích dữ liệu khách hàng một cách chính xác

# 2. Nội dung chính

## 2.1. Xu hướng AI Marketing 2024

### 2.1.1. Chatbot và Virtual Assistant
Chatbot tích hợp AI đang trở thành kênh tương tác chính với khách hàng, mang lại nhiều lợi ích:
- Hỗ trợ khách hàng 24/7
- Tự động hóa quy trình bán hàng
- Thu thập thông tin khách hàng
- Tối ưu chi phí vận hành

### 2.1.2. Cá nhân hóa trải nghiệm
AI giúp tạo ra trải nghiệm cá nhân hóa cho từng khách hàng thông qua:
- Gợi ý sản phẩm thông minh
- Email marketing được cá nhân hóa
- Nội dung website động
- Quảng cáo được nhắm mục tiêu chính xác

### 2.1.3. Phân tích dữ liệu và dự đoán
AI mang lại khả năng phân tích dữ liệu mạnh mẽ:
- Dự đoán hành vi khách hàng
- Phân tích sentiment trên social media
- Tối ưu hóa ROI marketing
- Dự báo xu hướng thị trường

## 2.2. Ứng dụng AI Marketing trong thực tế

### 2.2.1. Content Marketing
AI hỗ trợ tạo và tối ưu nội dung:
- Tự động tạo nội dung blog
- Tối ưu hóa SEO
- Phân tích hiệu quả content
- A/B testing tự động

### 2.2.2. Social Media Marketing
AI cải thiện hiệu quả social media marketing:
- Lập lịch đăng bài tự động
- Phân tích trending topics
- Tối ưu thời gian đăng bài
- Tương tác với follower tự động

### 2.2.3. Email Marketing
AI nâng cao hiệu quả email marketing:
- Phân khúc khách hàng tự động
- Tối ưu subject line
- Cá nhân hóa nội dung email
- Dự đoán thời điểm gửi tối ưu

# 3. Kết luận

## 3.1. Tương lai của AI Marketing
AI sẽ tiếp tục phát triển và mang lại nhiều cơ hội mới cho marketing:
- Marketing automation ngày càng thông minh
- Trải nghiệm khách hàng được cá nhân hóa cao độ
- Phân tích dữ liệu real-time
- Tối ưu hóa chi phí marketing

## 3.2. Lời khuyên cho doanh nghiệp
Để áp dụng AI Marketing hiệu quả, doanh nghiệp cần:
- Xây dựng chiến lược AI Marketing rõ ràng
- Đầu tư vào công nghệ và nhân sự
- Tập trung vào trải nghiệm khách hàng
- Liên tục cập nhật xu hướng mới`,
      status: 'published',
      date: '2024-01-15',
      views: 234,
      images: [
        {
          id: 1,
          url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
          name: 'AI Marketing Overview'
        },
        {
          id: 2,
          url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
          name: 'Data Analytics Dashboard'
        },
        {
          id: 3,
          url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
          name: 'Marketing Automation'
        },
        {
          id: 4,
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
          name: 'Customer Experience'
        }
      ],
      author: 'Nguyễn Văn A',
      readTime: '8 phút đọc',
      category: 'AI Marketing',
      tags: ['AI', 'Marketing', 'Automation', 'Machine Learning', 'Digital Marketing'],
      slug: 'ai-trong-marketing-tuong-lai',
      featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995'
    },
    {
      id: 2,
      title: 'Xu hướng E-commerce 2024',
      excerpt: 'Khám phá những xu hướng mới nhất trong thương mại điện tử năm 2024. Từ social commerce đến AI-powered recommendations, tìm hiểu cách các công nghệ mới đang định hình lại ngành bán lẻ trực tuyến.',
      content: `# 1. Giới thiệu

## 1.1. Tổng quan thị trường E-commerce 2024
Thương mại điện tử đang phát triển với tốc độ chóng mặt, mang đến nhiều cơ hội và thách thức mới cho doanh nghiệp.

## 1.2. Các yếu tố thúc đẩy tăng trưởng
- Công nghệ mới
- Thay đổi hành vi người tiêu dùng
- Cạnh tranh thị trường
- Chuyển đổi số toàn diện

# 2. Nội dung chính

## 2.1. Social Commerce
Social commerce đang trở thành xu hướng chủ đạo:
- Live streaming commerce
- Shopping trên social media
- User-generated content
- Influencer marketing

## 2.2. AI và Personalization
AI đang cách mạng hóa trải nghiệm mua sắm:
- Gợi ý sản phẩm thông minh
- Chatbot hỗ trợ khách hàng
- Dynamic pricing
- Inventory management

## 2.3. Mobile Commerce
M-commerce tiếp tục phát triển mạnh:
- Mobile-first design
- Mobile payment
- App-based shopping
- Progressive Web Apps

# 3. Kết luận
Thương mại điện tử sẽ tiếp tục phát triển với nhiều đổi mới công nghệ và xu hướng mới.`,
      status: 'draft',
      date: '2024-01-10',
      views: 0,
      images: [
        {
          id: 1,
          url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d',
          name: 'E-commerce Trends'
        },
        {
          id: 2,
          url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028',
          name: 'Social Commerce'
        }
      ],
      author: 'Trần Thị B',
      readTime: '6 phút đọc',
      category: 'E-commerce',
      tags: ['E-commerce', '2024', 'Trends', 'Digital Transformation'],
      slug: 'xu-huong-ecommerce-2024',
      featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d'
    },
  ]);

  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: `# 1. Giới thiệu

## 1.1. Tổng quan

[Viết tổng quan về chủ đề bài viết]

## 1.2. Mục tiêu

[Liệt kê các mục tiêu chính của bài viết]

# 2. Nội dung chính

## 2.1. [Tiêu đề phần 1]

### 2.1.1. [Tiểu mục 1]
[Nội dung chi tiết]

### 2.1.2. [Tiểu mục 2]
[Nội dung chi tiết]

## 2.2. [Tiêu đề phần 2]

### 2.2.1. [Tiểu mục 1]
[Nội dung chi tiết]

### 2.2.2. [Tiểu mục 2]
[Nội dung chi tiết]

# 3. Kết luận

## 3.1. Tổng kết
[Tóm tắt những điểm chính]

## 3.2. Đề xuất
[Đưa ra các đề xuất hoặc hướng phát triển]`,
    excerpt: '',
    status: 'draft',
    images: [],
    author: '',
    readTime: '',
    category: '',
    tags: [],
    slug: '',
    featuredImage: ''
  });

  const categories = [
    "AI Marketing",
    "E-commerce",
    "Content Marketing",
    "Analytics",
    "Supply Chain",
    "Case Studies"
  ];

  const handleImageUpload = async (blobInfo: any) => {
    // Trong thực tế, bạn sẽ upload file lên server và nhận về URL
    // Ở đây tạm thời dùng URL.createObjectURL
    const file = blobInfo.blob();
    const url = URL.createObjectURL(file);
    
    setNewBlog(prev => ({
      ...prev,
      images: [...prev.images, {
        id: Date.now(),
        file,
        url,
        name: blobInfo.filename()
      }]
    }));

    return url;
  };

  const insertTemplate = (template: string) => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement;
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const textBefore = newBlog.content.substring(0, cursorPos);
      const textAfter = newBlog.content.substring(cursorPos);
      
      setNewBlog(prev => ({
        ...prev,
        content: textBefore + template + textAfter
      }));
    }
  };

  const renderContent = (content: string, images: any[]) => {
    let processedContent = content;
    
    // Replace image placeholders with actual URLs
    images.forEach(img => {
      processedContent = processedContent.replace(
        img.placeholder || `{image-${img.id}}`,
        img.url
      );
    });

    return marked(processedContent, {
      breaks: true,
      gfm: true
    });
  };

  const templates = {
    section: `\n# Tiêu đề section\n\nNội dung của section...\n`,
    imageGallery: `\n## Bộ sưu tập hình ảnh\n\n[Chọn hình ảnh để chèn vào đây]\n\n`,
    productShowcase: `\n## Sản phẩm nổi bật\n\n### Tên sản phẩm\n- Giá: xxx\n- Mô tả: xxx\n\n[Chèn hình ảnh sản phẩm]\n`,
    quote: `\n> Trích dẫn hoặc highlight quan trọng\n`,
    list: `\n## Danh sách chính\n- Mục 1\n- Mục 2\n- Mục 3\n`,
    table: `\n| Cột 1 | Cột 2 | Cột 3 |\n|--------|--------|--------|\n| Nội dung 1 | Nội dung 2 | Nội dung 3 |\n`
  };

  const handleSaveBlog = () => {
    if (editingBlog) {
      setBlogs(blogs.map(blog => 
        blog.id === editingBlog.id 
          ? { ...blog, ...newBlog, date: new Date().toISOString().split('T')[0] }
          : blog
      ));
    } else {
      const newId = Math.max(...blogs.map(b => b.id)) + 1;
      setBlogs([...blogs, {
        ...newBlog,
        id: newId,
        date: new Date().toISOString().split('T')[0],
        views: 0
      }]);
    }
    setShowEditor(false);
    setEditingBlog(null);
    setNewBlog({
      title: '',
      content: '',
      excerpt: '',
      status: 'draft',
      images: [],
      author: '',
      readTime: '',
      category: '',
      tags: [],
      slug: '',
      featuredImage: ''
    });
  };

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setNewBlog({
      title: blog.title,
      content: blog.content || '',
      excerpt: blog.excerpt,
      status: blog.status,
      images: blog.images || [],
      author: blog.author,
      readTime: blog.readTime,
      category: blog.category,
      tags: blog.tags || [],
      slug: blog.slug,
      featuredImage: blog.featuredImage
    });
    setShowEditor(true);
  };

  const handlePreviewBlog = (blog: any) => {
    setPreviewBlog(blog);
    setShowPreview(true);
  };

  const handleDeleteBlog = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa blog này?')) {
      setBlogs(blogs.filter(blog => blog.id !== id));
    }
  };

  if (showEditor) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {editingBlog ? 'Chỉnh sửa Blog' : 'Tạo Blog mới'}
          </h1>
          <button
            onClick={() => {
              setShowEditor(false);
              setEditingBlog(null);
              setNewBlog({
                title: '',
                content: '',
                excerpt: '',
                status: 'draft',
                images: [],
                author: '',
                readTime: '',
                category: '',
                tags: [],
                slug: '',
                featuredImage: ''
              });
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            Quay lại
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-6">
            {/* Basic Info Section */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tiêu đề blog"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug URL
                </label>
                <input
                  type="text"
                  value={newBlog.slug}
                  onChange={(e) => setNewBlog({...newBlog, slug: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="vi-du-slug-url"
                />
              </div>
            </div>

            {/* Author & Category Section */}
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tác giả
                </label>
                <input
                  type="text"
                  value={newBlog.author}
                  onChange={(e) => setNewBlog({...newBlog, author: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Tên tác giả"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  value={newBlog.category}
                  onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thời gian đọc
                </label>
                <input
                  type="text"
                  value={newBlog.readTime}
                  onChange={(e) => setNewBlog({...newBlog, readTime: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: 5 phút đọc"
                />
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh đại diện
              </label>
              <div className="grid grid-cols-2 gap-6">
                <input
                  type="text"
                  value={newBlog.featuredImage}
                  onChange={(e) => setNewBlog({...newBlog, featuredImage: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="URL ảnh đại diện"
                />
                {newBlog.featuredImage && (
                  <div className="relative h-[150px] rounded-lg overflow-hidden">
                    <img
                      src={newBlog.featuredImage}
                      alt="Featured"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={newBlog.tags.join(', ')}
                onChange={(e) => setNewBlog({...newBlog, tags: e.target.value.split(',').map(tag => tag.trim())})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tags, phân cách bằng dấu phẩy"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tóm tắt
              </label>
              <textarea
                value={newBlog.excerpt}
                onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Nhập tóm tắt blog"
              />
            </div>

            {/* Rich Text Editor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung
              </label>
              <Editor
                apiKey="uerlxkgkal2hnhfpyp367018317719i9fwj8qxaseezquqde"
                onInit={(evt, editor) => editorRef.current = editor}
                value={newBlog.content}
                onEditorChange={(content) => setNewBlog({...newBlog, content})}
                init={{
                  height: 600,
                  menubar: true,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  images_upload_handler: handleImageUpload,
                  language: 'vi',
                  skin: 'oxide',
                  toolbar_mode: 'sliding',
                  branding: false,
                  resize: false,
                  paste_data_images: true,
                  automatic_uploads: true,
                  file_picker_types: 'image',
                  image_title: true,
                  image_caption: true,
                  image_dimensions: false,
                  image_class_list: [
                    { title: 'Responsive', value: 'img-fluid' }
                  ],
                  setup: (editor) => {
                    editor.on('init', () => {
                      editor.getContainer().style.transition = "border-color 0.15s ease-in-out";
                    });
                    editor.on('focus', () => {
                      editor.getContainer().style.borderColor = "#3b82f6";
                    });
                    editor.on('blur', () => {
                      editor.getContainer().style.borderColor = "#d1d5db";
                    });
                  }
                }}
              />
            </div>

            {/* Status & Actions */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái:
                </label>
                <select
                  value={newBlog.status}
                  onChange={(e) => setNewBlog({...newBlog, status: e.target.value})}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Xuất bản</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    if (editorRef.current) {
                      const editor = editorRef.current;
                      editor.setContent('');
                    }
                    setNewBlog({
                      title: '',
                      content: '',
                      excerpt: '',
                      status: 'draft',
                      images: [],
                      author: '',
                      readTime: '',
                      category: '',
                      tags: [],
                      slug: '',
                      featuredImage: ''
                    });
                  }}
                  className="px-6 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                >
                  Xóa tất cả
                </button>
                <button
                  onClick={() => setShowPreview(true)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Xem trước
                </button>
                <button
                  onClick={handleSaveBlog}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingBlog ? 'Cập nhật' : 'Tạo Blog'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Blog</h1>
        <button
          onClick={() => setShowEditor(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Blog mới</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm blog..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Tiêu đề</th>
                <th className="text-left py-3 px-4">Danh mục</th>
                <th className="text-left py-3 px-4">Tác giả</th>
                <th className="text-left py-3 px-4">Trạng thái</th>
                <th className="text-left py-3 px-4">Ngày tạo</th>
                <th className="text-left py-3 px-4">Lượt xem</th>
                <th className="text-left py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <h3 className="font-medium text-gray-800">{blog.title}</h3>
                      <p className="text-sm text-gray-600">{blog.excerpt}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{blog.category}</td>
                  <td className="py-3 px-4 text-gray-600">{blog.author}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      blog.status === 'published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{blog.date}</td>
                  <td className="py-3 px-4 text-gray-600">{blog.views}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditBlog(blog)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handlePreviewBlog(blog)}
                        className="text-green-600 hover:text-green-800"
                        title="Xem trước"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Xóa"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-6">
                📝 Blog Preview
              </span>
            </DialogTitle>
          </DialogHeader>
          
          {previewBlog && (
            <div>
              {/* Hero Section */}
              <section className="relative">
                {/* Featured Image */}
                <div className="relative h-[500px] rounded-xl overflow-hidden mb-8">
                  <img 
                    src={previewBlog.featuredImage} 
                    alt={previewBlog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <div className="max-w-4xl mx-auto">
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-sm font-medium">
                          {previewBlog.category}
                        </span>
                      </div>
                      <h1 className="text-4xl md:text-5xl font-bold mb-4">{previewBlog.title}</h1>
                      <div className="flex items-center gap-4 text-sm text-gray-200">
                        <span className="flex items-center gap-2">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(previewBlog.author)}&background=random`}
                            alt={previewBlog.author}
                            className="w-6 h-6 rounded-full"
                          />
                          {previewBlog.author}
                        </span>
                        <span>•</span>
                        <span>{previewBlog.date}</span>
                        <span>•</span>
                        <span>{previewBlog.readTime}</span>
                        <span>•</span>
                        <span>{previewBlog.views} lượt xem</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="max-w-4xl mx-auto px-4">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8">
                    {previewBlog.tags.map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Blog Excerpt */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-8">
                    <p className="text-lg text-gray-700 italic leading-relaxed">
                      {previewBlog.excerpt}
                    </p>
                  </div>

                  {/* Blog Content */}
                  <div className="prose prose-lg max-w-none mb-12">
                    <div 
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: marked(previewBlog.content, {
                          breaks: true,
                          gfm: true
                        })
                      }}
                    />
                  </div>

                  {/* Additional Images */}
                  {previewBlog.images && previewBlog.images.length > 0 && (
                    <div className="space-y-6 mb-12">
                      <h3 className="text-2xl font-semibold text-gray-900">Hình ảnh bổ sung</h3>
                      <div className="grid grid-cols-2 gap-6">
                        {previewBlog.images.map((image: any) => (
                          <div key={image.id} className="group relative rounded-xl overflow-hidden">
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="absolute bottom-4 left-4 right-4">
                                <p className="text-white text-sm truncate">{image.name}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Share Section */}
                  <div className="border-t border-gray-200 pt-8 mb-12">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Chia sẻ bài viết</h3>
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                        Facebook
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Twitter
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0a12 12 0 100 24 12 12 0 000-24zm3.73 17.66c-.23.3-.66.4-1.02.27-2.8-1.7-6.32-2.08-10.47-1.14-.4.1-.82-.15-.92-.55-.1-.4.15-.82.55-.92 4.53-1.03 8.42-.6 11.56 1.32.37.23.47.7.3 1.02zm.99-2.2c-.29.37-.82.5-1.24.33-3.2-1.96-8.07-2.53-11.84-1.38-.48.14-.98-.13-1.12-.6-.15-.48.12-.98.6-1.12 4.32-1.31 9.67-.68 13.38 1.54.44.27.57.82.22 1.23zm.09-2.28c-3.84-2.27-10.16-2.48-13.83-1.37-.57.17-1.18-.15-1.35-.73-.17-.57.15-1.18.73-1.35 4.22-1.28 11.24-1.03 15.67 1.58.54.32.72 1.01.4 1.55-.32.53-1.02.71-1.55.39-.07-.04-.13-.09-.07-.07-.07z"/>
                        </svg>
                        Spotify
                      </button>
                    </div>
                  </div>

                  {/* Related Posts */}
                  <div className="border-t border-gray-200 pt-8 mb-12">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Bài viết liên quan</h3>
                    <div className="grid grid-cols-2 gap-6">
                      {blogs.filter(b => b.id !== previewBlog.id).slice(0, 2).map((post) => (
                        <article key={post.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                          <div className="relative">
                            <img 
                              src={post.featuredImage} 
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
                            <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h4>
                            <p className="text-gray-600 mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                            
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <span>{post.author}</span>
                              <span>{post.date}</span>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Preview Actions */}
              <div className="sticky bottom-0 left-0 right-0 bg-white border-t p-4 mt-8">
                <div className="max-w-4xl mx-auto flex justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      handleEditBlog(previewBlog);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManager;
