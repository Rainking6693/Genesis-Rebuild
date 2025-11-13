// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Simulate checking local storage or an API endpoint
        const token = localStorage.getItem('token');
        if (token) {
          // Simulate fetching user data
          const userData = await fetchUserData(token);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err: any) {
        console.error("Authentication check failed:", err);
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
      // Simulate API call
      const response = await simulateLogin(credentials);

      if (response.token) {
        localStorage.setItem('token', response.token);
        const userData = await fetchUserData(response.token);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextProps = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

// Mock API calls (replace with actual API calls)
const simulateLogin = async (credentials: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'test' && credentials.password === 'password') {
        resolve({ token: 'fake_token', message: 'Login successful' });
      } else {
        reject({ message: 'Invalid credentials' });
      }
    }, 500);
  });
};

const fetchUserData = async (token: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, username: 'testuser', email: 'test@example.com' });
    }, 300);
  });
};

export default AuthContext;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Simulate checking local storage or an API endpoint
        const token = localStorage.getItem('token');
        if (token) {
          // Simulate fetching user data
          const userData = await fetchUserData(token);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err: any) {
        console.error("Authentication check failed:", err);
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
      // Simulate API call
      const response = await simulateLogin(credentials);

      if (response.token) {
        localStorage.setItem('token', response.token);
        const userData = await fetchUserData(response.token);
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Login failed");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value: AuthContextProps = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

// Mock API calls (replace with actual API calls)
const simulateLogin = async (credentials: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'test' && credentials.password === 'password') {
        resolve({ token: 'fake_token', message: 'Login successful' });
      } else {
        reject({ message: 'Invalid credentials' });
      }
    }, 500);
  });
};

const fetchUserData = async (token: string) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: 1, username: 'testuser', email: 'test@example.com' });
    }, 300);
  });
};

export default AuthContext;