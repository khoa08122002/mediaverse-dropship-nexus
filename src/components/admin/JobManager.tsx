import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash, Eye, Search, MapPin, Clock, User, Mail, Phone, FileText, Download, ExternalLink, Users } from 'lucide-react';
import { toast } from 'sonner';
import { recruitmentService } from '@/services/recruitmentService';
import type { Job, Application } from '@prisma/client';
import { JobType, JobStatus } from '@prisma/client';
import { CreateJobDto, JobTypeLowercase, JobStatusLowercase } from '@/backend/modules/recruitment/dto/job.dto';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';

interface Applicant {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  cvFileName?: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'accepted';
}

interface JobFormData {
  title: string;
  department: string;
  description: string;
  requirements: string;
  location: string;
  type: JobTypeLowercase;
  benefits: string;
  salary: string;
  status: JobStatusLowercase;
}

const JobManager = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showApplicants, setShowApplicants] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [jobApplicants, setJobApplicants] = useState<Application[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicationStats, setApplicationStats] = useState<{ job: Job; applicationsCount: number }[]>([]);

  const [newJob, setNewJob] = useState<JobFormData>({
    title: '',
    department: '',
    description: '',
    requirements: '',
    location: '',
    type: 'fulltime',
    benefits: '',
    salary: '',
    status: 'active'
  });

  const jobTypes = [
    { value: 'fulltime' as JobTypeLowercase, label: 'Toàn thời gian' },
    { value: 'parttime' as JobTypeLowercase, label: 'Bán thời gian' },
    { value: 'contract' as JobTypeLowercase, label: 'Hợp đồng' },
    { value: 'internship' as JobTypeLowercase, label: 'Thực tập' }
  ];

  const jobStatuses = [
    { value: 'active' as JobStatusLowercase, label: 'Đang tuyển' },
    { value: 'closed' as JobStatusLowercase, label: 'Đã đóng' },
    { value: 'draft' as JobStatusLowercase, label: 'Bản nháp' }
  ];

  // Sample applicants data
  const [applicants] = useState<Record<number, Applicant[]>>({
    1: [
      {
        id: 1,
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0123456789',
        coverLetter: 'Tôi rất quan tâm đến vị trí Frontend Developer này và có 3 năm kinh nghiệm làm việc với React...',
        cvFileName: 'NguyenVanA_CV.pdf',
        appliedDate: '2024-01-16',
        status: 'pending'
      },
      {
        id: 2,
        fullName: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0987654321',
        coverLetter: 'Với kinh nghiệm 2 năm trong phát triển web và đam mê công nghệ...',
        cvFileName: 'TranThiB_CV.pdf',
        appliedDate: '2024-01-17',
        status: 'reviewed'
      }
    ],
    2: [
      {
        id: 3,
        fullName: 'Lê Văn C',
        email: 'levanc@email.com',
        phone: '0369852147',
        coverLetter: 'Tôi có kinh nghiệm trong lĩnh vực marketing digital và mong muốn được góp phần...',
        appliedDate: '2024-01-18',
        status: 'interviewed'
      }
    ]
  });

  useEffect(() => {
    fetchJobs();
    fetchApplicationStats();
  }, []);

  const fetchApplicationStats = async () => {
    try {
      const stats = await recruitmentService.getApplicationsByJob();
      setApplicationStats(stats);
    } catch (error) {
      console.error('Error fetching application stats:', error);
      toast.error('Không thể tải thống kê ứng viên');
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recruitmentService.getAllJobs();
      setJobs(data);
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      setError(error.response?.data?.message || 'Không thể tải danh sách việc làm');
      toast.error('Không thể tải danh sách việc làm');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!newJob.title.trim()) {
        toast.error('Vui lòng nhập tiêu đề công việc');
        return;
      }
      if (!newJob.department.trim()) {
        toast.error('Vui lòng nhập phòng ban');
        return;
      }
      if (!newJob.description.trim()) {
        toast.error('Vui lòng nhập mô tả công việc');
        return;
      }
      if (!newJob.requirements.trim()) {
        toast.error('Vui lòng nhập yêu cầu công việc');
        return;
      }
      if (!newJob.location.trim()) {
        toast.error('Vui lòng nhập địa điểm làm việc');
        return;
      }
      if (!newJob.salary.trim()) {
        toast.error('Vui lòng nhập mức lương');
        return;
      }
      if (!newJob.type) {
        toast.error('Vui lòng chọn loại công việc');
        return;
      }
      if (!newJob.status) {
        toast.error('Vui lòng chọn trạng thái');
        return;
      }

      if (editingJob) {
        const updatedJob = await recruitmentService.updateJob(editingJob.id, newJob);
        setJobs(jobs.map(job => job.id === editingJob.id ? updatedJob : job));
        toast.success('Cập nhật công việc thành công');
      } else {
        const createdJob = await recruitmentService.createJob(newJob);
        setJobs([...jobs, createdJob]);
        toast.success('Tạo công việc mới thành công');
      }

      setShowJobForm(false);
      setEditingJob(null);
      setNewJob({
        title: '',
        department: '',
        description: '',
        requirements: '',
        location: '',
        type: 'fulltime',
        benefits: '',
        salary: '',
        status: 'active'
      });
    } catch (error: any) {
      console.error('Error saving job:', error);
      const errorMessage = error.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach(msg => toast.error(msg));
      } else {
        toast.error(errorMessage || 'Có lỗi xảy ra khi lưu thông tin');
      }
      setError(errorMessage || 'Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setNewJob({
      title: job.title,
      department: job.department,
      description: job.description,
      requirements: job.requirements,
      location: job.location,
      type: job.type.toLowerCase() as JobTypeLowercase,
      benefits: job.benefits || '',
      salary: job.salary || '',
      status: job.status.toLowerCase() as JobStatusLowercase
    });
    setShowJobForm(true);
  };

  const handleDeleteJob = async () => {
    if (!jobToDelete) return;

    try {
      setLoading(true);
      setError(null);
      await recruitmentService.deleteJob(jobToDelete.id);
      setJobs(jobs.filter(job => job.id !== jobToDelete.id));
      toast.success('Xóa công việc thành công');
    } catch (error: any) {
      console.error('Error deleting job:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi xóa công việc');
      toast.error('Có lỗi xảy ra khi xóa công việc');
    } finally {
      setLoading(false);
      setJobToDelete(null);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  const handleViewApplicants = async (jobId: number) => {
    try {
      setLoadingApplicants(true);
    setSelectedJobId(jobId);
      const applications = await recruitmentService.getJobApplications(jobId);
      setJobApplicants(applications);
    setShowApplicants(true);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Không thể tải danh sách ứng viên');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toUpperCase()) {
      case 'pending': return 'Chờ xử lý';
      case 'reviewed': return 'Đã xem';
      case 'interviewed': return 'Đã phỏng vấn';
      case 'accepted': return 'Đã chấp nhận';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedJob = jobs.find(job => job.id === selectedJobId);

  const handleViewApplicantProfile = (applicantId: number) => {
    navigate(`/admin/applicants/${applicantId}`);
  };

  const handleDownloadCV = async (applicationId: number, fullName: string) => {
    try {
      await recruitmentService.downloadCV(applicationId);
      toast.success('Đang tải CV');
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast.error('Không thể tải CV');
  }
  };

  const getJobTypeLabel = (type: string) => {
    const jobType = jobTypes.find(t => t.value === type.toLowerCase());
    return jobType ? jobType.label : type;
  };

  const getJobStatusLabel = (status: string) => {
    const jobStatus = jobStatuses.find(s => s.value === status.toLowerCase());
    return jobStatus ? jobStatus.label : status;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Briefcase className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Tuyển dụng</h1>
        </div>
        <Button 
          onClick={() => setShowJobForm(true)} 
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm công việc
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiêu đề
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng ban
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Địa điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mức lương
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số ứng viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    Không có công việc nào
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{job.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{job.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {getJobTypeLabel(job.type)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{job.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{job.salary}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {getJobStatusLabel(job.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {applicationStats.find(stat => stat.job.id === job.id)?.applicationsCount || 0} ứng viên
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(job.createdAt)}
                  </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                        onClick={() => handleEditJob(job)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-700 border-blue-600 hover:border-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setJobToDelete(job)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-700 border-red-600 hover:border-red-700"
                      >
                        <Trash className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewApplicants(job.id)}
                          disabled={loading}
                          className="text-purple-600 hover:text-purple-700 border-purple-600 hover:border-purple-700"
                        >
                          <Users className="w-4 h-4" />
                          <span className="ml-1">Ứng viên</span>
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

      <Dialog open={showJobForm} onOpenChange={setShowJobForm}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center space-x-2">
                {editingJob ? (
                  <>
                    <Edit className="w-5 h-5 text-blue-600" />
                    <span>Sửa công việc</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-green-600" />
                    <span>Thêm công việc mới</span>
                  </>
                )}
              </div>
            </DialogTitle>
            <DialogDescription>
              {editingJob ? 'Cập nhật thông tin công việc' : 'Điền thông tin để tạo công việc mới'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6">
            {/* Cột trái - Thông tin cơ bản */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  disabled={loading}
                  placeholder="Nhập tiêu đề công việc"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="department">Phòng ban <span className="text-red-500">*</span></Label>
                <Input
                  id="department"
                  value={newJob.department}
                  onChange={(e) => setNewJob({ ...newJob, department: e.target.value })}
                  disabled={loading}
                  placeholder="Nhập tên phòng ban"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Loại công việc <span className="text-red-500">*</span></Label>
                <select
                  id="type"
                  value={newJob.type}
                  onChange={(e) => setNewJob({ ...newJob, type: e.target.value as JobTypeLowercase })}
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Chọn loại công việc</option>
                  {jobTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Địa điểm <span className="text-red-500">*</span></Label>
                <Input
                  id="location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  disabled={loading}
                  placeholder="Nhập địa điểm làm việc"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="salary">Mức lương <span className="text-red-500">*</span></Label>
                <Input
                  id="salary"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                  disabled={loading}
                  placeholder="Ví dụ: 15-25 triệu"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Trạng thái <span className="text-red-500">*</span></Label>
                <select
                  id="status"
                  value={newJob.status}
                  onChange={(e) => setNewJob({ ...newJob, status: e.target.value as JobStatusLowercase })}
                  disabled={loading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Chọn trạng thái</option>
                  {jobStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cột phải - Mô tả chi tiết */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả công việc <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  disabled={loading}
                  rows={6}
                  placeholder="Mô tả chi tiết về công việc, trách nhiệm..."
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="requirements">Yêu cầu ứng viên <span className="text-red-500">*</span></Label>
                <Textarea
                  id="requirements"
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  disabled={loading}
                  rows={6}
                  placeholder="Kinh nghiệm, kỹ năng yêu cầu..."
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="benefits">Phúc lợi</Label>
                <Textarea
                  id="benefits"
                  value={newJob.benefits}
                  onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                  disabled={loading}
                  rows={6}
                  placeholder="Chế độ đãi ngộ, bảo hiểm, thưởng..."
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowJobForm(false);
                setEditingJob(null);
                setNewJob({
                  title: '',
                  department: '',
                  description: '',
                  requirements: '',
                  location: '',
                  type: 'fulltime',
                  benefits: '',
                  salary: '',
                  status: 'active'
                });
              }}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSaveJob}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  <span>Đang lưu...</span>
                </div>
              ) : (
                'Lưu'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!jobToDelete} onOpenChange={() => setJobToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <div className="flex items-center space-x-2 text-red-600">
                <Trash className="w-5 h-5" />
                <span>Xác nhận xóa công việc</span>
              </div>
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa công việc này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteJob}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  <span>Đang xóa...</span>
                </div>
              ) : (
                'Xóa'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Applicants Modal */}
      <Dialog open={showApplicants} onOpenChange={setShowApplicants}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Danh sách ứng viên - {selectedJob?.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {loadingApplicants ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : jobApplicants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-4" />
                <p>Chưa có ứng viên nào ứng tuyển cho vị trí này</p>
              </div>
            ) : (
              jobApplicants.map((applicant) => (
                <div key={applicant.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">
                        {applicant.fullName}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>{applicant.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{applicant.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>Ứng tuyển: {formatDate(applicant.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(applicant.status)}`}>
                      {getStatusText(applicant.status)}
                    </span>
                  </div>
                  
                  {applicant.coverLetter && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Thư xin việc:</h4>
                      <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded line-clamp-3">
                        {applicant.coverLetter}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    {applicant.cvFile && (
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">{applicant.cvFile}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownloadCV(applicant.id, applicant.fullName)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Tải CV
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewApplicantProfile(applicant.id)}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Xem hồ sơ
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobManager;
