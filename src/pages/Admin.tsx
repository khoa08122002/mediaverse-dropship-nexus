import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminDashboard from '../components/admin/AdminDashboard';
import BlogManager from '../components/admin/BlogManager';
import JobManager from '../components/admin/JobManager';
import ContactManager from '../components/admin/ContactManager';
import UserManager from '../components/admin/UserManager';
import ApplicantProfile from '../components/admin/ApplicantProfile';
import { useAuth } from '@/contexts/AuthContext';

const Admin = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get('tab');
    const [activeTab, setActiveTab] = useState(tab || 'dashboard');
    const isApplicantProfileRoute = window.location.pathname === '/admin/applicant';
    const { logout } = useAuth();

    const handleTabChange = (newTab: string) => {
      setActiveTab(newTab);
      setSearchParams({ tab: newTab });
    };

    const renderContent = () => {
      if (isApplicantProfileRoute) {
        return <ApplicantProfile />;
      }
      
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard onTabChange={handleTabChange} />;
        case 'blogs':
          return <BlogManager />;
        case 'jobs':
          return <JobManager />;
        case 'contacts':
          return <ContactManager />;
        case 'users':
          return <UserManager />;
        default:
          return <AdminDashboard onTabChange={handleTabChange} />;
      }
    };

    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        
        <div className="flex pt-20">
        {!isApplicantProfileRoute && (
            <AdminSidebar 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
              onLogout={logout}
            />
          )}
          
          <main className={`flex-1 p-6 ${isApplicantProfileRoute ? 'ml-0' : ''}`}>
            <div className="max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
        
        <Footer />
      </div>
    );
};

export default Admin;
