import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
  large?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', padding = true, large = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`card ${large ? 'card-lg' : ''} ${padding ? 'card-padding' : ''} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
