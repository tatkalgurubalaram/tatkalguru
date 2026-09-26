import React from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'neutral', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`badge badge-${variant} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);
Badge.displayName = 'Badge';
