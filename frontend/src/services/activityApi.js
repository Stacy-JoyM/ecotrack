// services/activityApi.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`
});

export const activityApi = {
  // Create activity (handles both transport and energy)
  createActivity: async (activityData) => {
    const response = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(activityData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create activity');
    }
    
    return response.json();
  },

  // Get summary for top cards
  getSummary: async () => {
    const response = await fetch(`${API_BASE_URL}/activities/summary`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch summary');
    }
    
    return response.json();
  },

  // Get activity history
  getHistory: async (filter = 'all') => {
    const response = await fetch(
      `${API_BASE_URL}/activities/history?filter=${filter}`,
      { headers: getAuthHeaders() }
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }
    
    return response.json();
  },

  // Get energy types for dropdown (no auth needed)
  getEnergyTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/activities/energy-types`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch energy types');
    }
    
    return response.json();
  },

  // Delete activity
  deleteActivity: async (id) => {
    const response = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete activity');
    }
    
    return response.json();
  }
};