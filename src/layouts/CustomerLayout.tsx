import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';

export const CustomerLayout: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <main style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
};
