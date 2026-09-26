import type { Product } from '../types/product';

export interface CatalogState {
  search: string;
  category: string; // 'all' or actual category
  availability: string; // 'all', 'in_stock', 'out_of_stock', 'coming_soon'
  priceRange: string; // 'all', 'under-500', '500-1000', '1000-2500', 'over-2500'
  sort: string; // 'featured', 'newest', 'price-low', 'price-high', 'name-asc', 'name-desc'
  page: number;
}

export const PRODUCTS_PER_PAGE = 8;

export function filterProducts(products: Product[], state: CatalogState): Product[] {
  let filtered = [...products];

  // Search
  if (state.search.trim()) {
    const q = state.search.toLowerCase().trim();
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.shortDescription.toLowerCase().includes(q)
    );
  }

  // Category
  if (state.category !== 'all') {
    filtered = filtered.filter(p => p.category === state.category);
  }

  // Availability
  if (state.availability !== 'all') {
    filtered = filtered.filter(p => p.availability === state.availability);
  }

  // Price
  if (state.priceRange !== 'all') {
    filtered = filtered.filter(p => {
      const price = p.price || 0;
      switch (state.priceRange) {
        case 'under-500': return price > 0 && price < 500;
        case '500-1000': return price >= 500 && price <= 1000;
        case '1000-2500': return price > 1000 && price <= 2500;
        case 'over-2500': return price > 2500;
        default: return true;
      }
    });
  }

  return filtered;
}

export function sortProducts(products: Product[], sort: string): Product[] {
  const sorted = [...products];

  switch (sort) {
    case 'price-low':
      sorted.sort((a, b) => {
        if (a.price === undefined && b.price === undefined) return 0;
        if (a.price === undefined) return 1;
        if (b.price === undefined) return -1;
        return a.price - b.price;
      });
      break;
    case 'price-high':
      sorted.sort((a, b) => {
        if (a.price === undefined && b.price === undefined) return 0;
        if (a.price === undefined) return 1;
        if (b.price === undefined) return -1;
        return b.price - a.price;
      });
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'featured':
    default:
      // Keep original order, prioritize featured if any
      sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
      break;
  }

  return sorted;
}

export function paginateProducts(products: Product[], page: number, perPage: number): Product[] {
  const start = (page - 1) * perPage;
  return products.slice(start, start + perPage);
}
