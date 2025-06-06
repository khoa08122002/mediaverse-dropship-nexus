import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  TrendingUp,
  UserCircle,
  Calendar,
  Activity
} from 'lucide-react';
import { blogService } from '@/services/blogService';
import { recruitmentService } from '@/services/recruitmentService';
import { contactService } from '@/services/contactService';

interface AdminDashboardProps {
  onTabChange: (tab: string) => void;
}

interface DashboardStats {
  totalBlogs: number;
  totalJobs: number;
  newMessages: number;
  totalApplications: number;
}

interface Activity {
  action: string;
  time: string;
  type: 'blog' | 'job' | 'contact' | 'application';
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onTabChange }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    totalJobs: 0,
    newMessages: 0,
    totalApplications: 0
  });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [blogs, recruitmentStats, contacts] = await Promise.all([
        blogService.getAllBlogs(),
        recruitmentService.getStats(),
        contactService.getAllContacts()
      ]);

      // Update stats
      setStats({
        totalBlogs: blogs.length,
        totalJobs: recruitmentStats.activeJobs || 0,
        newMessages: contacts.filter(c => c.status === 'NEW').length,
        totalApplications: recruitmentStats.totalApplications || 0
      });

      // Get recent activities
      const activities: Activity[] = [];

      // Add recent blogs
      blogs.slice(0, 2).forEach(blog => {
        activities.push({
          action: `Blog "${blog.title}" được ${blog.status === 'published' ? 'xuất bản' : 'tạo mới'}`,
          time: formatTime(new Date(blog.createdAt)),
          type: 'blog'
        });
      });

      // Add recent applications if any
      if (recruitmentStats.recentApplications) {
        recruitmentStats.recentApplications.forEach((app: any) => {
          activities.push({
            action: `Ứng viên mới cho vị trí ${app.job?.title || 'Không xác định'}`,
            time: formatTime(new Date(app.createdAt)),
            type: 'application'
          });
        });
      }

      // Add recent contacts
      contacts
        .filter(contact => contact.status === 'NEW')
        .slice(0, 2)
        .forEach(contact => {
          activities.push({
            action: `Tin nhắn mới từ ${contact.name}`,
            time: formatTime(new Date(contact.createdAt)),
            type: 'contact'
          });
        });

      // Sort by time and take latest 5
      activities.sort((a, b) => 
        new Date(b.time).getTime() - new Date(a.time).getTime()
      );
      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} ngày trước`;
    if (hours > 0) return `${hours} giờ trước`;
    if (minutes > 0) return `${minutes} phút trước`;
    return 'Vừa xong';
  };

  const dashboardStats = [
    { label: 'Tổng số Blog', value: stats.totalBlogs, icon: FileText, color: 'blue' },
    { label: 'Tin tuyển dụng', value: stats.totalJobs, icon: Briefcase, color: 'green' },
    { label: 'Tin nhắn mới', value: stats.newMessages, icon: MessageSquare, color: 'yellow' },
    { label: 'Tổng ứng viên', value: stats.totalApplications, icon: UserCircle, color: 'purple' },
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
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800">
                    {loading ? (
                      <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </p>
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
            {loading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="animate-pulse flex space-x-4 p-3">
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-blue-50">
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{activity.action}</p>
                    <p className="text-gray-600 text-sm">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Chưa có hoạt động nào</p>
            )}
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
