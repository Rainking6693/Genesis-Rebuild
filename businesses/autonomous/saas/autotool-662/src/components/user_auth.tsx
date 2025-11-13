// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { apiRequest } from '../utils/api'; // Assuming an API utility function exists

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (credentials: any) => Promise<void>; // Replace 'any' with a more specific credentials type
  logout: () => void;
  register: (userData: any) => Promise<void>; // Replace 'any' with a more specific user data type
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token in local storage on component mount
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and fetch user data
      validateToken(token)
        .then(userData => setUser(userData))
        .catch(error => {
          console.error("Token validation failed:", error);
          localStorage.removeItem('token'); // Remove invalid token
          setUser(null);
        });
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await apiRequest('/auth/validate', 'GET', null, token);
      if (!response.ok) {
        throw new Error('Token validation failed');
      }
      return await response.json();
    } catch (error) {
      console.error("Error validating token:", error);
      throw error;
    }
  };

  const login = async (credentials: any) => {
    try {
      const response = await apiRequest('/auth/login', 'POST', credentials);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error: any) {
      console.error("Login error:", error);
      throw error; // Re-throw the error to be handled by the calling component
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await apiRequest('/auth/register', 'POST', userData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/dashboard'); // Redirect to dashboard after successful registration
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error; // Re-throw the error to be handled by the calling component
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login'); // Redirect to login page after logout
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { apiRequest } from '../utils/api'; // Assuming an API utility function exists

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (credentials: any) => Promise<void>; // Replace 'any' with a more specific credentials type
  logout: () => void;
  register: (userData: any) => Promise<void>; // Replace 'any' with a more specific user data type
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token in local storage on component mount
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and fetch user data
      validateToken(token)
        .then(userData => setUser(userData))
        .catch(error => {
          console.error("Token validation failed:", error);
          localStorage.removeItem('token'); // Remove invalid token
          setUser(null);
        });
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      const response = await apiRequest('/auth/validate', 'GET', null, token);
      if (!response.ok) {
        throw new Error('Token validation failed');
      }
      return await response.json();
    } catch (error) {
      console.error("Error validating token:", error);
      throw error;
    }
  };

  const login = async (credentials: any) => {
    try {
      const response = await apiRequest('/auth/login', 'POST', credentials);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (error: any) {
      console.error("Login error:", error);
      throw error; // Re-throw the error to be handled by the calling component
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await apiRequest('/auth/register', 'POST', userData);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/dashboard'); // Redirect to dashboard after successful registration
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error; // Re-throw the error to be handled by the calling component
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login'); // Redirect to login page after logout
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};