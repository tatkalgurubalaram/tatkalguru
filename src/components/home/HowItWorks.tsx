import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { num: '01', title: 'Choose a Product', desc: 'Browse our catalog and select your required digital solution.' },
  { num: '02', title: 'Complete Your Order', desc: 'Proceed through our secure and streamlined checkout process.' },
  { num: '03', title: 'Receive Your Product', desc: 'Receive your product through the available delivery method.' },
  { num: '04', title: 'Get Support', desc: 'Reach out to our dedicated team if you need any assistance.' }
];

export const HowItWorks: React.FC = () => {
  return (
    <section style={{ padding: 'var(--space-16) 0', backgroundColor: 'var(--color-bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h2 className="section-heading">How It Works</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 'var(--space-8)' }}>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'relative' }}
            >
              <div style={{ fontSize: '48px', fontWeight: 800, color: 'var(--color-primary-light)', lineHeight: 1, marginBottom: 'var(--space-4)' }}>
                {step.num}
              </div>
              <h3 className="card-heading" style={{ marginBottom: 'var(--space-2)' }}>{step.title}</h3>
              <p className="text-small text-muted">{step.desc}</p>
              
              {/* Connector Line (desktop only, handled via CSS roughly) */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-[var(--border-light)]" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
