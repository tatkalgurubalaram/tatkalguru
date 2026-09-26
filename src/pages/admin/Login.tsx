import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { PageContainer } from '../../components/PageContainer';
import { Shield } from 'lucide-react';
import { apiClient } from '../../lib/api';

export const AdminLogin: React.FC = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiClient.post<{ success: boolean; data: { accessToken: string; user: any } }>('/auth/login', { email, password });
      if (!res.success || !res.data) {
        throw new Error('Login failed');
      }
      
      setAuth(res.data.user, res.data.accessToken);

      if (res.data.user.role !== 'ADMIN') {
        setError('Unauthorized: Admin access required.');
      } else {
        navigate('/admin');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div style={{ maxWidth: '400px', margin: '10vh auto' }}>
        <Card>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'inline-flex', padding: 'var(--space-3)', backgroundColor: 'var(--bg-light)', borderRadius: '50%', marginBottom: 'var(--space-4)' }}>
              <Shield size={32} color="var(--color-primary)" />
            </div>
            <h1 className="section-heading" style={{ margin: 0, fontSize: '24px' }}>Admin Login</h1>
            <p className="text-muted" style={{ marginTop: 'var(--space-2)' }}>Secure access for authorized personnel only.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {error && <div style={{ padding: 'var(--space-3)', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', borderRadius: 'var(--radius-sm)', fontSize: '14px', fontWeight: 500 }}>{error}</div>}
            <Input label="Email Address" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            <Input label="Password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
            <Button type="submit" variant="primary" disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
};
