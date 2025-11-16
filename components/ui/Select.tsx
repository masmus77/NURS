
import React from 'react';
import { cn } from '../../lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ className, children, ...props }) => {
  return (
    <select
      className={cn(
        'block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-nuGreen focus:border-nuGreen sm:text-sm',
        className
      )}
      {...props}
    >
        {children}
    </select>
  );
};

export default Select;
