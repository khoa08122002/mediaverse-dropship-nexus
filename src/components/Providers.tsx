import React from 'react';
import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from 'sonner';

const Providers = () => {
  return (
    <TooltipProvider>
      <AuthProvider>
        <Outlet />
        <Toaster position="top-right" expand={true} richColors />
      </AuthProvider>
    </TooltipProvider>
  );
};

export default Providers; 