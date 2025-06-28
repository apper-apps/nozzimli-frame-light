const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate user settings storage
const userSettings = {
  themeColor: '#F4A6CD',
  language: 'en',
  fontSize: 'medium',
  notifications: true
};

// Subscription plans data
const subscriptionPlans = [
  {
    id: 'monthly',
    name: 'Monthly VIP',
    description: 'Perfect for trying out premium features',
    price: 9.99,
    period: 'month',
    popular: false
  },
  {
    id: 'annual',
    name: 'Annual VIP',
    description: 'Best value for long-term wellness journey',
    price: 99.99,
    period: 'year',
    savings: 19.89,
    popular: true
  }
];

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
  },

  async getSubscriptionPlans() {
    await delay(200);
    return [...subscriptionPlans];
  },

  async processVIPUpgrade({ planId, paymentMethodId, userId }) {
    await delay(1500); // Simulate payment processing time
    
    // Simulate payment success/failure (90% success rate)
    if (Math.random() < 0.9) {
      // Simulate successful upgrade
      return {
        success: true,
        subscriptionId: `sub_${Date.now()}`,
        planId,
        userId,
        status: 'active',
        nextBillingDate: new Date(Date.now() + (planId === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000)
      };
    } else {
      throw new Error('Payment failed. Please check your card details and try again.');
    }
  },

  async cancelSubscription(subscriptionId) {
    await delay(500);
    return {
      success: true,
      subscriptionId,
      status: 'cancelled',
      cancelledAt: new Date()
    };
  }
};