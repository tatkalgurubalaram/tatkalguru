import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { apiClient } from '../../lib/api';
import { formatCurrency } from '../../utils/currency';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: any[] }>('/admin/products');
        if (res.success) setProducts(res.data);
      } catch (error) {
        console.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1 className="section-heading" style={{ margin: 0 }}>Products (Read-Only)</h1>
      </div>
      
      <div style={{ padding: 'var(--space-4)', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', fontSize: '14px', fontWeight: 500 }}>
        Note: The catalog is currently managed via source configuration. Full CRUD capabilities are limited to database-migrated catalogs.
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
            <thead style={{ backgroundColor: 'var(--bg-light)' }}>
              <tr>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>ID</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Name</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Category</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Price</th>
                <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Availability</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => (
                <tr key={product.id} style={{ borderTop: '1px solid var(--border-light)' }}>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'monospace', fontSize: '13px' }}>{product.id}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600 }}>{product.name}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{product.categoryId}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 500 }}>{formatCurrency(product.price, 'INR')}</td>
                  <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', backgroundColor: product.availability === 'in_stock' ? 'var(--color-success)' : 'var(--text-muted)', color: 'white' }}>
                      {product.availability === 'in_stock' ? 'AVAILABLE' : 'UNAVAILABLE'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
