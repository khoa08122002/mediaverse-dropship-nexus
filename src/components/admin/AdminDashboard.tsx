import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  TrendingUp,
  Eye,
  Calendar,
  Activity
} from 'lucide-react';

interface AdminDashboardProps {
  onTabChange: (tab: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onTabChange }) => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Tổng số Blog', value: '24', icon: FileText, color: 'blue' },
    { label: 'Tin tuyển dụng', value: '8', icon: Briefcase, color: 'green' },
    { label: 'Tin nhắn mới', value: '12', icon: MessageSquare, color: 'yellow' },
    { label: 'Lượt xem tháng', value: '1,234', icon: Eye, color: 'purple' },
  ];

  const recentActivities = [
    { action: 'Blog mới được đăng', time: '2 giờ trước', type: 'blog' },
    { action: 'Tin tuyển dụng Frontend Developer', time: '4 giờ trước', type: 'job' },
    { action: 'Tin nhắn liên hệ mới', time: '6 giờ trước', type: 'contact' },
    { action: 'Blog được cập nhật', time: '1 ngày trước', type: 'blog' },
  ];

  const getStatColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-500';
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'purple': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-5 h-5" />
          <span>{new Date().toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${getStatColor(stat.color)}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Hoạt động gần đây</h2>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{activity.action}</p>
                  <p className="text-gray-600 text-sm">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onTabChange('blogs')}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-blue-600 font-medium">Tạo Blog mới</span>
            </button>
            <button 
              onClick={() => onTabChange('jobs')}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-green-300 rounded-lg hover:bg-green-50 transition-colors">
              <Briefcase className="w-5 h-5 text-green-600" />
              <span className="text-green-600 font-medium">Đăng tuyển dụng</span>
            </button>
            <button 
              onClick={() => onTabChange('users')}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-purple-300 rounded-lg hover:bg-purple-50 transition-colors">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="text-purple-600 font-medium">Quản lý User</span>
            </button>
            <button 
              onClick={() => onTabChange('contacts')}
              className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-yellow-300 rounded-lg hover:bg-yellow-50 transition-colors">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-600 font-medium">Xem báo cáo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
