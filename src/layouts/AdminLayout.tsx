import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Package, Box, ShoppingCart, Users, Key, LogOut } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/admin/login', { replace: true });
      } else if (user.role !== 'ADMIN') {
        // Safe access denied
        navigate('/account', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading || !user || user.role !== 'ADMIN') {
    return <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading Admin Panel...</div>;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    padding: 'var(--space-3) var(--space-4)',
    borderRadius: 'var(--radius-md)',
    textDecoration: 'none',
    color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    marginBottom: 'var(--space-1)',
    transition: 'all 0.2s'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#111827', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ fontSize: '20px', fontWeight: 700, letterSpacing: '-0.5px' }}>TF Admin</div>
          <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px' }}>{user.email}</div>
        </div>
        
        <nav style={{ padding: 'var(--space-4)', flexGrow: 1 }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 'var(--space-2)', marginTop: 'var(--space-4)', letterSpacing: '1px' }}>Overview</div>
          <NavLink to="/admin" end style={navLinkStyle}><LayoutDashboard size={18} /> Dashboard</NavLink>
          
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 'var(--space-2)', marginTop: 'var(--space-6)', letterSpacing: '1px' }}>Catalog</div>
          <NavLink to="/admin/products" style={navLinkStyle}><Package size={18} /> Products</NavLink>
          <NavLink to="/admin/assets" style={navLinkStyle}><Box size={18} /> Digital Assets</NavLink>
          
          <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 'var(--space-2)', marginTop: 'var(--space-6)', letterSpacing: '1px' }}>Commerce</div>
          <NavLink to="/admin/orders" style={navLinkStyle}><ShoppingCart size={18} /> Orders</NavLink>
          <NavLink to="/admin/customers" style={navLinkStyle}><Users size={18} /> Customers</NavLink>
          <NavLink to="/admin/licenses" style={navLinkStyle}><Key size={18} /> Licenses</NavLink>
        </nav>
        
        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button 
            onClick={handleLogout} 
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              padding: 'var(--space-3) var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              background: 'transparent',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              fontWeight: 500,
              textAlign: 'left'
            }}
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <main style={{ flexGrow: 1, padding: 'var(--space-8)', overflowY: 'auto', backgroundColor: '#F9FAFB' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
