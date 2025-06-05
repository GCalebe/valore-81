
import React from 'react';
import { cn } from '@/lib/utils';
import { ShipWheel } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className,
  size = 'md',
  animated = true
}) => {
  const sizes = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28',
    lg: 'w-36 h-36'
  };

  return (
    <div className={cn(
      sizes[size],
      animated && 'animate-float',
      className
    )}>
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-lg">
        <ShipWheel className="w-2/3 h-2/3 text-white" />
      </div>
    </div>
  );
};

export default Logo;
