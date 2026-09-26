import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const WhatsAppButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappUrl = 'https://wa.me/916296579165';

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '30px',
        left: '30px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact us on WhatsApp"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          outline: 'none',
          borderRadius: '50%'
        }}
      >
        {/* Pulsing ring */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            backgroundColor: '#22C55E',
            zIndex: 0
          }}
          animate={{
            scale: [1, 1.4, 1.6],
            opacity: [0.6, 0.2, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        
        {/* Main button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          style={{
            position: 'relative',
            zIndex: 10,
            width: '60px',
            height: '60px',
            backgroundColor: '#25D366',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
          </svg>
        </motion.div>
      </a>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -5 }}
            transition={{ duration: 0.2 }}
            style={{
              marginLeft: '12px',
              backgroundColor: 'var(--color-surface)',
              color: 'var(--text-heading)',
              fontSize: '14px',
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: '9999px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              border: '1px solid var(--border-light)'
            }}
          >
            Contact us
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
