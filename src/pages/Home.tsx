import React, { useEffect } from 'react';
import { PageTransition } from '../components/PageTransition';
import { config } from '../config';

import { HeroSection } from '../components/home/HeroSection';
import { TrustIndicators } from '../components/home/TrustIndicators';
import { CategorySection } from '../components/home/CategorySection';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { TechnologySection } from '../components/home/TechnologySection';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { HowItWorks } from '../components/home/HowItWorks';
import { SecuritySection } from '../components/home/SecuritySection';
import { FAQSection } from '../components/home/FAQSection';
import { FinalCTA } from '../components/home/FinalCTA';

export const Home: React.FC = () => {
  useEffect(() => {
    document.title = `Digital Products & Technology Solutions | ${config.brandName}`;
  }, []);

  return (
    <PageTransition>
      <HeroSection />
      <TrustIndicators />
      <CategorySection />
      <FeaturedProducts />
      <TechnologySection />
      <WhyChooseUs />
      <HowItWorks />
      <SecuritySection />
      <FAQSection />
      <FinalCTA />
    </PageTransition>
  );
};
