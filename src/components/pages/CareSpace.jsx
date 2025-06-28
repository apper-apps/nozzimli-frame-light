import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import CareContentCard from "@/components/molecules/CareContentCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import { careContentService } from "@/services/api/careContentService";
import { userService } from "@/services/api/userService";
import { imageService } from "@/services/api/imageService";
const CareSpace = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Tips');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [contentData, userData] = await Promise.all([
        careContentService.getAllContent(),
        userService.getCurrentUser()
      ]);
      
      setContent(contentData || []);
      setUser(userData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpgrade = () => {
    toast.info("✨ Upgrade to VIP to unlock premium wellness content!");
  };

const categories = [
    { key: 'Tips', label: 'Mental Health Tips', icon: 'Brain', available: true },
    { key: 'Food', label: 'Nutrition Plans', icon: 'Apple', available: user?.role === 'Admin' || user?.role === 'VIP' },
    { key: 'Wellness', label: 'Wellness Routines', icon: 'Activity', available: user?.role === 'Admin' || user?.role === 'VIP' }
  ];

  const filteredContent = content.filter(item => item.category === activeCategory);
  const isContentLocked = user?.role !== 'VIP' && activeCategory !== 'Tips';
  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
{/* Header */}
        <motion.div
          className="text-center mb-6 relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Background sanctuary image */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <img
              src={imageService.getHeaderImage()}
              alt="Wellness sanctuary"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-secondary/10"></div>
          </div>
          
          {/* Header content */}
          <div className="relative z-10 py-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
              <ApperIcon name="Heart" size={32} className="text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">CareSpace</h1>
            <p className="text-gray-700 font-medium">Your wellness sanctuary</p>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          className="flex space-x-2 mb-6 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              disabled={!category.available}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all relative ${
                activeCategory === category.key
                  ? 'bg-primary text-white shadow-lg'
                  : category.available
                  ? 'bg-surface text-gray-600 hover:bg-gray-50 border border-gray-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <ApperIcon name={category.icon} size={16} />
              <span>{category.label}</span>
              {!category.available && (
                <ApperIcon name="Lock" size={12} className="text-gray-400" />
              )}
            </button>
          ))}
        </motion.div>

        {/* VIP Banner */}
        {user?.role === 'Free' && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
<div 
              className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all relative overflow-hidden"
              onClick={handleUpgrade}
            >
              {/* Premium background image */}
              <div className="absolute inset-0">
                <img
                  src={imageService.getPremiumImage()}
                  alt="Premium content"
                  className="w-full h-full object-cover opacity-10"
                />
              </div>
              
              <div className="flex items-center space-x-3 relative z-10">
                <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <ApperIcon name="Crown" size={20} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Unlock Premium Content</h3>
                  <p className="text-sm text-gray-600">Get access to nutrition plans and wellness routines</p>
                </div>
                <ApperIcon name="ArrowRight" size={16} className="text-primary" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Grid */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredContent.length === 0 ? (
            <Empty
              icon="Heart"
              title="No content available"
              message={`No ${activeCategory.toLowerCase()} content found at the moment.`}
            />
          ) : (
            filteredContent.map((item, index) => (
              <motion.div
                key={item.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CareContentCard
                  content={item}
                  isLocked={isContentLocked}
                  onUpgrade={handleUpgrade}
                />
              </motion.div>
            ))
          )}
        </motion.div>

{/* Daily Affirmations Section */}
        {activeCategory === 'Tips' && (
          <motion.div
            className="mt-8 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
{/* Daily Affirmation */}
            <div className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl border border-primary/20 relative overflow-hidden">
              {/* Affirmation background */}
              <div className="absolute inset-0">
                <img
                  src={imageService.getAffirmationImage()}
                  alt="Daily affirmation"
                  className="w-full h-full object-cover opacity-30"
                />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-3">
                  <ApperIcon name="Sparkles" size={20} className="text-primary" />
                  <h3 className="font-semibold text-gray-900">Daily Affirmation</h3>
                </div>
                <p className="text-sm text-gray-900 italic font-medium leading-relaxed">
                  "I am worthy of love, peace, and all the beautiful things life has to offer. Today I choose to be gentle with myself and celebrate every small victory." ✨
                </p>
              </div>
            </div>

{/* Wellness Tip */}
            <div className="p-4 bg-accent/10 rounded-2xl relative overflow-hidden">
              {/* Wellness tip background */}
              <div className="absolute inset-0">
                <img
                  src={imageService.getWellnessTipImage()}
                  alt="Daily wellness tip"
                  className="w-full h-full object-cover opacity-20"
                />
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-3">
                  <ApperIcon name="Lightbulb" size={20} className="text-accent" />
                  <h3 className="font-semibold text-gray-900">Daily Wellness Tip</h3>
                </div>
                <p className="text-sm text-gray-800">
                  Take 5 minutes today to practice deep breathing. Inhale for 4 counts, hold for 4, exhale for 6. This simple technique can reduce stress and increase mindfulness. 🌸
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIP Content Showcase */}
        {activeCategory !== 'Tips' && user?.role === 'Free' && (
          <motion.div
            className="mt-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Lock" size={32} className="text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">VIP Content Locked</h3>
            <p className="text-gray-600 text-sm mb-4">
              Unlock premium {activeCategory.toLowerCase()} content and enhance your wellness journey
            </p>
            <button
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-medium text-sm hover:shadow-lg transition-all"
            >
              Upgrade to VIP ✨
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CareSpace;