import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  padding = 'lg',
  ...props 
}) => {
  const paddings = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8'
  };

  const baseClasses = `bg-surface rounded-2xl shadow-soft border border-gray-100 ${paddings[padding]}`;
  const gradientClasses = gradient ? 'bg-gradient-to-br from-primary/5 to-secondary/5' : '';
  const hoverClasses = hover ? 'hover:shadow-lg transform hover:-translate-y-1' : '';

  return (
    <motion.div
      className={`${baseClasses} ${gradientClasses} ${hoverClasses} ${className}`}
      whileHover={hover ? { scale: 1.02 } : {}}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;