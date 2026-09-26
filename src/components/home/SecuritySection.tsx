import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const features = [
    "Secure Checkout",
    "Protected Account",
    "Clear Product Information",
    "Order Visibility"
  ];

  return (
    <section style={{ padding: 'var(--space-16) 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'var(--space-12)', alignItems: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card-lg)', padding: 'var(--space-8)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-heading" style={{ marginBottom: 'var(--space-4)' }}>Built for a Simple and Secure Experience</h2>
            <p className="text-body text-muted" style={{ marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
              We design the platform around clear product information, secure payment processing and a straightforward customer journey.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}
          >
            {features.map((feat, i) => (
              <div key={i} className="flex items-center gap-3" style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)' }}>
                <CheckCircle2 size={24} color="var(--color-success)" />
                <span style={{ fontWeight: 500, color: 'var(--text-heading)' }}>{feat}</span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
