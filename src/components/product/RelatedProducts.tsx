import React from 'react';
import type { Product } from '../../types/product';
import { ProductCard } from '../ui/ProductCard';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface RelatedProductsProps {
  products: Product[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div style={{ marginTop: 'var(--space-16)', paddingTop: 'var(--space-12)', borderTop: '1px solid var(--border-light)' }}>
      <h3 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>You May Also Like</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-6)' }}>
        {products.map((prod, i) => (
          <motion.div
            key={prod.id}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
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
          </motion.div>
        ))}
      </div>
    </div>
  );
};
