import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { calculateSubtotal, calculateTotal, getTotalQuantity } from '../utils/cart';
import type { CartItem } from '../utils/cart';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'CLEAR_CART' };

const CART_STORAGE_KEY = 'tatkalfast_cart_v1';

const initialState: CartState = {
  items: []
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: newItems };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity < 1) return state;
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        )
      };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };
    }
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalQuantity: number;
  subtotal: number;
  total: number;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (isOpen: boolean) => void;
  toastMessage: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (initial) => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Array.isArray(parsed.items)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to parse cart from local storage", e);
    }
    return initial;
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    showToast(`Added ${item.productName} to cart`);
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const totalQuantity = getTotalQuantity(state.items);
  const subtotal = calculateSubtotal(state.items);
  const total = calculateTotal(state.items);

  return (
    <CartContext.Provider value={{
      state, addItem, updateQuantity, removeItem, clearCart, 
      totalQuantity, subtotal, total, 
      isDrawerOpen, setIsDrawerOpen, toastMessage
    }}>
      {children}
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          style={{ position: 'fixed', bottom: '24px', right: '24px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-sm)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          role="status" aria-live="polite"
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
          <span style={{ fontWeight: 500 }}>{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
