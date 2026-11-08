import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import "./App.css";

// Dashboard Component dengan auto-redirect setelah logout
const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 🔄 AUTO-REDIRECT JIKA SUDAH LOGOUT
  useEffect(() => {
    if (!isAuthenticated) {
      console.log("🔄 User not authenticated, redirecting to home...");
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    console.log("🚪 Logout button clicked");
    const result = await logout();
    console.log("📄 Logout result:", result);

    // Tidak perlu navigate manual karena useEffect akan handle
  };

  // Jika tidak authenticated, tampilkan loading
  if (!isAuthenticated) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p>Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "40px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          margin: "20px auto",
          maxWidth: "500px",
        }}
      >
        <h1 style={{ color: "#333", marginBottom: "20px" }}>
          🎨 Welcome to Dashboard!
        </h1>

        {user ? (
          <>
            <div
              style={{
                background: "#f8f9fa",
                padding: "20px",
                borderRadius: "8px",
                margin: "20px 0",
                textAlign: "left",
              }}
            >
              <h2 style={{ color: "#333", marginBottom: "15px" }}>
                Hello, {user.name || user.email}!
              </h2>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                <span
                  style={{
                    color: user.role === "admin" ? "#dc3545" : "#28a745",
                    fontWeight: "bold",
                  }}
                >
                  {user.role}
                </span>
              </p>
              <p>
                <strong>Joined:</strong>{" "}
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>

            <button
              onClick={handleLogout}
              style={{
                padding: "12px 24px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "bold",
                marginTop: "20px",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <div>
            <p>Loading user data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Home Component dengan kondisi berdasarkan authentication
const Home = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
          ✅ Already Logged In
        </h1>
        <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
          Welcome back, {user?.name || user?.email}!
        </p>
        <div style={{ display: "flex", gap: "20px" }}>
          <a
            href="/dashboard"
            style={{
              padding: "12px 24px",
              backgroundColor: "white",
              color: "#28a745",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            Go to Dashboard
          </a>
          <a
            href="/logout"
            onClick={(e) => {
              e.preventDefault();
              // You can add logout here too if needed
            }}
            style={{
              padding: "12px 24px",
              backgroundColor: "transparent",
              color: "white",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
              border: "2px solid white",
            }}
          >
            Logout
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
        🔐 Auth System
      </h1>
      <p style={{ fontSize: "1.2rem", marginBottom: "30px" }}>
        Welcome to our authentication system
      </p>
      <div style={{ display: "flex", gap: "20px" }}>
        <a
          href="/login"
          style={{
            padding: "12px 24px",
            backgroundColor: "white",
            color: "#667eea",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
          }}
        >
          Login
        </a>
        <a
          href="/register"
          style={{
            padding: "12px 24px",
            backgroundColor: "transparent",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
            fontWeight: "bold",
            border: "2px solid white",
          }}
        >
          Register
        </a>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
