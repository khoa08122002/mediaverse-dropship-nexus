import React, { useState } from 'react';
import { Mail, Phone, Calendar, Search, Filter, Archive, Reply } from 'lucide-react';

const ContactManager = () => {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0123456789',
      subject: 'Tư vấn dịch vụ AI Marketing',
      message: 'Tôi muốn tìm hiểu thêm về dịch vụ AI Marketing của công ty...',
      date: '2024-01-15',
      status: 'new',
      priority: 'high'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0987654321',
      subject: 'Hỏi về Dropshipping',
      message: 'Công ty có hỗ trợ setup hệ thống dropshipping không?',
      date: '2024-01-14',
      status: 'replied',
      priority: 'medium'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      phone: '0369852147',
      subject: 'Báo giá E-commerce',
      message: 'Cần báo giá cho dự án e-commerce...',
      date: '2024-01-13',
      status: 'archived',
      priority: 'low'
    }
  ]);

  const [selectedContact, setSelectedContact] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || contact.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const updateContactStatus = (id: number, newStatus: string) => {
    setContacts(contacts.map(contact => 
      contact.id === id ? { ...contact, status: newStatus } : contact
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Liên hệ</h1>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full">
            {contacts.filter(c => c.status === 'new').length} tin nhắn mới
          </span>
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
              <option value="new">Mới</option>
              <option value="replied">Đã trả lời</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh sách tin nhắn ({filteredContacts.length})
            </h2>
          </div>
          
          <div className="divide-y max-h-96 overflow-y-auto">
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
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(contact.status)}`}>
                        {contact.status === 'new' ? 'Mới' : 
                         contact.status === 'replied' ? 'Đã trả lời' : 'Đã lưu trữ'}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 mb-1">{contact.subject}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{contact.message}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3" />
                        <span>{contact.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{contact.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Detail */}
        <div className="bg-white rounded-lg shadow-md">
          {selectedContact ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Chi tiết tin nhắn</h2>
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedContact.priority)}`}></div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Họ tên</label>
                  <p className="text-gray-800">{selectedContact.name}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-800">{selectedContact.email}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Số điện thoại</label>
                  <p className="text-gray-800">{selectedContact.phone}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Chủ đề</label>
                  <p className="text-gray-800">{selectedContact.subject}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Tin nhắn</label>
                  <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedContact.message}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Ngày gửi</label>
                  <p className="text-gray-800">{selectedContact.date}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Trạng thái</label>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(selectedContact.status)}`}>
                    {selectedContact.status === 'new' ? 'Mới' : 
                     selectedContact.status === 'replied' ? 'Đã trả lời' : 'Đã lưu trữ'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 space-y-2">
                <button
                  onClick={() => updateContactStatus(selectedContact.id, 'replied')}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
                >
                  <Reply className="w-4 h-4" />
                  <span>Trả lời</span>
                </button>
                
                <button
                  onClick={() => updateContactStatus(selectedContact.id, 'archived')}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 flex items-center justify-center space-x-2"
                >
                  <Archive className="w-4 h-4" />
                  <span>Lưu trữ</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Chọn một tin nhắn để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactManager;