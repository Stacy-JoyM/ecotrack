const BASE_URL = "http://127.0.0.1:5000/api/user"; // Flask backend URL

export async function registerUser(userData) {
  try {
    const res = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    
    const data = await res.json();
    console.log("API Response:", data); // ✅ DEBUG
    
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
    return res.json();
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}

export async function getProfile(token) {
  try {
    const res = await fetch(`${BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.json();
  } catch (error) {
    console.error("Profile fetch error:", error);
    return { success: false, message: "Network error. Please try again." };
  }
}