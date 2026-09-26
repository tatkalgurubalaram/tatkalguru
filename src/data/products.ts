import type { Product } from '../types/product';

export const products: Product[] = [
  {
    id: "prod-1",
    slug: "professional-software-suite",
    name: "Professional Software Suite",
    shortDescription: "A comprehensive digital software solution for modern workflows.",
    description: "The Professional Software Suite provides industry-leading digital tools for advanced workflows. Designed to run blazingly fast while providing a seamless user experience. Includes lifetime access to base modules and continuous security updates.",
    category: "software",
    price: 4999,
    originalPrice: 5999,
    currency: "INR",
    badge: "POPULAR",
    badgeVariant: "primary",
    rating: 4.8,
    reviewCount: 124,
    availability: "in_stock",
    featured: true,
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop"
    ],
    features: [
      "Advanced digital processing",
      "Cloud synchronization",
      "Automated workflow management",
      "Detailed reporting and analytics"
    ],
    specifications: {
      "License Type": "Perpetual (Single User)",
      "Format": "Digital Download",
      "Version": "v14.2.0",
      "Language": "English, Spanish, French"
    },
    requirements: [
      "Windows 10/11 or macOS 12+",
      "8GB RAM minimum (16GB recommended)",
      "Active internet connection for activation"
    ],
    deliveryInfo: "Digital License Key sent instantly via email upon order confirmation.",
    faqs: [
      { question: "Is this a subscription?", answer: "No, this is a one-time purchase for the current major version." },
      { question: "Can I use it on multiple devices?", answer: "The license covers a single user across up to two personal devices." }
    ]
  },
  {
    id: "prod-2",
    slug: "cloud-vps-starter",
    name: "Cloud VPS Starter",
    shortDescription: "High-performance virtual private server with NVMe storage. Perfect for startups.",
    description: "Our Cloud VPS Starter offers a balanced configuration for small to medium projects. Built on enterprise-grade hardware with NVMe storage for blazing fast IOPS.",
    category: "vps",
    price: 999,
    currency: "INR",
    badge: "SALE",
    badgeVariant: "error",
    rating: 4.5,
    reviewCount: 56,
    availability: "in_stock",
    featured: true,
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop",
    variants: [
      { id: "vps-1mo", name: "1 Month", price: 999, availability: "in_stock" },
      { id: "vps-6mo", name: "6 Months", price: 5500, originalPrice: 5994, availability: "in_stock" },
      { id: "vps-12mo", name: "12 Months", price: 10000, originalPrice: 11988, availability: "in_stock" }
    ],
    features: [
      "Full Root Access",
      "99.9% Uptime Guarantee",
      "1 IPv4 Address Included",
      "DDoS Protection"
    ],
    specifications: {
      "vCPU": "2 Cores",
      "RAM": "4 GB",
      "Storage": "50 GB NVMe",
      "Bandwidth": "1 TB / month"
    }
  },
  {
    id: "prod-3",
    slug: "premium-proxy-plan",
    name: "Premium Proxy Plan",
    shortDescription: "Reliable proxy network for data collection, privacy, and monitoring.",
    category: "proxy",
    price: 3500,
    currency: "INR",
    rating: 5.0,
    reviewCount: 42,
    availability: "in_stock",
    featured: true,
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=600&h=400&fit=crop"
  },
  {
    id: "prod-4",
    slug: "business-digital-combo",
    name: "Business Digital Combo",
    shortDescription: "Bundled software and premium hosting for new business projects.",
    category: "combo",
    price: 7999,
    originalPrice: 10000,
    currency: "INR",
    badge: "BEST VALUE",
    badgeVariant: "success",
    rating: 4.9,
    reviewCount: 200,
    availability: "in_stock",
    featured: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"
  },
  {
    id: "prod-5",
    slug: "creative-design-tools",
    name: "Creative Design Tools",
    shortDescription: "Essential tools for digital artists and designers.",
    category: "software",
    price: 1499,
    currency: "INR",
    availability: "in_stock",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop"
  },
  {
    id: "prod-6",
    slug: "vps-pro-max",
    name: "VPS Pro Max",
    shortDescription: "Top tier virtual private server with dedicated resources and priority support.",
    category: "vps",
    price: 4999,
    currency: "INR",
    badge: "NEW",
    badgeVariant: "info",
    availability: "coming_soon",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop"
  },
  {
    id: "prod-7",
    slug: "residential-proxies-100",
    name: "Residential Proxies (100 IPs)",
    shortDescription: "High anonymity residential proxies.",
    category: "proxy",
    price: 12000,
    currency: "INR",
    availability: "out_of_stock",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop"
  },
  {
    id: "prod-8",
    slug: "developer-combo",
    name: "Developer Combo",
    shortDescription: "VPS + Software tools aimed at backend developers.",
    category: "combo",
    price: 6000,
    currency: "INR",
    availability: "in_stock",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop"
  },
  {
    id: "prod-9",
    slug: "seo-software-pro",
    name: "SEO Software Pro",
    shortDescription: "Analyze and optimize your website for search engines.",
    category: "software",
    price: 2500,
    currency: "INR",
    rating: 4.2,
    reviewCount: 30,
    availability: "in_stock",
  },
  {
    id: "prod-10",
    slug: "budget-vps",
    name: "Budget VPS",
    shortDescription: "Affordable hosting for small projects and staging environments.",
    category: "vps",
    price: 399,
    currency: "INR",
    availability: "in_stock",
  },
  {
    id: "prod-11",
    slug: "proxy-5-ips",
    name: "Datacenter Proxy (5 IPs)",
    shortDescription: "Fast datacenter proxies for basic browsing and testing.",
    category: "proxy",
    price: 500,
    currency: "INR",
    availability: "in_stock",
  }
];
