
import React, { useState } from 'react';
import { Plus, Edit, Trash, Eye, Search } from 'lucide-react';

const BlogManager = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: 'AI trong Marketing: Tương lai đã đến',
      excerpt: 'Khám phá cách AI đang thay đổi ngành marketing...',
      status: 'published',
      date: '2024-01-15',
      views: 234
    },
    {
      id: 2,
      title: 'Xu hướng E-commerce 2024',
      excerpt: 'Những xu hướng mới trong thương mại điện tử...',
      status: 'draft',
      date: '2024-01-10',
      views: 0
    },
  ]);

  const [showEditor, setShowEditor] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft'
  });

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
    setNewBlog({ title: '', content: '', excerpt: '', status: 'draft' });
  };

  const handleEditBlog = (blog: any) => {
    setEditingBlog(blog);
    setNewBlog({
      title: blog.title,
      content: blog.content || '',
      excerpt: blog.excerpt,
      status: blog.status
    });
    setShowEditor(true);
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
              setNewBlog({ title: '', content: '', excerpt: '', status: 'draft' });
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
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
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
    </div>
  );
};

export default BlogManager;
