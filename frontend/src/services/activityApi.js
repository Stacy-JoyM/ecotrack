const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const parseJSON = async (res) => {
  try {
    return await res.json();
  } catch {
    return {};
  }
};

export const activityApi = {
  createActivity: async (data) => {
    if (!data.title?.trim()) throw new Error('Activity title is required');
    if (!['energy', 'transport'].includes(data.category)) throw new Error('Invalid activity category');

    const user_id = data.user_id || Number(localStorage.getItem('user_id'));
    if (!user_id) throw new Error('User ID is required');

    let payload = {
      title: data.title.trim(),
      category: data.category,
      user_id,
      notes: data.notes?.trim() || null,
      date: data.date || new Date().toISOString()
    };

    if (data.category === 'energy') {
      const duration = parseFloat(data.duration_hours);
      const usage_kwh = parseFloat(data.usage_kwh);

      if (!data.energy_type?.trim()) throw new Error('Energy type is required');
      if (isNaN(duration) || duration <= 0) throw new Error('Activity duration must be greater than 0');
      if (isNaN(usage_kwh) || usage_kwh <= 0) throw new Error('Usage (kWh) must be greater than 0');

      payload = {
        ...payload,
        energy_type: data.energy_type.trim(),
        duration_hours: duration,
        usage_kwh: usage_kwh,
        appliance_name: data.appliance_name?.trim() || null
      };
    }

    if (data.category === 'transport') {
      const distance = parseFloat(data.distance);
      const fuel_efficiency = data.fuel_efficiency ? parseFloat(data.fuel_efficiency) : null;

      if (!data.vehicle_type?.trim()) throw new Error('Vehicle type is required');
      if (isNaN(distance) || distance <= 0) throw new Error('Distance must be greater than 0');

      payload = {
        ...payload,
        vehicle_type: data.vehicle_type.trim(),
        distance,
        vehicle_model: data.vehicle_model?.trim() || null,
        fuel_efficiency
      };
    }

    const res = await fetch(`${API_BASE_URL}/activities`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });

    const responseData = await parseJSON(res);
    if (!res.ok) throw new Error(responseData.message || 'Failed to create activity');
    return responseData;
  },

  getSummary: async () => {
    const res = await fetch(`${API_BASE_URL}/activities/summary`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error((await parseJSON(res)).message || 'Failed to fetch summary');
    return parseJSON(res);
  },

  getHistory: async (filter = 'all') => {
    const res = await fetch(`${API_BASE_URL}/activities/history?filter=${filter}`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error((await parseJSON(res)).message || 'Failed to fetch history');
    return parseJSON(res);
  },

  getEnergyTypes: async () => {
    const res = await fetch(`${API_BASE_URL}/activities/energy-types`, { headers: getAuthHeaders() });
    if (!res.ok) throw new Error((await parseJSON(res)).message || 'Failed to fetch energy types');
    return parseJSON(res);
  },

  deleteActivity: async (id) => {
    if (!id) throw new Error('Activity ID is required to delete');

    const res = await fetch(`${API_BASE_URL}/activities/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    const responseData = await parseJSON(res);
    if (!res.ok) throw new Error(responseData.message || 'Failed to delete activity');
    return responseData;
  }
};
