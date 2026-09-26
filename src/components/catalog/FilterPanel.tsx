import React from 'react';
import type { CatalogState } from '../../utils/catalog';

interface FilterPanelProps {
  state: CatalogState;
  updateState: (updates: Partial<CatalogState>) => void;
  hideCategory?: boolean;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ state, updateState, hideCategory = false }) => {
  const handleReset = () => {
    updateState({
      search: '',
      category: 'all',
      availability: 'all',
      priceRange: 'all',
      sort: 'featured',
      page: 1
    });
  };

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'software', label: 'Software' },
    { value: 'vps', label: 'VPS Server' },
    { value: 'proxy', label: 'Proxy' },
    { value: 'combo', label: 'Combo Packs' }
  ];

  const availabilities = [
    { value: 'all', label: 'All' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'coming_soon', label: 'Coming Soon' }
  ];

  const priceRanges = [
    { value: 'all', label: 'Any Price' },
    { value: 'under-500', label: 'Under ₹500' },
    { value: '500-1000', label: '₹500 - ₹1,000' },
    { value: '1000-2500', label: '₹1,000 - ₹2,500' },
    { value: 'over-2500', label: '₹2,500+' }
  ];

  const renderRadioGroup = (title: string, name: string, options: {value: string, label: string}[], currentValue: string, onChange: (val: string) => void) => (
    <div style={{ marginBottom: 'var(--space-6)' }}>
      <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-3)' }}>{title}</h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
        {options.map(opt => (
          <label key={opt.value} className="check-wrapper" style={{ fontWeight: 400 }}>
            <input 
              type="radio" 
              name={name} 
              className="check-input" 
              checked={currentValue === opt.value}
              onChange={() => onChange(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ padding: 'var(--space-6)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h3 className="card-heading">Filters</h3>
        <button onClick={handleReset} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 500, cursor: 'pointer' }}>Clear</button>
      </div>

      {!hideCategory && renderRadioGroup('Category', 'category', categories, state.category, (v) => updateState({ category: v }))}
      {renderRadioGroup('Availability', 'availability', availabilities, state.availability, (v) => updateState({ availability: v }))}
      {renderRadioGroup('Price', 'priceRange', priceRanges, state.priceRange, (v) => updateState({ priceRange: v }))}
      
    </div>
  );
};
