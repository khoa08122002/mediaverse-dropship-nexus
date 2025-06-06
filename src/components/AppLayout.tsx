import React, { useEffect, memo } from 'react';
import Header from './Header';
import Footer from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = memo(({ children }) => {
  useEffect(() => {
    return () => {
      // Cleanup function
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow relative">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
});

AppLayout.displayName = 'AppLayout';

export default AppLayout; 