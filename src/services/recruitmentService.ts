import axios from './axiosConfig';

// Emergency fallback for production - Use current domain's API
if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
  console.log('🚨 Emergency: Using current domain API endpoint');
  axios.defaults.baseURL = `${window.location.origin}/api/comprehensive`;
}
import type { 
  Application,
  ApplicationStatusType,
  Job,
  JobTypeValue,
  JobStatusValue
} from '@/lib/prisma-types';
import { ApplicationStatus, JobType, JobStatus } from '@/lib/prisma-types';
import type { CreateJobDto, UpdateJobDto } from '@/backend/modules/recruitment/dto/job.dto';

export { ApplicationStatus, JobType, JobStatus };
export type { Application, Job };

export interface UpdateApplicationStatusDto {
  status: ApplicationStatusType;
}

export interface CreateApplicationDto {
  jobId: number;
  fullName: string;
  email: string;
  phone: string;
  coverLetter?: string;
  cvFile?: File;
}

class RecruitmentService {
  async getAllJobs(): Promise<Job[]> {
    const response = await axios.get('/recruitment/jobs');
    return response.data;
  }

  async getJobById(id: number): Promise<Job> {
    const response = await axios.get(`/recruitment/jobs/${id}`);
    return response.data;
  }

  async createJob(jobData: CreateJobDto): Promise<Job> {
    const response = await axios.post('/recruitment/jobs', jobData);
    return response.data;
  }

  async updateJob(id: number, jobData: UpdateJobDto): Promise<Job> {
    const response = await axios.put(`/recruitment/jobs/${id}`, jobData);
    return response.data;
  }

  async deleteJob(id: number): Promise<void> {
    await axios.delete(`/recruitment/jobs/${id}`);
  }

  async createApplication(applicationData: FormData): Promise<Application> {
    const response = await axios.post('/recruitment/applications', applicationData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getAllApplications(): Promise<Application[]> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để tiếp tục');
      }

      const response = await axios.get('/recruitment/applications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error in getAllApplications:', error);
      if (error.response?.status === 401) {
        // Token might be expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
            const { accessToken } = refreshResponse.data;
            localStorage.setItem('accessToken', accessToken);
            
            // Retry the original request with new token
            const retryResponse = await axios.get('/recruitment/applications', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
            return retryResponse.data;
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw new Error('Phiên đăng nhập đã hết hạn');
          }
        }
      }
      throw error;
    }
  }

  async getJobApplications(jobId: number): Promise<Application[]> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để tiếp tục');
      }

      const response = await axios.get(`/recruitment/jobs/${jobId}/applications`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error in getJobApplications:', error);
      if (error.response?.status === 401) {
        // Token might be expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
            const { accessToken } = refreshResponse.data;
            localStorage.setItem('accessToken', accessToken);
            
            // Retry the original request with new token
            const retryResponse = await axios.get(`/recruitment/jobs/${jobId}/applications`, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
            return retryResponse.data;
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw new Error('Phiên đăng nhập đã hết hạn');
          }
        }
      }
      throw error;
    }
  }

  async getApplication(id: number): Promise<Application> {
    try {
      console.log('Fetching application with ID:', id);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để tiếp tục');
      }

      const response = await axios.get(`/recruitment/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('API Response:', response.data);

      if (!response.data) {
        throw new Error('Không tìm thấy thông tin ứng viên');
      }

      return response.data;
    } catch (error: any) {
      console.error('Error in getApplication:', error);
      if (error.response?.status === 401) {
        // Token might be expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
            const { accessToken } = refreshResponse.data;
            localStorage.setItem('accessToken', accessToken);
            
            // Retry the original request with new token
            const retryResponse = await axios.get(`/recruitment/applications/${id}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });

            if (!retryResponse.data) {
              throw new Error('Không tìm thấy thông tin ứng viên');
            }

            return retryResponse.data;
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw new Error('Phiên đăng nhập đã hết hạn');
          }
        }
      } else if (error.response?.status === 404) {
        throw new Error('Không tìm thấy thông tin ứng viên');
      }
      throw error;
    }
  }

  async updateApplicationStatus(
    id: number, 
    status: ApplicationStatusType
  ): Promise<Application> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để tiếp tục');
      }

      const response = await axios.put(`/recruitment/applications/${id}/status`, 
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error in updateApplicationStatus:', error);
      if (error.response?.status === 401) {
        // Token might be expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
            const { accessToken } = refreshResponse.data;
            localStorage.setItem('accessToken', accessToken);
            
            // Retry the original request with new token
            const retryResponse = await axios.put(`/recruitment/applications/${id}/status`,
              { status },
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`
                }
              }
            );
            return retryResponse.data;
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw new Error('Phiên đăng nhập đã hết hạn');
          }
        }
      }
      throw error;
    }
  }

  async getStats() {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để tiếp tục');
      }

      const response = await axios.get('/recruitment/stats', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error in getStats:', error);
      if (error.response?.status === 401) {
        // Token might be expired, try to refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshResponse = await axios.post('/auth/refresh', { refreshToken });
            const { accessToken } = refreshResponse.data;
            localStorage.setItem('accessToken', accessToken);
            
            // Retry the original request with new token
            const retryResponse = await axios.get('/recruitment/stats', {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            });
            return retryResponse.data;
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            throw new Error('Phiên đăng nhập đã hết hạn');
          }
        }
      }
      throw error;
    }
  }

  async downloadCV(id: number): Promise<Blob> {
    try {
      console.log(`Attempting to download CV for application ${id}`);
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để tiếp tục');
      }

      const response = await axios.get(`/recruitment/applications/${id}/cv`, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Log response details for debugging
      console.log('CV download response:', {
        status: response.status,
        headers: response.headers,
        contentType: response.headers['content-type'],
        contentLength: response.headers['content-length']
      });

      if (!response.data || response.data.size === 0) {
        throw new Error('CV không tồn tại hoặc file rỗng');
      }

      return response.data;
    } catch (error: any) {
      console.error('CV download error:', error);
      if (error.response?.status === 404) {
        throw new Error('CV không tồn tại hoặc đã bị xóa');
      }
      if (error.response?.status === 403) {
        throw new Error('Không có quyền tải CV này');
      }
      throw new Error('Không thể tải CV: ' + (error.message || 'Lỗi không xác định'));
    }
  }

  async applyForJob(data: CreateApplicationDto): Promise<Application> {
    try {
      const formData = new FormData();
      
      // Convert jobId to number and validate
      const jobId = Number(data.jobId);
      if (isNaN(jobId)) {
        throw new Error('Invalid job ID');
      }
      formData.append('jobId', jobId.toString());
      
      // Add required fields
      formData.append('fullName', data.fullName.trim());
      formData.append('email', data.email.trim());
      formData.append('phone', data.phone.trim());
      
      // Add optional fields
      if (data.coverLetter) {
        formData.append('coverLetter', data.coverLetter.trim());
      }
      
      // Handle CV file
      if (data.cvFile instanceof File) {
        formData.append('cvFile', data.cvFile, data.cvFile.name);
      }

      const response = await axios.post('/recruitment/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error details:', error);
      throw error;
    }
  }

  async deleteApplication(id: number): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để tiếp tục');
      }

      await axios.delete(`/recruitment/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Ứng viên không tồn tại hoặc đã bị xóa');
      }
      throw new Error('Không thể xóa ứng viên: ' + (error.message || 'Lỗi không xác định'));
    }
  }

  async getApplicationsByJob(): Promise<{ job: Job; applicationsCount: number }[]> {
    const [jobs, applications] = await Promise.all([
      this.getAllJobs(),
      this.getAllApplications()
    ]);

    return jobs.map(job => ({
      job,
      applicationsCount: applications.filter(app => app.jobId === job.id).length
    }));
  }
}

export const recruitmentService = new RecruitmentService(); 