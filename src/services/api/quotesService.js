import { toast } from 'react-toastify';

export const quotesService = {
  async getDailyQuote() {
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
          { field: { Name: "author" } }
        ],
        pagingInfo: { limit: 1, offset: 0 },
        orderBy: [{ fieldName: "CreatedOn", sorttype: "DESC" }]
      };

      const response = await apperClient.fetchRecords('quote', params);
      
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
      console.error("Error fetching daily quote:", error);
      toast.error("Failed to load quote");
      throw error;
    }
  },

  async getRandomQuote() {
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
          { field: { Name: "author" } }
        ],
        pagingInfo: { limit: 1, offset: Math.floor(Math.random() * 50) }
      };

      const response = await apperClient.fetchRecords('quote', params);
      
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
      console.error("Error fetching random quote:", error);
      toast.error("Failed to load quote");
      throw error;
    }
  }
};