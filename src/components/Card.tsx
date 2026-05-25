import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={`glass rounded-[30px] p-5 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
