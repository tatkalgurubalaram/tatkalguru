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

          {/* Abstract Technology Visual */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ position: 'relative', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, var(--color-primary-light) 0%, transparent 70%)', opacity: 0.5, zIndex: 0 }} />
            
            <motion.div 
              className={isDark ? "glass-card" : ""}
              animate={{ y: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              style={{ 
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'var(--color-surface)', 
                border: isDark ? '1px solid rgba(37, 99, 235, 0.15)' : '1px solid var(--border-light)', 
                borderTop: isDark ? '1px solid rgba(37, 99, 235, 0.8)' : '1px solid var(--border-light)',
                boxShadow: isDark ? 'inset 0 20px 40px -20px rgba(37, 99, 235, 0.5), 0 8px 30px rgba(37, 99, 235, 0.1)' : 'var(--shadow-lg)',
                borderRadius: '16px', 
                padding: 'var(--space-6)', 
                position: 'relative', 
                zIndex: 1, 
                width: '100%', 
                maxWidth: '320px' 
              }}
            >
              <h3 className="card-heading" style={{ marginBottom: 'var(--space-4)', color: 'var(--text-heading)' }}>Digital Platform</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div className="flex justify-between items-center p-2" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-heading)' }}>Software</span> <Check size={16} color="var(--color-primary)" />
                </div>
                <div className="flex justify-between items-center p-2" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-heading)' }}>VPS Server</span> <Check size={16} color="var(--color-primary)" />
                </div>
                <div className="flex justify-between items-center p-2" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'var(--color-bg)', borderRadius: 'var(--radius-sm)', padding: '8px 12px' }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-heading)' }}>Proxy</span> <Check size={16} color="var(--color-primary)" />
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)', boxShadow: isDark ? '0 0 8px var(--color-success)' : 'none' }} />
                <span className="text-small text-muted">Secure Delivery Active</span>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [5, -5, 5] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              style={{ 
                position: 'absolute', bottom: '10%', left: '-5%', 
                backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : 'var(--color-surface)', 
                border: isDark ? '1px solid rgba(34, 197, 94, 0.15)' : '1px solid var(--border-light)', 
                borderTop: isDark ? '1px solid rgba(34, 197, 94, 0.8)' : '1px solid var(--border-light)',
                boxShadow: isDark ? 'inset 0 10px 20px -10px rgba(34, 197, 94, 0.5), 0 8px 30px rgba(34, 197, 94, 0.1)' : 'var(--shadow-md)',
                borderRadius: '12px', 
                padding: 'var(--space-3) var(--space-4)', 
                display: 'flex', alignItems: 'center', gap: 'var(--space-2)', zIndex: 2 
              }}
            >
              <div style={{ backgroundColor: 'var(--color-success-light)', padding: '4px', borderRadius: '50%' }}>
                <Check size={14} color="var(--color-success)" />
              </div>
              <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-heading)' }}>Fast Delivery</span>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
