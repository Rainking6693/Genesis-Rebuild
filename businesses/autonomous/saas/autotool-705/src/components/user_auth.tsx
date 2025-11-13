// src/components/UserAuth.tsx

import React, { useState, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

interface UserAuthProviderProps {
  children: React.ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Simulate checking for existing token on component mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Simulate validating the token with the backend
          const userData = await validateToken(token);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error: any) {
        console.error("Error during initial auth check:", error);
        // Handle token validation failure (e.g., token expired)
        localStorage.removeItem('authToken'); // Clear invalid token
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await authenticateUser(credentials);
      const { token, user } = response;

      localStorage.setItem('authToken', token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Login failed:", error);
      // Handle login failure (e.g., display error message to user)
      throw new Error("Invalid credentials"); // Re-throw for component to handle
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextProps = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display loading indicator
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock authentication and token validation functions (replace with actual API calls)
const authenticateUser = async (credentials: any) => {
  // Simulate API call to authenticate user
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'test' && credentials.password === 'password') {
        resolve({ token: 'fake_token', user: { id: 1, username: 'test' } });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

const validateToken = async (token: string) => {
  // Simulate API call to validate token
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === 'fake_token') {
        resolve({ id: 1, username: 'test' });
      } else {
        reject(new Error('Invalid token'));
      }
    }, 300);
  });
};

// src/components/UserAuth.tsx

import React, { useState, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

interface UserAuthProviderProps {
  children: React.ReactNode;
}

export const UserAuthProvider: React.FC<UserAuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Simulate checking for existing token on component mount
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Simulate validating the token with the backend
          const userData = await validateToken(token);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error: any) {
        console.error("Error during initial auth check:", error);
        // Handle token validation failure (e.g., token expired)
        localStorage.removeItem('authToken'); // Clear invalid token
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await authenticateUser(credentials);
      const { token, user } = response;

      localStorage.setItem('authToken', token);
      setUser(user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Login failed:", error);
      // Handle login failure (e.g., display error message to user)
      throw new Error("Invalid credentials"); // Re-throw for component to handle
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextProps = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display loading indicator
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock authentication and token validation functions (replace with actual API calls)
const authenticateUser = async (credentials: any) => {
  // Simulate API call to authenticate user
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'test' && credentials.password === 'password') {
        resolve({ token: 'fake_token', user: { id: 1, username: 'test' } });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

const validateToken = async (token: string) => {
  // Simulate API call to validate token
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === 'fake_token') {
        resolve({ id: 1, username: 'test' });
      } else {
        reject(new Error('Invalid token'));
      }
    }, 300);
  });
};