import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { apiClient } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiClient.post<{ success: boolean; data: any; message?: string }>('/auth/login', { email, password });
      if (res.success && res.data) {
        setAuth(res.data.user, res.data.accessToken);
        navigate('/account');
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Log In" description="Access your account to view your orders and downloads." />
      <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {error && <div style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{error}</div>}
          <Input 
            label="Email" 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
          />
          <Input 
            label="Password" 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button variant="primary" type="submit" disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
          <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
            <span className="text-muted">Don't have an account? </span>
            <Link to="/register" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Create Account</Link>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};
