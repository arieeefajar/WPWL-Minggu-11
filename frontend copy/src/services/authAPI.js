// Simulated Backend API untuk Authentication
class AuthAPI {
  constructor() {
    this.usersKey = "authApp:users";
    this.tokensKey = "authApp:tokens";
    this.initData();
  }

  // Initialize dengan sample data
  initData() {
    const existingUsers = localStorage.getItem(this.usersKey);
    if (!existingUsers) {
      const sampleUsers = [
        {
          id: 1,
          email: "admin@example.com",
          password: "password123",
          name: "Admin User",
          role: "admin",
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          email: "user@example.com",
          password: "password123",
          name: "Regular User",
          role: "user",
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem(this.usersKey, JSON.stringify(sampleUsers));
    }
  }

  // Simulate API delay
  delay(ms = 1000) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Register new user
  async register(userData) {
    await this.delay(800);

    try {
      const { email, password, name } = userData;

      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const users = this.getUsers();
      const existingUser = users.find((user) => user.email === email);

      if (existingUser) {
        throw new Error("User already exists with this email");
      }

      const newUser = {
        id: Date.now(),
        email,
        password, // Dalam real app, password harus di-hash
        name,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      this.saveUsers(users);

      // Auto login setelah register
      const token = this.generateToken(newUser);
      this.saveToken(token);

      return {
        success: true,
        data: {
          user: { ...newUser, password: undefined }, // Jangan return password
          token,
        },
        message: "Registration successful",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Registration failed",
      };
    }
  }

  // Login user
  async login(credentials) {
    await this.delay(800);

    try {
      const { email, password } = credentials;

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const users = this.getUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password,
      );

      if (!user) {
        throw new Error("Invalid email or password");
      }

      const token = this.generateToken(user);
      this.saveToken(token);

      return {
        success: true,
        data: {
          user: { ...user, password: undefined },
          token,
        },
        message: "Login successful",
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        message: "Login failed",
      };
    }
  }

  // Logout user
  async logout() {
    await this.delay(300);
    this.removeToken();

    return {
      success: true,
      message: "Logout successful",
    };
  }

  // Get current user from token
  async getCurrentUser() {
    await this.delay(500);

    try {
      const token = this.getToken();
      if (!token) {
        throw new Error("No token found");
      }

      const user = this.verifyToken(token);
      if (!user) {
        throw new Error("Invalid token");
      }

      return {
        success: true,
        data: { ...user, password: undefined },
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  // Helper methods
  getUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.usersKey)) || [];
    } catch {
      return [];
    }
  }

  saveUsers(users) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  generateToken(user) {
    // Dalam real app, gunakan library JWT yang proper
    const tokenData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };
    return btoa(JSON.stringify(tokenData)); // Simple encoding
  }

  verifyToken(token) {
    try {
      const tokenData = JSON.parse(atob(token));

      // Check expiration
      if (Date.now() > tokenData.exp) {
        this.removeToken();
        return null;
      }

      const users = this.getUsers();
      return users.find((user) => user.id === tokenData.userId);
    } catch {
      return null;
    }
  }

  saveToken(token) {
    localStorage.setItem(this.tokensKey, token);
  }

  getToken() {
    return localStorage.getItem(this.tokensKey);
  }

  removeToken() {
    localStorage.removeItem(this.tokensKey);
  }
}

// Create singleton instance
const authAPI = new AuthAPI();
export default authAPI;
