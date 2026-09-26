import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { Server, Monitor, Network } from 'lucide-react';

export const TechnologySection: React.FC = () => {
  return (
    <section style={{ backgroundColor: 'var(--color-dark)', color: 'var(--color-surface)', padding: 'var(--space-20) 0', overflow: 'hidden' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'var(--space-16)', alignItems: 'center' }}>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}
          >
            <div>
              <h2 className="section-heading" style={{ color: 'var(--color-surface)', marginBottom: 'var(--space-4)' }}>Technology for your workflow</h2>
              <p style={{ color: 'var(--text-placeholder)', fontSize: '18px', lineHeight: 1.6 }}>
                Our digital solutions are built to support modern technical demands. Whether you need reliable hosting, advanced software, or secure proxies.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: 'var(--color-dark-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <Monitor size={24} color="var(--color-accent)" />
                </div>
                <span style={{ fontSize: '18px', fontWeight: 500 }}>Advanced Software</span>
              </div>
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: 'var(--color-dark-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <Server size={24} color="var(--color-primary-light)" />
                </div>
                <span style={{ fontSize: '18px', fontWeight: 500 }}>High-Performance VPS</span>
              </div>
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: 'var(--color-dark-secondary)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
                  <Network size={24} color="var(--color-success-light)" />
                </div>
                <span style={{ fontSize: '18px', fontWeight: 500 }}>Reliable Proxies</span>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-2)' }}>
              <Link to="/products" style={{ textDecoration: 'none' }}>
                <Button variant="primary">Explore Solutions</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ position: 'relative', minHeight: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {/* Abstract Tech Visual */}
            <div style={{ position: 'absolute', width: '300px', height: '300px', background: 'radial-gradient(circle, var(--color-primary-dark) 0%, transparent 60%)', opacity: 0.4, filter: 'blur(40px)' }} />
            
            <div style={{ position: 'relative', width: '100%', maxWidth: '350px', height: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', zIndex: 1 }}>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }} style={{ backgroundColor: 'var(--color-dark-secondary)', border: '1px solid rgba(255,255,255,0.1)', padding: 'var(--space-4)', borderRadius: 'var(--radius-card)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <Server size={32} color="var(--color-primary-light)" />
                <div>
                  <div style={{ fontWeight: 600 }}>Node Alpha</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>99.9% Uptime</div>
                </div>
              </motion.div>

              <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }} style={{ backgroundColor: 'var(--color-dark-secondary)', border: '1px solid rgba(255,255,255,0.1)', padding: 'var(--space-4)', borderRadius: 'var(--radius-card)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', alignSelf: 'flex-end', width: '80%' }}>
                <Network size={32} color="var(--color-accent)" />
                <div>
                  <div style={{ fontWeight: 600 }}>Proxy Network</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-placeholder)' }}>Active Connections</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
