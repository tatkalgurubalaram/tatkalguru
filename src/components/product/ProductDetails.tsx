import React, { useState } from 'react';
import { Check } from 'lucide-react';
import type { Product } from '../../types/product';

interface ProductDetailsProps {
  product: Product;
}

type TabId = 'description' | 'features' | 'specifications' | 'requirements' | 'delivery';

export const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const tabs: { id: TabId; label: string }[] = [];
  
  tabs.push({ id: 'description', label: 'Description' });
  if (product.features && product.features.length > 0) tabs.push({ id: 'features', label: 'Features' });
  if (product.specifications && Object.keys(product.specifications).length > 0) tabs.push({ id: 'specifications', label: 'Specifications' });
  if (product.requirements && product.requirements.length > 0) tabs.push({ id: 'requirements', label: 'Requirements' });
  if (product.deliveryInfo) tabs.push({ id: 'delivery', label: 'Delivery' });

  const [activeTab, setActiveTab] = useState<TabId>(tabs[0].id);

  return (
    <div style={{ marginTop: 'var(--space-12)' }}>
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 'var(--space-6)', borderBottom: '1px solid var(--border-light)', overflowX: 'auto', marginBottom: 'var(--space-8)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: 'var(--space-3) 0',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '16px',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--text-muted)',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s, border-color 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: '200px' }}>
        {activeTab === 'description' && (
          <div style={{ lineHeight: 1.6, color: 'var(--text-muted)' }}>
            {product.description || "Detailed product information will be available soon."}
          </div>
        )}

        {activeTab === 'features' && product.features && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
            {product.features.map((f, i) => (
              <li key={i} className="flex items-center gap-3" style={{ color: 'var(--text-heading)' }}>
                <div style={{ backgroundColor: 'var(--color-primary-light)', padding: '4px', borderRadius: '50%' }}>
                  <Check size={16} color="var(--color-primary-dark)" />
                </div>
                {f}
              </li>
            ))}
          </ul>
        )}

        {activeTab === 'specifications' && product.specifications && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-2)' }}>
            {Object.entries(product.specifications).map(([key, val], i) => (
              <div key={i} style={{ display: 'flex', padding: 'var(--space-3)', backgroundColor: i % 2 === 0 ? 'var(--color-surface)' : 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontWeight: 600, width: '40%' }}>{key}</div>
                <div style={{ color: 'var(--text-muted)', width: '60%' }}>{val}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'requirements' && product.requirements && (
          <ul style={{ paddingLeft: 'var(--space-4)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {product.requirements.map((req, i) => (
              <li key={i} style={{ marginBottom: 'var(--space-2)' }}>{req}</li>
            ))}
          </ul>
        )}

        {activeTab === 'delivery' && product.deliveryInfo && (
          <div style={{ lineHeight: 1.6, color: 'var(--text-muted)' }}>
            {product.deliveryInfo}
          </div>
        )}
      </div>
    </div>
  );
};
