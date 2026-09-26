import React from 'react';
import type { Product } from '../../types/product';
import { ProductCard } from '../ui/ProductCard';
import { SearchX } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ProductGridProps {
  products: Product[];
  onClearFilters: () => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onClearFilters }) => {
  if (products.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16) 0', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'var(--color-bg)', padding: 'var(--space-6)', borderRadius: '50%', marginBottom: 'var(--space-6)' }}>
          <SearchX size={48} color="var(--text-muted)" />
        </div>
        <h3 className="card-heading" style={{ marginBottom: 'var(--space-2)' }}>No products found</h3>
        <p className="text-muted text-body" style={{ marginBottom: 'var(--space-6)', maxWidth: '400px' }}>
          We couldn't find products matching your current filters. Try a different search term or clear your filters.
        </p>
        <Button variant="secondary" onClick={onClearFilters}>Clear Filters</Button>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
      gap: 'var(--space-6)' 
    }}>
      {products.map((prod, i) => (
        <motion.div
          key={prod.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
        >
          <div style={{ height: '100%' }}>
            {/* We link directly over the whole card area for a better UX, or change View Product to a Link inside ProductCard */}
            <Link to={`/products/${prod.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
              <ProductCard 
                image={prod.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop&blur=50'}
                title={prod.name}
                description={prod.shortDescription}
                price={prod.price ?? (prod.availability === 'coming_soon' ? 'Coming Soon' as any : 'N/A' as any)}
                originalPrice={prod.originalPrice}
                rating={prod.rating || 0}
                reviews={prod.reviewCount || 0}
                badge={prod.badge}
                badgeVariant={prod.badgeVariant}
              />
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
