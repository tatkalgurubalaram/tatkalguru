import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (qty: number) => void;
  max?: number;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onChange, max }) => {
  const handleDec = () => {
    if (quantity > 1) onChange(quantity - 1);
  };
  const handleInc = () => {
    if (!max || quantity < max) onChange(quantity + 1);
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-surface)' }}>
      <button 
        onClick={handleDec}
        disabled={quantity <= 1}
        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: quantity <= 1 ? 'not-allowed' : 'pointer', opacity: quantity <= 1 ? 0.5 : 1, color: 'var(--text-heading)' }}
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      <div style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, borderLeft: '1px solid var(--border-light)', borderRight: '1px solid var(--border-light)' }}>
        {quantity}
      </div>
      <button 
        onClick={handleInc}
        disabled={max !== undefined && quantity >= max}
        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: max !== undefined && quantity >= max ? 'not-allowed' : 'pointer', opacity: max !== undefined && quantity >= max ? 0.5 : 1, color: 'var(--text-heading)' }}
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};
