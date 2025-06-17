import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Spline from '@splinetool/react-spline';

// Loading component that matches the page design
const LoadingScene = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl relative overflow-hidden">
    {/* Floating Orbs - matching the main page design */}
    <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
    <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
    
    <div className="relative z-10 flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      <p className="mt-4 text-gray-400 font-medium">Preparing 3D Experience...</p>
    </div>
  </div>
);

// Error boundary with matching design
class SplineErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl">
          <div className="text-center text-gray-400">
            <p className="text-lg font-medium">3D scene failed to load</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      
      {/* Floating Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-4 py-2 bg-blue-600/20 rounded-full text-blue-300 text-sm font-medium border border-blue-500/30">
                🚀 AI Marketing & E-commerce Solutions
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Tương lai của
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Truyền thông </span>
                & E-commerce
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Kết hợp sức mạnh của AI Marketing với giải pháp Dropshipping tiên tiến. 
                Tạo ra trải nghiệm khách hàng đột phá và tăng trưởng doanh thu bền vững.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">500+</div>
                <div className="text-sm text-gray-400">Dự án thành công</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">99%</div>
                <div className="text-sm text-gray-400">Khách hàng hài lòng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">24/7</div>
                <div className="text-sm text-gray-400">Hỗ trợ khách hàng</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/contact" 
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center"
              >
                Bắt đầu dự án
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/about" 
                className="border-2 border-white/20 text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-semibold text-center"
              >
                Tìm hiểu thêm
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>✓ Tư vấn miễn phí</span>
              <span>✓ Cam kết chất lượng</span>
              <span>✓ Bảo hành dài hạn</span>
            </div>
          </div>

          {/* Spline 3D Scene */}
          <div className="hidden lg:block aspect-square rounded-2xl overflow-hidden relative">
            <SplineErrorBoundary>
              <Suspense fallback={<LoadingScene />}>
                <Spline 
                  scene="https://prod.spline.design/zUQ9uRpjrb1vjK5R/scene.splinecode"
                  style={{ width: '100%', height: '100%' }}
                />
              </Suspense>
            </SplineErrorBoundary>
          </div>
        </div>
            
        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/30 rounded-full blur-xl animate-bounce delay-500"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-500/30 rounded-full blur-xl animate-bounce delay-1000"></div>
      </div>
    </section>
  );
};

export default HeroSection;
