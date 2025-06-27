import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const QuickActionTile = ({ icon, title, subtitle, path, color = 'primary' }) => {
  const navigate = useNavigate();

  const colorClasses = {
    primary: 'from-primary/20 to-primary/10 text-primary',
    secondary: 'from-secondary/20 to-secondary/10 text-secondary',
    accent: 'from-accent/20 to-accent/10 text-accent',
    warning: 'from-warning/20 to-warning/10 text-warning'
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card 
        className="cursor-pointer bg-gradient-to-br hover:shadow-lg transition-all duration-200"
        onClick={() => navigate(path)}
        padding="md"
      >
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-3`}>
          <ApperIcon name={icon} size={24} />
        </div>
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        {subtitle && (
          <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
        )}
      </Card>
    </motion.div>
  );
};

export default QuickActionTile;