// API Configuration - Use consistent base URL
const BASE_URL = " https://ecotrack-ai-backend.onrender.com/api/user"; // Flask backend URL

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('token');

// Generic API request handler
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Request failed');
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};


export async function registerUser(userData) {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    
    const data = await res.json();
    console.log("Registration Response:", data);
    
    // Store token if registration successful
    if (data.success && data.access_token) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}


export async function loginUser(userData) {
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    
    const data = await res.json();
    console.log("Login Response:", data);
    
    // Store token if login successful
    if (data.success && data.access_token) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}


export async function getProfile() {
  try {
    const token = getAuthToken();
    
    if (!token) {
      return { success: false, message: "No authentication token found" };
    }
    
    const res = await fetch(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const data = await res.json();
    
    // Update localStorage with fresh user data
    if (data.success && data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error("Profile fetch error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}


export async function updateProfile(profileData) {
  try {
    const result = await apiRequest('/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });

    // Update localStorage with new user data
    if (result.success && result.data.user) {
      localStorage.setItem('user', JSON.stringify(result.data.user));
    }

    return result.data;
  } catch (error) {
    console.error("Profile update error:", error);
    throw error;
  }
}


export async function changePassword(passwordData) {
  try {
    const result = await apiRequest('/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });

    return result.data;
  } catch (error) {
    console.error("Password change error:", error);
    throw error;
  }
}


export async function deleteAccount(password) {
  try {
    const result = await apiRequest('/profile', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });

    // Clear localStorage on successful deletion
    if (result.success) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return result.data;
  } catch (error) {
    console.error("Account deletion error:", error);
    throw error;
  }
}


export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { success: true, message: "Logged out successfully" };
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has valid token
 */
export function isAuthenticated() {
  const token = getAuthToken();
  const user = localStorage.getItem('user');
  return !!(token && user);
}

/**
 * Get current user from localStorage
 * @returns {Object|null} User object or null if not found
 */
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}