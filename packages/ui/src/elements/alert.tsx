import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  className?: string;
}

function Alert({ children, className = '' }: AlertProps) {
  return (
    <div className={`p-4 rounded-lg border ${className}`} role="alert">
      {children}
    </div>
  );
}

function AlertTitle({ children }: { children: React.ReactNode }) {
  return <h5 className="font-medium mb-1">{children}</h5>;
}

function AlertDescription({ children }: { children: React.ReactNode }) {
  return <div className="text-sm">{children}</div>;
}

export { Alert, AlertTitle, AlertDescription }