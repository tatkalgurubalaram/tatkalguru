import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { Button } from '../ui/Button';
import { Link, useNavigate } from 'react-router-dom';

export const CartDrawer: React.FC = () => {
  const { isDrawerOpen, setIsDrawerOpen, state, removeItem, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDrawerOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (isDrawerOpen && e.key === 'Escape') setIsDrawerOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isDrawerOpen, setIsDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      {/* Backdrop */}
      <div 
        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(15,23,42,0.5)' }} 
        onClick={() => setIsDrawerOpen(false)}
      />
      {/* Drawer */}
      <div 
        style={{ 
          position: 'absolute', top: 0, right: 0, bottom: 0, 
          width: '85%', maxWidth: '400px', 
          backgroundColor: 'var(--color-bg)',
          display: 'flex', flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)'
        }}
        role="dialog"
        aria-label="Shopping Cart"
      >
        <div style={{ padding: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', backgroundColor: 'var(--color-surface)' }}>
          <h3 className="card-heading flex items-center gap-2"><ShoppingBag size={20} /> Your Cart</h3>
          <button onClick={() => setIsDrawerOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        <div style={{ flexGrow: 1, overflowY: 'auto', padding: 'var(--space-4)' }}>
          {state.items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
              <ShoppingBag size={48} style={{ marginBottom: 'var(--space-4)', opacity: 0.5 }} />
              <p style={{ fontWeight: 500 }}>Your cart is currently empty.</p>
              <Button variant="secondary" style={{ marginTop: 'var(--space-4)' }} onClick={() => { setIsDrawerOpen(false); navigate('/products'); }}>Continue Shopping</Button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {state.items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-light)' }}>
                  <img src={item.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&h=100&fit=crop&blur=50'} alt="" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <Link to={`/products/${item.productSlug}`} onClick={() => setIsDrawerOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-heading)', fontWeight: 600 }}>{item.productName}</Link>
                        {item.variantName && <div className="text-small text-muted">{item.variantName}</div>}
                      </div>
                      <button onClick={() => removeItem(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-error)' }} aria-label="Remove item">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'var(--space-3)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} style={{ width: '28px', height: '28px', border: 'none', background: 'var(--color-surface)', cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer' }}>-</button>
                        <div style={{ width: '28px', textAlign: 'center', fontSize: '14px', fontWeight: 500 }}>{item.quantity}</div>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{ width: '28px', height: '28px', border: 'none', background: 'var(--color-surface)', cursor: 'pointer' }}>+</button>
                      </div>
                      <div style={{ fontWeight: 600 }}>
                        {formatCurrency(item.unitPrice * item.quantity, item.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--border-light)', backgroundColor: 'var(--color-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', fontWeight: 600, fontSize: '18px' }}>
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal, state.items[0]?.currency || 'INR')}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Button variant="secondary" className="w-full" onClick={() => { setIsDrawerOpen(false); navigate('/cart'); }}>View Cart</Button>
              <Button variant="primary" className="w-full" onClick={() => { setIsDrawerOpen(false); navigate('/checkout'); }}>Proceed to Checkout</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
