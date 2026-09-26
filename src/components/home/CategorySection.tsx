import React, { useState } from 'react';
import { Monitor, Server, Shield, Layers, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const categories = [
  { 
    name: 'Software', 
    desc: 'Premium digital software products', 
    icon: Monitor, 
    link: '/products/software',
    color: '#06B6D4',
    glowClass: 'neon-cyan'
  },
  { 
    name: 'VPS Server', 
    desc: 'High performance hosting', 
    icon: Server, 
    link: '/products/vps',
    color: '#8B5CF6',
    glowClass: 'neon-purple'
  },
  { 
    name: 'Proxy', 
    desc: 'Reliable network proxies', 
    icon: Shield, 
    link: '/products/proxy',
    color: '#10B981',
    glowClass: 'neon-emerald'
  },
  { 
    name: 'Combo Packs', 
    desc: 'Bundled digital packages', 
    icon: Layers, 
    link: '/products/combo',
    color: '#22C55E',
    glowClass: 'neon-green'
  }
];

export const CategorySection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="ambient-glow-wrapper" style={{ padding: 'var(--space-20) 0', position: 'relative' }}>
      {/* Background ambient subtle glow */}
      {isDark && (
        <>
          <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none' }} />
        </>
      )}

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 800, marginBottom: 'var(--space-2)', color: 'var(--text-heading)' }}>
            OUR PRODUCTS
          </h2>
          <p className="text-muted text-body" style={{ fontSize: '18px' }}>
            Everything you need, in one place.
          </p>
          <div style={{ width: '40px', height: '3px', background: 'var(--color-primary)', margin: '16px auto 0', borderRadius: '4px', boxShadow: isDark ? '0 0 10px rgba(37,99,235,0.5)' : 'none' }} />
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))', 
          gap: 'var(--space-6)' 
        }}>
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Link to={cat.link} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <motion.div 
                  className="glass-panel glass-card"
                  whileHover={{ 
                    scale: 1.03, 
                    y: -4 
                  }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  style={{ 
                    borderRadius: '16px', 
                    padding: '32px 24px', 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '280px',
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : undefined,
                    border: isDark ? `1px solid rgba(${hexToRgb(cat.color)}, 0.15)` : undefined,
                    borderTop: isDark ? `1px solid rgba(${hexToRgb(cat.color)}, 0.8)` : undefined,
                    boxShadow: isDark 
                      ? `inset 0 20px 40px -20px rgba(${hexToRgb(cat.color)}, 0.5), 0 8px 30px rgba(${hexToRgb(cat.color)}, ${hoveredIndex === i ? 0.25 : 0.05})` 
                      : undefined,
                  }}
                >
                  {/* Subtle reflection overlay is removed since we want the exact solid edge light look from the screenshot */}
                  
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <div style={{ 
                      width: '56px', height: '56px', borderRadius: '16px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDark ? `rgba(${hexToRgb(cat.color)}, 0.1)` : 'var(--color-bg)',
                      border: isDark ? `1px solid rgba(${hexToRgb(cat.color)}, 0.2)` : '1px solid var(--border-light)',
                      marginBottom: 'var(--space-6)',
                      boxShadow: hoveredIndex === i && isDark ? `0 0 20px rgba(${hexToRgb(cat.color)}, 0.4)` : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      <cat.icon size={28} color={isDark ? cat.color : 'var(--color-primary)'} />
                    </div>
                    
                    <h3 style={{ fontSize: '22px', fontWeight: 700, marginBottom: 'var(--space-2)', color: 'var(--text-heading)' }}>
                      {cat.name}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: 1.5, minHeight: '44px' }}>
                      {cat.desc}
                    </p>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '6px', 
                    color: isDark ? cat.color : 'var(--color-primary)', 
                    fontWeight: 600, fontSize: '15px', marginTop: 'var(--space-6)',
                    position: 'relative', zIndex: 2,
                    opacity: hoveredIndex === i ? 1 : 0.85,
                    transition: 'opacity 0.2s'
                  }}>
                    Explore <ArrowRight size={16} />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Helper for inline rgba usage
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '255, 255, 255';
}
