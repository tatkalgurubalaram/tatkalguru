import React from 'react';
import type { CatalogState } from '../../utils/catalog';
import { X } from 'lucide-react';

interface ActiveFiltersProps {
  state: CatalogState;
  updateState: (updates: Partial<CatalogState>) => void;
  hideCategory?: boolean;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({ state, updateState, hideCategory = false }) => {
  const activeFilters: { key: keyof CatalogState, label: string }[] = [];

  if (!hideCategory && state.category !== 'all') {
    activeFilters.push({ key: 'category', label: `Category: ${state.category}` });
  }
  if (state.availability !== 'all') {
    activeFilters.push({ key: 'availability', label: `Avail: ${state.availability}` });
  }
  if (state.priceRange !== 'all') {
    activeFilters.push({ key: 'priceRange', label: `Price: ${state.priceRange}` });
  }
  if (state.search.trim() !== '') {
    activeFilters.push({ key: 'search', label: `Search: "${state.search}"` });
  }

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex items-center gap-2" style={{ flexWrap: 'wrap', marginBottom: 'var(--space-6)' }}>
      <span className="text-small text-muted" style={{ marginRight: 'var(--space-2)' }}>Active filters:</span>
      {activeFilters.map(f => (
        <span 
          key={f.key} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--color-bg)', border: '1px solid var(--border-light)', padding: '4px 8px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 500 }}
        >
          {f.label}
          <button 
            onClick={() => updateState({ [f.key]: f.key === 'search' ? '' : 'all' })} 
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
            aria-label={`Remove ${f.label} filter`}
          >
            <X size={14} color="var(--text-muted)" />
          </button>
        </span>
      ))}
      <button 
        onClick={() => updateState({ search: '', category: hideCategory ? state.category : 'all', availability: 'all', priceRange: 'all', page: 1 })}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600, marginLeft: 'var(--space-2)' }}
      >
        Clear All
      </button>
    </div>
  );
};
