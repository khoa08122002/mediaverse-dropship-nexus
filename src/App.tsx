import React, { Suspense } from 'react';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route, Outlet, useLocation } from "react-router-dom";
import { Toaster } from 'sonner';
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import { AuthProvider } from "./contexts/AuthContext";
import ContactManager from './components/admin/ContactManager';
import ErrorBoundary from './components/ErrorBoundary';
import ApplicantProfile from './components/admin/ApplicantProfile';
import Index from './pages/Index';
import About from './pages/About';
import MediaServices from './pages/MediaServices';
import Ecommerce from './pages/Ecommerce';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Recruitment from './pages/Recruitment';
import Admin from './pages/Admin';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ApplicantManager from './components/admin/ApplicantManager';

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  },
});

// Loading Component with timeout
const LoadingFallback = () => {
  const [isTimeout, setIsTimeout] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsTimeout(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (isTimeout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-semibold mb-2">Tải quá lâu</h2>
        <p className="text-gray-600 mb-4">Có thể có vấn đề với kết nối. Vui lòng thử lại.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
};

// Root Layout Component with key prop
const RootLayout = () => {
  const location = useLocation();
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TooltipProvider>
          <AppLayout>
            <Suspense fallback={<LoadingFallback />}>
              <div key={location.pathname}>
                <Outlet />
              </div>
            </Suspense>
          </AppLayout>
          <Toaster position="top-right" />
        </TooltipProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

// Admin Layout Component with error boundary
const AdminLayout = () => {
  return (
    <ErrorBoundary>
      <ProtectedRoute>
        <Suspense fallback={<LoadingFallback />}>
          <Outlet />
        </Suspense>
      </ProtectedRoute>
    </ErrorBoundary>
  );
};

// Configure router with future flags
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<RootLayout />}>
      <Route path="/" element={<Index />} errorElement={<ErrorBoundary><NotFound /></ErrorBoundary>} />
      <Route path="/about" element={<About />} errorElement={<ErrorBoundary><NotFound /></ErrorBoundary>} />
      <Route path="/media-services" element={<MediaServices />} errorElement={<ErrorBoundary><NotFound /></ErrorBoundary>} />
      <Route path="/ecommerce" element={<Ecommerce />} errorElement={<ErrorBoundary><NotFound /></ErrorBoundary>} />
      <Route path="/blog" element={<Blog />} errorElement={<ErrorBoundary><NotFound /></ErrorBoundary>} />
      <Route path="/blog/:slug" element={<BlogDetail />} errorElement={<ErrorBoundary><NotFound /></ErrorBoundary>} />
      <Route path="/contact" element={<Contact />} errorElement={<ErrorBoundary><NotFound /></ErrorBoundary>} />
      <Route path="/recruitment" element={<Recruitment />} errorElement={<ErrorBoundary><NotFound /></ErrorBoundary>} />
      <Route path="/admin" element={<AdminLayout />} errorElement={<ErrorBoundary><NotFound /></ErrorBoundary>}>
        <Route index element={<Admin />} />
        <Route path="contacts" element={<ContactManager />} />
        <Route path="applicants">
          <Route index element={<ApplicantManager />} />
          <Route path=":id" element={<ApplicantProfile />} />
        </Route>
      </Route>
      <Route path="/login" element={<Login />} errorElement={<ErrorBoundary><NotFound /></ErrorBoundary>} />
      <Route path="*" element={<NotFound />} />
    </Route>
  ),
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true
    }
  }
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider 
        router={router} 
        future={{
          v7_startTransition: true
        }}
      />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;
