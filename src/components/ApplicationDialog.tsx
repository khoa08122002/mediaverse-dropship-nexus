
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';

interface ApplicationDialogProps {
  jobTitle: string;
  children: React.ReactNode;
}

const ApplicationDialog = ({ jobTitle, children }: ApplicationDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    coverLetter: '',
    cv: null as File | null
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      cv: file
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin bắt buộc",
        variant: "destructive"
      });
      return;
    }

    // Simulate form submission
    console.log('Application submitted:', {
      ...formData,
      jobTitle,
      cvFileName: formData.cv?.name
    });

    toast({
      title: "Ứng tuyển thành công!",
      description: `Đơn ứng tuyển cho vị trí ${jobTitle} đã được gửi. Chúng tôi sẽ liên hệ với bạn sớm nhất.`
    });

    // Reset form and close dialog
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      coverLetter: '',
      cv: null
    });
    setOpen(false);
  };

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      cv: null
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ứng tuyển: {jobTitle}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên của bạn"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="example@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="0123 456 789"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cv">CV/Resume</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="cv"
                name="cv"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('cv')?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {formData.cv ? 'Thay đổi CV' : 'Tải lên CV'}
              </Button>
              {formData.cv && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>{formData.cv.name}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500">Định dạng: PDF, DOC, DOCX (tối đa 5MB)</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Thư xin việc</Label>
            <Textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              placeholder="Viết vài dòng về bản thân và lý do bạn phù hợp với vị trí này..."
              rows={4}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Gửi đơn ứng tuyển
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDialog;
