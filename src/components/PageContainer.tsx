import React from 'react';

export const PageContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="container" style={{ padding: 'var(--space-8) var(--space-4)', flexGrow: 1 }}>
      {children}
    </div>
  );
};
