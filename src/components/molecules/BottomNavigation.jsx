import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const BottomNavigation = () => {
  const navItems = [
    { path: '/home', icon: 'Home', label: 'Home' },
    { path: '/tasks', icon: 'CheckSquare', label: 'Tasks' },
    { path: '/carespace', icon: 'Heart', label: 'CareSpace' },
    { path: '/affirmations', icon: 'Sparkles', label: 'Affirmations' },
    { path: '/settings', icon: 'Settings', label: 'Settings' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-100 px-4 py-2 z-50">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`
            }
          >
            {({ isActive }) => (
              <motion.div
                className="flex flex-col items-center"
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <div className={`p-1 rounded-lg ${isActive ? 'bg-primary/10' : ''}`}>
                  <ApperIcon 
                    name={item.icon} 
                    size={20} 
                    className={isActive ? 'text-primary' : 'text-gray-500'}
                  />
                </div>
                <span className={`text-xs mt-1 font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;