import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../lib/api';

export const AccountSettings: React.FC = () => {
  const { user } = useAuth();
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const submitPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters' });
      return;
    }

    setLoading(true);
    try {
      const res = await apiClient.post<{ success: boolean; message?: string }>('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (res.success) {
        setMessage({ type: 'success', text: res.message || 'Password updated successfully' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setMessage({ type: 'error', text: res.message || 'Failed to update password' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div>
      <h2 className="section-heading" style={{ marginBottom: 'var(--space-6)' }}>Profile & Settings</h2>

      <div style={{ display: 'grid', gap: 'var(--space-8)' }}>
        <Card>
          <h3 className="card-heading" style={{ marginBottom: 'var(--space-4)' }}>Profile Information</h3>
          <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: '400px' }}>
            <div>
              <span className="text-muted" style={{ display: 'block', fontSize: '14px', marginBottom: 'var(--space-1)' }}>Name</span>
              <div style={{ fontWeight: 500, padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-sm)' }}>
                {user.firstName} {user.lastName}
              </div>
            </div>
            <div>
              <span className="text-muted" style={{ display: 'block', fontSize: '14px', marginBottom: 'var(--space-1)' }}>Email Address</span>
              <div style={{ fontWeight: 500, padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-sm)' }}>
                {user.email}
              </div>
            </div>
            <div>
              <span className="text-muted" style={{ display: 'block', fontSize: '14px', marginBottom: 'var(--space-1)' }}>Phone Number</span>
              <div style={{ fontWeight: 500, padding: 'var(--space-2) var(--space-3)', backgroundColor: 'var(--bg-light)', borderRadius: 'var(--radius-sm)' }}>
                {user.phone || 'Not provided'}
              </div>
            </div>
            <p className="text-small text-muted" style={{ marginTop: 'var(--space-2)' }}>
              Profile editing is currently managed by system administrators only.
            </p>
          </div>
        </Card>

        <Card>
          <h3 className="card-heading" style={{ marginBottom: 'var(--space-4)' }}>Change Password</h3>
          <form onSubmit={submitPasswordChange} style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: '400px' }}>
            {message.text && (
              <div style={{ 
                padding: 'var(--space-3)', 
                borderRadius: 'var(--radius-sm)', 
                backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                color: message.type === 'error' ? 'var(--color-danger)' : 'var(--color-success)',
                fontSize: '14px',
                fontWeight: 500
              }}>
                {message.text}
              </div>
            )}
            
            <Input 
              type="password" 
              label="Current Password" 
              name="currentPassword" 
              required 
              value={passwordForm.currentPassword} 
              onChange={handlePasswordChange} 
            />
            <Input 
              type="password" 
              label="New Password" 
              name="newPassword" 
              required 
              value={passwordForm.newPassword} 
              onChange={handlePasswordChange} 
            />
            <Input 
              type="password" 
              label="Confirm New Password" 
              name="confirmPassword" 
              required 
              value={passwordForm.confirmPassword} 
              onChange={handlePasswordChange} 
            />
            
            <div style={{ marginTop: 'var(--space-2)' }}>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
