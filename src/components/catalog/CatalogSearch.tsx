import React from 'react';
import { Search } from 'lucide-react';

interface CatalogSearchProps {
  value: string;
  onChange: (val: string) => void;
}

export const CatalogSearch: React.FC<CatalogSearchProps> = ({ value, onChange }) => {
  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: 'var(--space-6)' }}>
      <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
      <input
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field"
        style={{ paddingLeft: '48px', height: '56px', fontSize: '16px' }}
        aria-label="Search products"
      />
    </div>
  );
};
