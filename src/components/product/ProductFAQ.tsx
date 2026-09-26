import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface ProductFAQProps {
  faqs: { question: string; answer: string }[];
}

export const ProductFAQ: React.FC<ProductFAQProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div style={{ marginTop: 'var(--space-12)' }}>
      <h3 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>Frequently Asked Questions</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {faqs.map((faq, i) => (
          <motion.div
            key={i}
            initial={false}
            style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)', overflow: 'hidden' }}
          >
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              style={{ width: '100%', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
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
  );
};
