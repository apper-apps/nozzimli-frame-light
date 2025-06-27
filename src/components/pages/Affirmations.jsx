import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AffirmationCard from '@/components/molecules/AffirmationCard';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import ApperIcon from '@/components/ApperIcon';
import { affirmationService } from '@/services/api/affirmationService';

const Affirmations = () => {
  const [dailyAffirmation, setDailyAffirmation] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewAffirmation, setShowNewAffirmation] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [affirmationData, favoritesData] = await Promise.all([
        affirmationService.getDailyAffirmation(),
        affirmationService.getFavorites()
      ]);
      setDailyAffirmation(affirmationData);
      setFavorites(favoritesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFavorite = async (affirmationId) => {
    try {
      const isFavorite = favorites.some(fav => fav.Id === affirmationId);
      
      if (isFavorite) {
        await affirmationService.removeFromFavorites(affirmationId);
        setFavorites(favorites.filter(fav => fav.Id !== affirmationId));
        toast.success("Removed from favorites 💔");
      } else {
        const affirmation = await affirmationService.getById(affirmationId);
        await affirmationService.addToFavorites(affirmationId);
        setFavorites([...favorites, affirmation]);
        toast.success("Added to favorites! ❤️");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleNewAffirmation = async () => {
    try {
      setShowNewAffirmation(true);
      const newAffirmation = await affirmationService.getRandomAffirmation();
      setDailyAffirmation(newAffirmation);
      toast.success("Here's a new affirmation for you! ✨");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setShowNewAffirmation(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const isFavorite = dailyAffirmation ? favorites.some(fav => fav.Id === dailyAffirmation.Id) : false;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Sparkles" size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 font-display">Daily Affirmations</h1>
          <p className="text-gray-600">Nurture your mind with positivity</p>
        </motion.div>

        {/* Daily Affirmation */}
        {dailyAffirmation && (
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <AffirmationCard
              affirmation={dailyAffirmation}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex space-x-3 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleNewAffirmation}
            loading={showNewAffirmation}
            icon="Shuffle"
            className="flex-1"
          >
            New Affirmation
          </Button>
          <Button
            variant="secondary"
            icon="Heart"
            onClick={() => toast.info(`You have ${favorites.length} favorite affirmations! ❤️`)}
          >
            {favorites.length}
          </Button>
        </motion.div>

        {/* Mindfulness Tips */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 font-display mb-4">
            Mindfulness Tips
          </h3>
          
          {[
            {
              icon: 'Sun',
              title: 'Morning Ritual',
              tip: 'Start your day by reading your affirmation aloud with intention and belief.'
            },
            {
              icon: 'Heart',
              title: 'Feel the Words',
              tip: 'Don\'t just read - truly feel the positive emotions behind each affirmation.'
            },
            {
              icon: 'Repeat',
              title: 'Repetition is Key',
              tip: 'Repeat your favorite affirmations throughout the day for maximum impact.'
            }
          ].map((tip, index) => (
            <motion.div
              key={tip.title}
              className="bg-surface rounded-2xl p-4 shadow-soft border border-gray-100"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <ApperIcon name={tip.icon} size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-600">{tip.tip}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Favorite Affirmations Count */}
        {favorites.length > 0 && (
          <motion.div
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4">
              <ApperIcon name="Heart" size={24} className="text-primary mx-auto mb-2" />
              <p className="text-sm text-gray-700">
                You have <span className="font-semibold text-primary">{favorites.length}</span> favorite affirmations
              </p>
              <p className="text-xs text-gray-500 mt-1">Keep collecting the ones that resonate with your soul ✨</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Affirmations;