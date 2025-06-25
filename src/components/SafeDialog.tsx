import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface SafeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  maxWidth?: string;
  maxHeight?: string;
}

const SafeDialog: React.FC<SafeDialogProps> = ({
  open,
  onOpenChange,
  title,
  children,
  className = "max-w-4xl max-h-[80vh] overflow-y-auto",
  maxWidth,
  maxHeight
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Safe state management with delays
  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsOpen(false);
      // Longer delay to ensure animation completes before unmount
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleOpenChange = useCallback((newOpen: boolean) => {
    try {
      if (!newOpen) {
        setIsOpen(false);
        setTimeout(() => {
          onOpenChange(false);
        }, 150);
      } else {
        onOpenChange(true);
      }
    } catch (error) {
      console.error('Error in SafeDialog openChange:', error);
      onOpenChange(false);
    }
  }, [onOpenChange]);

  // Don't render anything if not needed
  if (!shouldRender) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={className} style={{ maxWidth, maxHeight }}>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default SafeDialog; 