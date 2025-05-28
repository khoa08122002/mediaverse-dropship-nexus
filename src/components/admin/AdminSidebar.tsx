import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Users, 
  LogOut,
  Settings
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'blogs', label: 'Quản lý Blog', icon: FileText },
    { id: 'jobs', label: 'Quản lý Tuyển dụng', icon: Briefcase },
    { id: 'contacts', label: 'Tin nhắn Liên hệ', icon: MessageSquare },
    { id: 'users', label: 'Quản lý User', icon: Users },
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-screen sticky top-20">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        
        <div className="mt-8 pt-8 border-t">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default AdminSidebar;