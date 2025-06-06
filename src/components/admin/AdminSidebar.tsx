import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Users,
  LogOut,
  Settings,
  UserCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar = ({ activeTab, onTabChange }: AdminSidebarProps) => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
      roles: ['ADMIN', 'HR', 'USER']
    },
    {
      id: 'blogs',
      label: 'Bài viết',
      icon: <FileText className="w-5 h-5" />,
      roles: ['ADMIN', 'USER']
    },
    {
      id: 'jobs',
      label: 'Tuyển dụng',
      icon: <Briefcase className="w-5 h-5" />,
      roles: ['ADMIN', 'HR']
    },
    {
      id: 'applicants',
      label: 'Ứng viên',
      icon: <UserCircle className="w-5 h-5" />,
      roles: ['ADMIN', 'HR']
    },
    {
      id: 'contacts',
      label: 'Liên hệ',
      icon: <MessageSquare className="w-5 h-5" />,
      roles: ['ADMIN', 'HR']
    },
    {
      id: 'users',
      label: 'Người dùng',
      icon: <Users className="w-5 h-5" />,
      roles: ['ADMIN']
    }
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
  };

  const hasAccess = (roles: string[]) => {
    return user && roles.includes(user.role);
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800">Admin</h2>
          <p className="text-sm text-gray-600 mt-1">{user?.fullName}</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              hasAccess(item.roles) && (
                <li key={item.id}>
                  <button
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              )
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
