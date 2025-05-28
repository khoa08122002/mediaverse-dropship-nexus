
import React, { useState } from 'react';
import { Plus, Edit, Trash, Eye, Search, MapPin, Clock } from 'lucide-react';

const JobManager = () => {
  const [jobs, setJobs] = useState([
    {
      id: 1,
      title: 'Frontend Developer',
      department: 'Kỹ thuật',
      location: 'TP.HCM',
      type: 'Full-time',
      status: 'active',
      applications: 12,
      postedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Marketing Specialist',
      department: 'Marketing',
      location: 'Hà Nội',
      type: 'Part-time',
      status: 'closed',
      applications: 8,
      postedDate: '2024-01-10'
    },
  ]);

  const [showEditor, setShowEditor] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    benefits: '',
    salary: '',
    status: 'active'
  });

  const handleSaveJob = () => {
    if (editingJob) {
      setJobs(jobs.map(job => 
        job.id === editingJob.id 
          ? { ...job, ...newJob, postedDate: new Date().toISOString().split('T')[0] }
          : job
      ));
    } else {
      const newId = Math.max(...jobs.map(j => j.id)) + 1;
      setJobs([...jobs, {
        ...newJob,
        id: newId,
        postedDate: new Date().toISOString().split('T')[0],
        applications: 0
      }]);
    }
    setShowEditor(false);
    setEditingJob(null);
    setNewJob({
      title: '',
      department: '',
      location: '',
      type: 'Full-time',
      description: '',
      requirements: '',
      benefits: '',
      salary: '',
      status: 'active'
    });
  };

  const handleEditJob = (job: any) => {
    setEditingJob(job);
    setNewJob({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description || '',
      requirements: job.requirements || '',
      benefits: job.benefits || '',
      salary: job.salary || '',
      status: job.status
    });
    setShowEditor(true);
  };

  const handleDeleteJob = (id: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa tin tuyển dụng này?')) {
      setJobs(jobs.filter(job => job.id !== id));
    }
  };

  if (showEditor) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            {editingJob ? 'Chỉnh sửa tin tuyển dụng' : 'Tạo tin tuyển dụng mới'}
          </h1>
          <button
            onClick={() => {
              setShowEditor(false);
              setEditingJob(null);
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            Quay lại
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên vị trí
              </label>
              <input
                type="text"
                value={newJob.title}
                onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phòng ban
              </label>
              <input
                type="text"
                value={newJob.department}
                onChange={(e) => setNewJob({...newJob, department: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: Kỹ thuật"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa điểm
              </label>
              <input
                type="text"
                value={newJob.location}
                onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: TP.HCM"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại hình
              </label>
              <select
                value={newJob.type}
                onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mức lương
              </label>
              <input
                type="text"
                value={newJob.salary}
                onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Ví dụ: 15-25 triệu VND"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                value={newJob.status}
                onChange={(e) => setNewJob({...newJob, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Đang tuyển</option>
                <option value="closed">Đã đóng</option>
                <option value="draft">Bản nháp</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mô tả công việc
              </label>
              <textarea
                value={newJob.description}
                onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Mô tả chi tiết về công việc..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yêu cầu ứng viên
              </label>
              <textarea
                value={newJob.requirements}
                onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Các yêu cầu về kinh nghiệm, kỹ năng..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quyền lợi
              </label>
              <textarea
                value={newJob.benefits}
                onChange={(e) => setNewJob({...newJob, benefits: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Các quyền lợi được hưởng..."
              />
            </div>
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleSaveJob}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              {editingJob ? 'Cập nhật' : 'Tạo tin tuyển dụng'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Tuyển dụng</h1>
        <button
          onClick={() => setShowEditor(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo tin tuyển dụng</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm vị trí..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Vị trí</th>
                <th className="text-left py-3 px-4">Phòng ban</th>
                <th className="text-left py-3 px-4">Địa điểm</th>
                <th className="text-left py-3 px-4">Loại hình</th>
                <th className="text-left py-3 px-4">Trạng thái</th>
                <th className="text-left py-3 px-4">Ứng tuyển</th>
                <th className="text-left py-3 px-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <h3 className="font-medium text-gray-800">{job.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-3 h-3" />
                      <span>Đăng ngày {job.postedDate}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{job.department}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{job.type}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      job.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : job.status === 'closed'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {job.status === 'active' ? 'Đang tuyển' : 
                       job.status === 'closed' ? 'Đã đóng' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-blue-600">{job.applications}</span>
                    <span className="text-gray-600"> ứng tuyển</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditJob(job)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default JobManager;
