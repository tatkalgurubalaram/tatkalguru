import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Globe } from 'lucide-react';
import { config } from '../config';

export const Footer: React.FC = () => {
  return (
    <footer style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-6)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
        
        <div className="flex" style={{ flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div className="flex items-center gap-2">
            <Zap color="var(--color-primary)" size={24} />
            <span style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-heading)' }}>
              {config.brandName}
            </span>
          </div>
          <p className="text-muted text-small" style={{ maxWidth: '300px' }}>
            Premium digital products and services for modern professionals.
          </p>
        </div>

        <div>
          <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text-heading)' }}>Company</h4>
          <div className="flex" style={{ flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Link to="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="text-small hover:text-primary">About Us</Link>
            <Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="text-small hover:text-primary">Contact</Link>
          </div>
        </div>

        <div>
          <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text-heading)' }}>Products</h4>
          <div className="flex" style={{ flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Link to="/products/software" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="text-small hover:text-primary">Software</Link>
            <Link to="/products/vps" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="text-small hover:text-primary">VPS Servers</Link>
            <Link to="/products/proxy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="text-small hover:text-primary">Proxies</Link>
            <Link to="/products/combo" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="text-small hover:text-primary">Combo Packs</Link>
          </div>
        </div>

        <div>
          <h4 style={{ fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text-heading)' }}>Legal</h4>
          <div className="flex" style={{ flexDirection: 'column', gap: 'var(--space-2)' }}>
            <Link to="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="text-small hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="text-small hover:text-primary">Terms of Service</Link>
            <Link to="/refund-policy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }} className="text-small hover:text-primary">Refund Policy</Link>
          </div>
        </div>

      </div>

      <div className="container">
        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <p className="text-small text-muted">
            &copy; {new Date().getFullYear()} {config.brandName}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" style={{ color: 'var(--text-muted)' }}><Globe size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};
