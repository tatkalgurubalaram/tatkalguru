import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { apiClient } from '../../lib/api';
import { formatCurrency } from '../../utils/currency';
import { Users, Package, ShoppingCart, Key, Download } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: any }>('/admin/dashboard');
        if (res.success) setData(res.data);
      } catch (error) {
        console.error('Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;
  if (!data) return <div>Unable to load dashboard.</div>;

  const statCard = (icon: any, title: string, value: string | number) => (
    <Card style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
      <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
        {icon}
      </div>
      <div>
        <div className="text-small text-muted" style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{title}</div>
        <div style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-heading)' }}>{value}</div>
      </div>
    </Card>
  );

  return (
    <div>
      <h1 className="section-heading" style={{ marginBottom: 'var(--space-8)' }}>Dashboard Overview</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {statCard(<Package size={24} color="var(--color-primary)" />, 'Products', data.metrics.totalProducts)}
        {statCard(<ShoppingCart size={24} color="var(--color-primary)" />, 'Total Orders', data.metrics.totalOrders)}
        {statCard(<Users size={24} color="var(--color-primary)" />, 'Customers', data.metrics.customers)}
        {statCard(<Key size={24} color="var(--color-primary)" />, 'Active Licenses', data.metrics.activeLicenses)}
        {statCard(<Download size={24} color="var(--color-primary)" />, 'Deliveries', data.metrics.deliveries)}
      </div>

      <h2 className="section-heading" style={{ fontSize: '20px', marginBottom: 'var(--space-4)' }}>Recent Orders</h2>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ backgroundColor: 'var(--bg-light)' }}>
              <tr>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Order</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Customer</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Amount</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Payment</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order: any) => (
                <tr key={order.id} style={{ borderTop: '1px solid var(--border-light)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 500 }}>{order.orderNumber}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{order.customerFirstName} {order.customerLastName}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600 }}>{formatCurrency(order.total, order.currency)}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', backgroundColor: order.paymentStatus === 'PAID' ? 'var(--color-success)' : 'var(--text-muted)', color: 'white' }}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', backgroundColor: 'var(--color-primary)', color: 'white' }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-muted)', fontSize: '14px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
