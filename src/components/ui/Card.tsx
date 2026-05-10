import React from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const CardComponent = ({
  className,
  variant = 'default',
  padding = 'md',
  children,
  ...props
}: CardProps) => {
  const baseStyles = 'rounded-xl transition-all duration-200';
  
  const variants: Record<string, string> = {
    default: 'bg-white shadow-soft border border-gray-100',
    elevated: 'bg-white shadow-medium border border-gray-100 hover:shadow-strong',
    outlined: 'bg-white border-2 border-gray-200',
  };

  const paddings: Record<string, string> = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], paddings[padding], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const Card = CardComponent;

const CardHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('mb-6 last:mb-0', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3
      className={cn('text-xl font-bold text-gray-900 mb-2', className)}
      {...props}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <p
      className={cn('text-gray-600 text-sm leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('', className)}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('mt-6 pt-6 border-t border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default CardComponent;
export { CardHeader, CardTitle, CardContent, CardFooter };
