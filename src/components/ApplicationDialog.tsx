import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { recruitmentService, CreateApplicationDto } from '@/services/recruitmentService';

export interface ApplicationDialogProps {
  children: React.ReactNode;
  jobTitle: string;
  jobId: number;
}

const ApplicationDialog = ({ children, jobTitle, jobId }: ApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Initialize form data with jobId as a number
  const [formData, setFormData] = useState<CreateApplicationDto>(() => ({
    jobId: jobId,
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    cvFile: undefined
  }));

  // Update jobId when prop changes
  useEffect(() => {
    if (jobId > 0) {
      setFormData(prev => ({
        ...prev,
        jobId: jobId
      }));
    }
  }, [jobId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cvFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.fullName?.trim()) {
        toast.error('Vui lòng nhập họ và tên');
        return;
      }

      if (!formData.email?.trim()) {
        toast.error('Vui lòng nhập email');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        toast.error('Email không hợp lệ');
        return;
      }

      if (!formData.phone?.trim()) {
        toast.error('Vui lòng nhập số điện thoại');
        return;
      }

      // Phone validation for Vietnam (E.164 format)
      // Accepts:
      // - Numbers starting with +84 followed by 9 digits
      // - Numbers starting with 0 followed by 9 digits
      const phoneRegex = /^(\+84|0)([3|5|7|8|9])([0-9]{8})$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        toast.error('Số điện thoại không hợp lệ. Vui lòng nhập theo định dạng: 0xxxxxxxxx hoặc +84xxxxxxxxx');
        return;
      }

      if (!formData.cvFile) {
        toast.error('Vui lòng tải lên CV của bạn');
        return;
      }

      // File validation
      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      if (formData.cvFile.size > MAX_FILE_SIZE) {
        toast.error('File CV không được vượt quá 5MB');
        return;
      }

      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(formData.cvFile.type)) {
        toast.error('Chỉ chấp nhận file PDF, DOC hoặc DOCX');
        return;
      }

      // Format phone number to E.164 format
      let formattedPhone = formData.phone.trim();
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+84' + formattedPhone.substring(1);
      }

      // Clean data before sending
      const cleanedData: CreateApplicationDto = {
        jobId: formData.jobId,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formattedPhone,
        coverLetter: formData.coverLetter?.trim(),
        cvFile: formData.cvFile
      };

      await recruitmentService.applyForJob(cleanedData);
      toast.success('Đã gửi đơn ứng tuyển thành công!');
      setOpen(false);
      setFormData({
        jobId: jobId,
        fullName: '',
        email: '',
        phone: '',
        coverLetter: '',
        cvFile: undefined
      });
    } catch (error: any) {
      console.error('Error submitting application:', error);
      let errorMessage = 'Không thể gửi đơn ứng tuyển. Vui lòng thử lại.';
      
      if (error.response?.data?.message) {
        const messages = error.response.data.message;
        if (Array.isArray(messages)) {
          errorMessage = messages.join('\n');
        } else {
          errorMessage = messages;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ứng tuyển vị trí {jobTitle}</DialogTitle>
          <DialogDescription>
            Vui lòng điền đầy đủ thông tin bên dưới để ứng tuyển.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="VD: 0912345678 hoặc +84912345678"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverLetter">Thư xin việc</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              rows={4}
              value={formData.coverLetter}
              onChange={handleInputChange}
              placeholder="Giới thiệu bản thân và lý do bạn muốn ứng tuyển vị trí này..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvFile">CV của bạn</Label>
            <Input
              id="cvFile"
              name="cvFile"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <p className="text-sm text-gray-500">
              Chấp nhận file PDF, DOC, DOCX (tối đa 5MB)
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi đơn ứng tuyển'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
