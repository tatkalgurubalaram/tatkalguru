import React from 'react';
import { PageContainer } from '../PageContainer';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

export const ProductNotFound: React.FC = () => {
  return (
    <PageContainer>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: '50%', marginBottom: 'var(--space-6)', border: '1px solid var(--border-light)' }}>
          <SearchX size={48} color="var(--text-muted)" />
        </div>
        <h2 className="section-heading" style={{ marginBottom: 'var(--space-4)' }}>Product Not Found</h2>
        <p className="text-body text-muted" style={{ marginBottom: 'var(--space-8)', maxWidth: '400px' }}>
          This product may have been removed or the URL may be incorrect.
        </p>
        <Link to="/products" style={{ textDecoration: 'none' }}>
          <Button variant="primary">Browse All Products</Button>
        </Link>
      </div>
    </PageContainer>
  );
};
