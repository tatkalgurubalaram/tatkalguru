import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { FilterPanel } from './FilterPanel';
import type { CatalogState } from '../../utils/catalog';

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state: CatalogState;
  updateState: (updates: Partial<CatalogState>) => void;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({ isOpen, onClose, state, updateState }) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      <div 
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)' }} 
        onClick={onClose}
      />
      <div 
        style={{ 
          position: 'absolute', top: 0, right: 0, bottom: 0, 
          width: '85%', maxWidth: '360px', 
          backgroundColor: 'var(--color-bg)',
          display: 'flex', flexDirection: 'column'
        }}
        role="dialog"
        aria-label="Filters"
      >
        <div style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--color-surface)' }}>
          <h3 className="card-heading">Filters</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} aria-label="Close filters">
            <X size={24} />
          </button>
        </div>
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: 'var(--space-4)' }}>
          <FilterPanel state={state} updateState={updateState} />
        </div>
        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--color-surface)' }}>
          <button className="btn btn-primary w-full" onClick={onClose}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
};
