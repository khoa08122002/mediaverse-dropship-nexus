import React from 'react';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import TestimonialSection from '../components/TestimonialSection';
import SubsidiarySection from '../components/SubsidiarySection';

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        <HeroSection />
        <ServicesSection />
        <TestimonialSection />
        <SubsidiarySection />
      </main>
    </div>
  );
};

export default Index;
