import mockUsers from '@/services/mockData/users.json';

// Authentication state
let currentUser = null;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async login(email, password) {
    await delay(500);
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    currentUser = { ...user };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return { ...user };
  },

  async logout() {
    await delay(200);
    currentUser = null;
    localStorage.removeItem('currentUser');
    return true;
  },

  async getCurrentUser() {
    await delay(300);
    
    // Check if user is stored in localStorage
    if (!currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        currentUser = JSON.parse(storedUser);
      }
    }
    
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    // Refresh user data from mock database
    const user = mockUsers.find(u => u.Id === currentUser.Id);
    if (!user) {
      throw new Error('User not found');
    }
    
    currentUser = { ...user };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return { ...user };
  },

  async updateProfile(userData) {
    await delay(400);
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    const userIndex = mockUsers.findIndex(u => u.Id === currentUser.Id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
    currentUser = { ...mockUsers[userIndex] };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return { ...mockUsers[userIndex] };
  },

  async updateVoiceSettings(voiceSettings) {
    await delay(300);
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    const userIndex = mockUsers.findIndex(u => u.Id === currentUser.Id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = { 
      ...mockUsers[userIndex], 
      voiceSettings: { ...mockUsers[userIndex].voiceSettings, ...voiceSettings }
    };
    currentUser = { ...mockUsers[userIndex] };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return { ...mockUsers[userIndex] };
  },

  async upgradeToVIP() {
    await delay(500);
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    const userIndex = mockUsers.findIndex(u => u.Id === currentUser.Id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex].role = 'VIP';
    currentUser = { ...mockUsers[userIndex] };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return { ...mockUsers[userIndex] };
  },

  async exportUserData() {
    await delay(400);
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    const userData = {
      profile: { ...currentUser },
      settings: {
        themeColor: currentUser.themeColor || '#F4A6CD',
        language: currentUser.language || 'en',
        fontSize: currentUser.fontSize || 'medium',
        voiceAlerts: currentUser.voiceSettings?.enabled || true,
        voiceSpeed: currentUser.voiceSettings?.speed || 1.0,
        voiceVolume: currentUser.voiceSettings?.volume || 0.8
      },
      exportDate: new Date().toISOString(),
      dataVersion: '1.0.0'
    };
    
    return userData;
  },

  async updatePrivacySettings(privacySettings) {
    await delay(300);
    if (!currentUser) {
      throw new Error('No authenticated user');
    }
    
    const userIndex = mockUsers.findIndex(u => u.Id === currentUser.Id);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    mockUsers[userIndex] = { 
      ...mockUsers[userIndex], 
      privacySettings: { ...mockUsers[userIndex].privacySettings, ...privacySettings }
    };
    currentUser = { ...mockUsers[userIndex] };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    return { ...mockUsers[userIndex] };
  },

  isAuthenticated() {
    return currentUser !== null || localStorage.getItem('currentUser') !== null;
  }
};