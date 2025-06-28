import { mockTasks } from '@/services/mockData/tasks.json';
import { format, isToday } from 'date-fns';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...mockTasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(200);
    const task = mockTasks.find(t => t.Id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  async getTodaysTasks() {
    await delay(250);
    return mockTasks.filter(task => 
      isToday(new Date(task.dueDate))
    ).map(task => ({ ...task }));
  },

async getByCategory(category) {
    await delay(250);
    return mockTasks.filter(task => 
      task.category === category
    ).map(task => ({ ...task }));
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      Id: Math.max(...mockTasks.map(t => t.Id)) + 1,
      userId: 1, // Current user ID
      title: taskData.title,
      description: taskData.description || '',
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      category: taskData.category || 'General',
      completed: false,
      voiceReminder: taskData.voiceReminder || false,
      createdAt: new Date().toISOString()
    };
    
    mockTasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updates) {
    await delay(350);
    const taskIndex = mockTasks.findIndex(t => t.Id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
    return { ...mockTasks[taskIndex] };
  },

  async delete(id) {
    await delay(300);
    const taskIndex = mockTasks.findIndex(t => t.Id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    mockTasks.splice(taskIndex, 1);
    return true;
  }
};