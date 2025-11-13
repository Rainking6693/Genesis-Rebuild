// src/components/UserAuth.tsx
import React, { useState, createContext, useContext, ReactNode } from 'react';

interface AuthContextProps {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => Promise<void>; // Replace 'any' with a more specific user type
  logout: () => void;
  register: (userData: any) => Promise<void>; // Replace 'any' with a more specific user type
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: any) => { // Replace 'any' with a more specific user type
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(userData);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: any) => { // Replace 'any' with a more specific user type
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(userData);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextProps = {
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Example usage:
// const { user, login, logout, register, isLoading, error } = useAuth();

// src/components/UserAuth.tsx
import React, { useState, createContext, useContext, ReactNode } from 'react';

interface AuthContextProps {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => Promise<void>; // Replace 'any' with a more specific user type
  logout: () => void;
  register: (userData: any) => Promise<void>; // Replace 'any' with a more specific user type
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: any) => { // Replace 'any' with a more specific user type
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(userData);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: any) => { // Replace 'any' with a more specific user type
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(userData);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextProps = {
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Example usage:
// const { user, login, logout, register, isLoading, error } = useAuth();