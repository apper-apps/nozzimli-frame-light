import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import QuickActionTile from '@/components/molecules/QuickActionTile';
import ProgressRing from '@/components/molecules/ProgressRing';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { userService } from '@/services/api/userService';
import { taskService } from '@/services/api/taskService';
import { quotesService } from '@/services/api/quotesService';

const Home = () => {
  const [user, setUser] = useState(null);
  const [todaysTasks, setTodaysTasks] = useState([]);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [userData, tasksData, quoteData] = await Promise.all([
        userService.getCurrentUser(),
        taskService.getTodaysTasks(),
        quotesService.getDailyQuote()
      ]);
      
      setUser(userData);
      setTodaysTasks(tasksData);
      setDailyQuote(quoteData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadHomeData} />;

  const completedTasks = todaysTasks.filter(task => task.completed).length;
  const totalTasks = todaysTasks.length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const quickActions = [
    { icon: 'Plus', title: 'Add Task', subtitle: 'Create new task', path: '/tasks', color: 'primary' },
    { icon: 'Heart', title: 'Self Care', subtitle: 'Wellness tips', path: '/carespace', color: 'accent' },
    { icon: 'Sparkles', title: 'Affirmations', subtitle: 'Daily positivity', path: '/affirmations', color: 'secondary' },
    { icon: 'Settings', title: 'Settings', subtitle: 'Customize app', path: '/settings', color: 'warning' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header Greeting */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl font-bold text-gray-900 font-display">
            {getGreeting()}, {user?.name || 'Beautiful'}! ✨
          </h1>
          <p className="text-gray-600 mt-1">Ready to make today amazing?</p>
        </motion.div>

        {/* Daily Quote */}
        {dailyQuote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card gradient className="text-center">
              <ApperIcon name="Quote" size={24} className="text-primary mx-auto mb-3" />
              <p className="text-gray-800 font-medium italic leading-relaxed">
                "{dailyQuote.text}"
              </p>
              <p className="text-sm text-gray-500 mt-2">- {dailyQuote.author}</p>
            </Card>
          </motion.div>
        )}

        {/* Today's Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-display">
                  Today's Progress
                </h3>
                <p className="text-gray-600 text-sm">
                  {completedTasks} of {totalTasks} tasks completed
                </p>
              </div>
              <ProgressRing percentage={completionPercentage} size={64}>
                <span className="text-sm font-bold text-accent">
                  {completionPercentage}%
                </span>
              </ProgressRing>
            </div>
            
            {totalTasks > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>Remaining: {totalTasks - completedTasks}</span>
                  <span>Completed: {completedTasks}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-accent to-primary h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-display">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
              >
                <QuickActionTile {...action} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* VIP Status */}
        {user?.role === 'Free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <ApperIcon name="Crown" size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">Upgrade to VIP</h4>
                  <p className="text-xs text-gray-600">Unlock premium wellness content</p>
                </div>
                <ApperIcon name="ArrowRight" size={16} className="text-primary" />
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;