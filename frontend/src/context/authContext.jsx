import React, { createContext, useState, useContext, useEffect } from "react";
import {
  authAPI,
  setAuthToken,
  removeAuthToken,
  getAuthToken,
} from "../services/authAPI";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);
  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }
      const result = await authAPI.getCurrentUser();
      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
      } else {
        removeAuthToken();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      removeAuthToken();
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      setFormErrors({});
      const result = await authAPI.login(credentials);
      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        setAuthToken(result.data.token);
        setFormErrors({});
        return { success: true, message: result.message };
      } else {
        setError(result.error);

        // Handle specific validation errors
        if (result.error.includes("Invalid email or password")) {
          setFormErrors({
            general: "Email atau password salah. Silakan coba lagi.",
          });
        } else {
          setFormErrors({ general: result.error });
        }
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || "Login failed. Please try again.";
      setError(errorMessage);
      if (error.message.includes("Invalid email or password")) {
        setFormErrors({
          general: "Email atau password salah. Silakan coba lagi.",
        });
      } else {
        setFormErrors({ general: errorMessage });
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      setFormErrors({});
      const result = await authAPI.register(userData);
      if (result.success) {
        setUser(result.data.user);
        setIsAuthenticated(true);
        setAuthToken(result.data.token);
        setFormErrors({});
        return { success: true, message: result.message };
      } else {
        setError(result.error);

        // Handle specific validation errors
        if (result.error.includes("Password must contain")) {
          setFormErrors({
            password:
              "Password harus mengandung minimal 6 karakter, satu huruf kecil, satu huruf besar, dan satu angka",
          });
        } else if (result.error.includes("User already exists")) {
          setFormErrors({
            email: "Email sudah terdaftar. Silakan gunakan email lain.",
          });
        } else {
          setFormErrors({ general: result.error });
        }
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage =
        error.message || "Registration failed. Please try again.";

      setError(errorMessage);
      if (error.message.includes("Password must contain")) {
        setFormErrors({
          password:
            "Password harus mengandung minimal 6 karakter, satu huruf kecil, satu huruf besar, dan satu angka",
        });
      } else if (error.message.includes("User already exists")) {
        setFormErrors({
          email: "Email sudah terdaftar. Silakan gunakan email lain.",
        });
      } else {
        setFormErrors({ general: errorMessage });
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ✅ TAMBAHKAN: Logout function yang hilang
  const logout = async () => {
    try {
      console.log("🔄 Logout process started...");

      // Remove token from localStorage
      removeAuthToken();
      console.log("✅ Token removed from localStorage");

      // Reset state - INI YANG MEMICU RE-RENDER
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      setFormErrors({});
      console.log("✅ Auth state reset completed");

      // Force a small delay to ensure state updates
      await new Promise((resolve) => setTimeout(resolve, 100));
      return { success: true, message: "Logout successful" };
    } catch (error) {
      console.error("❌ Logout error:", error);
      setError("Logout failed");
      return { success: false, error: "Logout failed" };
    }
  };

  // ✅ TAMBAHKAN: Update profile function (placeholder)
  const updateProfile = async (updates) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authAPI.updateProfile(updates);
      if (result.success) {
        setUser(result.data.user);
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || "Profile update failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ✅ TAMBAHKAN: Change password function (placeholder)
  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authAPI.changePassword(passwordData);
      if (result.success) {
        return { success: true, message: result.message };
      } else {
        setError(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error.message || "Password change failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => {
    setError(null);
    setFormErrors({});
  };

  const value = {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    formErrors,
    // Actions
    login,
    register,
    logout, //
    updateProfile,
    changePassword,
    clearError,
    checkAuthStatus,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export default AuthContext;
