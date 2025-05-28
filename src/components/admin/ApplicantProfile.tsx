import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Clock, FileText, Download, User, MapPin, Briefcase } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Applicant {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  coverLetter: string;
  cvFileName?: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'accepted';
  jobTitle: string;
  jobId: number;
}

const ApplicantProfile = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const applicantId = searchParams.get('id');
  const jobId = searchParams.get('jobId');

  // Sample applicants data - in real app, this would come from API
  const allApplicants: Record<number, Applicant[]> = {
    1: [
      {
        id: 1,
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@email.com',
        phone: '0123456789',
        coverLetter: 'Tôi rất quan tâm đến vị trí Frontend Developer này và có 3 năm kinh nghiệm làm việc với React, Vue.js và các công nghệ frontend hiện đại. Trong quá trình làm việc tại công ty ABC, tôi đã tham gia phát triển nhiều dự án web application quy mô lớn, từ việc thiết kế UI/UX cho đến triển khai và tối ưu hóa performance. Tôi có kinh nghiệm làm việc với các framework như Next.js, TypeScript, và các thư viện state management như Redux, Zustand. Ngoài ra, tôi cũng có hiểu biết về backend development với Node.js và database. Tôi luôn đam mê học hỏi công nghệ mới và tin rằng có thể đóng góp tích cực cho đội ngũ phát triển của công ty.',
        cvFileName: 'NguyenVanA_CV.pdf',
        appliedDate: '2024-01-16',
        status: 'pending',
        jobTitle: 'Frontend Developer',
        jobId: 1
      },
      {
        id: 2,
        fullName: 'Trần Thị B',
        email: 'tranthib@email.com',
        phone: '0987654321',
        coverLetter: 'Với kinh nghiệm 2 năm trong phát triển web và đam mê công nghệ, tôi mong muốn được gia nhập đội ngũ Frontend Developer của công ty. Tôi có kinh nghiệm với HTML, CSS, JavaScript, React và đã hoàn thành nhiều dự án cá nhân cũng như công việc freelance.',
        cvFileName: 'TranThiB_CV.pdf',
        appliedDate: '2024-01-17',
        status: 'reviewed',
        jobTitle: 'Frontend Developer',
        jobId: 1
      }
    ],
    2: [
      {
        id: 3,
        fullName: 'Lê Văn C',
        email: 'levanc@email.com',
        phone: '0369852147',
        coverLetter: 'Tôi có kinh nghiệm trong lĩnh vực marketing digital và mong muốn được góp phần vào sự phát triển của công ty trong vai trò Marketing Specialist.',
        appliedDate: '2024-01-18',
        status: 'interviewed',
        jobTitle: 'Marketing Specialist',
        jobId: 2
      }
    ]
  };

  const applicant = React.useMemo(() => {
    if (!applicantId || !jobId) return null;
    const jobApplicants = allApplicants[parseInt(jobId)] || [];
    return jobApplicants.find(app => app.id === parseInt(applicantId));
  }, [applicantId, jobId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interviewed': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'reviewed': return 'Đã xem';
      case 'interviewed': return 'Đã phỏng vấn';
      case 'accepted': return 'Đã nhận';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  if (!applicant) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin?tab=jobs')}
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
            onClick={() => navigate('/admin?tab=jobs')}
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
              Ứng tuyển vị trí: {applicant.jobTitle}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm border ${getStatusColor(applicant.status)}`}>
            {getStatusText(applicant.status)}
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
                  <p className="text-lg font-semibold text-gray-900">{applicant.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Ngày ứng tuyển</label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-gray-900">{applicant.appliedDate}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <a href={`mailto:${applicant.email}`} className="text-blue-600 hover:underline">
                      {applicant.email}
                    </a>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Số điện thoại</label>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <a href={`tel:${applicant.phone}`} className="text-blue-600 hover:underline">
                      {applicant.phone}
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cover Letter */}
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
                  {applicant.coverLetter}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CV Section */}
          {applicant.cvFileName && (
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
                      <p className="font-medium text-gray-900">{applicant.cvFileName}</p>
                      <p className="text-sm text-gray-500">Tài liệu PDF</p>
                    </div>
                  </div>
                  <Button size="sm" className="flex items-center gap-2">
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
              <Button className="w-full" size="lg">
                <Mail className="w-4 h-4 mr-2" />
                Gửi email
              </Button>
              <Button variant="outline" className="w-full" size="lg">
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
                <p className="font-semibold text-gray-900">{applicant.jobTitle}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Trạng thái ứng tuyển</label>
                <span className={`inline-block px-2 py-1 rounded-full text-sm border mt-1 ${getStatusColor(applicant.status)}`}>
                  {getStatusText(applicant.status)}
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
              <Button variant="outline" className="w-full justify-start">
                Chuyển sang "Đã xem"
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Chuyển sang "Đã phỏng vấn"
              </Button>
              <Button variant="outline" className="w-full justify-start text-green-600 hover:text-green-700">
                Chấp nhận ứng viên
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                Từ chối ứng viên
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicantProfile;
