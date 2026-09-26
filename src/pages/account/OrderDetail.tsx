import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../lib/api';
import { formatCurrency } from '../../utils/currency';
import { ArrowLeft } from 'lucide-react';

export const AccountOrderDetail: React.FC = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: any; message?: string }>(`/users/me/orders/${orderNumber}`);
        if (res.success) {
          setOrder(res.data);
        } else {
          setError(res.message || 'Order not found.');
        }
      } catch (err) {
        setError('Order not found.');
      } finally {
        setLoading(false);
      }
    };
    if (orderNumber) fetchOrder();
  }, [orderNumber]);

  if (loading) return <div>Loading order details...</div>;
  
  if (error || !order) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <div style={{ color: 'var(--color-danger)', marginBottom: 'var(--space-4)' }}>{error || 'Order not found.'}</div>
        <Button variant="outline" onClick={() => navigate('/account/orders')}>Back to Orders</Button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <button onClick={() => navigate('/account/orders')} className="btn-ghost" style={{ border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="section-heading" style={{ margin: 0 }}>Order #{order.orderNumber}</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <Card>
          <h3 className="card-heading" style={{ marginBottom: 'var(--space-4)' }}>Order Information</h3>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Date:</span>
              <span style={{ fontWeight: 500 }}>{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Status:</span>
              <span style={{ fontWeight: 500 }}>{order.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-muted">Payment Method:</span>
              <span style={{ fontWeight: 500 }}>Razorpay</span>
            </div>
            {order.paymentId && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Payment ID:</span>
                <span style={{ fontWeight: 500 }}>••••••{order.paymentId.slice(-4)}</span>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="card-heading" style={{ marginBottom: 'var(--space-4)' }}>Customer Information</h3>
          <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
            <div>
              <span className="text-muted" style={{ display: 'block', fontSize: '14px' }}>Name</span>
              <span style={{ fontWeight: 500 }}>{order.customerFirstName} {order.customerLastName}</span>
            </div>
            <div>
              <span className="text-muted" style={{ display: 'block', fontSize: '14px' }}>Email</span>
              <span style={{ fontWeight: 500 }}>{order.customerEmail}</span>
            </div>
            {order.customerPhone && (
              <div>
                <span className="text-muted" style={{ display: 'block', fontSize: '14px' }}>Phone</span>
                <span style={{ fontWeight: 500 }}>{order.customerPhone}</span>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: 'var(--space-6)' }}>
        <h3 className="card-heading" style={{ marginBottom: 'var(--space-4)' }}>Order Items</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                <th style={{ padding: 'var(--space-3) 0', fontWeight: 600 }}>Product</th>
                <th style={{ padding: 'var(--space-3) 0', fontWeight: 600 }}>Quantity</th>
                <th style={{ padding: 'var(--space-3) 0', fontWeight: 600, textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item: any) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: 'var(--space-4) 0' }}>
                    <div style={{ fontWeight: 500 }}>{item.productName}</div>
                  </td>
                  <td style={{ padding: 'var(--space-4) 0' }}>{item.quantity}</td>
                  <td style={{ padding: 'var(--space-4) 0', textAlign: 'right', fontWeight: 500 }}>
                    {formatCurrency(item.price * item.quantity, order.currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 'var(--space-6)', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '300px', display: 'grid', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
              <span className="text-muted">Subtotal</span>
              <span>{formatCurrency(order.total, order.currency)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, marginTop: 'var(--space-2)', paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-light)' }}>
              <span>Total</span>
              <span>{formatCurrency(order.total, order.currency)}</span>
            </div>
          </div>
        </div>
      </Card>
      
      {order.status === 'PAID' && (
        <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
          <Link to="/account/licenses">
            <Button variant="primary">View Licenses</Button>
          </Link>
          <Link to="/account/downloads">
            <Button variant="outline">View Downloads</Button>
          </Link>
        </div>
      )}
    </div>
  );
};
