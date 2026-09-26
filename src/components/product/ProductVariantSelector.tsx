import React from 'react';
import type { ProductVariant } from '../../types/product';
import { formatCurrency } from '../../utils/currency';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedId: string;
  currency: string;
  onSelect: (id: string) => void;
}

export const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({ variants, selectedId, currency, onSelect }) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Choose an option</label>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(140px, 100%), 1fr))', gap: 'var(--space-3)' }}>
        {variants.map(v => (
          <button
            key={v.id}
            onClick={() => onSelect(v.id)}
            style={{
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-card)',
              border: selectedId === v.id ? '2px solid var(--color-primary)' : '1px solid var(--border-light)',
              backgroundColor: selectedId === v.id ? 'var(--color-primary-light)' : 'var(--color-surface)',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontWeight: 600, color: selectedId === v.id ? 'var(--color-primary-dark)' : 'var(--text-heading)' }}>{v.name}</span>
            {v.price !== undefined && (
              <span style={{ fontSize: '14px', color: selectedId === v.id ? 'var(--color-primary)' : 'var(--text-muted)' }}>
                {formatCurrency(v.price, currency)}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
