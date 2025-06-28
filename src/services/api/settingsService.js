const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate user settings storage
const userSettings = {
  themeColor: '#F4A6CD',
  language: 'en',
  fontSize: 'medium',
  notifications: true,
  voiceAlerts: true,
  voiceSpeed: 1.0,
  voiceVolume: 0.8
};

// VIP subscription plan with specific Stripe price ID
const vipSubscriptionPlan = {
  id: 'monthly_vip',
  name: 'Monthly VIP',
  description: 'Unlock premium wellness content and features',
  price: 1.99,
  period: 'month',
  priceId: 'price_1Reuv1IFRMUC72MviNgYZq4K'
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
  },

async getSubscriptionPlans() {
    await delay(200);
    return [vipSubscriptionPlan];
  },
async processVIPUpgrade({ priceId, paymentMethodId, userId }) {
    await delay(1500); // Simulate payment processing time
    
    // Validate the specific price ID
    if (priceId !== 'price_1Reuv1IFRMUC72MviNgYZq4K') {
      throw new Error('Invalid price ID for VIP subscription');
    }
    
    // Simulate payment success/failure (90% success rate)
    if (Math.random() < 0.9) {
      // Simulate successful upgrade with Stripe price ID
      return {
        success: true,
        subscriptionId: `sub_${Date.now()}`,
        priceId,
        userId,
        status: 'active',
        amount: 199, // $1.99 in cents
        currency: 'usd',
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
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