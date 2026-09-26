import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export interface ProductCardProps {
  image: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  badgeVariant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  price,
  originalPrice,
  rating,
  reviews,
  badge,
  badgeVariant = 'primary'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Default neon accent for all products
  const neonColor = '37, 99, 235'; // Primary blue

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: '100%' }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        padding={false} 
        className="flex relative overflow-hidden" 
        style={{ 
          flexDirection: 'column', 
          height: '100%',
          borderRadius: '16px',
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.7)' : undefined,
          border: isDark ? `1px solid rgba(${neonColor}, 0.15)` : undefined,
          borderTop: isDark ? `1px solid rgba(${neonColor}, 0.8)` : undefined,
          boxShadow: isDark 
            ? `inset 0 20px 40px -20px rgba(${neonColor}, 0.5), 0 8px 30px rgba(${neonColor}, ${isHovered ? 0.25 : 0.05})` 
            : undefined,
          transition: 'all 0.3s ease'
        }}
      >
        
        {/* Glow effect inside card */}
        {isDark && (
          <div 
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: `radial-gradient(circle at 50% 0%, rgba(${neonColor}, 0.15), transparent 70%)`,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none',
              zIndex: 0
            }} 
          />
        )}

        <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: 'var(--color-bg)', zIndex: 1 }}>
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {badge && (
            <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
              <Badge variant={badgeVariant}>{badge}</Badge>
            </div>
          )}
        </div>
        
        <div className="card-padding flex" style={{ flexDirection: 'column', flexGrow: 1, gap: 'var(--space-2)', position: 'relative', zIndex: 1 }}>
          <h3 className="card-heading" style={{ fontSize: '18px', fontWeight: 700 }}>{title}</h3>
          <p className="text-muted text-small" style={{ flexGrow: 1, lineHeight: 1.5 }}>{description}</p>
          
          <div className="flex items-center gap-2" style={{ marginTop: 'var(--space-2)' }}>
            <div className="flex items-center" style={{ color: 'var(--color-warning)' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill={i < Math.floor(rating) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="text-muted text-small">({reviews} reviews)</span>
          </div>

          <div className="flex items-center justify-between" style={{ marginTop: 'var(--space-4)' }}>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-heading)' }}>
                ₹{price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-muted" style={{ textDecoration: 'line-through', fontSize: '14px' }}>
                  ₹{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <Button variant="primary" className="w-full" style={{ 
            marginTop: 'var(--space-4)',
            backgroundColor: isHovered ? 'var(--color-primary-dark)' : 'var(--color-primary)',
            boxShadow: isHovered && isDark ? `0 0 15px rgba(${neonColor}, 0.5)` : 'none'
          }}>
            View Product
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};
