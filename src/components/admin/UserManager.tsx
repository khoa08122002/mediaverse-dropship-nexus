
import React, { useState } from 'react';
import { Users, Plus, Edit, Trash, Search, Shield, ShieldCheck, User } from 'lucide-react';

const UserManager = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Admin System',
      email: 'admin@phgroup.vn',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15',
      createdDate: '2024-01-01'
    },
    {
      id: 2,
      name: 'Nguyễn Văn Editor',
      email: 'editor@phgroup.vn',
      role: 'editor',
      status: 'active',
      lastLogin: '2024-01-14',
      createdDate: '2024-01-05'
    },
    {
      id: 3,
      name: 'Trần Thị Viewer',
      email: 'viewer@phgroup.vn',
      role: 'viewer',
      status: 'inactive',
      lastLogin: '2024-01-10',
      createdDate: '2024-01-10'
    }
  ]);

  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'viewer',
    status: 'active',
    password: ''
  });

  const handleSaveUser = () => {
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...newUser, lastLogin: user.lastLogin, createdDate: user.createdDate }
          : user
      ));
    } else {
      const newId = Math.max(...users.map(u => u.id)) + 1;
      setUsers([...users, {
        ...newUser,
        id: newId,
        lastLogin: 'Chưa đăng nhập',
        createdDate: new Date().toISOString().split('T')[0]
      }]);
    }
    setShowUserForm(false);
    setEditingUser(null);
    setNewUser({ name: '', email: '', role: 'viewer', status: 'active', password: '' });
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      password: ''
    });
    setShowUserForm(true);
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(user => user.id !== id));
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldCheck className="w-4 h-4 text-red-600" />;
      case 'editor': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'viewer': return <User className="w-4 h-4 text-green-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'editor': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (showUserForm) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
          </h1>
          <button
            onClick={() => {
              setShowUserForm(false);
              setEditingUser(null);
              setNewUser({ name: '', email: '', role: 'viewer', status: 'active', password: '' });
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            Quay lại
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập địa chỉ email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu {editingUser && '(để trống nếu không đổi)'}
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={editingUser ? "Để trống nếu không đổi mật khẩu" : "Nhập mật khẩu"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vai trò
              </label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="viewer">Viewer - Chỉ xem</option>
                <option value="editor">Editor - Tạo và chỉnh sửa nội dung</option>
                <option value="admin">Admin - Toàn quyền</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Vô hiệu hóa</option>
              </select>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleSaveUser}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                {editingUser ? 'Cập nhật' : 'Tạo người dùng'}
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
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Người dùng</h1>
        <button
          onClick={() => setShowUserForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm người dùng</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{users.length} người dùng</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Người dùng</th>
                <th className="text-left py-3 px-4">Vai trò</th>
                <th className="text-left py-3 px-4">Trạng thái</th>
                <th className="text-left py-3 px-4">Đăng nhập gần nhất</th>
                <th className="text-left py-3 px-4">Ngày tạo</th>
                <th className="text-left py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <h3 className="font-medium text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                        {user.role === 'admin' ? 'Admin' : 
                         user.role === 'editor' ? 'Editor' : 'Viewer'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Vô hiệu hóa'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{user.lastLogin}</td>
                  <td className="py-3 px-4 text-gray-600">{user.createdDate}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      )}
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

export default UserManager;
