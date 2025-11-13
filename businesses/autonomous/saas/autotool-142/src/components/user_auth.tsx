// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

interface AuthContextType {
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    // Check for existing token in local storage on component mount
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and fetch user data
      verifyToken(token)
        .then(userData => {
          setUser(userData);
        })
        .catch(err => {
          console.error("Token verification failed:", err);
          localStorage.removeItem('token'); // Remove invalid token
        });
    }
  }, []);

  const verifyToken = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/verify-token', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Token verification failed: ${response.status}`);
      }

      const data = await response.json();
      return data.user;
    } catch (error: any) {
      setError(error.message || "Token verification failed");
      throw error; // Re-throw for handling in useEffect
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/login', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Login failed: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      history.push('/dashboard'); // Redirect to dashboard on successful login
    } catch (error: any) {
      setError(error.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/register', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Registration failed: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      history.push('/dashboard'); // Redirect to dashboard on successful registration
    } catch (error: any) {
      setError(error.message || "Registration failed");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/login'); // Redirect to login page
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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

interface AuthContextType {
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  useEffect(() => {
    // Check for existing token in local storage on component mount
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token and fetch user data
      verifyToken(token)
        .then(userData => {
          setUser(userData);
        })
        .catch(err => {
          console.error("Token verification failed:", err);
          localStorage.removeItem('token'); // Remove invalid token
        });
    }
  }, []);

  const verifyToken = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/verify-token', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Token verification failed: ${response.status}`);
      }

      const data = await response.json();
      return data.user;
    } catch (error: any) {
      setError(error.message || "Token verification failed");
      throw error; // Re-throw for handling in useEffect
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/login', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Login failed: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      history.push('/dashboard'); // Redirect to dashboard on successful login
    } catch (error: any) {
      setError(error.message || "Login failed");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/register', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Registration failed: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      history.push('/dashboard'); // Redirect to dashboard on successful registration
    } catch (error: any) {
      setError(error.message || "Registration failed");
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    history.push('/login'); // Redirect to login page
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
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};