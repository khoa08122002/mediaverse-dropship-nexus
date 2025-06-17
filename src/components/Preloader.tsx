import React from 'react';

interface PreloaderProps {
  onLoadingComplete?: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onLoadingComplete }) => {
  React.useEffect(() => {
    onLoadingComplete?.();
  }, [onLoadingComplete]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>
  );
};

export default Preloader;