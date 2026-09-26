import React from 'react';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'danger' | 'ghost' | 'outline' | 'glass' | 'glass-secondary';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg' | string;
  isLoading?: boolean;
}

// Use Framer Motion for button interactions
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', isLoading, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={`btn btn-${variant} ${className}`}
        disabled={disabled || isLoading}
        {...(props as HTMLMotionProps<"button">)}
      >
        {isLoading ? <span className="spinner" style={{ width: '20px', height: '20px', marginRight: '8px' }} /> : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
