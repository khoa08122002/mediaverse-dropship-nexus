import React, { useState, useEffect } from 'react';
import { Users, Search, Eye, CheckCircle, Clock, Download, Trash2, BriefcaseIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { recruitmentService } from '@/services/recruitmentService';
import type { Application, ApplicationStatusType, Job } from '@/lib/prisma-types';
import { ApplicationStatus } from '@/lib/prisma-types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import ApplicantProfile from './ApplicantProfile';

const ApplicantManager = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [applicationsByJob, setApplicationsByJob] = useState<{ job: Job; applicationsCount: number }[]>([]);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  useEffect(() => {
    fetchApplications();
    fetchStats();
    fetchApplicationsByJob();
  }, []);

  const fetchStats = async () => {
    try {
      const statsData = await recruitmentService.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Không thể tải thống kê');
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await recruitmentService.getAllApplications();
      console.log('Fetched applications:', data);
      setApplications(data);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast.error('Không thể tải danh sách ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplicationsByJob = async () => {
    try {
      const data = await recruitmentService.getApplicationsByJob();
      setApplicationsByJob(data);
    } catch (error) {
      console.error('Error fetching applications by job:', error);
      toast.error('Không thể tải thống kê theo vị trí');
    }
  };

  const handleSearch = () => {
    // Implement search functionality
    const filteredApplications = applications.filter(app =>
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.phone.includes(searchQuery)
    );
    setApplications(filteredApplications);
    if (searchQuery === '') {
      fetchApplications();
    }
  };

  const getStatusLabel = (status: ApplicationStatusType) => {
    switch (status) {
      case ApplicationStatus.ACCEPTED:
        return 'Đã tuyển';
      case ApplicationStatus.REJECTED:
        return 'Từ chối';
      case ApplicationStatus.INTERVIEWING:
        return 'Đang phỏng vấn';
      case ApplicationStatus.REVIEWING:
        return 'Đang xem xét';
      case ApplicationStatus.PENDING:
        return 'Chờ xử lý';
      default:
        return status;
    }
  };

  const handleStatusChange = async (applicationId: number, newStatus: ApplicationStatusType) => {
    try {
      setLoading(true);
      await recruitmentService.updateApplicationStatus(applicationId, newStatus);
      toast.success('Cập nhật trạng thái thành công');
      await fetchApplications();
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCV = async (applicationId: number, fullName: string) => {
    try {
      const blob = await recruitmentService.downloadCV(applicationId);
      // Kiểm tra xem blob có phải là PDF không
      if (blob.type !== 'application/pdf') {
        throw new Error('File không đúng định dạng PDF');
      }
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${fullName.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Error downloading CV:', error);
      toast.error(error.message || 'Không thể tải CV');
    }
  };

  const getStatusColor = (status: ApplicationStatusType) => {
    switch (status) {
      case ApplicationStatus.PENDING:
        return 'bg-yellow-100 text-yellow-800';
      case ApplicationStatus.REVIEWING:
        return 'bg-blue-100 text-blue-800';
      case ApplicationStatus.INTERVIEWING:
        return 'bg-purple-100 text-purple-800';
      case ApplicationStatus.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  const handleDelete = async (application: Application) => {
    setSelectedApplication(application);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedApplication) return;
    try {
      setLoading(true);
      await recruitmentService.deleteApplication(selectedApplication.id);
      toast.success('Đã xóa ứng viên thành công');
      await fetchApplications();
    } catch (error: any) {
      console.error('Error deleting application:', error);
      toast.error(error.message || 'Không thể xóa ứng viên');
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setSelectedApplication(null);
    }
  };

  const handleViewApplication = (application: Application) => {
    if (!application || !application.id) {
      toast.error('Thông tin ứng viên không hợp lệ');
      return;
    }
    
    // Add detailed logging
    console.log('Viewing application details:', {
      id: application.id,
      fullName: application.fullName,
      email: application.email,
      status: application.status
    });
    
    navigate(`/admin/applicants/${application.id}`);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedApplication(null);
  };

  if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'HR')) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <Users className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Không có quyền truy cập</h2>
        <p className="text-gray-500">Bạn không có quyền xem trang này.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Quản lý ứng viên</h1>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tổng số ứng viên</p>
                  <h3 className="text-2xl font-bold text-gray-900">{stats.totalApplications}</h3>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Đang chờ xem xét</p>
                  <h3 className="text-2xl font-bold text-yellow-600">{stats.statusCounts?.pending || 0}</h3>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Đã chấp nhận</p>
                  <h3 className="text-2xl font-bold text-green-600">{stats.statusCounts?.accepted || 0}</h3>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Vị trí đang tuyển</p>
                  <h3 className="text-2xl font-bold text-purple-600">{stats.activeJobs || 0}</h3>
                </div>
                <BriefcaseIcon className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <BriefcaseIcon className="w-5 h-5 mr-2 text-blue-600" />
          Thống kê theo vị trí
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {applicationsByJob.map(({ job, applicationsCount }) => (
            <Card key={job.id}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {applicationsCount} ứng viên
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {job.department} • {job.location}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      job.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                    }`}></span>
                    {job.status === 'active' ? 'Đang tuyển' : 'Đã đóng'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex gap-2">
            <Input
              placeholder="Tìm kiếm ứng viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Tìm kiếm
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ và tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí ứng tuyển
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày ứng tuyển
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    Không có ứng viên nào
                  </td>
                </tr>
              ) : (
                applications.map((application) => (
                  <tr 
                    key={application.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewApplication(application)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {application.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {application.fullName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{application.job?.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Select
                        defaultValue={application.status}
                        onValueChange={(value) => handleStatusChange(application.id, value as ApplicationStatusType)}
                      >
                        <SelectTrigger className={`w-[140px] ${getStatusColor(application.status)}`}>
                          <SelectValue>{getStatusLabel(application.status)}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ApplicationStatus.PENDING}>Chờ xử lý</SelectItem>
                          <SelectItem value={ApplicationStatus.REVIEWING}>Đang xem xét</SelectItem>
                          <SelectItem value={ApplicationStatus.INTERVIEWING}>Đang phỏng vấn</SelectItem>
                          <SelectItem value={ApplicationStatus.ACCEPTED}>Đã tuyển</SelectItem>
                          <SelectItem value={ApplicationStatus.REJECTED}>Từ chối</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(application.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleViewApplication(application);
                          }}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {application.cvFile && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              handleDownloadCV(application.id, application.fullName);
                            }}
                            className="text-purple-600 hover:text-purple-700"
                          >
                            Tải CV
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(application);
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa ứng viên {selectedApplication?.fullName}?
              {selectedApplication?.cvFile && ' CV của ứng viên cũng sẽ bị xóa.'}
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApplicantManager; 