// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps>({
  isLoggedIn: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  resetPassword: async () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (username: string, password: string) => {
    try {
      // Simulate API call
      const response = await fakeLoginRequest(username, password);

      if (response.success) {
        setIsLoggedIn(true);
        localStorage.setItem('token', response.token); // Store token
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Login failed:", error.message);
      alert(`Login failed: ${error.message}`); // Display error to user
      // Handle login error (e.g., display error message)
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token'); // Remove token
  };

  const register = async (username: string, password: string) => {
    try {
      // Simulate API call
      const response = await fakeRegisterRequest(username, password);

      if (response.success) {
        alert("Registration successful! Please log in.");
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      alert(`Registration failed: ${error.message}`);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Simulate API call
      const response = await fakeResetPasswordRequest(email);

      if (response.success) {
        alert("Password reset email sent!");
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Password reset failed:", error.message);
      alert(`Password reset failed: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, register, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock API requests (replace with actual API calls)
const fakeLoginRequest = async (username: string, password: string) => {
  // Simulate successful login
  if (username === "test" && password === "password") {
    return { success: true, token: "fake_token", message: "Login successful" };
  } else {
    return { success: false, message: "Invalid credentials" };
  }
};

const fakeRegisterRequest = async (username: string, password: string) => {
  if (username.length < 3) {
    return { success: false, message: "Username must be at least 3 characters" };
  }
  return { success: true, message: "Registration successful" };
};

const fakeResetPasswordRequest = async (email: string) => {
  if (!email.includes("@")) {
    return { success: false, message: "Invalid email address" };
  }
  return { success: true, message: "Password reset email sent" };
};

export default AuthProvider;

// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextProps {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps>({
  isLoggedIn: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  resetPassword: async () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (username: string, password: string) => {
    try {
      // Simulate API call
      const response = await fakeLoginRequest(username, password);

      if (response.success) {
        setIsLoggedIn(true);
        localStorage.setItem('token', response.token); // Store token
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Login failed:", error.message);
      alert(`Login failed: ${error.message}`); // Display error to user
      // Handle login error (e.g., display error message)
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token'); // Remove token
  };

  const register = async (username: string, password: string) => {
    try {
      // Simulate API call
      const response = await fakeRegisterRequest(username, password);

      if (response.success) {
        alert("Registration successful! Please log in.");
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Registration failed:", error.message);
      alert(`Registration failed: ${error.message}`);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Simulate API call
      const response = await fakeResetPasswordRequest(email);

      if (response.success) {
        alert("Password reset email sent!");
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error("Password reset failed:", error.message);
      alert(`Password reset failed: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, register, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock API requests (replace with actual API calls)
const fakeLoginRequest = async (username: string, password: string) => {
  // Simulate successful login
  if (username === "test" && password === "password") {
    return { success: true, token: "fake_token", message: "Login successful" };
  } else {
    return { success: false, message: "Invalid credentials" };
  }
};

const fakeRegisterRequest = async (username: string, password: string) => {
  if (username.length < 3) {
    return { success: false, message: "Username must be at least 3 characters" };
  }
  return { success: true, message: "Registration successful" };
};

const fakeResetPasswordRequest = async (email: string) => {
  if (!email.includes("@")) {
    return { success: false, message: "Invalid email address" };
  }
  return { success: true, message: "Password reset email sent" };
};

export default AuthProvider;

### Build Report