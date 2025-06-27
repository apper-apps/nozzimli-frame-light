import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  icon = "Inbox", 
  title = "Nothing here yet", 
  message = "Get started by adding your first item.", 
  actionLabel, 
  onAction 
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={36} className="text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-sm">
        {message}
      </p>
      
      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          icon="Plus"
          variant="primary"
          size="lg"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;