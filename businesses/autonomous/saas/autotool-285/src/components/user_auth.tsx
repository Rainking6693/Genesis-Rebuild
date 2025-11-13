// src/components/UserAuth.tsx
import React, { useState, createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // For token generation

// Define types
interface AuthContextType {
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  isLoading: boolean;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedToken: any = jwt.verify(storedToken, 'YOUR_SECRET_KEY'); // Replace with a secure secret key
        setUser(decodedToken.user);
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem('authToken'); // Remove invalid token
      }
    }
  }, []);

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = { ...userData, password: hashedPassword };

      // Simulate API call (replace with actual API endpoint)
      const response = await fetch('/api/register', { // Replace with your API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);

      // Decode the token to get user information
      const decodedToken: any = jwt.verify(data.token, 'YOUR_SECRET_KEY'); // Replace with a secure secret key
      setUser(decodedToken.user);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error: any) {
      console.error("Registration error:", error);
      // Handle registration error (e.g., display error message to the user)
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      // Simulate API call (replace with actual API endpoint)
      const response = await fetch('/api/login', { // Replace with your API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);

      // Decode the token to get user information
      const decodedToken: any = jwt.verify(data.token, 'YOUR_SECRET_KEY'); // Replace with a secure secret key
      setUser(decodedToken.user);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error: any) {
      console.error("Login error:", error);
      // Handle login error (e.g., display error message to the user)
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login'); // Redirect to login page
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Example usage in a component:
// const { user, login, logout, register, isLoading } = useAuth();

export default AuthContext;

// src/components/UserAuth.tsx
import React, { useState, createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import bcrypt from 'bcryptjs'; // For password hashing
import jwt from 'jsonwebtoken'; // For token generation

// Define types
interface AuthContextType {
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
  isLoading: boolean;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedToken: any = jwt.verify(storedToken, 'YOUR_SECRET_KEY'); // Replace with a secure secret key
        setUser(decodedToken.user);
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem('authToken'); // Remove invalid token
      }
    }
  }, []);

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = { ...userData, password: hashedPassword };

      // Simulate API call (replace with actual API endpoint)
      const response = await fetch('/api/register', { // Replace with your API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);

      // Decode the token to get user information
      const decodedToken: any = jwt.verify(data.token, 'YOUR_SECRET_KEY'); // Replace with a secure secret key
      setUser(decodedToken.user);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error: any) {
      console.error("Registration error:", error);
      // Handle registration error (e.g., display error message to the user)
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials: any) => {
    setIsLoading(true);
    try {
      // Simulate API call (replace with actual API endpoint)
      const response = await fetch('/api/login', { // Replace with your API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);

      // Decode the token to get user information
      const decodedToken: any = jwt.verify(data.token, 'YOUR_SECRET_KEY'); // Replace with a secure secret key
      setUser(decodedToken.user);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error: any) {
      console.error("Login error:", error);
      // Handle login error (e.g., display error message to the user)
      alert(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login'); // Redirect to login page
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Example usage in a component:
// const { user, login, logout, register, isLoading } = useAuth();

export default AuthContext;