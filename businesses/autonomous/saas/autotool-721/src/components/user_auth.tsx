// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (username: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      if (username === 'test' && password === 'password') {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login failed:', error.message);
      throw error; // Re-throw for component-level handling
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const register = async (username: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Registered user: ${username}`);
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Password reset email sent to: ${email}`);
    } catch (error: any) {
      console.error('Password reset failed:', error.message);
      throw error;
    }
  };

  const value: AuthContextProps = {
    isAuthenticated,
    login,
    logout,
    register,
    resetPassword,
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

// Example usage in a component:
// import { useAuth } from './UserAuth';
// const { isAuthenticated, login, logout } = useAuth();

// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (username: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      if (username === 'test' && password === 'password') {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      console.error('Login failed:', error.message);
      throw error; // Re-throw for component-level handling
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const register = async (username: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Registered user: ${username}`);
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Password reset email sent to: ${email}`);
    } catch (error: any) {
      console.error('Password reset failed:', error.message);
      throw error;
    }
  };

  const value: AuthContextProps = {
    isAuthenticated,
    login,
    logout,
    register,
    resetPassword,
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

// Example usage in a component:
// import { useAuth } from './UserAuth';
// const { isAuthenticated, login, logout } = useAuth();