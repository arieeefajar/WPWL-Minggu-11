import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/authContext";
import { validateEmail } from "../../utils/auth";
import "./auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const {
    login,
    loading,
    error: authError,
    clearError,
    isAuthenticated,
  } = useAuth();

  // Clear auth error ketika form berubah
  useEffect(() => {
    if (authError) {
      clearError();
    }
  }, [formData, authError, clearError]);

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

    const result = await login(formData);

    if (result.success) {
      alert("✅ Login successful! Check the console for user data.");
      console.log("Logged in user:", result);
    }
  };

  const hasError = (field) => touched[field] && errors[field];

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Please sign in to your account</p>
        </div>

        {authError && <div className="auth-error">{authError}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
          </div>

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => window.location.reload()} // Simple navigation
            >
              Sign up here
            </button>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="demo-accounts">
          <details>
            <summary>Demo Accounts</summary>
            <div className="demo-account-list">
              <div className="demo-account">
                <strong>Admin:</strong> admin@example.com / password123
              </div>
              <div className="demo-account">
                <strong>User:</strong> user@example.com / password123
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default Login;
