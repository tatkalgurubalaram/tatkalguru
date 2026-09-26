import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export const Breadcrumb: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-small text-muted" style={{ flexWrap: 'wrap' }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link to={item.href} style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="hover:text-heading transition">
                {item.label}
              </Link>
            ) : (
              <span style={{ color: 'var(--text-heading)', fontWeight: 500 }} aria-current="page">
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight size={14} style={{ margin: '0 4px' }} />}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
