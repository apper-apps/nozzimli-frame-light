import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;
  const isToday = format(new Date(task.dueDate), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <Card className="group hover:shadow-lg transition-all duration-200" padding="md">
      <div className="flex items-start space-x-3">
        <motion.button
          onClick={() => onToggleComplete(task.Id)}
          className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed 
              ? 'bg-accent border-accent text-white' 
              : 'border-gray-300 hover:border-accent'
          }`}
          whileTap={{ scale: 0.9 }}
        >
          {task.completed && (
            <ApperIcon name="Check" size={12} />
          )}
        </motion.button>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-medium text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm text-gray-600 mt-1 ${task.completed ? 'line-through' : ''}`}>
                  {task.description}
                </p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-400 hover:text-primary transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <ApperIcon name="Edit2" size={14} />
              </motion.button>
              <motion.button
                onClick={() => onDelete(task.Id)}
                className="p-1 text-gray-400 hover:text-error transition-colors"
                whileTap={{ scale: 0.9 }}
              >
                <ApperIcon name="Trash2" size={14} />
              </motion.button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <Badge variant={task.priority.toLowerCase()}>
                {task.priority}
              </Badge>
              {isToday && (
                <Badge variant="primary">Today</Badge>
              )}
              {isOverdue && (
                <Badge variant="error">Overdue</Badge>
              )}
            </div>
            
            <div className="flex items-center text-xs text-gray-500">
              <ApperIcon name="Calendar" size={12} className="mr-1" />
              {format(new Date(task.dueDate), 'MMM dd')}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;