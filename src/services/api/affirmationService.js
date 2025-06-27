import { mockAffirmations } from '@/services/mockData/affirmations.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate user favorites storage
const userFavorites = [];

export const affirmationService = {
  async getDailyAffirmation() {
    await delay(300);
    // Get affirmation based on current date to ensure same affirmation per day
    const today = new Date().toDateString();
    const hash = today.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % mockAffirmations.length;
    
    return { ...mockAffirmations[index] };
  },

  async getRandomAffirmation() {
    await delay(250);
    const randomIndex = Math.floor(Math.random() * mockAffirmations.length);
    return { ...mockAffirmations[randomIndex] };
  },

  async getById(id) {
    await delay(200);
    const affirmation = mockAffirmations.find(a => a.Id === id);
    if (!affirmation) {
      throw new Error('Affirmation not found');
    }
    return { ...affirmation };
  },

  async getFavorites() {
    await delay(200);
    return userFavorites.map(favId => {
      const affirmation = mockAffirmations.find(a => a.Id === favId);
      return affirmation ? { ...affirmation } : null;
    }).filter(Boolean);
  },

  async addToFavorites(affirmationId) {
    await delay(200);
    if (!userFavorites.includes(affirmationId)) {
      userFavorites.push(affirmationId);
    }
    return true;
  },

  async removeFromFavorites(affirmationId) {
    await delay(200);
    const index = userFavorites.indexOf(affirmationId);
    if (index > -1) {
      userFavorites.splice(index, 1);
    }
    return true;
  }
};