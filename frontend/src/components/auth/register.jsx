import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ TAMBAHKAN INI;
import { useAuth } from "../../context/authContext";
import { validateEmail } from "../../utils/auth";
import "./Auth.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  // ✅ GUNAKAN useNavigate
  const navigate = useNavigate();
  const {
    register,
    loading,
    error: authError,
    formErrors,
    clearError,
    isAuthenticated,
  } = useAuth();
  // Redirect jika sudah login
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  // Clear error ketika form berubah
  useEffect(() => {
    if (authError) {
      clearError();
    }
  }, [formData, authError, clearError]);
  // Handle formErrors dari backend
  useEffect(() => {
    if (formErrors) {
      setErrors((prev) => ({
        ...prev,
        ...formErrors,
      }));
    }
  }, [formErrors]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    // Clear backend formErrors juga
    if (formErrors && formErrors[name]) {
      clearError();
    }
  };
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    validateField(name, formData[name]);
  };
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.trim().length < 2) {
          error = "Name must be at least 2 characters";
        }
        break;
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!validateEmail(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = "Password must contain lowercase, uppercase and number";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
    return error;
  };
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);
    if (!validateForm()) {
      return;
    }
    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    if (result.success) {
      // ✅ GUNAKAN navigate() bukan window.location
      navigate("/dashboard");
    }
  };
  const hasError = (field) => touched[field] && errors[field];
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Please sign up for a new account</p>
        </div>

        {/* Error messages */}
        {(authError || formErrors?.general) && (
          <div className="auth-error">{authError || formErrors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${hasError("name") ? "error" : ""}`}
              placeholder="Enter your full name"
              disabled={loading}
            />
            {hasError("name") && (
              <div className="form-error">{errors.name}</div>
            )}
            {formErrors?.name && !errors.name && (
              <div className="form-error">{formErrors.name}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${hasError("email") ? "error" : ""}`}
              placeholder="Enter your email"
              disabled={loading}
            />
            {hasError("email") && (
              <div className="form-error">{errors.email}</div>
            )}
            {formErrors?.email && !errors.email && (
              <div className="form-error">{formErrors.email}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${hasError("password") ? "error" : ""}`}
              placeholder="Enter your password"
              disabled={loading}
            />
            {hasError("password") && (
              <div className="form-error">{errors.password}</div>
            )}
            {formErrors?.password && !errors.password && (
              <div className="form-error">{formErrors.password}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`form-input ${
                hasError("confirmPassword") ? "error" : ""
              }`}
              placeholder="Confirm your password"
              disabled={loading}
            />
            {hasError("confirmPassword") && (
              <div className="form-error">{errors.confirmPassword}</div>
            )}
          </div>
          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => navigate("/login")} // ✅ GUNAKAN navigate()
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Register;
