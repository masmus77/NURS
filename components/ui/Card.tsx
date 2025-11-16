import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// Fix: Wrap Card component with React.forwardRef to allow ref forwarding.
const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('bg-white rounded-lg shadow-md overflow-hidden', className)} {...props}>
      {children}
    </div>
  );
});
Card.displayName = 'Card';


export const CardHeader: React.FC<CardProps> = ({ className, children, ...props }) => (
    <div className={cn('p-4 border-b', className)} {...props}>
        {children}
    </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, children, ...props }) => (
    <h3 className={cn('text-lg font-semibold text-gray-800', className)} {...props}>
        {children}
    </h3>
);


export const CardContent: React.FC<CardProps> = ({ className, children, ...props }) => (
    <div className={cn('p-4', className)} {...props}>
        {children}
    </div>
);

export const CardFooter: React.FC<CardProps> = ({ className, children, ...props }) => (
    <div className={cn('p-4 border-t bg-gray-50', className)} {...props}>
        {children}
    </div>
);


export default Card;