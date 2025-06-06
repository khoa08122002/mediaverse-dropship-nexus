import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  FileText, 
  Download,
  Clock,
  CheckCircle,
  XCircle,
  MessageCircle,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import { recruitmentService, Application, ApplicationStatus } from '@/services/recruitmentService';
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const ApplicantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('pending');
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await recruitmentService.getApplication(Number(id));
      setApplication(data);
      setNewStatus(data.status);
    } catch (error: any) {
      console.error('Error fetching application:', error);
      setError(error.response?.data?.message || 'Không thể tải thông tin ứng viên');
      toast.error('Không thể tải thông tin ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!application) return;

    try {
      setLoading(true);
      const updatedApplication = await recruitmentService.updateApplicationStatus(
        application.id,
        newStatus
      );
      setApplication(updatedApplication);
      toast.success('Cập nhật trạng thái thành công');
      setShowStatusDialog(false);
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Không thể cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!application || !message.trim()) return;

    try {
      setLoading(true);
      // Implement send message functionality
      toast.success('Đã gửi tin nhắn thành công');
      setShowMessageDialog(false);
      setMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error('Không thể gửi tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCV = async () => {
    if (!application?.cvFile) return;

    try {
      setLoading(true);
      const blob = await recruitmentService.downloadCV(application.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV_${application.fullName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      console.error('Error downloading CV:', error);
      toast.error('Không thể tải CV');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.pending: return 'bg-yellow-100 text-yellow-800';
      case ApplicationStatus.reviewed: return 'bg-blue-100 text-blue-800';
      case ApplicationStatus.interviewed: return 'bg-purple-100 text-purple-800';
      case ApplicationStatus.accepted: return 'bg-green-100 text-green-800';
      case ApplicationStatus.rejected: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.pending: return 'Chờ xử lý';
      case ApplicationStatus.reviewed: return 'Đang xem xét';
      case ApplicationStatus.interviewed: return 'Đã phỏng vấn';
      case ApplicationStatus.accepted: return 'Đã chấp nhận';
      case ApplicationStatus.rejected: return 'Từ chối';
      default: return status;
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl mb-4">
          {error || 'Không tìm thấy thông tin ứng viên'}
        </div>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Hồ sơ ứng viên</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Thông tin cơ bản */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {application.fullName}
                </h2>
                <div className="flex flex-wrap gap-4 text-gray-600">
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {application.email}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {application.phone}
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(application.status)}`}>
                {getStatusText(application.status)}
              </span>
            </div>

            {application.job && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Vị trí ứng tuyển
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <Briefcase className="w-4 h-4 mr-2 mt-1 text-gray-500" />
                    <div>
                      <div className="font-medium">{application.job.title}</div>
                      <div className="text-sm text-gray-600">{application.job.department}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{application.job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                    <span>Ngày ứng tuyển: {formatDate(application.createdAt)}</span>
                  </div>
                </div>
              </div>
            )}

            {application.coverLetter && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Thư xin việc
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                  {application.coverLetter}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Thao tác
            </h3>
            <div className="space-y-3">
              <Button
                className="w-full justify-start"
                onClick={() => setShowStatusDialog(true)}
              >
                <Clock className="w-4 h-4 mr-2" />
                Cập nhật trạng thái
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setShowMessageDialog(true)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Gửi tin nhắn
              </Button>
              {application.cvFile && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleDownloadCV}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải CV
                </Button>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Lịch sử
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">
                    Ứng tuyển
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(application.createdAt)}
                  </div>
                </div>
              </div>
              {/* Add more timeline items here */}
            </div>
          </div>
        </div>
      </div>

      {/* Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái ứng viên</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label>Ứng viên</Label>
                <p className="text-sm font-medium">{application.fullName}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Trạng thái mới</Label>
                <Select
                  value={newStatus}
                  onValueChange={(value: ApplicationStatus) => setNewStatus(value)}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="reviewed">Đang xem xét</SelectItem>
                    <SelectItem value="interviewed">Đã phỏng vấn</SelectItem>
                    <SelectItem value="accepted">Đã nhận</SelectItem>
                    <SelectItem value="rejected">Từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={loading}
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gửi tin nhắn cho ứng viên</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label>Gửi đến</Label>
                <p className="text-sm font-medium">{application.fullName}</p>
                <p className="text-sm text-gray-500">{application.email}</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Nội dung</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập nội dung tin nhắn..."
                  rows={6}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowMessageDialog(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleSendMessage}
              disabled={loading || !message.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicantProfile;
