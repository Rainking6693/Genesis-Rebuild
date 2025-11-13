// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  // ... other user properties
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    // Simulate checking for existing token on component mount
    const token = localStorage.getItem('authToken');
    if (token) {
      // Simulate fetching user data based on token
      setTimeout(() => {
        setUser({ id: '123', email: 'test@example.com' }); // Replace with actual data fetching
        setIsLoading(false);
      }, 500); // Simulate API call delay
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call for login
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          // Simulate successful login
          localStorage.setItem('authToken', 'fakeToken');
          resolve({ id: '123', email });
        }, 1000)
      );

      const userData = response as { id: string; email: string };
      setUser({ id: userData.id, email: userData.email });
    } catch (error: any) {
      console.error('Login failed:', error);
      // Handle login error (e.g., display error message)
      throw new Error('Invalid credentials'); // Re-throw for component to handle
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    try {
      // Simulate API call for registration
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call delay
      // Simulate successful registration
      await login(email, password); // Automatically log in after registration
    } catch (error: any) {
      console.error('Registration failed:', error);
      // Handle registration error (e.g., display error message)
      throw new Error('Registration failed'); // Re-throw for component to handle
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  // ... other user properties
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    // Simulate checking for existing token on component mount
    const token = localStorage.getItem('authToken');
    if (token) {
      // Simulate fetching user data based on token
      setTimeout(() => {
        setUser({ id: '123', email: 'test@example.com' }); // Replace with actual data fetching
        setIsLoading(false);
      }, 500); // Simulate API call delay
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulate API call for login
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          // Simulate successful login
          localStorage.setItem('authToken', 'fakeToken');
          resolve({ id: '123', email });
        }, 1000)
      );

      const userData = response as { id: string; email: string };
      setUser({ id: userData.id, email: userData.email });
    } catch (error: any) {
      console.error('Login failed:', error);
      // Handle login error (e.g., display error message)
      throw new Error('Invalid credentials'); // Re-throw for component to handle
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const register = async (email: string, password: string) => {
    try {
      // Simulate API call for registration
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call delay
      // Simulate successful registration
      await login(email, password); // Automatically log in after registration
    } catch (error: any) {
      console.error('Registration failed:', error);
      // Handle registration error (e.g., display error message)
      throw new Error('Registration failed'); // Re-throw for component to handle
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

Now, I will use the tools to write the code to a file and output the build report.