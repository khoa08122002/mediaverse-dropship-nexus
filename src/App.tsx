import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import withPreloader from "./hoc/withPreloader";
import Index from "./pages/Index";
import About from "./pages/About";
import MediaServices from "./pages/MediaServices";
import Ecommerce from "./pages/Ecommerce";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Recruitment from "./pages/Recruitment";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Wrap all pages with preloader
const PreloadedIndex = withPreloader(Index);
const PreloadedAbout = withPreloader(About);
const PreloadedMediaServices = withPreloader(MediaServices);
const PreloadedEcommerce = withPreloader(Ecommerce);
const PreloadedBlog = withPreloader(Blog);
const PreloadedBlogDetail = withPreloader(BlogDetail);
const PreloadedContact = withPreloader(Contact);
const PreloadedRecruitment = withPreloader(Recruitment);
const PreloadedAdmin = withPreloader(Admin);
const PreloadedLogin = withPreloader(Login);
const PreloadedNotFound = withPreloader(NotFound);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<PreloadedIndex />} />
              <Route path="/about" element={<PreloadedAbout />} />
              <Route path="/media-services" element={<PreloadedMediaServices />} />
              <Route path="/ecommerce" element={<PreloadedEcommerce />} />
              <Route path="/blog" element={<PreloadedBlog />} />
              <Route path="/blog/:slug" element={<PreloadedBlogDetail />} />
              <Route path="/contact" element={<PreloadedContact />} />
              <Route path="/recruitment" element={<PreloadedRecruitment />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <PreloadedAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/applicant" 
                element={
                  <ProtectedRoute>
                    <PreloadedAdmin />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<PreloadedLogin />} />
              <Route path="*" element={<PreloadedNotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
