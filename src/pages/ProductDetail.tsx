import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import { PageContainer } from '../components/PageContainer';
import { PageTransition } from '../components/PageTransition';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { Badge } from '../components/ui/Badge';
import { Star, ShieldCheck, Zap, Info } from 'lucide-react';
import { config } from '../config';
import { formatCurrency } from '../utils/currency';

import { ProductGallery } from '../components/product/ProductGallery';
import { QuantitySelector } from '../components/product/QuantitySelector';
import { ProductVariantSelector } from '../components/product/ProductVariantSelector';
import { ProductActions } from '../components/product/ProductActions';
import { ProductDetails } from '../components/product/ProductDetails';
import { ProductFAQ } from '../components/product/ProductFAQ';
import { RelatedProducts } from '../components/product/RelatedProducts';
import { ProductNotFound } from '../components/product/ProductNotFound';
import { useCart } from '../context/CartContext';
import { getCartItemId } from '../utils/cart';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const product = products.find(p => p.slug === slug);
  const { addItem } = useCart();
  
  const [selectedVariantId, setSelectedVariantId] = useState<string>(() => {
    if (product?.variants && product.variants.length > 0) {
      return product.variants[0].id;
    }
    return '';
  });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | ${config.brandName}`;
    }
  }, [product]);

  if (!product) return <ProductNotFound />;

  // Get active price based on variant
  const activeVariant = product.variants?.find(v => v.id === selectedVariantId);
  const displayPrice = activeVariant?.price !== undefined ? activeVariant.price : product.price;
  const displayOriginalPrice = activeVariant?.originalPrice !== undefined ? activeVariant.originalPrice : product.originalPrice;

  const handleAddToCart = () => {
    if (!product || displayPrice === undefined) return;
    
    addItem({
      id: getCartItemId(product.id, selectedVariantId || undefined),
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      image: product.image,
      quantity: quantity,
      unitPrice: displayPrice,
      variantId: selectedVariantId || undefined,
      variantName: activeVariant?.name,
      currency: product.currency
    });
  };

  // Find related products (same category first, then others)
  const related = products
    .filter(p => p.id !== product.id)
    .sort((a, b) => {
      if (a.category === product.category && b.category !== product.category) return -1;
      if (a.category !== product.category && b.category === product.category) return 1;
      return 0;
    })
    .slice(0, 4);

  return (
    <PageTransition>
      <PageContainer>
        <div style={{ padding: 'var(--space-6) 0' }}>
          <Breadcrumb 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Products', href: '/products' },
              { label: product.category.toUpperCase(), href: `/products/${product.category}` },
              { label: product.name }
            ]}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-12)', marginTop: 'var(--space-6)' }} className="lg:grid-cols-2">
          {/* Left: Gallery */}
          <div>
            <ProductGallery image={product.image} images={product.images} productName={product.name} />
          </div>

          {/* Right: Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              {product.badge && (
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <Badge variant={product.badgeVariant || 'primary'}>{product.badge}</Badge>
                </div>
              )}
              <h1 className="hero-heading" style={{ fontSize: '32px', marginBottom: 'var(--space-2)' }}>{product.name}</h1>
              
              {product.rating !== undefined && (
                <div className="flex items-center gap-2" style={{ marginBottom: 'var(--space-4)' }}>
                  <div className="flex text-warning">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" opacity={product.rating >= 4.8 ? 1 : 0.5} />
                  </div>
                  <span style={{ fontWeight: 600 }}>{product.rating}</span>
                  <span className="text-muted text-small">({product.reviewCount || 0} reviews)</span>
                </div>
              )}

              <p className="text-body text-muted" style={{ fontSize: '18px', lineHeight: 1.6 }}>
                {product.shortDescription}
              </p>
            </div>

            <div style={{ padding: 'var(--space-6) 0', borderTop: '1px solid var(--border-light)', borderBottom: '1px solid var(--border-light)' }}>
              {displayPrice !== undefined ? (
                <div className="flex items-baseline gap-3">
                  <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--text-heading)' }}>
                    {formatCurrency(displayPrice, product.currency)}
                  </span>
                  {displayOriginalPrice !== undefined && (
                    <span style={{ fontSize: '18px', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                      {formatCurrency(displayOriginalPrice, product.currency)}
                    </span>
                  )}
                  {displayOriginalPrice !== undefined && displayPrice < displayOriginalPrice && (
                    <Badge variant="success">
                      {Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)}% OFF
                    </Badge>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: '24px', fontWeight: 600, color: 'var(--text-muted)' }}>Pricing unavailable</span>
              )}
            </div>

            {/* Availability */}
            <div>
              {product.availability === 'in_stock' && <span className="text-success" style={{ fontWeight: 600 }}>● In Stock</span>}
              {product.availability === 'out_of_stock' && <span className="text-error" style={{ fontWeight: 600 }}>● Out of Stock</span>}
              {product.availability === 'coming_soon' && <span className="text-warning" style={{ fontWeight: 600 }}>● Coming Soon</span>}
            </div>

            <ProductVariantSelector 
              variants={product.variants || []} 
              selectedId={selectedVariantId} 
              currency={product.currency}
              onSelect={setSelectedVariantId} 
            />

            <div className="flex gap-4" style={{ alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Quantity</label>
                <QuantitySelector quantity={quantity} onChange={setQuantity} />
              </div>
              <div style={{ flexGrow: 1, minWidth: '200px' }}>
                <ProductActions availability={product.availability} onAddToCart={handleAddToCart} />
              </div>
            </div>

            {/* Benefits */}
            <div style={{ marginTop: 'var(--space-4)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-4)' }}>
              <div className="flex items-center gap-2 text-small text-muted">
                <ShieldCheck size={16} color="var(--color-primary)" /> Secure checkout
              </div>
              <div className="flex items-center gap-2 text-small text-muted">
                <Zap size={16} color="var(--color-primary)" /> Instant digital delivery
              </div>
              <div className="flex items-center gap-2 text-small text-muted">
                <Info size={16} color="var(--color-primary)" /> Clear product details
              </div>
            </div>
          </div>
        </div>

        <ProductDetails product={product} />
        
        {product.faqs && <ProductFAQ faqs={product.faqs} />}
        
        <RelatedProducts products={related} />

      </PageContainer>
    </PageTransition>
  );
};
