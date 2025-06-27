import { mockCareContent } from '@/services/mockData/careContent.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const careContentService = {
  async getAll() {
    await delay(300);
    return [...mockCareContent];
  },

  async getByCategory(category) {
    await delay(250);
    return mockCareContent.filter(content => 
      content.category === category
    ).map(content => ({ ...content }));
  },

  async getById(id) {
    await delay(200);
    const content = mockCareContent.find(c => c.Id === id);
    if (!content) {
      throw new Error('Content not found');
    }
    return { ...content };
  }
};