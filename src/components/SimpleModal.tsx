import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
}

const SimpleModal: React.FC<SimpleModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '1024px',
  maxHeight = '80vh'
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
      style={{ backdropFilter: 'blur(2px)' }}
    >
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl w-full overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
        style={{ 
          maxWidth, 
          maxHeight
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          {title && (
            <h2 className="text-xl font-semibold text-gray-900">
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="p-6 overflow-y-auto"
          style={{ maxHeight: 'calc(80vh - 120px)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SimpleModal; 