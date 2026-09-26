import React, { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { PageTransition } from '../components/PageTransition';
import { config } from '../config';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import { QuantitySelector } from '../components/product/QuantitySelector';

export const Cart: React.FC = () => {
  const { state, updateQuantity, removeItem, clearCart, subtotal, total } = useCart();

  useEffect(() => {
    document.title = `Cart | ${config.brandName}`;
  }, []);

  return (
    <PageTransition>
      <PageContainer>
        <PageHeader 
          title="Your Cart"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Cart' }
          ]}
        />
        
        {state.items.length === 0 ? (
          <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-12) 0', border: '1px dashed var(--border-strong)', borderRadius: 'var(--radius-card)', backgroundColor: 'var(--color-bg)' }}>
            <ShoppingCart size={48} color="var(--text-muted)" style={{ marginBottom: 'var(--space-4)' }} />
            <h3 className="card-heading" style={{ marginBottom: 'var(--space-2)' }}>Your cart is currently empty</h3>
            <p className="text-muted text-body" style={{ marginBottom: 'var(--space-6)' }}>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" style={{ textDecoration: 'none' }}>
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-8)', marginTop: 'var(--space-8)' }} className="lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-2)' }}>
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                  style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontWeight: 500, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={16} /> Clear Cart
                </button>
              </div>
              
              {state.items.map(item => (
                <div key={item.id} style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
                  <img src={item.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=120&h=120&fit=crop&blur=50'} alt="" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                  
                  <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <Link to={`/products/${item.productSlug}`} style={{ textDecoration: 'none', color: 'var(--text-heading)', fontWeight: 600, fontSize: '18px' }}>
                          {item.productName}
                        </Link>
                        {item.variantName && (
                          <div className="text-muted text-small" style={{ marginTop: '4px' }}>Variant: {item.variantName}</div>
                        )}
                        <div style={{ marginTop: '8px', fontWeight: 600, color: 'var(--text-heading)' }}>
                          {formatCurrency(item.unitPrice, item.currency)} <span className="text-muted text-small font-normal">each</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)} 
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} 
                        aria-label="Remove item"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'var(--space-4)' }}>
                      <div>
                        <QuantitySelector quantity={item.quantity} onChange={(q) => updateQuantity(item.id, q)} />
                      </div>
                      <div style={{ fontWeight: 700, fontSize: '18px', color: 'var(--color-primary)' }}>
                        {formatCurrency(item.unitPrice * item.quantity, item.currency)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)', padding: 'var(--space-6)' }}>
                <h3 className="card-heading" style={{ marginBottom: 'var(--space-6)' }}>Order Summary</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-muted">Subtotal</span>
                    <span style={{ fontWeight: 500 }}>{formatCurrency(subtotal, state.items[0]?.currency || 'INR')}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-muted">Discount</span>
                    <span style={{ fontWeight: 500 }}>₹0</span>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border-light)', margin: 'var(--space-2) 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 700 }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(total, state.items[0]?.currency || 'INR')}</span>
                  </div>
                </div>
                
                <Link to="/checkout" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" className="w-full" style={{ padding: '16px', fontSize: '16px' }}>Proceed to Checkout</Button>
                </Link>
                
                <div style={{ marginTop: 'var(--space-4)', textAlign: 'center' }}>
                  <Link to="/products" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500, fontSize: '14px' }}>
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </PageContainer>
    </PageTransition>
  );
};
