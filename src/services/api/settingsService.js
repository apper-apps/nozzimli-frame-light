const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate user settings storage
const userSettings = {
  themeColor: '#F4A6CD',
  language: 'en',
  fontSize: 'medium',
  notifications: true
};

export const settingsService = {
  async getUserSettings() {
    await delay(200);
    return { ...userSettings };
  },

  async updateSettings(newSettings) {
    await delay(300);
    Object.assign(userSettings, newSettings);
    return { ...userSettings };
  },

  async resetSettings() {
    await delay(250);
    const defaultSettings = {
      themeColor: '#F4A6CD',
      language: 'en',
      fontSize: 'medium',
      notifications: true
    };
    Object.assign(userSettings, defaultSettings);
    return { ...userSettings };
  }
};