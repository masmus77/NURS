import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  // Fix: Add size prop to ButtonProps
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ className, variant = 'primary', size = 'md', children, ...props }) => {
  // Fix: Extracted size-specific classes from baseClasses
  const baseClasses = 'inline-flex items-center justify-center border border-transparent font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors';
  
  const variantClasses = {
    primary: 'bg-nuGreen hover:bg-nuGreen-dark text-white focus:ring-nuGreen',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-800 border-gray-300',
  };

  // Fix: Added size classes to handle different button sizes
  const sizeClasses = {
    sm: 'p-1',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button className={cn(baseClasses, sizeClasses[size], variantClasses[variant], className)} {...props}>
      {children}
    </button>
  );
};

export default Button;