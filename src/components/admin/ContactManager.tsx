import React, { useState, useEffect } from 'react';
import { Mail, Phone, Calendar, Search, Filter, Archive, Reply, XCircle, Clock, CheckCircle2, Ban } from 'lucide-react';
import { contactService, type Contact, type ContactStatusType, type ContactPriorityType } from '@/services/contactService';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ContactManager = () => {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated, logout } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const checkAndFetchContacts = async () => {
    if (!isAuthenticated) {
        setError('Vui lòng đăng nhập để truy cập trang này');
        return;
      }

      if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'HR') {
        setError('Bạn không có quyền truy cập trang này');
      return;
    }

      await fetchContacts();
    };

    checkAndFetchContacts();
  }, [isAuthenticated, currentUser]);

  const handleError = (error: any, errorMessage: string) => {
    console.error(errorMessage, error);
    if (error?.message === 'Unauthorized' || error?.status === 401) {
      toast.error('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại');
      logout();
      navigate('/login');
      return;
    }
    toast.error(errorMessage);
    setError(errorMessage);
  };

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await contactService.getAllContacts();
      setContacts(data);
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        logout();
      } else {
        setError(error.message || 'Không thể tải danh sách liên hệ');
        toast.error('Không thể tải danh sách liên hệ');
      }
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: string, newStatus: ContactStatusType) => {
    try {
      setLoading(true);
      await contactService.updateContact(id, { status: newStatus });
      toast.success('Cập nhật trạng thái thành công');
      await fetchContacts();
    } catch (error) {
      handleError(error, 'Không thể cập nhật trạng thái');
    } finally {
      setLoading(false);
    }
  };

  const updateContactPriority = async (id: string, newPriority: ContactPriorityType) => {
    try {
      setLoading(true);
      await contactService.updateContact(id, { priority: newPriority });
      toast.success('Cập nhật độ ưu tiên thành công');
      await fetchContacts();
    } catch (error) {
      handleError(error, 'Không thể cập nhật độ ưu tiên');
    } finally {
      setLoading(false);
    }
  };

  const handleReplyContact = async (id: string, message: string) => {
    try {
      setLoading(true);
      await contactService.replyToContact(id, message);
      await contactService.updateContact(id, { status: 'REPLIED' });
      toast.success('Đã gửi phản hồi');
      await fetchContacts();
      if (selectedContact?.id === id) {
        const updatedContact = await contactService.getContactById(id);
        setSelectedContact(updatedContact);
      }
    } catch (error) {
      handleError(error, 'Không thể gửi phản hồi');
    } finally {
      setLoading(false);
    }
  };

  const handleArchiveContact = async (id: string) => {
    try {
      setLoading(true);
      await contactService.updateContact(id, { status: 'ARCHIVED' });
      toast.success('Đã lưu trữ tin nhắn');
      await fetchContacts();
      if (selectedContact?.id === id) {
        const updatedContact = await contactService.getContactById(id);
        setSelectedContact(updatedContact);
      }
    } catch (error) {
      handleError(error, 'Không thể lưu trữ tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: ContactStatusType) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'REPLIED':
        return 'bg-green-100 text-green-800';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ContactStatusType) => {
    switch (status) {
      case 'NEW':
        return <Mail className="w-4 h-4" />;
      case 'REPLIED':
        return <Reply className="w-4 h-4" />;
      case 'ARCHIVED':
        return <Archive className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: ContactStatusType) => {
    switch (status) {
      case 'NEW':
        return 'Mới';
      case 'REPLIED':
        return 'Đã trả lời';
      case 'ARCHIVED':
        return 'Đã lưu trữ';
      default:
        return status;
    }
  };

  const getAvailableStatuses = (currentStatus: ContactStatusType): ContactStatusType[] => {
    switch (currentStatus) {
      case 'NEW':
        return ['NEW', 'REPLIED'];
      case 'REPLIED':
        return ['REPLIED', 'ARCHIVED'];
      case 'ARCHIVED':
        return ['ARCHIVED'];
      default:
        return ['NEW', 'REPLIED', 'ARCHIVED'];
    }
  };

  const getPriorityColor = (priority: ContactPriorityType) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: ContactPriorityType) => {
    switch (priority) {
      case 'HIGH':
        return 'Cao';
      case 'MEDIUM':
        return 'Trung bình';
      case 'LOW':
        return 'Thấp';
      default:
        return priority;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="text-2xl font-bold text-gray-700 mb-2">Vui lòng đăng nhập</div>
        <p className="text-gray-500">Bạn cần đăng nhập để truy cập trang này.</p>
      </div>
    );
  }

  if (currentUser?.role !== 'ADMIN' && currentUser?.role !== 'HR') {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="text-2xl font-bold text-gray-700 mb-2">Không có quyền truy cập</div>
        <p className="text-gray-500">Bạn không có quyền truy cập trang này.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="mb-4 text-red-500">
          <XCircle className="w-12 h-12 mx-auto" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Đã có lỗi xảy ra</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => fetchContacts()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (loading && contacts.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Liên hệ</h1>
        <div className="flex items-center space-x-4">
          {contacts.filter(c => c.status === 'NEW').length > 0 ? (
            <div className="flex items-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-sm font-medium">
                {contacts.filter(c => c.status === 'NEW').length} tin nhắn mới cần xử lý
              </span>
            </div>
          ) : (
            <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-medium">
              Đã xử lý tất cả tin nhắn
            </span>
          )}
          <div className="flex items-center space-x-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium">
              {contacts.filter(c => c.status === 'REPLIED').length} đã trả lời
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium">
              {contacts.filter(c => c.status === 'ARCHIVED').length} đã lưu trữ
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc chủ đề..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-80"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="NEW">Mới</option>
              <option value="REPLIED">Đã trả lời</option>
              <option value="ARCHIVED">Đã lưu trữ</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh sách tin nhắn ({filteredContacts.length})
            </h2>
          </div>
          
          <div className="divide-y max-h-[calc(100vh-250px)] overflow-y-auto">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(contact.priority)}`}></div>
                      <h3 className="font-medium text-gray-800">{contact.name}</h3>
                      {contact.company && (
                        <span className="text-sm text-gray-500">- {contact.company}</span>
                      )}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(contact.status)}`}>
                        {getStatusIcon(contact.status)}
                        {getStatusText(contact.status)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      {contact.service} {contact.budget && `- ${contact.budget}`}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-2">{contact.message}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{contact.email}</span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(contact.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Detail */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
          {selectedContact ? (
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Chi tiết tin nhắn</h2>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedContact.status}
                    onChange={(e) => updateContactStatus(selectedContact.id, e.target.value as ContactStatusType)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${getStatusColor(selectedContact.status)} focus:ring-2 focus:ring-blue-500`}
                  >
                    {getAvailableStatuses(selectedContact.status as ContactStatusType).map((status) => (
                      <option key={status} value={status}>
                        {getStatusText(status)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Họ tên</label>
                    <p className="text-lg text-gray-800">{selectedContact.name}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Công ty</label>
                    <p className="text-lg text-gray-800">{selectedContact.company || 'Không có'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Email</label>
                    <p className="text-lg text-gray-800">{selectedContact.email}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Số điện thoại</label>
                    <p className="text-lg text-gray-800">{selectedContact.phone || 'Không có'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Dịch vụ quan tâm</label>
                    <p className="text-lg text-gray-800 font-medium">{selectedContact.service}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Ngân sách dự kiến</label>
                    <p className="text-lg text-gray-800">{selectedContact.budget || 'Chưa xác định'}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Chủ đề</label>
                  <p className="text-lg text-gray-800 font-medium">{selectedContact.subject}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600 block mb-1">Nội dung tin nhắn</label>
                  <div className="mt-2 bg-gray-50 p-6 rounded-lg">
                    <p className="text-lg text-gray-800 whitespace-pre-wrap leading-relaxed">{selectedContact.message}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600 block mb-1">Ngày gửi</label>
                    <p className="text-lg text-gray-800">
                      {new Date(selectedContact.createdAt).toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 space-y-3">
                {selectedContact.status === 'NEW' && (
                  <button
                    onClick={() => selectedContact && handleReplyContact(selectedContact.id, "Phản hồi mẫu")}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 disabled:opacity-50 transition-colors text-lg font-medium"
                  >
                    <Reply className="w-5 h-5" />
                    <span>{loading ? 'Đang gửi...' : 'Trả lời'}</span>
                  </button>
                )}

                {selectedContact.status === 'REPLIED' && (
                  <button
                    onClick={() => selectedContact && handleArchiveContact(selectedContact.id)}
                    disabled={loading}
                    className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2 disabled:opacity-50 transition-colors text-lg font-medium"
                  >
                    <Archive className="w-5 h-5" />
                    <span>{loading ? 'Đang xử lý...' : 'Lưu trữ'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg">Chọn một tin nhắn để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManager;
