// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (credentials: any) => Promise<void>; // Replace 'any' with credential type
  logout: () => void;
  register: (userData: any) => Promise<void>; // Replace 'any' with user data type
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type

  const login = async (credentials: any) => { // Replace 'any' with credential type
    try {
      // Simulate API call
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({ success: true, user: { id: 1, username: 'testuser' } }), 500)
      );

      if (response && (response as any).success) { // Type assertion for response
        setUser((response as any).user); // Type assertion for response
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) { // Explicitly type 'error' as 'any'
      console.error('Login failed:', error.message);
      // Handle login error (e.g., display error message to the user)
      throw error; // Re-throw to allow the calling component to handle it
    }
  };

  const logout = () => {
    setUser(null);
    // Perform logout logic (e.g., clear local storage, redirect)
  };

  const register = async (userData: any) => { // Replace 'any' with user data type
    try {
      // Simulate API call
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({ success: true, user: { id: 1, username: userData.username } }), 500)
      );

      if (response && (response as any).success) { // Type assertion for response
        setUser((response as any).user); // Type assertion for response
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: any) { // Explicitly type 'error' as 'any'
      console.error('Registration failed:', error.message);
      // Handle registration error (e.g., display error message to the user)
      throw error; // Re-throw to allow the calling component to handle it
    }
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
import React, { useState } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (credentials: any) => Promise<void>; // Replace 'any' with credential type
  logout: () => void;
  register: (userData: any) => Promise<void>; // Replace 'any' with user data type
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type

  const login = async (credentials: any) => { // Replace 'any' with credential type
    try {
      // Simulate API call
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({ success: true, user: { id: 1, username: 'testuser' } }), 500)
      );

      if (response && (response as any).success) { // Type assertion for response
        setUser((response as any).user); // Type assertion for response
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) { // Explicitly type 'error' as 'any'
      console.error('Login failed:', error.message);
      // Handle login error (e.g., display error message to the user)
      throw error; // Re-throw to allow the calling component to handle it
    }
  };

  const logout = () => {
    setUser(null);
    // Perform logout logic (e.g., clear local storage, redirect)
  };

  const register = async (userData: any) => { // Replace 'any' with user data type
    try {
      // Simulate API call
      const response = await new Promise((resolve) =>
        setTimeout(() => resolve({ success: true, user: { id: 1, username: userData.username } }), 500)
      );

      if (response && (response as any).success) { // Type assertion for response
        setUser((response as any).user); // Type assertion for response
      } else {
        throw new Error('Registration failed');
      }
    } catch (error: any) { // Explicitly type 'error' as 'any'
      console.error('Registration failed:', error.message);
      // Handle registration error (e.g., display error message to the user)
      throw error; // Re-throw to allow the calling component to handle it
    }
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