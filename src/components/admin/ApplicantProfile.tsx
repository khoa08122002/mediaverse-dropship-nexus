import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Clock, 
  FileText, 
  Download, 
  User, 
  MapPin, 
  Briefcase,
  CheckCircle,
  XCircle,
  MessageCircle,
  Send,
  Eye,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { recruitmentService, Application } from '@/services/recruitmentService';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ApplicationStatus } from '@/lib/prisma-types';
import { useAuth } from '@/contexts/AuthContext';

const ApplicantProfile = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);
  const { user: currentUser } = useAuth();

  // DEBUG: Log để check URL params
  console.log('🔍 DEBUG ApplicantProfile:');
  console.log('- URL params:', params);
  console.log('- window.location.pathname:', window.location.pathname);

  // Extract applicantId from wildcard parameter or direct id parameter
  const getApplicantId = () => {
    // If we have direct id parameter (from nested routing)
    if (params.id) {
      return params.id;
    }
    
    // If we have wildcard parameter (from /admin/* route)
    if (params['*']) {
      const wildcardPath = params['*'];
      console.log('- wildcard path:', wildcardPath);
      
      // Extract ID from path like "applicants/6"
      const match = wildcardPath.match(/^applicants\/(\d+)$/);
      if (match) {
        const extractedId = match[1];
        console.log('- extracted ID:', extractedId);
        return extractedId;
      }
    }
    
    return null;
  };

  const applicantId = getApplicantId();
  console.log('- final applicantId:', applicantId);

  useEffect(() => {
    console.log('🔍 DEBUG useEffect triggered with applicantId:', applicantId);
    
    if (!applicantId) {
      console.log('❌ DEBUG: applicantId is falsy:', applicantId);
      toast.error('ID ứng viên không hợp lệ');
      navigate('/admin?tab=applicants');
      return;
    }
    
    console.log('✅ DEBUG: applicantId is valid, calling fetchApplication');
    fetchApplication();
  }, [applicantId]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const currentApplicantId = getApplicantId();
      if (!currentApplicantId) return;
      
      // Log for debugging
      console.log('Fetching application with ID:', currentApplicantId);
      
      const data = await recruitmentService.getApplication(parseInt(currentApplicantId));
      
      // Log the response
      console.log('Application data received:', data);
      
      if (!data) {
        throw new Error('Không tìm thấy thông tin ứng viên');
      }
      
      setApplication(data);
    } catch (error: any) {
      console.error('Error fetching application:', error);
      toast.error(error.message || 'Không thể tải thông tin ứng viên');
      navigate('/admin?tab=applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: typeof ApplicationStatus[keyof typeof ApplicationStatus]) => {
    if (!application) return;
    try {
      setLoading(true);
      await recruitmentService.updateApplicationStatus(application.id, newStatus);
      toast.success('Cập nhật trạng thái thành công');
      await fetchApplication();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCV = async () => {
    if (!application) return;
    try {
      const blob = await recruitmentService.downloadCV(application.id);
      if (blob.type !== 'application/pdf') {
        throw new Error('File không đúng định dạng PDF');
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${application.fullName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Error downloading CV:', error);
      toast.error(error.message || 'Không thể tải CV');
    }
  };

  const getStatusColor = (status: typeof ApplicationStatus[keyof typeof ApplicationStatus]) => {
    switch (status) {
      case ApplicationStatus.PENDING: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ApplicationStatus.REVIEWING: return 'bg-blue-100 text-blue-800 border-blue-200';
      case ApplicationStatus.INTERVIEWING: return 'bg-purple-100 text-purple-800 border-purple-200';
      case ApplicationStatus.ACCEPTED: return 'bg-green-100 text-green-800 border-green-200';
      case ApplicationStatus.REJECTED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: typeof ApplicationStatus[keyof typeof ApplicationStatus]) => {
    switch (status) {
      case ApplicationStatus.PENDING: return 'Chờ xử lý';
      case ApplicationStatus.REVIEWING: return 'Đang xem xét';
      case ApplicationStatus.INTERVIEWING: return 'Đang phỏng vấn';
      case ApplicationStatus.ACCEPTED: return 'Đã tuyển';
      case ApplicationStatus.REJECTED: return 'Từ chối';
      default: return status;
    }
  };

  // Check for authentication
  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR')) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <User className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Không có quyền truy cập</h2>
        <p className="text-gray-500">Bạn không có quyền xem trang này.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/applicants')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
        </div>
        <div className="text-center py-12">
          <User className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            Không tìm thấy ứng viên
          </h2>
          <p className="text-gray-500">
            Ứng viên không tồn tại hoặc đã bị xóa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/applicants')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Hồ sơ ứng viên
            </h1>
            <p className="text-gray-600">
              Ứng tuyển vị trí: {application.job?.title}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(application.status)}`}>
            {getStatusText(application.status)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Họ và tên</label>
                  <p className="text-lg font-semibold text-gray-900">{application.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày ứng tuyển</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{new Date(application.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${application.email}`} className="text-blue-600 hover:underline">
                      {application.email}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${application.phone}`} className="text-blue-600 hover:underline">
                      {application.phone}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Letter */}
          {application.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Thư xin việc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {application.coverLetter}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* CV Section */}
          {application.cvFile && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  CV đính kèm
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">CV_{application.fullName.replace(/\s+/g, '_')}.pdf</p>
                      <p className="text-sm text-gray-500">Tài liệu PDF</p>
                    </div>
                  </div>
                  <Button size="sm" className="flex items-center gap-2" onClick={handleDownloadCV}>
                    <Download className="w-4 h-4" />
                    Tải xuống
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" size="lg" onClick={() => window.location.href = `mailto:${application.email}`}>
                <Mail className="w-4 h-4 mr-2" />
                Gửi email
              </Button>
              <Button variant="outline" className="w-full" size="lg" onClick={() => window.location.href = `tel:${application.phone}`}>
                <Phone className="w-4 h-4 mr-2" />
                Gọi điện
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Briefcase className="w-4 h-4 mr-2" />
                Lên lịch phỏng vấn
              </Button>
            </CardContent>
          </Card>

          {/* Job Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Thông tin vị trí
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-500">Vị trí ứng tuyển</label>
                <p className="font-semibold text-gray-900">{application.job?.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Trạng thái ứng tuyển</label>
                <span className={`inline-block px-2 py-1 rounded-full text-sm border mt-1 ${getStatusColor(application.status)}`}>
                  {getStatusText(application.status)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle>Cập nhật trạng thái</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {application.status !== ApplicationStatus.REVIEWING && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleStatusChange(ApplicationStatus.REVIEWING)}
                >
                  Chuyển sang "Đang xem xét"
                </Button>
              )}
              {application.status !== ApplicationStatus.INTERVIEWING && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleStatusChange(ApplicationStatus.INTERVIEWING)}
                >
                  Chuyển sang "Đang phỏng vấn"
                </Button>
              )}
              {application.status !== ApplicationStatus.ACCEPTED && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-green-600 hover:text-green-700"
                  onClick={() => handleStatusChange(ApplicationStatus.ACCEPTED)}
                >
                  Chấp nhận ứng viên
                </Button>
              )}
              {application.status !== ApplicationStatus.REJECTED && (
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={() => handleStatusChange(ApplicationStatus.REJECTED)}
                >
                  Từ chối ứng viên
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;
