import { toast } from 'react-toastify';

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
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "theme_color" } },
          { field: { Name: "language" } },
          { field: { Name: "font_size" } },
          { field: { Name: "voice_alerts" } },
          { field: { Name: "voice_speed" } },
          { field: { Name: "voice_volume" } },
          { field: { Name: "user_id" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await apperClient.fetchRecords('user_settings', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        // Return default settings if none found
        return {
          theme_color: '#F4A6CD',
          language: 'en',
          font_size: 'medium',
          voice_alerts: 'true',
          voice_speed: 1.0,
          voice_volume: 0.8
        };
      }

      if (!response.data || response.data.length === 0) {
        // Return default settings if none found
        return {
          theme_color: '#F4A6CD',
          language: 'en',
          font_size: 'medium',
          voice_alerts: 'true',
          voice_speed: 1.0,
          voice_volume: 0.8
        };
      }

      return response.data[0];
    } catch (error) {
      console.error("Error fetching user settings:", error);
      toast.error("Failed to load settings");
      // Return default settings on error
      return {
        theme_color: '#F4A6CD',
        language: 'en',
        font_size: 'medium',
        voice_alerts: 'true',
        voice_speed: 1.0,
        voice_volume: 0.8
      };
    }
  },

  async updateSettings(newSettings) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // First try to get existing settings to update
      const existingResponse = await apperClient.fetchRecords('user_settings', {
        fields: [{ field: { Name: "Id" } }],
        pagingInfo: { limit: 1, offset: 0 }
      });

      const updateData = {};
      
      // Only include updateable fields
      if (newSettings.theme_color !== undefined) updateData.theme_color = newSettings.theme_color;
      if (newSettings.language !== undefined) updateData.language = newSettings.language;
      if (newSettings.font_size !== undefined) updateData.font_size = newSettings.font_size;
      if (newSettings.voice_alerts !== undefined) updateData.voice_alerts = newSettings.voice_alerts ? 'true' : 'false';
      if (newSettings.voice_speed !== undefined) updateData.voice_speed = newSettings.voice_speed;
      if (newSettings.voice_volume !== undefined) updateData.voice_volume = newSettings.voice_volume;

      let response;

      if (existingResponse.success && existingResponse.data && existingResponse.data.length > 0) {
        // Update existing settings
        updateData.Id = existingResponse.data[0].Id;
        
        const params = {
          records: [updateData]
        };

        response = await apperClient.updateRecord('user_settings', params);
      } else {
        // Create new settings record
        updateData.Name = 'User Settings';
        
        const params = {
          records: [updateData]
        };

        response = await apperClient.createRecord('user_settings', params);
      }
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Failed to update settings');
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successfulRecords.length > 0) {
          toast.success("Settings updated successfully! ✨");
          return successfulRecords[0].data;
        }
      }

      return newSettings;
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
      throw error;
    }
  },

  async resetSettings() {
    const defaultSettings = {
      theme_color: '#F4A6CD',
      language: 'en',
      font_size: 'medium',
      voice_alerts: true,
      voice_speed: 1.0,
      voice_volume: 0.8
    };
    
    return await this.updateSettings(defaultSettings);
  },

  async getSubscriptionPlans() {
    // Return static VIP plan - this could be enhanced to fetch from database
    return [vipSubscriptionPlan];
  },

  async processVIPUpgrade({ priceId, paymentMethodId, userId }) {
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
    // Simulate cancellation delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      subscriptionId,
      status: 'cancelled',
      cancelledAt: new Date()
    };
  }
};