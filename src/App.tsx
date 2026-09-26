import { Routes, Route } from 'react-router-dom';
import { CustomerLayout } from './layouts/CustomerLayout';
import { ScrollToTop } from './components/ScrollToTop';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetail } from './pages/ProductDetail';
import { Contact } from './pages/Contact';
import { Cart } from './pages/Cart';
import { AccountLayout } from './layouts/AccountLayout';
import { AccountOverview } from './pages/account/Overview';
import { AccountOrders } from './pages/account/Orders';
import { AccountOrderDetail } from './pages/account/OrderDetail';
import { AccountLicenses } from './pages/account/Licenses';
import { AccountDownloads } from './pages/account/Downloads';
import { AccountSettings } from './pages/account/Settings';
import { NotFound } from './pages/NotFound';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminLayout } from './layouts/AdminLayout';
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminProducts } from './pages/admin/Products';
import { AdminAssets } from './pages/admin/Assets';
import { AdminOrders } from './pages/admin/Orders';
import { AdminCustomers } from './pages/admin/Customers';
import { AdminLicenses } from './pages/admin/Licenses';

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <CartProvider>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          
          <Route path="products">
            <Route index element={<Products />} />
            <Route path="software" element={<CategoryPage title="Software" categoryId="software" description="Explore software products and digital tools available through our marketplace." />} />
            <Route path="vps" element={<CategoryPage title="VPS Server" categoryId="vps" description="Explore server solutions for different workloads." />} />
            <Route path="proxy" element={<CategoryPage title="Proxy" categoryId="proxy" description="Explore available network and proxy solutions." />} />
            <Route path="combo" element={<CategoryPage title="Combo Packs" categoryId="combo" description="Explore bundled digital solutions." />} />
            <Route path=":slug" element={<ProductDetail />} />
          </Route>
          
          <Route path="contact" element={<Contact />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmation />} />
          
          <Route path="account" element={<AccountLayout />}>
            <Route index element={<AccountOverview />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="orders/:orderNumber" element={<AccountOrderDetail />} />
            <Route path="licenses" element={<AccountLicenses />} />
            <Route path="downloads" element={<AccountDownloads />} />
            <Route path="settings" element={<AccountSettings />} />
          </Route>
          
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Legal Pages Placeholders mapped to NotFound or temporary CategoryPage for now, but 404 is best per instructions if not built. */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="assets" element={<AdminAssets />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="licenses" element={<AdminLicenses />} />
        </Route>
      </Routes>
      <WhatsAppButton />
    </CartProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
