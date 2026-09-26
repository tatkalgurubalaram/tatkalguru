import React from 'react';
import type { BreadcrumbItem } from './ui/Breadcrumb';
import { Breadcrumb } from './ui/Breadcrumb';

export interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  breadcrumbs?: BreadcrumbItem[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, eyebrow, breadcrumbs }) => {
  return (
    <div style={{ marginBottom: 'var(--space-8)' }}>
      {breadcrumbs && <div style={{ marginBottom: 'var(--space-4)' }}><Breadcrumb items={breadcrumbs} /></div>}
      {eyebrow && <div className="text-small" style={{ color: 'var(--color-primary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 'var(--space-2)' }}>{eyebrow}</div>}
      <h1 className="hero-heading" style={{ marginBottom: 'var(--space-2)' }}>{title}</h1>
      {description && <p className="text-body text-muted" style={{ maxWidth: '600px', fontSize: 'var(--font-size-card)' }}>{description}</p>}
    </div>
  );
};
