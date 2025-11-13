// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { AuthService } from '../services/AuthService'; // Assuming an AuthService handles API calls

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (credentials: any) => Promise<void>; // Replace 'any' with appropriate types
  logout: () => void;
  register: (userData: any) => Promise<void>; // Replace 'any' with appropriate types
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err: any) {
        console.error("Error checking auth status:", err);
        setError("Failed to check authentication status.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await AuthService.login(credentials);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard'); // Redirect to dashboard after login
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page after logout
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await AuthService.register(userData);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      navigate('/dashboard'); // Redirect to dashboard after registration
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthService (Example - needs actual implementation)
// src/services/AuthService.ts
export const AuthService = {
  login: async (credentials: any) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username === 'test' && credentials.password === 'password') {
          resolve({ id: 1, username: 'test', email: 'test@example.com' });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },
  register: async (userData: any) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ id: 2, username: userData.username, email: userData.email });
      }, 500);
    });
  },
};

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { AuthService } from '../services/AuthService'; // Assuming an AuthService handles API calls

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (credentials: any) => Promise<void>; // Replace 'any' with appropriate types
  logout: () => void;
  register: (userData: any) => Promise<void>; // Replace 'any' with appropriate types
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err: any) {
        console.error("Error checking auth status:", err);
        setError("Failed to check authentication status.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = await AuthService.login(credentials);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard'); // Redirect to dashboard after login
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page after logout
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await AuthService.register(userData);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      navigate('/dashboard'); // Redirect to dashboard after registration
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthService (Example - needs actual implementation)
// src/services/AuthService.ts
export const AuthService = {
  login: async (credentials: any) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.username === 'test' && credentials.password === 'password') {
          resolve({ id: 1, username: 'test', email: 'test@example.com' });
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },
  register: async (userData: any) => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ id: 2, username: userData.username, email: userData.email });
      }, 500);
    });
  },
};