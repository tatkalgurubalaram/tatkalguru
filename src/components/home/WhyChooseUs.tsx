import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, MousePointerClick, Headphones } from 'lucide-react';
import { Card } from '../ui/Card';

const features = [
  { icon: Zap, title: 'Fast Experience', desc: 'Designed for a smooth and responsive shopping experience.' },
  { icon: ShieldCheck, title: 'Secure Transactions', desc: 'Your data and payments are processed securely.' },
  { icon: MousePointerClick, title: 'Simple Purchasing', desc: 'Streamlined checkout process without unnecessary steps.' },
  { icon: Headphones, title: 'Dedicated Support', desc: 'Our team is available to assist you with any inquiries.' }
];

export const WhyChooseUs: React.FC = () => {
  return (
    <section style={{ padding: 'var(--space-16) 0' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h2 className="section-heading">Why Choose Our Platform?</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)' }}>
          {features.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card style={{ padding: 'var(--space-6)', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                <div style={{ backgroundColor: 'var(--color-primary-light)', padding: '12px', borderRadius: 'var(--radius-sm)' }}>
                  <feat.icon size={24} color="var(--color-primary-dark)" />
                </div>
                <div>
                  <h3 className="card-heading" style={{ marginBottom: 'var(--space-2)' }}>{feat.title}</h3>
                  <p className="text-muted text-small">{feat.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
