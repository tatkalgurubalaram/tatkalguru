import React, { useEffect, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../lib/api';
import { Key, Check, Copy } from 'lucide-react';

export const AccountLicenses: React.FC = () => {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: any[]; message?: string }>('/users/me/licenses');
        if (res.success) {
          setLicenses(res.data);
        } else {
          setError(res.message || 'Unable to load licenses.');
        }
      } catch (err) {
        setError('Unable to load licenses.');
      } finally {
        setLoading(false);
      }
    };
    fetchLicenses();
  }, []);

  const handleReveal = (id: string) => {
    setRevealed(prev => ({ ...prev, [id]: true }));
  };

  const handleCopy = async (id: string, licenseKey: string) => {
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopied(prev => ({ ...prev, [id]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [id]: false })), 2000);
    } catch (err) {
      console.error('Failed to copy');
    }
  };

  if (loading) return <div>Loading licenses...</div>;
  if (error) return <div style={{ color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div>
      <h2 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>My Licenses</h2>

      {licenses.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <Key size={48} color="var(--text-muted)" style={{ margin: '0 auto var(--space-4)' }} />
            <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: 'var(--space-2)' }}>No licenses yet</div>
            <p className="text-muted">Licenses for your eligible purchases will appear here.</p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {licenses.map(license => {
            const isRevealed = revealed[license.id];
            const isCopied = copied[license.id];
            
            return (
              <Card key={license.id}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: 'var(--space-1)' }}>Product: {license.productId}</div>
                    <div className="text-small text-muted" style={{ marginBottom: 'var(--space-4)' }}>
                      Order #{license.order?.orderNumber} • {new Date(license.createdAt).toLocaleDateString()}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <span className="text-muted" style={{ fontSize: '14px', fontWeight: 500 }}>Status:</span>
                        <span style={{ 
                          backgroundColor: license.status === 'ACTIVE' ? 'var(--color-success)' : 'var(--text-muted)', 
                          color: 'white', 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: 600 
                        }}>
                          {license.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ backgroundColor: 'var(--bg-light)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', minWidth: '300px' }}>
                    <div className="text-small text-muted" style={{ marginBottom: 'var(--space-2)', fontWeight: 500 }}>License Key</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <code style={{ 
                        flexGrow: 1, 
                        backgroundColor: 'var(--color-surface)', 
                        padding: '8px 12px', 
                        borderRadius: 'var(--radius-sm)', 
                        border: '1px solid var(--border-light)', 
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        letterSpacing: '1px'
                      }}>
                        {isRevealed ? license.licenseKey : `••••-••••-••••-${license.licenseKey.slice(-4)}`}
                      </code>
                    </div>
                    
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                      {!isRevealed ? (
                        <Button variant="outline" size="sm" onClick={() => handleReveal(license.id)} className="w-full">
                          Reveal
                        </Button>
                      ) : (
                        <Button 
                          variant={isCopied ? 'primary' : 'outline'} 
                          size="sm" 
                          onClick={() => handleCopy(license.id, license.licenseKey)} 
                          className="w-full"
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}
                          aria-live="polite"
                        >
                          {isCopied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
