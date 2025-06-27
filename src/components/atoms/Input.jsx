import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label, 
  icon, 
  error, 
  className = '', 
  type = 'text',
  ...props 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={icon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          className={`block w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-error' : ''}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;