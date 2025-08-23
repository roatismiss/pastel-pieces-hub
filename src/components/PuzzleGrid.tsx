import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PuzzleGridProps {
  children: ReactNode;
  className?: string;
}

export const PuzzleGrid = ({ children, className }: PuzzleGridProps) => {
  return (
    <div className={cn("puzzle-grid", className)}>
      {children}
    </div>
  );
};

interface PuzzleCardProps {
  children: ReactNode;
  size?: '1x1' | '2x1' | '1x2' | '2x2';
  variant?: 'default' | 'orange' | 'turquoise' | 'mint';
  className?: string;
  onClick?: () => void;
}

export const PuzzleCard = ({ 
  children, 
  size = '1x1', 
  variant = 'default',
  className,
  onClick 
}: PuzzleCardProps) => {
  const sizeClasses = {
    '1x1': 'puzzle-1x1',
    '2x1': 'puzzle-2x1', 
    '1x2': 'puzzle-1x2',
    '2x2': 'puzzle-2x2'
  };

  const variantClasses = {
    'default': '',
    'orange': 'card-healio-orange',
    'turquoise': 'card-healio-turquoise',
    'mint': 'card-healio-mint'
  };

  return (
    <div 
      className={cn(
        "puzzle-card hover-lift cursor-pointer",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};