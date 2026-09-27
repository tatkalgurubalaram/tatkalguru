import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import heroBg from '../../assets/hero-bg.png';

export const HeroSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section style={{ backgroundColor: 'var(--color-bg)', position: 'relative', overflow: 'hidden', padding: 'var(--space-16) 0' }}>
      {/* Desktop Background Image Layer */}
      <div 
        className="hidden md:block"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          opacity: isDark ? 0.45 : 0.25,
          zIndex: 0
        }}
      />
      
      {/* Mobile Background Image Layer */}
      <div 
        className="block md:hidden"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'auto 100%',
          backgroundPosition: 'right center',
          opacity: isDark ? 0.75 : 0.5,
          zIndex: 0
        }}
      />
      
      {/* Responsive Gradient Overlay */}
      <div 
        className="mobile-hero-gradient absolute inset-0 z-0 md:bg-[linear-gradient(90deg,var(--color-bg)_0%,var(--color-bg)_55%,transparent_90%)] lg:bg-[linear-gradient(90deg,var(--color-bg)_0%,var(--color-bg)_40%,transparent_75%)]"
      />
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ padding: 'var(--space-8) 0' }}>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="hero-content"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', gap: 'var(--space-8)' }}
          >
            <div>
              <p className="text-small" style={{ color: 'var(--color-primary)', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 'var(--space-4)' }}>
                Digital Marketplace
              </p>
              <h1 className="hero-heading elementor-heading-title">
                Best Tatkal Software for Fast IRCTC Ticket Booking in India
              </h1>
            </div>
            
            <p className="hero-description text-body text-muted">
              Welcome to TSF Group — India's trusted platform for high-speed Tatkal ticket booking software. Get advanced autofill technology, fast booking assistant tools, free demo setups, and instant license key delivery in under 10 seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4" style={{ width: '100%' }}>
              <Link to="/products" className="w-full sm:w-auto" style={{ textDecoration: 'none' }}>
                <Button variant="glass" style={{ width: '100%' }}>DOWNLOAD SOFTWARE PLANS</Button>
              </Link>
              <Link to="/contact" className="w-full sm:w-auto" style={{ textDecoration: 'none' }}>
                <Button variant="glass-secondary" style={{ width: '100%' }}>GET FREE DEMO ON TELEGRAM</Button>
              </Link>
            </div>
            <div className="hero-features flex flex-col sm:flex-row gap-4 sm:gap-6 text-small text-muted" style={{ marginTop: 'var(--space-4)' }}>
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
