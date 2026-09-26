import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

export const FinalCTA: React.FC = () => {
  return (
    <section style={{ padding: 'var(--space-24) 0', backgroundColor: 'var(--color-primary-dark)', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative background */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at 80% 20%, white 0%, transparent 40%)' }} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: 'linear-gradient(45deg, transparent 48%, white 48%, white 52%, transparent 52%)', backgroundSize: '20px 20px' }} />
      
      <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 style={{ fontSize: 'var(--font-size-hero)', fontWeight: 800, marginBottom: 'var(--space-4)', lineHeight: 1.2 }}>
            Ready to explore?
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.9, marginBottom: 'var(--space-8)', lineHeight: 1.6 }}>
            Discover software, servers and digital solutions in one modern marketplace.
          </p>
          <Link to="/products" style={{ textDecoration: 'none' }}>
            <Button style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-primary-dark)' }}>Explore Products</Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
