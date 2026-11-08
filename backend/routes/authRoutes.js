const express = require("express");
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getUsers,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  validateRegister,
  validateLogin,
  validateUpdateProfile,
  validateChangePassword,
} = require("../middleware/validation");

const router = express.Router();

// Public routes
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

// Protected routes
router.get("/me", protect, getMe);
router.put("/profile", protect, validateUpdateProfile, updateProfile);
router.put("/change-password", protect, validateChangePassword, changePassword);

// Admin only routes
router.get("/users", protect, authorize("admin"), getUsers);

module.exports = router;
