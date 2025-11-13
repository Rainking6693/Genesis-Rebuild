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
          // Simulate fetching user data based on the token
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
      // Simulate API call for login
      const response = await fakeLoginApiCall(credentials);

      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setError(response.message || "Login failed.");
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("Login failed due to a network error.");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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
    return <div>Loading authentication...</div>;
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
const fakeLoginApiCall = async (credentials: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'test' && credentials.password === 'password') {
        resolve({ success: true, token: 'fake_token', user: { id: 1, username: 'test' } });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
};

const fetchUserData = async (token: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id: 1, username: 'test' });
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
          // Simulate fetching user data based on the token
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
      // Simulate API call for login
      const response = await fakeLoginApiCall(credentials);

      if (response.success) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setError(response.message || "Login failed.");
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("Login failed due to a network error.");
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
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
    return <div>Loading authentication...</div>;
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
const fakeLoginApiCall = async (credentials: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'test' && credentials.password === 'password') {
        resolve({ success: true, token: 'fake_token', user: { id: 1, username: 'test' } });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
};

const fetchUserData = async (token: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ id: 1, username: 'test' });
    }, 300);
  });
};

export default AuthContext;