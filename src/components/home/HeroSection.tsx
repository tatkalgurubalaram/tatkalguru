import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section style={{ backgroundColor: 'var(--color-bg)', position: 'relative', overflow: 'hidden', padding: 'var(--space-16) 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-12)', alignItems: 'center' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
          >
            <div>
              <p className="text-small" style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 'var(--space-2)' }}>
                Digital Marketplace
              </p>
              <h1 className="hero-heading" style={{ color: 'var(--text-heading)' }}>
                Everything You Need.<br />Delivered Digitally.
              </h1>
            </div>
            
            <p className="text-body text-muted" style={{ fontSize: '18px', maxWidth: '500px', lineHeight: 1.6 }}>
              Explore software, server solutions and digital services through one modern marketplace built for speed and simplicity.
            </p>
            
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <Link to="/products" style={{ textDecoration: 'none' }}>
                <Button variant="primary">Explore Products</Button>
              </Link>
              <Link to="/about" style={{ textDecoration: 'none' }}>
                <Button variant="secondary">Learn More</Button>
              </Link>
            </div>

            <div className="flex gap-4 text-small text-muted" style={{ flexWrap: 'wrap', marginTop: 'var(--space-2)' }}>
              <span className="flex items-center gap-1"><Check size={16} color="var(--color-success)" /> Digital Delivery</span>
              <span className="flex items-center gap-1"><Check size={16} color="var(--color-success)" /> Secure Checkout</span>
              <span className="flex items-center gap-1"><Check size={16} color="var(--color-success)" /> Support</span>
            </div>
          </motion.div>



        </div>
      </div>
    </section>
  );
};
