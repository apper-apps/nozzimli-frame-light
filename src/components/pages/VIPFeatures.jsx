import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '@/contexts/AuthProvider';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';

const VIPFeatures = () => {
  const { user, isVIP, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!isVIP()) {
        toast.warning('VIP membership required to access this page');
        navigate('/settings');
        return;
      }
      
      await refreshUser();
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load VIP features');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadUserData} />;

  const features = [
    {
      icon: 'Sparkles',
      title: 'Premium Meditations',
      description: 'Access exclusive guided meditation sessions designed by wellness experts',
      color: 'from-purple-400 to-purple-600'
    },
    {
      icon: 'BookOpen',
      title: 'Wellness Courses',
      description: 'Complete comprehensive courses on mindfulness, stress management, and self-care',
      color: 'from-blue-400 to-blue-600'
    },
    {
      icon: 'Heart',
      title: 'Personalized Plans',
      description: 'Get AI-powered wellness plans tailored to your specific needs and goals',
      color: 'from-pink-400 to-pink-600'
    },
    {
      icon: 'TrendingUp',
      title: 'Advanced Analytics',
      description: 'Track your progress with detailed insights and personalized recommendations',
      color: 'from-green-400 to-green-600'
    },
    {
      icon: 'MessageCircle',
      title: 'Priority Support',
      description: '24/7 priority customer support from our wellness specialists',
      color: 'from-orange-400 to-orange-600'
    },
    {
      icon: 'Zap',
      title: 'Early Access',
      description: 'Be the first to try new features and wellness tools before anyone else',
      color: 'from-yellow-400 to-yellow-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Crown" size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">VIP Features</h1>
          <p className="text-gray-600">Welcome to your premium wellness experience</p>
          
          {/* VIP Badge */}
          <div className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full border border-primary/20">
            <ApperIcon name="Crown" size={16} className="text-primary" />
            <span className="text-primary font-semibold">VIP Member</span>
            <span className="text-gray-600">- {user?.name}</span>
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                🎉 Congratulations!
              </h2>
              <p className="text-gray-600">
                You've successfully upgraded to VIP! Your premium wellness journey starts now.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Features Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your VIP Benefits</h3>
          
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all cursor-pointer">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <ApperIcon name={feature.icon} size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                  <ApperIcon name="ChevronRight" size={16} className="text-gray-400 mt-1" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Button
            onClick={() => navigate('/home')}
            className="w-full"
          >
            Start Your VIP Journey
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/settings')}
            className="w-full"
          >
            Manage Subscription
          </Button>
        </motion.div>

        {/* Support */}
        <motion.div
          className="text-center text-sm text-gray-500 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p>Need help? Contact our VIP support team anytime</p>
          <p className="mt-1">💬 Available 24/7 for VIP members</p>
        </motion.div>
      </div>
    </div>
  );
};

export default VIPFeatures;