import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { toast } from 'react-toastify';

const AffirmationCard = ({ affirmation, isFavorite, onToggleFavorite }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayAudio = () => {
    setIsPlaying(true);
    toast.info("🎵 Playing affirmation audio...");
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
      toast.success("✨ Audio playback completed");
    }, 3000);
  };

  return (
    <Card className="text-center" gradient padding="xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-6">
          <ApperIcon name="Sparkles" size={32} className="text-primary mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-800 leading-relaxed">
            "{affirmation.text}"
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="secondary"
            size="sm"
            icon={isPlaying ? "Pause" : "Play"}
            loading={isPlaying}
            onClick={handlePlayAudio}
          >
            {isPlaying ? "Playing..." : "Listen"}
          </Button>
          
          <motion.button
            onClick={() => onToggleFavorite(affirmation.Id)}
            className={`p-2 rounded-full transition-colors ${
              isFavorite ? 'text-error bg-error/10' : 'text-gray-400 hover:text-error'
            }`}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
          >
            <ApperIcon name="Heart" size={20} className={isFavorite ? 'fill-current' : ''} />
          </motion.button>
        </div>
      </motion.div>
    </Card>
  );
};

export default AffirmationCard;