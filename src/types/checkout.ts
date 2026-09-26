export type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type BillingAddress = {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type PaymentMethod = 'online' | 'manual';

export type CheckoutData = {
  customer: CheckoutCustomer;
  billing: BillingAddress;
  paymentMethod: PaymentMethod;
};
