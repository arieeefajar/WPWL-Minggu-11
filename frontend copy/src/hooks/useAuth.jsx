import { useAuth } from "../context/authContext";

// Custom hook untuk authentication
// Ini adalah wrapper untuk useAuth context dengan additional functionality
const useAuthHook = () => {
  const auth = useAuth();

  // Check if user has specific role
  const hasRole = (role) => {
    return auth.user?.role === role;
  };

  // Check if user is admin
  const isAdmin = () => {
    return hasRole("admin");
  };

  // Check if user can access resource
  const canAccess = (requiredRole) => {
    if (!requiredRole) return true;
    return auth.user?.role === requiredRole;
  };

  return {
    ...auth,
    hasRole,
    isAdmin,
    canAccess,
  };
};

export default useAuthHook;
