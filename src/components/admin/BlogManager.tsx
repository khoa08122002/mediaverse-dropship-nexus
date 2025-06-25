import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash, Eye, Search, User, Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import SimpleModal from '@/components/SimpleModal';
import { Editor } from '@tinymce/tinymce-react';
import { blogService } from '@/services/blogService';
import type { BlogImage, BlogData, CreateBlogDTO } from '@/types/blog';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Error Boundary Component
interface DialogErrorBoundaryState {
  hasError: boolean;
}

interface DialogErrorBoundaryProps {
  children: React.ReactNode;
}

class DialogErrorBoundary extends React.Component<DialogErrorBoundaryProps, DialogErrorBoundaryState> {
  constructor(props: DialogErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): DialogErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Dialog Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <div className="p-4 text-center text-red-600">Đã xảy ra lỗi với dialog. Vui lòng thử lại.</div>;
    }

    return this.props.children;
  }
}

interface BlogFormData extends CreateBlogDTO {
  status: 'draft' | 'published';
}

const categories = [
  "AI Marketing",
  "E-commerce",
  "Content Marketing",
  "Analytics",
  "Supply Chain",
  "Case Studies"
];

const BlogManager = () => {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated, logout } = useAuth();
  const editorRef = useRef<any>(null);
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewBlog, setPreviewBlog] = useState<BlogData | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogData | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogConfig, setConfirmDialogConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    title: '',
    message: '',
    onConfirm: () => {},
  });
  const [newBlog, setNewBlog] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    category: '',
    tags: [],
    readTime: '',
    isFeatured: false,
    featuredImage: {
      url: '',
      alt: ''
    }
  });

  const isAdmin = currentUser?.role === 'ADMIN';
  const isHR = currentUser?.role === 'HR';
  const canManageAllBlogs = isAdmin || isHR;

  useEffect(() => {
    const checkAndFetchBlogs = async () => {
      if (!isAuthenticated) {
        setError('Vui lòng đăng nhập để tiếp tục');
        return;
      }

      await fetchBlogs();
    };

    checkAndFetchBlogs();
  }, [isAuthenticated]);

  const fetchBlogs = async () => {
    try {
      console.log('📋 fetchBlogs called - starting fetch...');
      setLoading(true);
      setError(null);
      console.log('📋 Loading state set to true, calling blogService.getAllBlogs...');
      
      const data = await blogService.getAllBlogs();
      console.log('📋 Raw data received from API:', data.length, 'blogs');
      console.log('📋 First blog ID:', data[0]?.id);
      console.log('📋 All blog IDs:', data.map(b => b.id));
      
      // Parse featuredImage and tags for all posts
      const processedData = data.map(post => ({
        ...post,
        featuredImage: typeof post.featuredImage === 'string' 
          ? JSON.parse(post.featuredImage)
          : post.featuredImage,
        tags: typeof post.tags === 'string' 
          ? (post.tags ? (post.tags as string).split(',').map((tag: string) => tag.trim()) : [])
          : (Array.isArray(post.tags) ? post.tags : [])
      }));
      console.log('📋 Data processed (featuredImage parsed)');
      
      // Filter blogs based on user role
      const filteredData = canManageAllBlogs 
        ? processedData 
        : processedData.filter(blog => blog.authorId === currentUser?.id);
      console.log('📋 Data filtered - canManageAllBlogs:', canManageAllBlogs);
      console.log('📋 Current user ID:', currentUser?.id);
      console.log('📋 Filtered data count:', filteredData.length);
      console.log('📋 Filtered blog IDs:', filteredData.map(b => b.id));
      
      console.log('📋 Setting blogs state with', filteredData.length, 'blogs...');
      setBlogs(filteredData);
      console.log('📋 Blogs state updated successfully');
      
    } catch (error: any) {
      console.error('📋 Error fetching blogs:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        logout();
      } else {
        setError(error.response?.data?.message || 'Không thể tải danh sách bài viết');
        toast.error('Không thể tải danh sách bài viết');
      }
    } finally {
      console.log('📋 Setting loading to false...');
      setLoading(false);
      console.log('📋 fetchBlogs completed');
    }
  };

  const handleSaveBlog = async () => {
    try {
      console.log('💾 handleSaveBlog called');
      console.log('💾 newBlog:', newBlog);
      console.log('💾 editingBlog:', editingBlog);
      
      // Validate required fields
      if (!newBlog.title.trim()) {
        console.log('💾 Validation failed: title missing');
        toast.error('Vui lòng nhập tiêu đề bài viết');
        return;
      }
      if (!newBlog.content.trim()) {
        console.log('💾 Validation failed: content missing');
        toast.error('Vui lòng nhập nội dung bài viết');
        return;
      }
      if (!newBlog.excerpt.trim()) {
        console.log('💾 Validation failed: excerpt missing');
        toast.error('Vui lòng nhập tóm tắt bài viết');
        return;
      }
      if (!newBlog.category) {
        console.log('💾 Validation failed: category missing');
        toast.error('Vui lòng chọn danh mục');
        return;
      }

      console.log('💾 Validation passed');
      console.log('💾 Current blog status:', newBlog.status);
      console.log('💾 Is featured:', newBlog.isFeatured);

      // Nếu đang set bài viết làm featured, kiểm tra xem đã có bài viết featured nào chưa
      if (newBlog.isFeatured) {
        console.log('💾 Checking for existing featured blog...');
        const currentFeaturedBlog = blogs.find(blog => blog.isFeatured && blog.id !== editingBlog?.id);
        console.log('💾 Current featured blog:', currentFeaturedBlog);

        if (currentFeaturedBlog) {
          console.log('💾 Found existing featured blog, showing confirmation dialog');
          setConfirmDialogConfig({
            title: 'Xác nhận thay đổi bài viết nổi bật',
            message: 'Hiện đã có một bài viết nổi bật. Bạn có muốn thay thế bài viết nổi bật hiện tại không?',
            onConfirm: async () => {
              try {
                setLoading(true);
                console.log('💾 Updating old featured blog:', currentFeaturedBlog.id);
                // Unset featured cho bài viết cũ
                await blogService.updateBlog(currentFeaturedBlog.id, {
                  ...currentFeaturedBlog,
                  isFeatured: false
                });
                await saveNewBlog();
              } catch (error) {
                console.error('💾 Error updating featured blog:', error);
                toast.error('Có lỗi xảy ra khi cập nhật bài viết nổi bật');
                setLoading(false);
              }
            }
          });
          setConfirmDialogOpen(true);
          return;
        }
      }

      // Show confirmation dialog for create/update
      console.log('💾 Showing create/update confirmation dialog');
      console.log('💾 editingBlog exists:', !!editingBlog);
      setConfirmDialogConfig({
        title: editingBlog ? 'Xác nhận cập nhật' : 'Xác nhận đăng bài',
        message: editingBlog 
          ? 'Bạn có chắc chắn muốn cập nhật bài viết này?' 
          : 'Bạn có chắc chắn muốn đăng bài viết này?',
        onConfirm: async () => {
          try {
            console.log('💾 Save confirmed, calling saveNewBlog...');
            setLoading(true);
            await saveNewBlog();
          } catch (error) {
            console.error('💾 Error saving blog:', error);
            if (error instanceof Error) {
              toast.error(`Lỗi: ${error.message}`);
            } else {
              toast.error('Có lỗi xảy ra khi lưu bài viết');
            }
            setLoading(false);
          }
        }
      });
      setConfirmDialogOpen(true);
      console.log('💾 Confirmation dialog opened');
    } catch (error) {
      console.error('💾 Error in handleSaveBlog:', error);
      toast.error('Có lỗi xảy ra khi xử lý yêu cầu');
    }
  };

  const saveNewBlog = async () => {
    try {
      console.log('✏️ saveNewBlog called');
      console.log('✏️ editingBlog:', editingBlog);
      console.log('✏️ newBlog data:', newBlog);
      console.log('✏️ canManageAllBlogs:', canManageAllBlogs);
      console.log('✏️ currentUser:', currentUser);
      
      const featuredImageData = {
        url: newBlog.featuredImage?.url?.trim() || '',
        alt: newBlog.featuredImage?.alt?.trim() || newBlog.title.trim()
      };

      if (editingBlog) {
        console.log('✏️ Updating existing blog with ID:', editingBlog.id);
        console.log('✏️ editingBlog.authorId:', editingBlog.authorId);
        console.log('✏️ currentUser.id:', currentUser?.id);
        
        // Nếu người dùng là admin/HR hoặc là tác giả, cho phép cập nhật tất cả các trường
        const hasFullPermission = canManageAllBlogs || editingBlog.authorId === currentUser?.id;
        console.log('✏️ hasFullPermission:', hasFullPermission);
        
        if (hasFullPermission) {
          console.log('✏️ User has full permission, updating all fields');
          const updateData = {
            title: newBlog.title.trim(),
            content: newBlog.content.trim(),
            excerpt: newBlog.excerpt.trim(),
            category: newBlog.category,
            tags: newBlog.tags,
            readTime: newBlog.readTime,
            status: newBlog.status,
            isFeatured: newBlog.status === 'published' && newBlog.isFeatured,
            featuredImage: featuredImageData
          };

          console.log('✏️ Update data:', updateData);
          const response = await blogService.updateBlog(editingBlog.id, updateData);
          console.log('✏️ Update response:', response);
          toast.success('Cập nhật bài viết thành công');
        } else {
          console.log('✏️ User has limited permission, updating only featured status');
          // Nếu không phải admin/HR hoặc tác giả, chỉ cho phép cập nhật trạng thái featured
          const updateData = {
            isFeatured: newBlog.status === 'published' && newBlog.isFeatured
          };
          console.log('✏️ Limited update data:', updateData);
          const response = await blogService.updateBlog(editingBlog.id, updateData);
          console.log('✏️ Limited update response:', response);
          toast.success('Cập nhật trạng thái nổi bật thành công');
        }
      } else {
        console.log('✏️ Creating new blog');
        // Tạo blog mới
        const blogData = {
          title: newBlog.title.trim(),
          content: newBlog.content.trim(),
          excerpt: newBlog.excerpt.trim(),
          category: newBlog.category,
          tags: newBlog.tags,
          readTime: newBlog.readTime,
          status: newBlog.status,
          isFeatured: newBlog.status === 'published' && newBlog.isFeatured,
          featuredImage: featuredImageData
        };

        console.log('✏️ Create blog data:', blogData);
        const response = await blogService.createBlog(blogData);
        console.log('✏️ Create response:', response);
        toast.success('Tạo bài viết mới thành công');
      }

      console.log('✏️ Refreshing blogs list...');
      await fetchBlogs();
      console.log('✏️ Closing editor...');
      setShowEditor(false);
      setEditingBlog(null);
      setNewBlog({
        title: '',
        content: '',
        excerpt: '',
        status: 'draft',
        category: '',
        tags: [],
        readTime: '',
        isFeatured: false,
        featuredImage: {
          url: '',
          alt: ''
        }
      });
      console.log('✏️ saveNewBlog completed successfully');
    } catch (error: any) {
      console.error('✏️ Error in saveNewBlog:', error);
      
      // Enhanced error handling
      let errorMessage = 'Có lỗi xảy ra khi lưu bài viết';
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        console.log('✏️ Update error details:', {
          status,
          data,
          blogId: editingBlog?.id,
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers
        });
        
        switch (status) {
          case 401:
            errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
            logout();
            break;
          case 403:
            errorMessage = 'Bạn không có quyền chỉnh sửa bài viết này.';
            break;
          case 400:
            errorMessage = data?.message || 'Dữ liệu không hợp lệ.';
            break;
          case 404:
            errorMessage = 'Bài viết không tồn tại.';
            break;
          case 500:
            errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
            break;
          default:
            errorMessage = data?.message || data?.error || errorMessage;
        }
      } else if (error.request) {
        console.log('✏️ Network error - no response received:', error.request);
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
      } else {
        console.log('✏️ General error:', error.message);
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditBlog = (blog: BlogData) => {
    console.log('✏️ handleEditBlog called with blog:', blog);
    console.log('✏️ Blog author ID:', blog.authorId);
    console.log('✏️ Current user ID:', currentUser?.id);
    console.log('✏️ User can manage all blogs:', canManageAllBlogs);
    console.log('✏️ Blog tags type:', typeof blog.tags, 'Value:', blog.tags);
    
    setEditingBlog(blog);
    
    // Convert tags from string to array if needed
    let tagsArray: string[] = [];
    if (typeof blog.tags === 'string') {
      console.log('✏️ Converting tags from string to array');
      tagsArray = blog.tags ? (blog.tags as string).split(',').map(tag => tag.trim()) : [];
    } else if (Array.isArray(blog.tags)) {
      console.log('✏️ Tags is already array');
      tagsArray = blog.tags;
    } else {
      console.log('✏️ Tags is not string or array, setting empty array');
      tagsArray = [];
    }
    
    const editData = {
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      status: blog.status,
      category: blog.category,
      tags: tagsArray,
      readTime: blog.readTime,
      isFeatured: blog.isFeatured,
      featuredImage: blog.featuredImage
    };
    
    console.log('✏️ Setting newBlog state with:', editData);
    console.log('✏️ Tags converted to:', editData.tags);
    setNewBlog(editData);
    setShowEditor(true);
    console.log('✏️ Editor opened for editing');
  };

  const handlePreviewBlog = useCallback((blog: BlogData | BlogFormData) => {
    try {
      // Delay to ensure previous dialog is fully closed
      setTimeout(() => {
        setPreviewBlog(blog as BlogData);
        setShowPreview(true);
      }, 100);
    } catch (error) {
      console.error('Error setting preview blog:', error);
      toast.error('Không thể xem trước bài viết');
    }
  }, []);

  const handleClosePreview = useCallback((open: boolean) => {
    if (!open) {
      try {
        setShowPreview(false);
        // Clear preview data after animation completes
        setTimeout(() => {
          setPreviewBlog(null);
        }, 300);
      } catch (error) {
        console.error('Error closing preview:', error);
      }
    }
  }, []);

  const handleCloseEditor = useCallback(() => {
    try {
      setShowEditor(false);
      setEditingBlog(null);
      // Clear editor data after animation completes
      setTimeout(() => {
        setNewBlog({
          title: '',
          content: '',
          excerpt: '',
          status: 'draft',
          category: '',
          tags: [],
          readTime: '',
          isFeatured: false,
          featuredImage: {
            url: '',
            alt: ''
          }
        });
      }, 150);
    } catch (error) {
      console.error('Error closing editor:', error);
    }
  }, []);

  const handleDeleteBlog = async (id: string) => {
    console.log('🗑️ handleDeleteBlog called with ID:', id);
    console.log('🗑️ Current blogs count before delete:', blogs.length);
    console.log('🗑️ Blog to delete exists in list:', blogs.find(b => b.id === id) ? 'YES' : 'NO');
    
    setConfirmDialogConfig({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc chắn muốn xóa bài viết này?',
      onConfirm: async () => {
        console.log('🗑️ Delete confirmed, starting deletion process...');
        try {
          setLoading(true);
          console.log('🗑️ Loading state set to true');
          console.log('🗑️ Attempting to delete blog with ID:', id);
          
          // Check if user has access token
          const token = localStorage.getItem('accessToken');
          console.log('🗑️ Access token available:', !!token);
          console.log('🗑️ Token preview:', token?.substring(0, 30) + '...');
          
          console.log('🗑️ Calling blogService.deleteBlog...');
          await blogService.deleteBlog(id);
          console.log('🗑️ blogService.deleteBlog completed successfully');
          
          toast.success('Xóa bài viết thành công');
          console.log('🗑️ Success toast shown');
          
          console.log('🗑️ Calling fetchBlogs to refresh list...');
          await fetchBlogs();
          console.log('🗑️ fetchBlogs completed');
          console.log('🗑️ New blogs count after refresh:', blogs.length);
          
        } catch (error: any) {
          console.error('🗑️ Error deleting blog:', error);
          
          // Enhanced error handling
          let errorMessage = 'Có lỗi xảy ra khi xóa bài viết';
          
          if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            
            console.log('🗑️ Delete error details:', {
              status,
              data,
              blogId: id,
              url: error.config?.url,
              method: error.config?.method,
              headers: error.config?.headers
            });
            
            switch (status) {
              case 401:
                errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
                logout();
                break;
              case 403:
                errorMessage = 'Bạn không có quyền xóa bài viết này.';
                break;
              case 404:
                errorMessage = 'Bài viết không tồn tại hoặc đã bị xóa.';
                break;
              case 500:
                errorMessage = 'Lỗi server. Vui lòng thử lại sau.';
                break;
              default:
                errorMessage = data?.message || data?.error || errorMessage;
            }
          } else if (error.request) {
            console.log('🗑️ Network error - no response received:', error.request);
            errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
          } else {
            console.log('🗑️ General error:', error.message);
            errorMessage = error.message || errorMessage;
          }
          
          toast.error(errorMessage);
        } finally {
          console.log('🗑️ Setting loading to false...');
          setLoading(false);
          console.log('🗑️ Delete process completed');
        }
      }
    });
    console.log('🗑️ Confirm dialog config set, opening dialog...');
    console.log('🗑️ Current confirmDialogOpen state:', confirmDialogOpen);
    setConfirmDialogOpen(true);
    console.log('🗑️ setConfirmDialogOpen(true) called');
    
    // Log after a short delay to see if state updated
    setTimeout(() => {
      console.log('🗑️ confirmDialogOpen state after update:', confirmDialogOpen);
    }, 100);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchQuery.trim()) {
        const results = await blogService.searchBlogs(searchQuery);
        setBlogs(results);
      } else {
        await fetchBlogs();
      }
    } catch (error) {
      console.error('Error searching blogs:', error);
      toast.error('Có lỗi xảy ra khi tìm kiếm');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (blobInfo: any) => {
    try {
      const { url } = await blogService.uploadImage(blobInfo.blob());
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Không thể tải lên hình ảnh');
      throw error;
    }
  };

  const handleFeaturedChange = async (checked: boolean) => {
    console.log('⭐ handleFeaturedChange called with checked:', checked);
    console.log('⭐ editingBlog:', editingBlog);
    console.log('⭐ Current blogs:', blogs.map(b => ({ id: b.id, title: b.title, isFeatured: b.isFeatured })));
    
    if (!checked) {
      console.log('⭐ Unchecking featured, setting to false');
      // Nếu bỏ featured, không cần xác nhận
      setNewBlog(prev => ({ ...prev, isFeatured: false }));
      return;
    }

    console.log('⭐ Checking for existing featured blog...');
    // Kiểm tra xem có bài viết featured nào khác không
    const currentFeaturedBlog = blogs.find(blog => blog.isFeatured && blog.id !== editingBlog?.id);
    console.log('⭐ Current featured blog found:', currentFeaturedBlog);
    
    if (currentFeaturedBlog) {
      console.log('⭐ Found existing featured blog, showing confirmation dialog');
      setConfirmDialogConfig({
        title: 'Xác nhận thay đổi bài viết nổi bật',
        message: `Bài viết "${currentFeaturedBlog.title}" hiện đang là bài viết nổi bật. Bạn có muốn thay thế bằng bài viết này không?`,
        onConfirm: async () => {
          try {
            console.log('⭐ Featured change confirmed, updating old featured blog');
            setLoading(true);
            // Unset featured cho bài viết cũ
            console.log('⭐ Unsetting featured for blog:', currentFeaturedBlog.id);
            await blogService.updateBlog(currentFeaturedBlog.id, {
              isFeatured: false
            });
            console.log('⭐ Old featured blog updated, setting new blog as featured');
            // Set featured cho bài viết mới
            setNewBlog(prev => ({ ...prev, isFeatured: true }));
            toast.success('Đã cập nhật bài viết nổi bật');
            console.log('⭐ Featured change completed successfully');
          } catch (error) {
            console.error('⭐ Error updating featured blog:', error);
            toast.error('Có lỗi xảy ra khi cập nhật bài viết nổi bật');
            // Revert checkbox state
            setNewBlog(prev => ({ ...prev, isFeatured: false }));
          } finally {
            setLoading(false);
          }
        }
      });
      setConfirmDialogOpen(true);
    } else {
      console.log('⭐ No existing featured blog found, setting directly');
      // Nếu không có bài viết featured nào khác, set trực tiếp
      setNewBlog(prev => ({ ...prev, isFeatured: true }));
    }
  };

  // Debug effect for confirmDialogOpen state
  useEffect(() => {
    console.log('🗑️ confirmDialogOpen state changed to:', confirmDialogOpen);
    console.log('🗑️ confirmDialogConfig:', confirmDialogConfig);
  }, [confirmDialogOpen, confirmDialogConfig]);



  // Cleanup effect for dialog states
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      setShowPreview(false);
      setShowEditor(false);
      setConfirmDialogOpen(false);
      setPreviewBlog(null);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-4">
        <div className="text-2xl font-bold text-gray-700 mb-2">Vui lòng đăng nhập</div>
        <p className="text-gray-500">Bạn cần đăng nhập để truy cập trang này.</p>
      </div>
    );
  }

  if (showEditor) {
    return (
      <>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              {editingBlog ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
            </h1>
            <button
              onClick={handleCloseEditor}
              className="text-gray-600 hover:text-gray-800"
            >
              Quay lại
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={newBlog.title}
                  onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung
                </label>
                <Editor
                  tinymceScriptSrc="/tinymce/tinymce.js"
                  onInit={(evt, editor) => editorRef.current = editor}
                  value={newBlog.content}
                  onEditorChange={(content) => setNewBlog({...newBlog, content})}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    skin: 'oxide',
                    content_css: 'default',
                    images_upload_handler: handleImageUpload
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tóm tắt
                </label>
                <textarea
                  value={newBlog.excerpt}
                  onChange={(e) => setNewBlog({...newBlog, excerpt: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Nhập tóm tắt bài viết"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thời gian đọc
                  </label>
                  <input
                    type="text"
                    value={newBlog.readTime}
                    onChange={(e) => setNewBlog({...newBlog, readTime: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="VD: 5 phút đọc"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={newBlog.category}
                    onChange={(e) => setNewBlog({...newBlog, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (phân cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={Array.isArray(newBlog.tags) ? newBlog.tags.join(', ') : ''}
                  onChange={(e) => {
                    const tagsString = e.target.value;
                    const tagsArray = tagsString ? tagsString.split(',').map(tag => tag.trim()) : [];
                    setNewBlog({...newBlog, tags: tagsArray});
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="VD: AI, Marketing, Technology"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh đại diện
                </label>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newBlog.featuredImage.url}
                    onChange={(e) => setNewBlog(prev => ({
                      ...prev,
                      featuredImage: {
                        ...prev.featuredImage,
                        url: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập URL ảnh đại diện"
                  />
                  <input
                    type="text"
                    value={newBlog.featuredImage.alt}
                    onChange={(e) => setNewBlog(prev => ({
                      ...prev,
                      featuredImage: {
                        ...prev.featuredImage,
                        alt: e.target.value
                      }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Mô tả ảnh (alt text)"
                  />
                  {newBlog.featuredImage.url && (
                    <div className="mt-2">
                      <img
                        src={newBlog.featuredImage.url}
                        alt={newBlog.featuredImage.alt}
                        className="max-w-xs rounded-lg shadow-md"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trạng thái
                </label>
                <div className="space-y-4">
                  <select
                    value={newBlog.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as 'draft' | 'published';
                      setNewBlog(prev => ({
                        ...prev,
                        status: newStatus
                      }));
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    disabled={!canManageAllBlogs && editingBlog?.authorId !== currentUser?.id}
                  >
                    <option value="draft">Bản nháp</option>
                    <option value="published">Đã xuất bản</option>
                  </select>

                  {newBlog.status === 'published' && (
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={newBlog.isFeatured}
                        onChange={(e) => handleFeaturedChange(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="isFeatured" className="text-sm text-gray-700">
                        Đặt làm bài viết nổi bật
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleSaveBlog}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Đang xử lý...' : (editingBlog ? 'Cập nhật' : 'Đăng bài')}
                </button>
                <button
                  onClick={() => handlePreviewBlog(newBlog)}
                  disabled={loading}
                  className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  Xem trước
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Dialog for Editor View */}
        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmDialogConfig.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialogConfig.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                try {
                  console.log('🗑️ Dialog cancelled');
                  if (confirmDialogConfig.title.includes('nổi bật')) {
                    // If canceling featured blog change, revert the checkbox
                    setNewBlog(prev => ({ ...prev, isFeatured: false }));
                  }
                  setConfirmDialogOpen(false);
                } catch (error) {
                  console.error('Error closing dialog:', error);
                  setConfirmDialogOpen(false);
                }
              }}>
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  try {
                    console.log('🗑️ Dialog confirmed, calling onConfirm...');
                    setConfirmDialogOpen(false);
                    confirmDialogConfig.onConfirm();
                  } catch (error) {
                    console.error('Error confirming dialog:', error);
                    setConfirmDialogOpen(false);
                  }
                }}
              >
                Xác nhận
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  return (
    <DialogErrorBoundary>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Blog</h1>
          <button
            onClick={() => setShowEditor(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo bài viết</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{blogs.length} bài viết</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Tiêu đề</th>
                  <th className="text-left py-3 px-4">Tác giả</th>
                  <th className="text-left py-3 px-4">Trạng thái</th>
                  <th className="text-left py-3 px-4">Ngày đăng</th>
                  <th className="text-left py-3 px-4">Lượt xem</th>
                  <th className="text-left py-3 px-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-b">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-4">
                        {blog.featuredImage?.url ? (
                          <img
                            src={blog.featuredImage.url}
                            alt={blog.featuredImage.alt}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{blog.title}</p>
                          <p className="text-sm text-gray-600">{blog.excerpt.substring(0, 100)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{blog.author.fullName}</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          blog.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                        </span>
                        {blog.isFeatured && (
                          <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                            Bài viết nổi bật
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-600">{blog.views}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {(canManageAllBlogs || blog.authorId === currentUser?.id) && (
                          <>
                            <button
                              onClick={() => handleEditBlog(blog)}
                              disabled={loading}
                              className="text-blue-600 hover:text-blue-800 disabled:opacity-50"
                              title="Chỉnh sửa bài viết"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlog(blog.id)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-800 disabled:opacity-50"
                              title="Xóa bài viết"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handlePreviewBlog(blog)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preview Dialog with Error Boundary */}
        {showPreview && (
          <DialogErrorBoundary>
            <SimpleModal 
              isOpen={showPreview} 
              onClose={() => handleClosePreview(false)}
              title="Xem trước bài viết"
            >
              {previewBlog ? (
                <div className="space-y-6">
                  {previewBlog.featuredImage?.url && (
                    <div className="relative rounded-lg overflow-hidden">
                      <img 
                        src={previewBlog.featuredImage.url} 
                        alt={previewBlog.featuredImage.alt || ''}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', previewBlog.featuredImage?.url);
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                        {previewBlog.category || 'Chưa phân loại'}
                      </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">{previewBlog.title || 'Tiêu đề chưa có'}</h1>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>{previewBlog.author?.fullName || previewBlog.authorId || 'Admin'}</span>
                      </div>
                      {previewBlog.createdAt && (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{new Date(previewBlog.createdAt).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{previewBlog.readTime || '5 min'}</span>
                      </div>
                    </div>

                    {previewBlog.tags && previewBlog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {previewBlog.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="prose max-w-none">
                      {previewBlog.excerpt && (
                        <p className="text-gray-600 italic border-l-4 border-blue-500 pl-4">
                          {previewBlog.excerpt}
                        </p>
                      )}
                      {previewBlog.content && (
                        <div 
                          dangerouslySetInnerHTML={{ __html: previewBlog.content }}
                          style={{ wordBreak: 'break-word' }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Không có nội dung để xem trước</p>
                </div>
              )}
            </SimpleModal>
          </DialogErrorBoundary>
        )}

        {/* Confirmation Dialog for Main View (Delete, etc.) */}
        <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{confirmDialogConfig.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {confirmDialogConfig.message}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => {
                try {
                  console.log('🗑️ Dialog cancelled');
                  if (confirmDialogConfig.title.includes('nổi bật')) {
                    // If canceling featured blog change, revert the checkbox
                    setNewBlog(prev => ({ ...prev, isFeatured: false }));
                  }
                  setConfirmDialogOpen(false);
                } catch (error) {
                  console.error('Error closing dialog:', error);
                  setConfirmDialogOpen(false);
                }
              }}>
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  try {
                    console.log('🗑️ Dialog confirmed, calling onConfirm...');
                    setConfirmDialogOpen(false);
                    confirmDialogConfig.onConfirm();
                  } catch (error) {
                    console.error('Error confirming dialog:', error);
                    setConfirmDialogOpen(false);
                  }
                }}
              >
                Xác nhận
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DialogErrorBoundary>
  );
};

export default BlogManager;
