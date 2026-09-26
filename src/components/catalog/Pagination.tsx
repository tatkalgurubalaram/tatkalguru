import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-12)' }}>
      <Button 
        variant="ghost" 
        disabled={currentPage === 1} 
        onClick={() => onPageChange(currentPage - 1)}
        style={{ padding: '0 12px' }}
        aria-label="Previous Page"
      >
        <ChevronLeft size={20} />
      </Button>
      
      {pages.map(p => (
        <Button 
          key={p} 
          variant={currentPage === p ? 'primary' : 'ghost'}
          onClick={() => onPageChange(p)}
          style={{ width: '40px', height: '40px', padding: 0 }}
          aria-current={currentPage === p ? 'page' : undefined}
        >
          {p}
        </Button>
      ))}

      <Button 
        variant="ghost" 
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(currentPage + 1)}
        style={{ padding: '0 12px' }}
        aria-label="Next Page"
      >
        <ChevronRight size={20} />
      </Button>
    </div>
  );
};
