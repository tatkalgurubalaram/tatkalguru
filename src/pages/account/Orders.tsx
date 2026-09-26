import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../lib/api';
import { formatCurrency } from '../../utils/currency';
import { FileText } from 'lucide-react';

export const AccountOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: any[]; message?: string }>('/users/me/orders');
        if (res.success) {
          setOrders(res.data);
        } else {
          setError(res.message || 'Unable to load your orders.');
        }
      } catch (err) {
        setError('Unable to load your orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div>
      <h2 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>My Orders</h2>
      
      {orders.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto var(--space-4)' }} />
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--space-2)' }}>No orders yet</div>
            <p className="text-muted" style={{ marginBottom: 'var(--space-4)' }}>Your purchased products will appear here.</p>
            <Link to="/products"><Button variant="primary">Browse Products</Button></Link>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {orders.map(order => (
            <Card key={order.id}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '16px' }}>Order #{order.orderNumber}</div>
                  <div className="text-small text-muted" style={{ marginTop: '4px' }}>
                    {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length || 0} Items
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700 }}>{formatCurrency(order.total, order.currency)}</div>
                    <div className="text-small" style={{ color: order.status === 'PAID' ? 'var(--color-success)' : 'var(--text-muted)' }}>
                      {order.status}
                    </div>
                  </div>
                  <Link to={`/account/orders/${order.orderNumber}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
