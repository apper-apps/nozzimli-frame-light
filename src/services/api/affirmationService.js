import { toast } from 'react-toastify';

// Simulate user favorites storage
const userFavorites = [];

export const affirmationService = {
  async getDailyAffirmation() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "audio_url" } },
          { field: { Name: "language" } }
        ],
        pagingInfo: { limit: 1, offset: 0 }
      };

      const response = await apperClient.fetchRecords('affirmation', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      return response.data[0];
    } catch (error) {
      console.error("Error fetching daily affirmation:", error);
      toast.error("Failed to load affirmation");
      throw error;
    }
  },

  async getRandomAffirmation() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "audio_url" } },
          { field: { Name: "language" } }
        ],
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }],
        pagingInfo: { limit: 1, offset: Math.floor(Math.random() * 50) }
      };

      const response = await apperClient.fetchRecords('affirmation', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      return response.data[0];
    } catch (error) {
      console.error("Error fetching random affirmation:", error);
      toast.error("Failed to load affirmation");
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "text" } },
          { field: { Name: "audio_url" } },
          { field: { Name: "language" } }
        ]
      };

      const response = await apperClient.getRecordById('affirmation', id, params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Affirmation not found');
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching affirmation with ID ${id}:`, error);
      toast.error("Failed to load affirmation");
      throw error;
    }
  },

  async getFavorites() {
    // For now, return favorites from local storage until user favorites are implemented in database
    return userFavorites.map(favId => {
      // This would be replaced with actual database queries for user favorites
      return { Id: favId, text: "Favorite affirmation", audio_url: null, language: "en" };
    });
  },

  async addToFavorites(affirmationId) {
    // Simulate adding to favorites - would be implemented with user_favorites table
    if (!userFavorites.includes(affirmationId)) {
      userFavorites.push(affirmationId);
    }
    toast.success("Added to favorites! ❤️");
    return true;
  },

  async removeFromFavorites(affirmationId) {
    // Simulate removing from favorites - would be implemented with user_favorites table
    const index = userFavorites.indexOf(affirmationId);
    if (index > -1) {
      userFavorites.splice(index, 1);
    }
    toast.success("Removed from favorites 💔");
    return true;
  }
};