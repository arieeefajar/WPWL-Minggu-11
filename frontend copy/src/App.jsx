import React, { useState } from "react";
import { AuthProvider } from "./context/authContext";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("login");

  return (
    <AuthProvider>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <h1>🔐 Authentication System</h1>
            <p>Praktikum Pertemuan 13 - Login & Register</p>
          </div>

          <nav className="app-nav">
            <button
              onClick={() => setCurrentView("login")}
              className={currentView === "login" ? "active" : ""}
            >
              🔑 Login
            </button>
            <button
              onClick={() => setCurrentView("register")}
              className={currentView === "register" ? "active" : ""}
            >
              📝 Register
            </button>
          </nav>
        </header>

        <main className="App-main">
          {currentView === "login" && <Login />}
          {currentView === "register" && <Register />}
        </main>

        <footer className="App-footer">
          <p>Praktikum React - Authentication System</p>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;
