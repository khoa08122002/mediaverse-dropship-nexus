import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash, Eye, Search, User, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { Editor } from '@tinymce/tinymce-react';
import { blogService } from '@/services/blogService';
import type { BlogImage, BlogData, CreateBlogDTO } from '@/types/blog';
import { toast } from 'react-hot-toast';
import { marked } from 'marked';

interface BlogFormData extends CreateBlogDTO {
  status: 'draft' | 'published';
}

const categories = [
  "AI Marketing",
  "E-commerce",
  "Content Marketing",
  "Analytics",
  "Supply Chain",
  "Case Studies"
];

const BlogManager = () => {
  const navigate = useNavigate();
  const editorRef = useRef<any>(null);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewBlog, setPreviewBlog] = useState<BlogData | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogData | null>(null);
  const [newBlog, setNewBlog] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    category: '',
    tags: [],
    readTime: '',
    isFeatured: false,
    featuredImage: {
      url: '',
      alt: ''
    }
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
      return;
    }
    fetchBlogs();
  }, [navigate]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Không thể tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBlog = async () => {
    try {
      // Validate required fields
      if (!newBlog.title.trim()) {
        toast.error('Vui lòng nhập tiêu đề bài viết');
        return;
      }
      if (!newBlog.content.trim()) {
        toast.error('Vui lòng nhập nội dung bài viết');
        return;
      }
      if (!newBlog.excerpt.trim()) {
        toast.error('Vui lòng nhập tóm tắt bài viết');
        return;
      }
      if (!newBlog.category) {
        toast.error('Vui lòng chọn danh mục');
        return;
      }

      setLoading(true);
      const blogData: CreateBlogDTO = {
        title: newBlog.title.trim(),
        content: newBlog.content.trim(),
        excerpt: newBlog.excerpt.trim(),
        category: newBlog.category,
        tags: newBlog.tags,
        readTime: newBlog.readTime,
        status: newBlog.status,
        isFeatured: newBlog.status === 'published' && newBlog.isFeatured,
        featuredImage: {
          url: newBlog.featuredImage.url.trim(),
          alt: newBlog.featuredImage.alt.trim()
        }
      };

      console.log('Saving blog with data:', blogData); // Debug log

      if (editingBlog) {
        const response = await blogService.updateBlog(editingBlog.id, blogData);
        console.log('Update response:', response); // Debug log
        toast.success('Cập nhật bài viết thành công');
      } else {
        const response = await blogService.createBlog(blogData);
        console.log('Create response:', response); // Debug log
        toast.success('Tạo bài viết mới thành công');
      }

      await fetchBlogs();
      setShowEditor(false);
      setEditingBlog(null);
      setNewBlog({
        title: '',
        content: '',
        excerpt: '',
        status: 'draft',
        category: '',
        tags: [],
        readTime: '',
        isFeatured: false,
        featuredImage: {
          url: '',
          alt: ''
        }
      });
    } catch (error) {
      console.error('Error saving blog:', error);
      if (error instanceof Error) {
        toast.error(`Lỗi: ${error.message}`);
      } else {
        toast.error('Có lỗi xảy ra khi lưu bài viết');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = (blog: BlogData) => {
    setEditingBlog(blog);
    setNewBlog({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      status: blog.status,
      category: blog.category,
      tags: blog.tags,
      readTime: blog.readTime,
      isFeatured: blog.isFeatured,
      featuredImage: blog.featuredImage
    });
    setShowEditor(true);
  };

  const handlePreviewBlog = (blog: BlogData | BlogFormData) => {
    setPreviewBlog(blog as BlogData);
    setShowPreview(true);
  };

  const handleDeleteBlog = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        setLoading(true);
        await blogService.deleteBlog(id);
        toast.success('Xóa bài viết thành công');
        await fetchBlogs();
      } catch (error) {
        console.error('Error deleting blog:', error);
        toast.error('Có lỗi xảy ra khi xóa bài viết');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchQuery.trim()) {
        const results = await blogService.searchBlogs(searchQuery);
        setBlogs(results);
      } else {
        await fetchBlogs();
      }
    } catch (error) {
      console.error('Error searching blogs:', error);
      toast.error('Có lỗi xảy ra khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (blobInfo: any) => {
    try {
      const { url } = await blogService.uploadImage(blobInfo.blob());
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Không thể tải lên hình ảnh');
      throw error;
    }
  };

  if (showEditor) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {editingBlog ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
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
                category: '',
                tags: [],
                readTime: '',
                isFeatured: false,
                featuredImage: {
                  url: '',
                  alt: ''
                }
              });
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            Quay lại
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề
              </label>
              <input
                type="text"
                value={newBlog.title}
                onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập tiêu đề bài viết"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung
              </label>
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                onInit={(evt, editor) => editorRef.current = editor}
                value={newBlog.content}
                onEditorChange={(content) => setNewBlog({...newBlog, content})}
                init={{
                  height: 500,
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
                  language: 'vi',
                  skin: 'oxide',
                  content_css: 'default',
                  images_upload_handler: handleImageUpload
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tóm tắt
              </label>
              <textarea
                value={newBlog.excerpt}
                onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Nhập tóm tắt bài viết"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh đại diện
              </label>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newBlog.featuredImage.url}
                  onChange={(e) => setNewBlog(prev => ({
                    ...prev,
                    featuredImage: {
                      ...prev.featuredImage,
                      url: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập URL ảnh đại diện"
                />
                <input
                  type="text"
                  value={newBlog.featuredImage.alt}
                  onChange={(e) => setNewBlog(prev => ({
                    ...prev,
                    featuredImage: {
                      ...prev.featuredImage,
                      alt: e.target.value
                    }
                  }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Mô tả ảnh (alt text)"
                />
                {newBlog.featuredImage.url && (
                  <div className="mt-2">
                    <img
                      src={newBlog.featuredImage.url}
                      alt={newBlog.featuredImage.alt}
                      className="max-w-xs rounded-lg shadow-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <div className="space-y-4">
                <select
                  value={newBlog.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as 'draft' | 'published';
                    setNewBlog(prev => ({
                      ...prev,
                      status: newStatus,
                      isFeatured: newStatus === 'draft' ? false : prev.isFeatured
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                </select>

                {newBlog.status === 'published' && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={newBlog.isFeatured}
                      onChange={(e) => setNewBlog(prev => ({
                        ...prev,
                        isFeatured: e.target.checked
                      }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isFeatured" className="text-sm text-gray-700">
                      Đặt làm bài viết nổi bật
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSaveBlog}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingBlog ? 'Cập nhật' : 'Đăng bài'}
              </button>
              <button
                onClick={() => handlePreviewBlog(newBlog)}
                className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200"
              >
                Xem trước
              </button>
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
          <span>Tạo bài viết</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>{blogs.length} bài viết</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Tiêu đề</th>
                <th className="text-left py-3 px-4">Tác giả</th>
                <th className="text-left py-3 px-4">Trạng thái</th>
                <th className="text-left py-3 px-4">Ngày đăng</th>
                <th className="text-left py-3 px-4">Lượt xem</th>
                <th className="text-left py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-800">{blog.title}</p>
                      <p className="text-sm text-gray-600">{blog.excerpt.substring(0, 100)}...</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{blog.author.fullName}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        blog.status === 'published'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                      </span>
                      {blog.isFeatured && (
                        <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                          Bài viết nổi bật
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{new Date(blog.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-600">{blog.views}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditBlog(blog)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePreviewBlog(blog)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog.id)}
                        className="text-red-600 hover:text-red-800"
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

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Xem trước bài viết</DialogTitle>
          </DialogHeader>
          {previewBlog && (
            <div className="space-y-6">
              {/* Featured Image */}
              {previewBlog.featuredImage?.url && (
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={previewBlog.featuredImage.url} 
                    alt={previewBlog.featuredImage.alt}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Blog Info */}
              <div className="space-y-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {previewBlog.category}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900">{previewBlog.title}</h1>

                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    <span>{previewBlog.authorId || 'Admin'}</span>
                  </div>
                  {previewBlog.createdAt && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(previewBlog.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>{previewBlog.readTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {previewBlog.tags?.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="prose max-w-none">
                  <p className="text-gray-600 italic border-l-4 border-blue-500 pl-4">
                    {previewBlog.excerpt}
                  </p>
                  <div dangerouslySetInnerHTML={{ __html: previewBlog.content }} />
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
