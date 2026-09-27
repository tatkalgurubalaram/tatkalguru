import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { products } from '../data/products';
import { filterProducts, sortProducts, paginateProducts, PRODUCTS_PER_PAGE } from '../utils/catalog';
import type { CatalogState } from '../utils/catalog';
import { PageContainer } from '../components/PageContainer';
import { PageHeader } from '../components/PageHeader';
import { PageTransition } from '../components/PageTransition';
import { config } from '../config';
import { Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';

import { CatalogSearch } from '../components/catalog/CatalogSearch';
import { FilterPanel } from '../components/catalog/FilterPanel';
import { MobileFilterDrawer } from '../components/catalog/MobileFilterDrawer';
import { SortSelect } from '../components/catalog/SortSelect';
import { ActiveFilters } from '../components/catalog/ActiveFilters';
import { ProductGrid } from '../components/catalog/ProductGrid';
import { Pagination } from '../components/catalog/Pagination';
import type { ProductCategory } from '../types/product';

export const CategoryPage: React.FC<{ title: string, categoryId: ProductCategory, description: string }> = ({ title, categoryId, description }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const state: CatalogState = {
    search: searchParams.get('search') || '',
    category: categoryId, // Forced category
    availability: searchParams.get('availability') || 'all',
    priceRange: searchParams.get('priceRange') || 'all',
    sort: searchParams.get('sort') || 'featured',
    page: parseInt(searchParams.get('page') || '1', 10) || 1
  };

  const updateState = (updates: Partial<CatalogState>) => {
    const newState = { ...state, ...updates, category: categoryId };
    
    if (updates.search !== undefined || updates.availability !== undefined || updates.priceRange !== undefined || updates.sort !== undefined) {
      newState.page = 1;
    }

    const params = new URLSearchParams();
    if (newState.search) params.set('search', newState.search);
    if (newState.availability !== 'all') params.set('availability', newState.availability);
    if (newState.priceRange !== 'all') params.set('priceRange', newState.priceRange);
    if (newState.sort !== 'featured') params.set('sort', newState.sort);
    if (newState.page > 1) params.set('page', newState.page.toString());

    setSearchParams(params);
  };

  useEffect(() => {
    document.title = `${title} | ${config.brandName}`;
  }, [title]);

  const filtered = filterProducts(products, state);
  const sorted = sortProducts(filtered, state.sort);
  const paginated = paginateProducts(sorted, state.page, PRODUCTS_PER_PAGE);

  const startItem = (state.page - 1) * PRODUCTS_PER_PAGE + 1;
  const endItem = Math.min(state.page * PRODUCTS_PER_PAGE, sorted.length);

  return (
    <PageTransition>
      <PageContainer>
        <PageHeader 
          title={title}
          description={description}
          breadcrumbs={[
            { label: 'Home', href: '/' },
            { label: 'Products', href: '/products' },
            { label: title }
          ]}
        />
        
        <CatalogSearch value={state.search} onChange={(val) => updateState({ search: val })} />
        
        <div className="flex flex-col lg:flex-row" style={{ gap: 'var(--space-8)' }}>
          {/* Desktop Sidebar */}
          <div className="hidden lg:block" style={{ width: '280px', flexShrink: 0 }}>
            <FilterPanel state={state} updateState={updateState} hideCategory={true} />
          </div>

          {/* Main Content */}
          <div style={{ flexGrow: 1, minWidth: 0 }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-6)', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="secondary" 
                  className="lg:hidden flex items-center gap-2" 
                  onClick={() => setIsMobileFilterOpen(true)}
                  style={{ height: '40px', padding: '0 16px' }}
                >
                  <Filter size={16} /> Filters
                </Button>
                <span className="text-muted text-small">
                  {sorted.length > 0 
                    ? `Showing ${startItem}–${endItem} of ${sorted.length} products` 
                    : '0 products'}
                </span>
              </div>

              <SortSelect value={state.sort} onChange={(val) => updateState({ sort: val })} />
            </div>

            <ActiveFilters state={state} updateState={updateState} hideCategory={true} />

            <ProductGrid products={paginated} onClearFilters={() => updateState({ search: '', availability: 'all', priceRange: 'all', page: 1 })} />
            
            <Pagination 
              currentPage={state.page} 
              totalItems={sorted.length} 
              itemsPerPage={PRODUCTS_PER_PAGE} 
              onPageChange={(p) => updateState({ page: p })} 
            />
          </div>
        </div>

        <MobileFilterDrawer 
          isOpen={isMobileFilterOpen} 
          onClose={() => setIsMobileFilterOpen(false)} 
          state={state} 
          updateState={updateState} 
        />
      </PageContainer>
    </PageTransition>
  );
};
