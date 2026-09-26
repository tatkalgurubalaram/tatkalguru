export type ProductCategory = 'software' | 'vps' | 'proxy' | 'combo';
export type ProductAvailability = 'in_stock' | 'out_of_stock' | 'coming_soon';
export type ProductBadge = 'POPULAR' | 'SALE' | 'BEST VALUE' | 'NEW';
export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface ProductVariant {
  id: string;
  name: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  availability: ProductAvailability;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description?: string;
  category: ProductCategory;
  image?: string;
  images?: string[];
  price?: number;
  originalPrice?: number;
  currency: string;
  badge?: ProductBadge;
  badgeVariant?: BadgeVariant;
  rating?: number;
  reviewCount?: number;
  availability: ProductAvailability;
  featured?: boolean;
  
  features?: string[];
  specifications?: Record<string, string>;
  requirements?: string[];
  deliveryInfo?: string;
  faqs?: { question: string; answer: string }[];
  variants?: ProductVariant[];
}
