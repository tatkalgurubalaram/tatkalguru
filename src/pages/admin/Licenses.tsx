import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { apiClient } from '../../lib/api';

export const AdminLicenses: React.FC = () => {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: any[] }>('/admin/licenses');
        if (res.success) setLicenses(res.data);
      } catch (error) {
        console.error('Failed to load licenses');
      } finally {
        setLoading(false);
      }
    };
    fetchLicenses();
  }, []);

  if (loading) return <div>Loading licenses...</div>;

  return (
    <div>
      <h1 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>License Management</h1>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ backgroundColor: 'var(--bg-light)' }}>
              <tr>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>License Key</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Product ID</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Status</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Issued</th>
              </tr>
            </thead>
            <tbody>
              {licenses.map((license: any) => (
                <tr key={license.id} style={{ borderTop: '1px solid var(--border-light)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'monospace', fontWeight: 600, letterSpacing: '1px' }}>{license.licenseKey}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{license.productId}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', backgroundColor: license.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--text-muted)', color: 'white' }}>
                      {license.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-muted)', fontSize: '14px' }}>{new Date(license.issuedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
