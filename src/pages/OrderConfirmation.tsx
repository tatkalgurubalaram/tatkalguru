import React, { useEffect, useState } from 'react';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { PageTransition } from '../components/PageTransition';
import { config } from '../config';
import { Button } from '../components/ui/Button';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle2, Loader2, AlertCircle, Download, Key } from 'lucide-react';
import { apiClient, API_BASE_URL } from '../lib/api';
import { formatCurrency } from '../utils/currency';

export const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const orderNumber = location.state?.orderNumber;
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Order Confirmation | ${config.brandName}`;
    
    if (orderNumber) {
      apiClient.get<{ success: boolean; data: any }>(`/orders/${orderNumber}`)
        .then(res => {
          if (res.success) setOrder(res.data);
          else setError('Order not found');
          setLoading(false);
        })
        .catch(() => {
          setError('Unable to load order details');
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError('No order reference provided');
    }
  }, [orderNumber]);

  if (loading) {
    return (
      <PageTransition>
        <PageContainer>
          <div style={{ padding: 'var(--space-12) 0', display: 'flex', justifyContent: 'center' }}>
            <Loader2 size={48} className="animate-spin" color="var(--color-primary)" />
          </div>
        </PageContainer>
      </PageTransition>
    );
  }

  if (error || !order) {
    return (
      <PageTransition>
        <PageContainer>
          <div style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
            <AlertCircle size={48} color="var(--color-error)" style={{ margin: '0 auto var(--space-4)' }} />
            <h2 className="section-heading">Order Information Unavailable</h2>
            <p className="text-muted" style={{ marginTop: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>{error}</p>
            <Link to="/" style={{ textDecoration: 'none' }}><Button variant="primary">Return to Home</Button></Link>
          </div>
        </PageContainer>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <PageContainer>
        <PageHeader 
          title="Order Review Complete"
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Order Confirmation' }
          ]}
        />
        
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-12) 0', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-card)', backgroundColor: 'var(--color-surface)' }}>
          <CheckCircle2 size={64} color="var(--color-success)" style={{ marginBottom: 'var(--space-4)' }} />
          <h3 className="card-heading" style={{ marginBottom: 'var(--space-2)' }}>Your checkout information has been captured successfully.</h3>
          <p className="text-muted text-body" style={{ marginBottom: 'var(--space-6)', maxWidth: '500px', textAlign: 'center' }}>
            Payment processing and order creation have been completed securely.
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', width: '100%', maxWidth: '600px', marginBottom: 'var(--space-8)' }}>
            <div style={{ backgroundColor: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
              <div className="text-small text-muted" style={{ marginBottom: '4px' }}>Order Number</div>
              <div style={{ fontWeight: 700, color: 'var(--text-heading)' }}>{order.orderNumber}</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
              <div className="text-small text-muted" style={{ marginBottom: '4px' }}>Total Amount</div>
              <div style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{formatCurrency(order.total, order.currency)}</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
              <div className="text-small text-muted" style={{ marginBottom: '4px' }}>Order Status</div>
              <div style={{ fontWeight: 600, color: 'var(--text-heading)' }}>{order.status}</div>
            </div>
            <div style={{ backgroundColor: 'var(--color-bg)', padding: 'var(--space-4)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
              <div className="text-small text-muted" style={{ marginBottom: '4px' }}>Payment Status</div>
              <div style={{ fontWeight: 600, color: 'var(--color-warning)' }}>{order.paymentStatus}</div>
            </div>
          </div>

          {/* Delivery & License Section */}
          {order.deliveries && order.deliveries.length > 0 && (
            <div style={{ width: '100%', maxWidth: '600px', marginBottom: 'var(--space-8)', textAlign: 'left' }}>
              <h4 className="section-heading" style={{ marginBottom: 'var(--space-4)' }}>Digital Delivery</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {order.deliveries.map((delivery: any) => {
                   const item = order.items.find((i: any) => i.productId === delivery.productId);
                   return (
                     <div key={delivery.id} style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--border-light)', padding: 'var(--space-4)', borderRadius: 'var(--radius-card)' }}>
                       <div style={{ fontWeight: 600, color: 'var(--text-heading)', marginBottom: 'var(--space-2)' }}>
                         {item?.productName} {item?.variantName ? `(${item.variantName})` : ''}
                       </div>
                       
                       <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                         <Key size={16} className="text-muted" />
                         <span className="text-muted text-small">License Key:</span>
                         <code style={{ backgroundColor: 'var(--color-surface)', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-light)', fontSize: '0.875rem' }}>
                           {delivery.licenseKeyMasked || delivery.licenseKey || 'N/A'}
                         </code>
                         {delivery.licenseKey && (
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(delivery.licenseKey);
                                alert('License key copied.');
                              }}
                              style={{ marginLeft: 'var(--space-2)', background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontSize: '0.875rem' }}
                            >
                              Copy
                            </button>
                         )}
                       </div>
                       
                       {delivery.status === 'AVAILABLE' ? (
                         <a href={`${API_BASE_URL}/deliveries/${delivery.deliveryToken}/download`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                           <Button variant="primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                             <Download size={18} /> Download Product
                           </Button>
                         </a>
                       ) : (
                         <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: 'var(--color-warning)' }}>
                           Digital delivery is temporarily unavailable.
                         </div>
                       )}
                     </div>
                   );
                })}
              </div>
            </div>
          )}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Button variant="primary">Return to Home</Button>
          </Link>
        </div>
      </PageContainer>
    </PageTransition>
  );
};
