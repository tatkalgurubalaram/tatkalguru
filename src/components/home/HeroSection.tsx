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
                Best Tatkal Software for Fast IRCTC Ticket Booking in India
              </h1>
            </div>
            
            <p className="text-body text-muted" style={{ fontSize: '18px', maxWidth: '600px', lineHeight: 1.6 }}>
              Welcome to TSF Group — India's trusted platform for high-speed Tatkal ticket booking software. Get advanced autofill technology, fast booking assistant tools, free demo setups, and instant license key delivery in under 10 seconds.
            </p>
            
            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
              <Link to="/products" style={{ textDecoration: 'none' }}>
                <Button variant="primary">DOWNLOAD SOFTWARE PLANS</Button>
              </Link>
              <Link to="/contact" style={{ textDecoration: 'none' }}>
                <Button variant="secondary">GET FREE DEMO ON TELEGRAM</Button>
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
