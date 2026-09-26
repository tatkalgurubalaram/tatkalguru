import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';

export const AccountLayout: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <PageContainer><div style={{ padding: 'var(--space-8)' }}>Loading account...</div></PageContainer>;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'block',
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    color: isActive ? 'var(--color-primary)' : 'var(--text-heading)',
    backgroundColor: isActive ? 'var(--bg-light)' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    marginBottom: 'var(--space-1)',
    transition: 'all 0.2s'
  });

  return (
    <PageContainer>
      <PageHeader 
        title="My Account" 
        description={`Welcome back, ${user.firstName}`}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Account' }
        ]} 
      />
      
      <div style={{ marginTop: 'var(--space-8)' }}>
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <nav>
            <NavLink to="/account" end style={navLinkStyle}>Overview</NavLink>
            <NavLink to="/account/orders" style={navLinkStyle}>Orders</NavLink>
            <NavLink to="/account/licenses" style={navLinkStyle}>Licenses</NavLink>
            <NavLink to="/account/downloads" style={navLinkStyle}>Downloads</NavLink>
            <NavLink to="/account/settings" style={navLinkStyle}>Profile & Settings</NavLink>
            <button 
              onClick={handleLogout} 
              style={{
                width: '100%',
                textAlign: 'left',
                display: 'block',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                textDecoration: 'none',
                color: 'var(--color-danger)',
                backgroundColor: 'transparent',
                fontWeight: 500,
                marginTop: 'var(--space-4)',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Log Out
            </button>
          </nav>
          
          {/* Main Content Area */}
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
