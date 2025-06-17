import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ApplicationDialog from '../components/ApplicationDialog';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MapPin, Clock, Users, Briefcase, Mail, Phone } from 'lucide-react';
import { recruitmentService, Job } from '../services/recruitmentService';
import { useToast } from '../components/ui/use-toast';

const Recruitment = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const fetchedJobs = await recruitmentService.getAllJobs();
      setJobs(fetchedJobs);
    } catch (error: any) {
      console.error('Error loading jobs:', error);
      let errorMessage = 'Failed to load job listings. Please try again later.';
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Your session has expired. Please log in again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to view job listings.';
            break;
          case 404:
            errorMessage = 'Job listings not found.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    "Lương thưởng cạnh tranh, đánh giá tăng lương 2 lần/năm",
    "Bảo hiểm sức khỏe cao cấp cho nhân viên và gia đình",
    "Môi trường làm việc năng động, sáng tạo với công nghệ hiện đại",
    "Cơ hội đào tạo và phát triển nghề nghiệp",
    "Team building, du lịch công ty hàng năm",
    "Flexible working time, work from home",
    "Thưởng hiệu suất, thưởng dự án"
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Tham gia đội ngũ PH Group
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Cùng chúng tôi xây dựng tương lai của AI Marketing và E-commerce tại Việt Nam
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span>TP. Hồ Chí Minh</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>50+ nhân viên</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              <span>Đang tuyển {jobs.length} vị trí</span>
            </div>
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tại sao chọn PH Group?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi không chỉ là nơi làm việc, mà là nơi để bạn phát triển bản thân và sự nghiệp
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Công nghệ tiên tiến</h3>
                <p className="text-gray-600">
                  Làm việc với các công nghệ AI và automation mới nhất trong ngành
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Đội ngũ trẻ trung</h3>
                <p className="text-gray-600">
                  Môi trường năng động với đồng nghiệp tài năng và nhiệt huyết
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Work-life balance</h3>
                <p className="text-gray-600">
                  Thời gian làm việc linh hoạt, hỗ trợ làm việc từ xa
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Quyền lợi nhân viên
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Job Positions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Vị trí đang tuyển dụng
            </h2>
            <p className="text-lg text-gray-600">
              Tìm kiếm cơ hội phù hợp với bạn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {job.department}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </div>
                    <div className="font-semibold text-green-600">
                      {job.salary}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{job.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Yêu cầu:</h4>
                    <div className="text-gray-600 whitespace-pre-line">
                      {job.requirements}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Quyền lợi:</h4>
                    <div className="text-gray-600 whitespace-pre-line">
                      {job.benefits}
                    </div>
                  </div>

                  <ApplicationDialog jobTitle={job.title} jobId={job.id}>
                    <Button className="w-full">
                      Ứng tuyển ngay
                    </Button>
                  </ApplicationDialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white text-center">
            <h2 className="text-3xl font-bold mb-4">
              Không tìm thấy vị trí phù hợp?
            </h2>
            <p className="text-xl mb-6">
              Hãy gửi CV của bạn cho chúng tôi. Chúng tôi luôn tìm kiếm những tài năng xuất sắc!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="mailto:hr@phgcorporation.com" 
                className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-5 h-5" />
                hr@phgcorporation.com
              </a>
              <a 
                href="tel:+84123456789" 
                className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-5 h-5" />
                +84 123 456 789
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Recruitment;
