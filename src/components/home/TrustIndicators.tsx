import React from 'react';
import { Zap, ShieldCheck, Smile, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export const TrustIndicators: React.FC = () => {
  const items = [
    { icon: Zap, label: "Fast Digital Delivery" },
    { icon: ShieldCheck, label: "Secure Payments" },
    { icon: Smile, label: "Simple Experience" },
    { icon: Headphones, label: "Customer Support" }
  ];

  return (
    <section style={{ padding: 'var(--space-6) 0', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--color-surface)' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-6)', alignItems: 'center' }}>
          {items.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="flex items-center gap-2"
              style={{ padding: 'var(--space-2) var(--space-4)' }}
            >
              <item.icon size={20} color="var(--color-primary)" />
              <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-heading)' }}>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
