import React from 'react';

interface SortSelectProps {
  value: string;
  onChange: (val: string) => void;
}

export const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Sort by:</label>
      <select 
        id="sort-select"
        className="input-field" 
        style={{ height: '40px', padding: '0 12px', minWidth: '160px', cursor: 'pointer' }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>
    </div>
  );
};
