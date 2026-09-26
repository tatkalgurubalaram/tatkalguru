import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package } from 'lucide-react';

interface ProductGalleryProps {
  image?: string;
  images?: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ image, images, productName }) => {
  const allImages = images && images.length > 0 ? images : (image ? [image] : []);
  const [activeIndex, setActiveIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div style={{ aspectRatio: '4/3', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card-lg)', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <Package size={64} style={{ marginBottom: 'var(--space-4)', opacity: 0.5 }} />
        <span style={{ fontSize: '14px', fontWeight: 500 }}>{productName}</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Main Image */}
      <div style={{ aspectRatio: '4/3', position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-card-lg)', backgroundColor: 'var(--color-surface)', border: '1px solid var(--border-light)' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={allImages[activeIndex]}
            alt={`${productName} - Image ${activeIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 'var(--space-3)' }}>
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              style={{
                aspectRatio: '1',
                padding: 0,
                border: activeIndex === idx ? '2px solid var(--color-primary)' : '1px solid var(--border-light)',
                borderRadius: 'var(--radius-sm)',
                overflow: 'hidden',
                cursor: 'pointer',
                opacity: activeIndex === idx ? 1 : 0.6,
                transition: 'all 0.2s',
                backgroundColor: 'var(--color-surface)'
              }}
              aria-label={`Select image ${idx + 1}`}
            >
              <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
