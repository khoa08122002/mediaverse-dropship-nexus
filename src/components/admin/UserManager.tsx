import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash, Search, Shield, ShieldCheck, User, Key } from 'lucide-react';
import { userService } from '@/services/userService';
import type { User as UserType, CreateUserDTO, UpdateUserDTO } from '@/types/user';
import { toast } from 'react-hot-toast';

const UserManager = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [newUser, setNewUser] = useState<CreateUserDTO>({
    email: '',
    password: '',
    fullName: '',
    role: 'VIEWER',
    status: 'ACTIVE'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchQuery.trim()) {
        const data = await userService.searchUsers(searchQuery);
        setUsers(data);
      } else {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Có lỗi xảy ra khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);
      
      // Validate required fields
      if (!newUser.fullName.trim()) {
        toast.error('Vui lòng nhập họ và tên');
        return;
      }
      if (!newUser.email.trim()) {
        toast.error('Vui lòng nhập email');
        return;
      }
      if (!editingUser && !newUser.password.trim()) {
        toast.error('Vui lòng nhập mật khẩu');
        return;
      }

      if (editingUser) {
        // Update existing user
        const updateData: UpdateUserDTO = {
          fullName: newUser.fullName,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status
        };
        
        if (newUser.password.trim()) {
          updateData.password = newUser.password;
        }

        const updatedUser = await userService.updateUser(editingUser.id, updateData);
        setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
        toast.success('Cập nhật người dùng thành công');
      } else {
        // Create new user
        const createdUser = await userService.createUser(newUser);
        setUsers([...users, createdUser]);
        toast.success('Tạo người dùng mới thành công');
      }

      setShowUserForm(false);
      setEditingUser(null);
      setNewUser({
        email: '',
        password: '',
        fullName: '',
        role: 'VIEWER',
        status: 'ACTIVE'
      });
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: UserType) => {
    setEditingUser(user);
    setNewUser({
      email: user.email,
      password: '',
      fullName: user.fullName,
      role: user.role,
      status: user.status
    });
    setShowUserForm(true);
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        setLoading(true);
        await userService.deleteUser(id);
        setUsers(users.filter(user => user.id !== id));
        toast.success('Xóa người dùng thành công');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Có lỗi xảy ra khi xóa người dùng');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChangePassword = async () => {
    try {
      if (!editingUser) {
        toast.error('Không tìm thấy thông tin người dùng');
        return;
      }

      if (!passwordData.currentPassword.trim()) {
        toast.error('Vui lòng nhập mật khẩu hiện tại');
        return;
      }

      if (!passwordData.newPassword.trim()) {
        toast.error('Vui lòng nhập mật khẩu mới');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('Mật khẩu mới không khớp');
        return;
      }

      setLoading(true);
      await userService.changePassword(
        editingUser.id,
        passwordData.currentPassword,
        passwordData.newPassword
      );

      toast.success('Đổi mật khẩu thành công');
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN': return <ShieldCheck className="w-4 h-4 text-red-600" />;
      case 'EDITOR': return <Shield className="w-4 h-4 text-blue-600" />;
      case 'VIEWER': return <User className="w-4 h-4 text-green-600" />;
      default: return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'EDITOR': return 'bg-blue-100 text-blue-800';
      case 'VIEWER': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
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
              setNewUser({ email: '', password: '', fullName: '', role: 'VIEWER', status: 'ACTIVE' });
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
                value={newUser.fullName}
                onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
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
                onChange={(e) => setNewUser({...newUser, role: e.target.value as 'ADMIN' | 'EDITOR' | 'VIEWER'})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="VIEWER">Viewer - Chỉ xem</option>
                <option value="EDITOR">Editor - Tạo và chỉnh sửa nội dung</option>
                <option value="ADMIN">Admin - Toàn quyền</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={newUser.status}
                onChange={(e) => setNewUser({...newUser, status: e.target.value as 'ACTIVE' | 'INACTIVE'})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Vô hiệu hóa</option>
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

  if (showPasswordForm && editingUser) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Đổi mật khẩu cho {editingUser.fullName}
          </h1>
          <button
            onClick={() => {
              setShowPasswordForm(false);
              setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              });
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
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleChangePassword}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Đổi mật khẩu
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Tìm kiếm người dùng..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tìm kiếm
            </button>
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
                      <h3 className="font-medium text-gray-800">{user.fullName}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(user.status)}`}>
                      {user.status === 'ACTIVE' ? 'Hoạt động' : 'Vô hiệu hóa'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(user.updatedAt)}</td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(user.createdAt)}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setShowPasswordForm(true);
                        }}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {user.role !== 'ADMIN' && (
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
