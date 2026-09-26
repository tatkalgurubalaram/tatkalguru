import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, Menu, X, Zap, ChevronDown } from 'lucide-react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { config } from '../config';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const location = useLocation();
  const { totalQuantity, setIsDrawerOpen } = useCart();
  const { user } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProductsOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProductsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProductsOpen(false);
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? 'var(--color-primary)' : 'var(--text-heading)',
    textDecoration: 'none',
    fontWeight: isActive ? 600 : 500,
    transition: 'color var(--transition-fast)'
  });

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'var(--color-surface)',
          borderBottom: '1px solid var(--border-light)',
          boxShadow: isScrolled ? 'var(--shadow-sm)' : 'none',
          transition: 'all var(--transition-fast)',
          height: '72px',
          ...(isScrolled ? {
             backgroundColor: 'rgba(var(--color-surface-rgb, 255, 255, 255), 0.8)',
             backdropFilter: 'blur(16px)',
             WebkitBackdropFilter: 'blur(16px)'
          } : {})
        }}
      >
        <div className="container flex items-center justify-between" style={{ height: '100%' }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <Zap color="var(--color-primary)" size={28} />
            <span style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--text-heading)' }}>
              {config.brandName}
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="flex items-center gap-6" style={{ display: 'none' }} id="desktop-nav">
            <NavLink to="/" style={navLinkStyle}>Home</NavLink>
            
            {/* Products Dropdown */}
            <div className="relative" ref={dropdownRef} style={{ position: 'relative' }}>
              <button 
                className="flex items-center gap-1"
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', 
                  color: location.pathname.includes('/products') ? 'var(--color-primary)' : 'var(--text-heading)',
                  fontWeight: location.pathname.includes('/products') ? 600 : 500,
                  fontSize: '16px', fontFamily: 'inherit'
                }}
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                aria-expanded={isProductsOpen}
              >
                Products <ChevronDown size={16} />
              </button>
              
              {isProductsOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                  marginTop: '16px', backgroundColor: 'var(--color-surface)',
                  boxShadow: 'var(--shadow-lg)', borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--border-light)', width: '200px',
                  padding: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
                  zIndex: 50
                }}>
                  <Link to="/products" className="hover:bg-bg transition" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--text-heading)', fontWeight: 500 }}>All Products</Link>
                  <Link to="/products/software" className="hover:bg-bg transition" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--text-muted)' }}>Software</Link>
                  <Link to="/products/vps" className="hover:bg-bg transition" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--text-muted)' }}>VPS Server</Link>
                  <Link to="/products/proxy" className="hover:bg-bg transition" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--text-muted)' }}>Proxy</Link>
                  <Link to="/products/combo" className="hover:bg-bg transition" style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--text-muted)' }}>Combo Packs</Link>
                </div>
              )}
            </div>

            <NavLink to="/about" style={navLinkStyle}>About</NavLink>
            <NavLink to="/contact" style={navLinkStyle}>Contact</NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="flex items-center gap-4" style={{ display: 'none' }} id="desktop-actions">
            <ThemeToggle />
            <button aria-label="Search" className="btn-ghost" style={{ padding: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer' }} onClick={() => setIsSearchOpen(true)}>
              <Search size={20} />
            </button>
            <button aria-label="Cart" className="btn-ghost relative" style={{ padding: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', color: 'inherit' }} onClick={() => setIsDrawerOpen(true)}>
              <ShoppingCart size={20} />
              {totalQuantity > 0 && (
                <span style={{ position: 'absolute', top: '0', right: '0', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '11px', fontWeight: 700, width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                  {totalQuantity}
                </span>
              )}
            </button>
            <Link to="/account" aria-label="Account" className="btn-ghost" style={{ padding: '8px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
              <User size={20} />
              {user && <span style={{ fontSize: '14px', fontWeight: 600 }}>Hi, {user.firstName}</span>}
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-4" id="mobile-actions">
            <ThemeToggle />
            <button aria-label="Search" className="btn-ghost" style={{ padding: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer' }} onClick={() => setIsSearchOpen(true)}>
              <Search size={20} />
            </button>
            <button aria-label="Cart" className="btn-ghost relative" style={{ padding: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer', color: 'inherit' }} onClick={() => setIsDrawerOpen(true)}>
              <ShoppingCart size={20} />
              {totalQuantity > 0 && (
                <span style={{ position: 'absolute', top: '0', right: '0', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '11px', fontWeight: 700, width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                  {totalQuantity}
                </span>
              )}
            </button>
            <button 
              aria-label="Menu"
              className="btn-ghost" 
              style={{ padding: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer' }}
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: '100px', paddingLeft: '16px', paddingRight: '16px' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)' }} onClick={() => setIsSearchOpen(false)} />
          <div style={{ position: 'relative', width: '100%', maxWidth: '600px', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card)', padding: 'var(--space-4)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="flex items-center gap-2">
              <Search size={20} color="var(--text-muted)" />
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search products..." 
                style={{ flexGrow: 1, border: 'none', outline: 'none', fontSize: '18px', padding: '8px', fontFamily: 'inherit', color: 'var(--text-heading)' }} 
              />
              <button onClick={() => setIsSearchOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                <X size={20} color="var(--text-muted)" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <div 
            style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)' }} 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div 
            style={{ 
              position: 'absolute', 
              top: 0, right: 0, bottom: 0, 
              width: '80%', 
              maxWidth: '300px', 
              backgroundColor: 'var(--color-surface)',
              padding: 'var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-6)',
              overflowY: 'auto'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap color="var(--color-primary)" size={24} />
                <span style={{ fontSize: '18px', fontWeight: 800 }}>{config.brandName}</span>
              </div>
              <button 
                className="btn-ghost" 
                aria-label="Close Menu"
                style={{ padding: '8px', borderRadius: '50%', border: 'none', cursor: 'pointer' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <nav className="flex" style={{ flexDirection: 'column', gap: 'var(--space-4)' }}>
              <Link to="/" style={{ color: 'var(--text-heading)', textDecoration: 'none', fontWeight: 600, fontSize: '18px' }}>Home</Link>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <Link to="/products" style={{ color: 'var(--text-heading)', textDecoration: 'none', fontWeight: 600, fontSize: '18px' }}>Products</Link>
                <div className="flex" style={{ flexDirection: 'column', gap: 'var(--space-2)', paddingLeft: 'var(--space-4)' }}>
                  <Link to="/products/software" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Software</Link>
                  <Link to="/products/vps" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>VPS Server</Link>
                  <Link to="/products/proxy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Proxy</Link>
                  <Link to="/products/combo" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: 500 }}>Combo Packs</Link>
                </div>
              </div>

              <Link to="/about" style={{ color: 'var(--text-heading)', textDecoration: 'none', fontWeight: 600, fontSize: '18px' }}>About</Link>
              <Link to="/contact" style={{ color: 'var(--text-heading)', textDecoration: 'none', fontWeight: 600, fontSize: '18px' }}>Contact</Link>
              <Link to="/account" style={{ color: 'var(--text-heading)', textDecoration: 'none', fontWeight: 600, fontSize: '18px' }}>Account</Link>
            </nav>
          </div>
        </div>
      )}
      <style>{`
        @media(min-width: 1024px) {
          #desktop-nav { display: flex !important; }
          #desktop-actions { display: flex !important; }
          #mobile-actions { display: none !important; }
        }
      `}</style>
    </>
  );
};
