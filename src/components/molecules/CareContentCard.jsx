import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const CareContentCard = ({ content, isLocked, onUpgrade }) => {
  return (
    <Card className="relative overflow-hidden" hover={!isLocked} padding="md">
      {isLocked && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center p-4">
            <ApperIcon name="Lock" size={32} className="text-primary mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700 mb-3">VIP Content</p>
            <Button size="sm" onClick={onUpgrade}>
              Upgrade to Unlock
            </Button>
          </div>
        </div>
      )}
      
      <div className={isLocked ? 'opacity-30' : ''}>
        {content.imageUrl && (
          <div className="w-full h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl mb-4 flex items-center justify-center">
            <ApperIcon name="Image" size={32} className="text-primary/60" />
          </div>
        )}
        
        <div className="flex items-start justify-between mb-2">
          <Badge variant={content.category.toLowerCase()}>{content.category}</Badge>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2">{content.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{content.description}</p>
        
        {!isLocked && (
          <motion.button
            className="mt-3 text-primary text-sm font-medium hover:text-primary/80 transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            Read More →
          </motion.button>
        )}
      </div>
    </Card>
  );
};

export default CareContentCard;