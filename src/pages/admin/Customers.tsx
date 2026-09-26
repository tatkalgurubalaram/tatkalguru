import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { apiClient } from '../../lib/api';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: any[] }>('/admin/customers');
        if (res.success) setCustomers(res.data);
      } catch (error) {
        console.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  if (loading) return <div>Loading customers...</div>;

  return (
    <div>
      <h1 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>Customers</h1>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ backgroundColor: 'var(--bg-light)' }}>
              <tr>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Name</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Email</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Phone</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer: any) => (
                <tr key={customer.id} style={{ borderTop: '1px solid var(--border-light)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600 }}>{customer.firstName} {customer.lastName}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{customer.email}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{customer.phone || 'N/A'}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', backgroundColor: customer.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--text-muted)', color: 'white' }}>
                      {customer.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-muted)', fontSize: '14px' }}>{new Date(customer.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
