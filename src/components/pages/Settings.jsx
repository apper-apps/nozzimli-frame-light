import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import VIPUpgradeModal from "@/components/molecules/VIPUpgradeModal";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import { userService } from "@/services/api/userService";
import { settingsService } from "@/services/api/settingsService";
const Settings = () => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    themeColor: '#F4A6CD',
    language: 'en',
    fontSize: 'medium'
});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [userData, settingsData] = await Promise.all([
        userService.getCurrentUser(),
        settingsService.getUserSettings()
      ]);
      setUser(userData);
      setSettings(settingsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSettingChange = async (key, value) => {
    try {
      const updatedSettings = { ...settings, [key]: value };
      await settingsService.updateSettings(updatedSettings);
      setSettings(updatedSettings);
      toast.success("Settings updated successfully! ✨");
    } catch (err) {
      toast.error(err.message);
    }
  };

const handleUpgradeToVIP = () => {
    setShowVIPModal(true);
  };

  const handleVIPUpgradeSuccess = async () => {
    setShowVIPModal(false);
    await loadData(); // Refresh user data
    toast.success("🎉 Welcome to VIP! Your premium wellness journey begins now!");
  };
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.error("Account deletion feature will be implemented with backend integration.");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const themeColors = [
    { name: 'Soft Pink', value: '#F4A6CD', gradient: 'from-pink-300 to-pink-400' },
    { name: 'Soft Blue', value: '#A8C8EC', gradient: 'from-blue-300 to-blue-400' },
    { name: 'Muted Green', value: '#8FA68E', gradient: 'from-green-300 to-green-400' },
    { name: 'Warm Purple', value: '#B19BE8', gradient: 'from-purple-300 to-purple-400' },
    { name: 'Coral', value: '#F4A68C', gradient: 'from-orange-300 to-orange-400' }
  ];

  const fontSizes = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' }
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
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Settings" size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Settings</h1>
          <p className="text-gray-600">Customize your wellness journey</p>
        </motion.div>

        {/* User Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{user?.name || 'User'}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user?.role === 'VIP' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {user?.role === 'VIP' ? '👑 VIP Member' : '🌸 Free Member'}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* VIP Upgrade */}
        {user?.role === 'Free' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <ApperIcon name="Crown" size={20} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Upgrade to VIP</h4>
                    <p className="text-sm text-gray-600">Unlock premium wellness content</p>
                  </div>
                </div>
                <Button size="sm" onClick={handleUpgradeToVIP}>
                  Upgrade
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Theme Colors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Theme Color</h3>
            <div className="grid grid-cols-5 gap-3">
              {themeColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => handleSettingChange('themeColor', color.value)}
                  className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.gradient} transition-all ${
                    settings.themeColor === color.value 
                      ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' 
                      : 'hover:scale-105'
                  }`}
                  title={color.name}
                />
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Language Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Language</h3>
            <div className="space-y-2">
              {[
                { label: 'English', value: 'en', flag: '🇺🇸' },
                { label: 'العربية', value: 'ar', flag: '🇸🇦' }
              ].map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleSettingChange('language', lang.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                    settings.language === lang.value
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.label}</span>
                  </div>
                  {settings.language === lang.value && (
                    <ApperIcon name="Check" size={16} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Font Size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Font Size</h3>
            <div className="flex space-x-2">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleSettingChange('fontSize', size.value)}
                  className={`flex-1 p-3 rounded-xl transition-colors font-medium ${
                    settings.fontSize === size.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Account</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Download" size={16} />
                  <span>Export Data</span>
                </div>
                <ApperIcon name="ChevronRight" size={16} />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Shield" size={16} />
                  <span>Privacy Settings</span>
                </div>
                <ApperIcon name="ChevronRight" size={16} />
              </button>
              
              <button 
                onClick={handleDeleteAccount}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-error/10 text-error hover:bg-error/20 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Trash2" size={16} />
                  <span>Delete Account</span>
                </div>
                <ApperIcon name="ChevronRight" size={16} />
              </button>
            </div>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          className="text-center text-sm text-gray-500 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <p>Nozzimli v1.0.0</p>
          <p className="mt-1">Made with 💖 for your wellness journey</p>
</motion.div>
      </div>

      {/* VIP Upgrade Modal */}
      <VIPUpgradeModal
        isOpen={showVIPModal}
        onClose={() => setShowVIPModal(false)}
        onSuccess={handleVIPUpgradeSuccess}
        user={user}
      />
    </div>
  );
};

export default Settings;