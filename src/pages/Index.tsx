
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import TestimonialSection from '../components/TestimonialSection';
import SubsidiarySection from '../components/SubsidiarySection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <TestimonialSection />
        <SubsidiarySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
