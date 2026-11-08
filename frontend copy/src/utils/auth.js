// Authentication utility functions

// Validate email format
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  if (!password) return false;
  const minLength = 6;
  return password.length >= minLength;
};

// Validate name
export const validateName = (name) => {
  if (!name) return false;
  return name.trim().length >= 2;
};

// Get user initials for avatar
export const getUserInitials = (name) => {
  if (!name) return "?";

  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
