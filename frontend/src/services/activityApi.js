const API_BASE_URL = ' https://ecotrack-ai-backend.onrender.com/api/activity'; // ✅ Update to match your backend URL

export const activityApi = {
  // Create a new activity
  createActivity: async (activityData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create activity');
      }

      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error creating activity:', err);
      return { success: false, message: err.message };
    }
  },

  // Get summary
  getSummary: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/activities/summary`);
      if (!res.ok) throw new Error('Failed to fetch summary');

      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching summary:', err);
      return { success: false, message: err.message };
    }
  },

  // Get activity history (with optional filter)
  getHistory: async (filter) => {
    try {
      const url =
        filter && filter !== 'all'
          ? `${API_BASE_URL}/activities?category=${filter}`
          : `${API_BASE_URL}/activities`;

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch history');

      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error fetching history:', err);
      return { success: false, message: err.message };
    }
  },

  // Delete an activity
  deleteActivity: async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/activities/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete activity');

      const data = await res.json();
      return { success: true, data };
    } catch (err) {
      console.error('Error deleting activity:', err);
      return { success: false, message: err.message };
    }
  },
};
