import React from 'react';
import { motion } from 'framer-motion';
import { featuredProducts } from '../../data/home';
import { ProductCard } from '../ui/ProductCard';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export const FeaturedProducts: React.FC = () => {
  return (
    <section style={{ padding: 'var(--space-16) 0', backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h2 className="section-heading" style={{ marginBottom: 'var(--space-2)' }}>Featured Products</h2>
          <p className="text-muted text-body">Explore selected products from our marketplace.</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))', 
          gap: 'var(--space-6)',
          marginBottom: 'var(--space-10)'
        }}>
          {featuredProducts.map((prod, i) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard 
                image={prod.image}
                title={prod.name}
                description={prod.description}
                price={prod.price as any} // Temporary cast for string placeholder
                originalPrice={prod.originalPrice as any}
                rating={5}
                reviews={0}
                badge={prod.badge}
                badgeVariant={prod.badgeVariant}
              />
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link to="/products" style={{ textDecoration: 'none' }}>
            <Button variant="secondary">View All Products</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
