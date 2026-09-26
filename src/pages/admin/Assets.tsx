import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { apiClient, API_BASE_URL } from '../../lib/api';

export const AdminAssets: React.FC = () => {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [productId, setProductId] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [message, setMessage] = useState('');

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<{ success: boolean; data: any[] }>('/admin/assets');
      if (res.success) setAssets(res.data);
    } catch (error) {
      console.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !productId) return;
    
    setUploading(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', productId);
      formData.append('version', version);

      const token = localStorage.getItem('accessToken');
      
      const res = await fetch(`${API_BASE_URL}/admin/assets/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await res.json();
      if (data.success) {
        setMessage('Asset uploaded successfully!');
        setFile(null);
        setProductId('');
        setVersion('1.0.0');
        fetchAssets();
      } else {
        setMessage(data.message || 'Upload failed');
      }
    } catch (err) {
      setMessage('Upload failed due to network error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>Digital Assets</h1>

      <Card style={{ marginBottom: 'var(--space-8)' }}>
        <h2 className="card-heading" style={{ marginBottom: 'var(--space-4)' }}>Upload / Replace Asset</h2>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 200px' }}>
            <Input label="Product ID" required value={productId} onChange={e => setProductId(e.target.value)} placeholder="e.g. software" />
          </div>
          <div style={{ flex: '1 1 150px' }}>
            <Input label="Version" required value={version} onChange={e => setVersion(e.target.value)} placeholder="1.0.0" />
          </div>
          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column' }}>
            <label className="text-small text-muted" style={{ marginBottom: '4px', fontWeight: 600 }}>File</label>
            <input type="file" required onChange={e => setFile(e.target.files?.[0] || null)} style={{ padding: '8px' }} />
          </div>
          <div style={{ flex: '0 0 auto' }}>
            <Button type="submit" variant="primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Asset'}
            </Button>
          </div>
        </form>
        {message && <div style={{ marginTop: 'var(--space-4)', color: message.includes('success') ? 'var(--color-success)' : 'var(--color-danger)', fontWeight: 500 }}>{message}</div>}
      </Card>

      {loading ? (
        <div>Loading assets...</div>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead style={{ backgroundColor: 'var(--bg-light)' }}>
                <tr>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Product ID</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>File Name</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Version</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Size</th>
                  <th style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600, fontSize: '13px', color: 'var(--text-muted)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset: any) => (
                  <tr key={asset.id} style={{ borderTop: '1px solid var(--border-light)' }}>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontWeight: 600 }}>{asset.productId}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', fontFamily: 'monospace', fontSize: '13px' }}>{asset.fileName}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>{asset.version}</td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)', color: 'var(--text-muted)' }}>
                      {asset.fileSize ? `${(asset.fileSize / 1024 / 1024).toFixed(2)} MB` : 'N/A'}
                    </td>
                    <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', backgroundColor: asset.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--text-muted)', color: 'white' }}>
                        {asset.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};
