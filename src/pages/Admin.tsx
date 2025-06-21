import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import BlogManager from '@/components/admin/BlogManager';
import JobManager from '@/components/admin/JobManager';
import ApplicantManager from '@/components/admin/ApplicantManager';
import ContactManager from '@/components/admin/ContactManager';
import UserManager from '@/components/admin/UserManager';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Header from '@/components/Header';
import ErrorBoundary from '@/components/ErrorBoundary';

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Extract tab from URL or use default
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update URL without reloading
    const newUrl = `${window.location.pathname}?tab=${tab}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
  };

  // Show loading while auth is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Additional check for user data
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <AdminDashboard onTabChange={handleTabChange} />;
      case 'blogs':
        return <BlogManager />;
      case 'jobs':
        return <JobManager />;
      case 'applicants':
        return <ApplicantManager />;
      case 'contacts':
        return (
          <ErrorBoundary>
            <ContactManager />
          </ErrorBoundary>
        );
      case 'users':
        return <UserManager />;
      default:
        return <AdminDashboard onTabChange={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex pt-20">
        <AdminSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
