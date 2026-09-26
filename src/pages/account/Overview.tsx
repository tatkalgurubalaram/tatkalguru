import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../lib/api';
import { formatCurrency } from '../../utils/currency';
import { Package, Key, Download, FileText } from 'lucide-react';

export const AccountOverview: React.FC = () => {
  const [stats, setStats] = useState({ orders: 0, licenses: 0, deliveries: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, licensesRes, deliveriesRes] = await Promise.all([
          apiClient.get<{ success: boolean; data: any[] }>('/users/me/orders'),
          apiClient.get<{ success: boolean; data: any[] }>('/users/me/licenses'),
          apiClient.get<{ success: boolean; data: any[] }>('/users/me/deliveries')
        ]);
        
        let ordersCount = 0;
        if (ordersRes.success) {
          ordersCount = ordersRes.data.length;
          setRecentOrders(ordersRes.data.slice(0, 3));
        }

        setStats({
          orders: ordersCount,
          licenses: licensesRes.success ? licensesRes.data.length : 0,
          deliveries: deliveriesRes.success ? deliveriesRes.data.length : 0
        });
      } catch (err) {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading overview...</div>;

  return (
    <div>
      <h2 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>Dashboard Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-light)', borderRadius: '50%' }}>
            <Package size={24} color="var(--color-primary)" />
          </div>
          <div>
            <div className="text-muted text-small">Total Orders</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.orders}</div>
          </div>
        </Card>
        
        <Card style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-light)', borderRadius: '50%' }}>
            <Key size={24} color="var(--color-primary)" />
          </div>
          <div>
            <div className="text-muted text-small">Active Licenses</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.licenses}</div>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--bg-light)', borderRadius: '50%' }}>
            <Download size={24} color="var(--color-primary)" />
          </div>
          <div>
            <div className="text-muted text-small">Available Downloads</div>
            <div style={{ fontSize: '24px', fontWeight: 700 }}>{stats.deliveries}</div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h3 className="section-heading" style={{ margin: 0 }}>Recent Orders</h3>
        <Link to="/account/orders" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 500 }}>View All</Link>
      </div>

      {recentOrders.length === 0 ? (
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
          {recentOrders.map(order => (
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
