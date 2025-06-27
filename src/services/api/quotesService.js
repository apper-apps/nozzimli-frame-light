import { mockQuotes } from '@/services/mockData/quotes.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const quotesService = {
  async getDailyQuote() {
    await delay(200);
    // Get quote based on current date to ensure same quote per day
    const today = new Date().toDateString();
    const hash = today.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const index = Math.abs(hash) % mockQuotes.length;
    
    return { ...mockQuotes[index] };
  },

  async getRandomQuote() {
    await delay(200);
    const randomIndex = Math.floor(Math.random() * mockQuotes.length);
    return { ...mockQuotes[randomIndex] };
  }
};