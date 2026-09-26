import React, { useEffect } from 'react';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { PageTransition } from '../components/PageTransition';
import { config } from '../config';

export const About: React.FC = () => {
  useEffect(() => {
    document.title = `About | ${config.brandName}`;
  }, []);

  return (
    <PageTransition>
      <PageContainer>
        <PageHeader 
          title="About Us" 
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'About' }
          ]}
        />
        <div style={{ maxWidth: '800px' }}>
          <p className="text-body" style={{ fontSize: '18px', marginBottom: 'var(--space-4)' }}>
            Our platform provides digital products and technology services through a modern and secure online marketplace.
          </p>
        </div>
      </PageContainer>
    </PageTransition>
  );
};
