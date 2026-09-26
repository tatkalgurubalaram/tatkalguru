import type { Product } from '../types/product';

export interface CartItem {
  id: string; // Composite ID: productId + '-' + (variantId || 'default')
  productId: string;
  productSlug: string;
  productName: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  variantId?: string;
  variantName?: string;
  currency: string;
}

export const getCartItemId = (productId: string, variantId?: string): string => {
  return `${productId}-${variantId || 'default'}`;
};

export const getActivePrice = (product: Product, variantId?: string): number | undefined => {
  if (variantId && product.variants) {
    const variant = product.variants.find(v => v.id === variantId);
    if (variant && variant.price !== undefined) return variant.price;
  }
  return product.price;
};

export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
};

export const calculateDiscount = (_items: CartItem[]): number => {
  return 0; // Stage 6 placeholder
};

export const calculateTotal = (items: CartItem[]): number => {
  return calculateSubtotal(items) - calculateDiscount(items);
};

export const getTotalQuantity = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};
