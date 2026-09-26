import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { apiClient } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const res = await apiClient.post<{ success: boolean; data: any; message?: string }>('/auth/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      if (res.success && res.data) {
        setAuth(res.data.user, res.data.accessToken);
        navigate('/account');
      } else {
        setError(res.message || 'Unable to register.');
      }
    } catch (err: any) {
      setError(err.message || 'Unable to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader title="Create Account" description="Sign up to access and manage your digital products." />
      <div style={{ maxWidth: '400px', margin: '0 auto', width: '100%' }}>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {error && <div style={{ color: 'var(--color-danger)', fontSize: '0.875rem' }}>{error}</div>}
          
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Input label="First Name" name="firstName" required value={formData.firstName} onChange={handleChange} />
            <Input label="Last Name" name="lastName" required value={formData.lastName} onChange={handleChange} />
          </div>
          <Input label="Email" type="email" name="email" required value={formData.email} onChange={handleChange} />
          <Input label="Phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          
          <Input label="Password" type="password" name="password" required value={formData.password} onChange={handleChange} />
          <Input label="Confirm Password" type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} />
          
          <Button variant="primary" type="submit" disabled={loading} style={{ marginTop: 'var(--space-2)' }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
          
          <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
            <span className="text-muted">Already have an account? </span>
            <Link to="/login" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>Log In</Link>
          </div>
        </form>
      </div>
    </PageContainer>
  );
};
