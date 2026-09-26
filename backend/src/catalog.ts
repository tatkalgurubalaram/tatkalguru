export interface ProductVariant {
  id: string;
  name: string;
  price?: number;
  originalPrice?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  availability: 'in_stock' | 'out_of_stock' | 'coming_soon';
  variants?: ProductVariant[];
}

export const products: Product[] = [
  {
    id: "prod_001",
    slug: "whatsapp-marketing-software",
    name: "WhatsApp Marketing Software Pro",
    price: 999,
    originalPrice: 1499,
    currency: "INR",
    availability: "in_stock",
    variants: [
      { id: "var_001", name: "1 PC / 1 Year", price: 999, originalPrice: 1499 },
      { id: "var_002", name: "3 PCs / 1 Year", price: 2499, originalPrice: 3499 },
      { id: "var_003", name: "Unlimited PCs / Lifetime", price: 7999, originalPrice: 9999 }
    ]
  },
  {
    id: "prod_002",
    slug: "bulk-sms-sender",
    name: "Bulk SMS Sender Elite",
    price: 1499,
    currency: "INR",
    availability: "in_stock",
  },
  {
    id: "prod_003",
    slug: "data-extractor-suite",
    name: "Ultimate Data Extractor Suite",
    price: 1999,
    originalPrice: 2999,
    currency: "INR",
    availability: "in_stock",
  },
  {
    id: "prod_004",
    slug: "windows-vps-basic",
    name: "Windows VPS - Basic",
    price: 599,
    currency: "INR",
    availability: "in_stock",
    variants: [
      { id: "var_004", name: "1 Month", price: 599 },
      { id: "var_005", name: "3 Months (Save 10%)", price: 1617 },
      { id: "var_006", name: "12 Months (Save 20%)", price: 5750 }
    ]
  },
  {
    id: "prod_005",
    slug: "linux-vps-pro",
    name: "Linux VPS - Pro",
    price: 899,
    currency: "INR",
    availability: "in_stock",
  },
  {
    id: "prod_006",
    slug: "dedicated-server-max",
    name: "Dedicated Server Max",
    price: 4999,
    currency: "INR",
    availability: "in_stock",
  },
  {
    id: "prod_007",
    slug: "shared-datacenter-proxies",
    name: "Shared Datacenter Proxies (100 IPs)",
    price: 299,
    currency: "INR",
    availability: "in_stock",
  },
  {
    id: "prod_008",
    slug: "private-residential-proxies",
    name: "Private Residential Proxies (10GB)",
    price: 1299,
    originalPrice: 1599,
    currency: "INR",
    availability: "in_stock",
  },
  {
    id: "prod_009",
    slug: "4g-mobile-proxies",
    name: "4G Mobile Proxies - Dedicated",
    price: 2499,
    currency: "INR",
    availability: "coming_soon",
  },
  {
    id: "prod_010",
    slug: "starter-business-combo",
    name: "Starter Business Combo",
    price: 2499,
    originalPrice: 3500,
    currency: "INR",
    availability: "in_stock",
  },
  {
    id: "prod_011",
    slug: "ultimate-agency-bundle",
    name: "Ultimate Agency Bundle",
    price: 9999,
    originalPrice: 15000,
    currency: "INR",
    availability: "in_stock",
  }
];
