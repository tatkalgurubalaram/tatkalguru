import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { PageContainer } from '../components/PageContainer';
import { PageTransition } from '../components/PageTransition';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency } from '../utils/currency';
import { config } from '../config';
import type { CheckoutData } from '../types/checkout';
import { ChevronRight, ShieldCheck, ArrowLeft, ShoppingCart, Info } from 'lucide-react';
import { apiClient } from '../lib/api';

export const Checkout: React.FC = () => {
  const { state, subtotal, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CheckoutData>({
    customer: { firstName: '', lastName: '', email: '', phone: '' },
    billing: { addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India' },
    paymentMethod: 'online'
  });

  const [useCustomerForBilling, setUseCustomerForBilling] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = `Checkout | ${config.brandName}`;
    // Redirect if cart is empty
    if (state.items.length === 0 && !isSubmitting) {
      navigate('/cart', { replace: true });
    }
  }, [state.items.length, navigate, isSubmitting]);

  if (state.items.length === 0) {
    return (
      <PageContainer>
        <div style={{ padding: 'var(--space-12) 0', textAlign: 'center' }}>
          <h2 className="section-heading" style={{ marginBottom: 'var(--space-4)' }}>Your cart is empty</h2>
          <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>Please add products before continuing.</p>
          <Link to="/products" style={{ textDecoration: 'none' }}><Button variant="primary">Browse Products</Button></Link>
        </div>
      </PageContainer>
    );
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<string, string>> = {};
    const { customer, billing } = formData;
    
    if (!customer.firstName.trim()) newErrors['customer.firstName'] = 'First name is required.';
    if (!customer.lastName.trim()) newErrors['customer.lastName'] = 'Last name is required.';
    if (!customer.email.trim() || !/^\S+@\S+\.\S+$/.test(customer.email)) newErrors['customer.email'] = 'A valid email is required.';
    if (!customer.phone.trim() || !/^[0-9+\s-]{7,15}$/.test(customer.phone)) newErrors['customer.phone'] = 'A valid phone number is required.';

    if (!billing.addressLine1.trim()) newErrors['billing.addressLine1'] = 'Address Line 1 is required.';
    if (!billing.city.trim()) newErrors['billing.city'] = 'City is required.';
    if (!billing.state.trim()) newErrors['billing.state'] = 'State is required.';
    if (!billing.postalCode.trim()) newErrors['billing.postalCode'] = 'Postal Code is required.';
    if (!billing.country.trim()) newErrors['billing.country'] = 'Country is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (section: 'customer' | 'billing', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    // Clear error for this field
    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[`${section}.${field}`];
        return newErrs;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const orderData = {
          customer: formData.customer,
          billing: useCustomerForBilling ? {
            addressLine1: formData.customer.firstName + ' ' + formData.customer.lastName, 
            city: 'N/A', state: 'N/A', postalCode: 'N/A', country: 'India' 
          } : formData.billing,
          paymentMethod: formData.paymentMethod,
          items: state.items.map(item => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity
          }))
        };
        
        if (useCustomerForBilling) {
           orderData.billing = {
             addressLine1: formData.customer.firstName + ' ' + formData.customer.lastName,
             addressLine2: '',
             city: 'N/A',
             state: 'N/A',
             postalCode: '000000',
             country: 'India'
           };
        }

        const response = await apiClient.post<{ success: boolean; data: any; message?: string }>('/orders', orderData);
        
        if (response.success && response.data) {
          const order = response.data;
          
          if (formData.paymentMethod === 'online') {
            // Load Razorpay
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = async () => {
              try {
                const paymentRes = await apiClient.post<{ success: boolean; data: any; message?: string }>('/payments/create-order', {
                  orderNumber: order.orderNumber
                });
                
                if (paymentRes.success && paymentRes.data) {
                  const options = {
                    key: paymentRes.data.keyId,
                    amount: paymentRes.data.amount * 100,
                    currency: paymentRes.data.currency,
                    name: config.brandName,
                    description: 'Order Payment',
                    order_id: paymentRes.data.gatewayOrderId,
                    handler: async (response: any) => {
                      try {
                        const verifyRes = await apiClient.post<{ success: boolean; message?: string }>('/payments/verify', {
                          orderNumber: order.orderNumber,
                          gatewayOrderId: response.razorpay_order_id,
                          gatewayPaymentId: response.razorpay_payment_id,
                          gatewaySignature: response.razorpay_signature
                        });
                        
                        if (verifyRes.success) {
                          clearCart();
                          navigate('/order-confirmation', { state: { orderNumber: order.orderNumber } });
                        } else {
                          alert(verifyRes.message || 'Payment verification failed');
                          setIsSubmitting(false);
                        }
                      } catch (e: any) {
                        alert(e.message || 'Payment verification failed');
                        setIsSubmitting(false);
                      }
                    },
                    prefill: {
                      name: paymentRes.data.customer.name,
                      email: paymentRes.data.customer.email,
                      contact: paymentRes.data.customer.contact
                    },
                    theme: {
                      color: '#000000'
                    },
                    modal: {
                      ondismiss: () => {
                        setIsSubmitting(false);
                      }
                    }
                  };
                  const rzp = new (window as any).Razorpay(options);
                  rzp.on('payment.failed', function (response: any) {
                    alert('Payment failed: ' + response.error.description);
                    setIsSubmitting(false);
                  });
                  rzp.open();
                } else {
                  alert(paymentRes.message || 'Unable to start payment');
                  setIsSubmitting(false);
                }
              } catch (err: any) {
                alert(err.message || 'Unable to start payment');
                setIsSubmitting(false);
              }
            };
            script.onerror = () => {
              alert('Failed to load payment gateway');
              setIsSubmitting(false);
            };
            document.body.appendChild(script);
          } else {
            // Manual payment
            clearCart();
            navigate('/order-confirmation', { state: { orderNumber: order.orderNumber } });
          }
        } else {
          alert(response.message || 'We couldn\'t create your order right now. Please try again.');
          setIsSubmitting(false);
        }
      } catch (error: any) {
        alert(error.message || 'We couldn\'t create your order right now. Please try again.');
        setIsSubmitting(false);
      }
    }
  };

  return (
    <PageTransition>
      <PageContainer>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: '14px', color: 'var(--text-muted)', marginBottom: 'var(--space-6)', marginTop: 'var(--space-6)', fontWeight: 500 }}>
          <Link to="/cart" style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShoppingCart size={16} /> Cart
          </Link>
          <ChevronRight size={14} />
          <span style={{ color: 'var(--text-heading)' }}>Checkout</span>
          <ChevronRight size={14} />
          <span>Confirmation</span>
        </div>

        <form onSubmit={handleSubmit} style={{ gap: 'var(--space-8)' }} className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Main Form Area */}
          <div className="lg:col-span-7 xl:col-span-8" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            
            <section style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
              <h2 className="card-heading" style={{ marginBottom: 'var(--space-6)' }}>Customer Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 'var(--space-4)' }}>
                <Input 
                  label="First Name" 
                  value={formData.customer.firstName} 
                  onChange={(e) => handleInputChange('customer', 'firstName', e.target.value)} 
                  error={errors['customer.firstName']}
                />
                <Input 
                  label="Last Name" 
                  value={formData.customer.lastName} 
                  onChange={(e) => handleInputChange('customer', 'lastName', e.target.value)} 
                  error={errors['customer.lastName']}
                />
                <Input 
                  label="Email Address" 
                  type="email" 
                  value={formData.customer.email} 
                  onChange={(e) => handleInputChange('customer', 'email', e.target.value)} 
                  error={errors['customer.email']}
                />
                <Input 
                  label="Phone Number" 
                  type="tel" 
                  value={formData.customer.phone} 
                  onChange={(e) => handleInputChange('customer', 'phone', e.target.value)} 
                  error={errors['customer.phone']}
                />
              </div>
            </section>

            <section style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h2 className="card-heading">Billing Information</h2>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: 'var(--text-muted)' }}>
                  <input 
                    type="checkbox" 
                    checked={useCustomerForBilling} 
                    onChange={(e) => setUseCustomerForBilling(e.target.checked)} 
                    style={{ cursor: 'pointer' }}
                  />
                  Same as customer
                </label>
              </div>

              {!useCustomerForBilling && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))', gap: 'var(--space-4)' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Input 
                      label="Address Line 1" 
                      value={formData.billing.addressLine1} 
                      onChange={(e) => handleInputChange('billing', 'addressLine1', e.target.value)} 
                      error={errors['billing.addressLine1']}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Input 
                      label="Address Line 2 (Optional)" 
                      value={formData.billing.addressLine2 || ''} 
                      onChange={(e) => handleInputChange('billing', 'addressLine2', e.target.value)} 
                    />
                  </div>
                  <Input 
                    label="City" 
                    value={formData.billing.city} 
                    onChange={(e) => handleInputChange('billing', 'city', e.target.value)} 
                    error={errors['billing.city']}
                  />
                  <Input 
                    label="State" 
                    value={formData.billing.state} 
                    onChange={(e) => handleInputChange('billing', 'state', e.target.value)} 
                    error={errors['billing.state']}
                  />
                  <Input 
                    label="Postal Code" 
                    value={formData.billing.postalCode} 
                    onChange={(e) => handleInputChange('billing', 'postalCode', e.target.value)} 
                    error={errors['billing.postalCode']}
                  />
                  <Input 
                    label="Country" 
                    value={formData.billing.country} 
                    onChange={(e) => handleInputChange('billing', 'country', e.target.value)} 
                    error={errors['billing.country']}
                  />
                </div>
              )}
            </section>

            <section style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--space-6)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)' }}>
              <h2 className="card-heading" style={{ marginBottom: 'var(--space-6)' }}>Payment Method</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', border: formData.paymentMethod === 'online' ? '2px solid var(--color-primary)' : '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', backgroundColor: formData.paymentMethod === 'online' ? 'var(--color-primary-light)' : 'var(--color-bg)', transition: 'all 0.2s' }}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="online" 
                    checked={formData.paymentMethod === 'online'}
                    onChange={() => setFormData(p => ({ ...p, paymentMethod: 'online' }))}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: formData.paymentMethod === 'online' ? 'var(--color-primary-dark)' : 'var(--text-heading)' }}>Secure Online Payment</span>
                    <span className="text-small text-muted">Credit Card, Netbanking, UPI, Wallets</span>
                  </div>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-4)', border: formData.paymentMethod === 'manual' ? '2px solid var(--color-primary)' : '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', backgroundColor: formData.paymentMethod === 'manual' ? 'var(--color-primary-light)' : 'var(--color-bg)', transition: 'all 0.2s' }}>
                  <input 
                    type="radio" 
                    name="paymentMethod" 
                    value="manual" 
                    checked={formData.paymentMethod === 'manual'}
                    onChange={() => setFormData(p => ({ ...p, paymentMethod: 'manual' }))}
                    style={{ transform: 'scale(1.2)' }}
                  />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600, color: formData.paymentMethod === 'manual' ? 'var(--color-primary-dark)' : 'var(--text-heading)' }}>Manual / Cash Transfer</span>
                    <span className="text-small text-muted">Instructions will be provided after checkout</span>
                  </div>
                </label>
              </div>
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px', backgroundColor: 'var(--color-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)', fontSize: '13px', lineHeight: 1.5 }}>
                <Info size={16} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Actual payment processing is not implemented in this stage. This is a secure frontend checkout preview.</span>
              </div>
            </section>
            
          </div>

          {/* Sidebar / Summary */}
          <div className="lg:col-span-5 xl:col-span-4" style={{ position: 'sticky', top: '90px', alignSelf: 'start' }}>
            <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-light)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              
              <h2 className="card-heading">Order Summary</h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                {state.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={item.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=60&h=60&fit=crop&blur=50'} alt="" style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }} />
                      <span style={{ position: 'absolute', top: '-6px', right: '-6px', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '11px', fontWeight: 700, width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                        {item.quantity}
                      </span>
                    </div>
                    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-heading)', lineHeight: 1.3 }}>{item.productName}</span>
                      {item.variantName && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.variantName}</span>}
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center' }}>
                      {formatCurrency(item.unitPrice * item.quantity, item.currency)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span className="text-muted">Subtotal</span>
                  <span style={{ fontWeight: 500 }}>{formatCurrency(subtotal, state.items[0]?.currency || 'INR')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span className="text-muted">Discount</span>
                  <span style={{ fontWeight: 500 }}>₹0</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-light)', margin: 'var(--space-1) 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 700 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(total, state.items[0]?.currency || 'INR')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isSubmitting} 
                  style={{ padding: '16px', fontSize: '16px', width: '100%', position: 'relative' }}
                >
                  {isSubmitting ? 'Processing...' : 'Place Order'}
                </Button>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  <ShieldCheck size={14} color="var(--color-success)" />
                  <span>Secure & Encrypted Checkout Preview</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <Link to="/cart" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowLeft size={14} /> Back to Cart
                </Link>
              </div>

            </div>
          </div>
        </form>
      </PageContainer>
    </PageTransition>
  );
};
