import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helperText, ...props }, ref) => {
    return (
      <div className="input-wrapper">
        {label && <label className="input-label">{label}</label>}
        <input
          ref={ref}
          className={`input-field ${error ? 'error' : ''} ${className}`}
          {...props}
        />
        {(error || helperText) && (
          <span className={`input-helper ${error ? 'error' : ''}`}>
            {error || helperText}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
