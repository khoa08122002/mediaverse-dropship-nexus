
import React, { useState } from 'react';
import { Plus, Edit, Trash, Eye, Search, Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BlogManager = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'AI trong Marketing: Tương lai đã đến',
      excerpt: 'Khám phá cách AI đang thay đổi ngành marketing...',
      content: 'Nội dung chi tiết về AI trong marketing. AI đang cách mạng hóa cách chúng ta tiếp cận khách hàng, từ việc cá nhân hóa trải nghiệm đến tối ưu hóa chiến lược quảng cáo.',
      status: 'published',
      date: '2024-01-15',
      views: 234,
      images: []
    },
    {
      id: 2,
      title: 'Xu hướng E-commerce 2024',
      excerpt: 'Những xu hướng mới trong thương mại điện tử...',
      content: 'Thương mại điện tử đang phát triển mạnh mẽ với nhiều xu hướng mới như live commerce, social commerce và AI-powered recommendations.',
      status: 'draft',
      date: '2024-01-10',
      views: 0,
      images: []
    },
  ]);

  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewBlog, setPreviewBlog] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    images: []
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map(file => ({
      id: Date.now() + Math.random(),
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setNewBlog({
      ...newBlog,
      images: [...newBlog.images, ...imageUrls]
    });
  };

  const removeImage = (imageId: number) => {
    const updatedImages = newBlog.images.filter((img: any) => img.id !== imageId);
    setNewBlog({
      ...newBlog,
      images: updatedImages
    });
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
    setNewBlog({ title: '', content: '', excerpt: '', status: 'draft', images: [] });
  };

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setNewBlog({
      title: blog.title,
      content: blog.content || '',
      excerpt: blog.excerpt,
      status: blog.status,
      images: blog.images || []
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
              setNewBlog({ title: '', content: '', excerpt: '', status: 'draft', images: [] });
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
                placeholder="Nhập tiêu đề blog"
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
                rows={3}
                placeholder="Nhập tóm tắt blog"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="mb-4">
                    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2">
                      <Upload className="w-4 h-4" />
                      <span>Chọn hình ảnh</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">Hoặc kéo thả hình ảnh vào đây</p>
                  <p className="text-xs text-gray-400 mt-2">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              {newBlog.images.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Hình ảnh đã chọn:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {newBlog.images.map((image: any) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">{image.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung
              </label>
              <textarea
                value={newBlog.content}
                onChange={(e) => setNewBlog({...newBlog, content: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={10}
                placeholder="Nhập nội dung blog"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={newBlog.status}
                onChange={(e) => setNewBlog({...newBlog, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSaveBlog}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingBlog ? 'Cập nhật' : 'Tạo Blog'}
              </button>
              <button
                onClick={() => setNewBlog({...newBlog, status: 'published'})}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Lưu và Xuất bản
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

      {/* Blog Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Xem trước Blog</DialogTitle>
          </DialogHeader>
          
          {previewBlog && (
            <div className="space-y-6">
              {/* Blog Header */}
              <div className="border-b pb-6">
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    previewBlog.status === 'published' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {previewBlog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {previewBlog.title}
                </h1>
                
                <div className="flex items-center gap-4 text-gray-600 text-sm">
                  <span>Ngày đăng: {previewBlog.date}</span>
                  <span>•</span>
                  <span>Lượt xem: {previewBlog.views}</span>
                </div>
              </div>

              {/* Blog Images */}
              {previewBlog.images && previewBlog.images.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Hình ảnh:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewBlog.images.map((image: any) => (
                      <div key={image.id} className="relative">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog Excerpt */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Tóm tắt:</h3>
                <p className="text-gray-700 italic">{previewBlog.excerpt}</p>
              </div>

              {/* Blog Content */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Nội dung:</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {previewBlog.content || 'Chưa có nội dung.'}
                </div>
              </div>

              {/* Preview Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlogManager;
