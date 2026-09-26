import React, { useEffect } from 'react';
import { PageContainer } from '../components/PageContainer';
import { PageTransition } from '../components/PageTransition';
import { config } from '../config';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = `404 | ${config.brandName}`;
  }, []);

  return (
    <PageTransition>
      <PageContainer>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', textAlign: 'center' }}>
          <h1 style={{ fontSize: '72px', fontWeight: 800, color: 'var(--color-primary)', lineHeight: 1, marginBottom: 'var(--space-4)' }}>404</h1>
          <h2 className="section-heading" style={{ marginBottom: 'var(--space-4)' }}>Page Not Found</h2>
          <p className="text-body text-muted" style={{ marginBottom: 'var(--space-8)' }}>The page you're looking for doesn't exist.</p>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="primary">Back Home</Button>
          </Link>
        </div>
      </PageContainer>
    </PageTransition>
  );
};
