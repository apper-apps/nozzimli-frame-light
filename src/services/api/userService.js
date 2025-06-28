import mockUsers from '@/services/mockData/users.json';

// Authentication state
let currentUser = null;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Enhanced error handling
const handleAuthError = (message) => {
  currentUser = null;
  localStorage.removeItem('currentUser');
  throw new Error(message);
};

export const userService = {
  async login(email, password) {
    try {
      await delay(500);
      
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      const user = mockUsers.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }
      
      currentUser = { ...user };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      return { ...user };
    } catch (err) {
      handleAuthError(err.message);
    }
  },

  async logout() {
    await delay(200);
    currentUser = null;
    localStorage.removeItem('currentUser');
    return true;
  },

async getCurrentUser() {
    try {
      await delay(300);
      
      // Check if user is stored in localStorage
      if (!currentUser) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
          try {
            currentUser = JSON.parse(storedUser);
          } catch (err) {
            localStorage.removeItem('currentUser');
            throw new Error('Invalid session data. Please log in again.');
          }
        }
      }
      
      if (!currentUser) {
        throw new Error('No authenticated user. Please log in to continue.');
      }
      
      // Refresh user data from mock database
      const user = mockUsers.find(u => u.Id === currentUser.Id);
      if (!user) {
        handleAuthError('User account not found. Please log in again.');
      }
      
      currentUser = { ...user };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      return { ...user };
    } catch (err) {
      if (err.message.includes('authenticated user') || err.message.includes('account not found')) {
        throw err;
      }
      handleAuthError('Failed to retrieve user information. Please log in again.');
    }
  },

async updateProfile(userData) {
    try {
      await delay(400);
      if (!currentUser) {
        throw new Error('No authenticated user. Please log in to update your profile.');
      }
      
      const userIndex = mockUsers.findIndex(u => u.Id === currentUser.Id);
      if (userIndex === -1) {
        handleAuthError('User account not found. Please log in again.');
      }
      
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
      currentUser = { ...mockUsers[userIndex] };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      return { ...mockUsers[userIndex] };
    } catch (err) {
      if (err.message.includes('authenticated user') || err.message.includes('account not found')) {
        throw err;
      }
      throw new Error('Failed to update profile. Please try again.');
    }
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
    try {
      await delay(500);
      if (!currentUser) {
        throw new Error('No authenticated user. Please log in to upgrade to VIP.');
      }
      
      const userIndex = mockUsers.findIndex(u => u.Id === currentUser.Id);
      if (userIndex === -1) {
        handleAuthError('User account not found. Please log in again.');
      }
      
      mockUsers[userIndex].role = 'VIP';
      currentUser = { ...mockUsers[userIndex] };
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      return { ...mockUsers[userIndex] };
    } catch (err) {
      if (err.message.includes('authenticated user') || err.message.includes('account not found')) {
        throw err;
      }
      throw new Error('Failed to upgrade to VIP. Please try again.');
    }
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