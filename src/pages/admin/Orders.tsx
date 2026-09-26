import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { apiClient } from '../../lib/api';
import { formatCurrency } from '../../utils/currency';

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: any[] }>('/admin/orders');
        if (res.success) setOrders(res.data);
      } catch (error) {
        console.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading orders...</div>;

  return (
    <div>
      <h1 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>Order Management</h1>
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
              {orders.map((order: any) => (
                <tr key={order.id} style={{ borderTop: '1px solid var(--border-light)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 500 }}>{order.orderNumber}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{order.customerEmail}</td>
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
