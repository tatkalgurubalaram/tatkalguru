import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ProductAvailability } from '../../types/product';

interface ProductActionsProps {
  availability: ProductAvailability;
  onAddToCart: () => void;
}

export const ProductActions: React.FC<ProductActionsProps> = ({ availability, onAddToCart }) => {
  if (availability === 'coming_soon') {
    return <Button variant="secondary" disabled className="w-full" style={{ padding: '16px' }}>Coming Soon</Button>;
  }

  if (availability === 'out_of_stock') {
    return <Button variant="secondary" disabled className="w-full" style={{ padding: '16px' }}>Currently Unavailable</Button>;
  }

  return (
    <Button 
      variant="primary" 
      onClick={onAddToCart}
      className="w-full flex justify-center items-center gap-2"
      style={{ padding: '16px' }}
    >
      <ShoppingCart size={20} /> Add to Cart
    </Button>
  );
};
