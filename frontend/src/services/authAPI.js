const API_BASE_URL = "http://localhost:5000/api";

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("authToken");
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.body && typeof config.body === "object") {
    config.body = JSON.stringify(config.body);
  }
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(
        data.error ||
          `HTTP error! status: 
${response.status}`,
      );
    }
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: userData,
    });
  },
  login: async (credentials) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: credentials,
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest("/auth/me");
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiRequest("/auth/profile", {
      method: "PUT",
      body: userData,
    });
  },

  // Change password
  changePassword: async (passwordData) => {
    return apiRequest("/auth/change-password", {
      method: "PUT",
      body: passwordData,
    });
  },

  // Get all users (admin only)
  getUsers: async () => {
    return apiRequest("/auth/users");
  },
};

// ✅ TAMBAHKAN: Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token;
};

// ✅ TAMBAHKAN: Store auth token
export const setAuthToken = (token) => {
  localStorage.setItem("authToken", token);
};

// ✅ TAMBAHKAN: Remove auth token (logout) - INI YANG HILANG!
export const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

// ✅ TAMBAHKAN: Get stored auth token
export const getAuthToken = () => {
  return localStorage.getItem("authToken");
};
