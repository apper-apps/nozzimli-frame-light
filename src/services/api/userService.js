import { mockUsers } from '@/services/mockData/users.json';

// Simulate current user (in real app, this would come from authentication)
const CURRENT_USER_ID = 1;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getCurrentUser() {
    await delay(300);
    const user = mockUsers.find(u => u.Id === CURRENT_USER_ID);
    if (!user) {
      throw new Error('User not found');
    }
    return { ...user };
  },

  async updateProfile(userData) {
    await delay(400);
    const userIndex = mockUsers.findIndex(u => u.Id === CURRENT_USER_ID);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    return { ...mockUsers[userIndex] };
  },

  async upgradeToVIP() {
    await delay(500);
    const userIndex = mockUsers.findIndex(u => u.Id === CURRENT_USER_ID);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex].role = 'VIP';
    return { ...mockUsers[userIndex] };
  }
};