import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { faqData } from '../../data/home';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section style={{ padding: 'var(--space-16) 0', backgroundColor: 'var(--color-bg)' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <h2 className="section-heading">Frequently Asked Questions</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {faqData.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)', overflow: 'hidden' }}
            >
              <button 
                onClick={() => toggle(i)}
                style={{ width: '100%', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', minHeight: '44px' }}
                aria-expanded={openIndex === i}
              >
                <span style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-heading)' }}>{faq.question}</span>
                {openIndex === i ? <Minus size={20} color="var(--color-primary)" /> : <Plus size={20} color="var(--text-muted)" />}
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{ padding: '0 var(--space-4) var(--space-4) var(--space-4)', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
