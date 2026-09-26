import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { apiClient, API_BASE_URL } from '../../lib/api';
import { Download } from 'lucide-react';

export const AccountDownloads: React.FC = () => {
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: any[]; message?: string }>('/users/me/deliveries');
        if (res.success) {
          setDeliveries(res.data);
        } else {
          setError(res.message || 'Unable to load downloads.');
        }
      } catch (err) {
        setError('Unable to load downloads.');
      } finally {
        setLoading(false);
      }
    };
    fetchDownloads();
  }, []);

  const handleDownload = async (deliveryId: string, deliveryToken: string) => {
    setDownloading(prev => ({ ...prev, [deliveryId]: true }));
    try {
      // Use standard anchor approach to trigger browser download prompt safely.
      // Assuming GET is supported. If only POST or needs Authorization header, it might require a blob fetch approach.
      // Since it's digital delivery, usually token is enough if URL has it.
      
      const link = document.createElement('a');
      link.href = `${API_BASE_URL}/deliveries/${deliveryToken}/download`;
      link.target = '_blank'; // Optional: open in new tab for safety
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update local state temporarily for UX, next fetch will refresh real count
      setDeliveries(prev => prev.map(d => 
        d.id === deliveryId ? { ...d, downloadCount: d.downloadCount + 1 } : d
      ));
    } catch (err) {
      console.error('Download error');
    } finally {
      setTimeout(() => {
        setDownloading(prev => ({ ...prev, [deliveryId]: false }));
      }, 1500); // clear loading state after a brief moment
    }
  };

  if (loading) return <div>Loading downloads...</div>;
  if (error) return <div style={{ color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div>
      <h2 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>Digital Downloads</h2>

      {deliveries.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <Download size={48} color="var(--text-muted)" style={{ margin: '0 auto var(--space-4)' }} />
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--space-2)' }}>No digital downloads yet</div>
            <p className="text-muted">Your available digital products will appear here after purchase.</p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {deliveries.map(delivery => (
            <Card key={delivery.id}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: 'var(--space-1)' }}>Product: {delivery.productId}</div>
                  <div className="text-small text-muted" style={{ marginBottom: 'var(--space-2)' }}>
                    Order #{delivery.order?.orderNumber}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: '14px' }}>
                    <span className="text-muted">Status: <strong style={{ color: 'var(--text-heading)' }}>{delivery.status}</strong></span>
                    <span className="text-muted">Downloads: <strong style={{ color: 'var(--text-heading)' }}>{delivery.downloadCount}</strong></span>
                  </div>
                </div>
                
                <div>
                  {delivery.status === 'AVAILABLE' ? (
                    <Button 
                      variant="primary" 
                      onClick={() => handleDownload(delivery.id, delivery.deliveryToken)}
                      disabled={downloading[delivery.id]}
                      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                    >
                      {downloading[delivery.id] ? (
                        'Preparing download...'
                      ) : (
                        <><Download size={18} /> Download</>
                      )}
                    </Button>
                  ) : (
                    <Button variant="outline" disabled>Unavailable</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
