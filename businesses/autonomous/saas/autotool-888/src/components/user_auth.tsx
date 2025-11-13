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
        // Simulate checking local storage or API for existing token
        const token = localStorage.getItem('authToken');
        if (token) {
          // Simulate validating the token
          const userData = await validateToken(token);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err: any) {
        console.error("Authentication check failed:", err.message);
        setError("Failed to validate authentication.");
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
      const response = await fakeLogin(credentials);

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setError(response.message || "Login failed.");
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.error("Login failed:", err.message);
      setError("Login failed: " + err.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
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
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
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
const fakeLogin = async (credentials: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'user' && credentials.password === 'password') {
        resolve({ success: true, token: 'fakeToken', user: { id: 1, username: 'user' } });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
};

const validateToken = async (token: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === 'fakeToken') {
        resolve({ id: 1, username: 'user' });
      } else {
        reject(new Error('Invalid token'));
      }
    }, 300);
  });
};

// Example usage in a component:
// import { useAuth } from './AuthContext';
// const MyComponent = () => {
//   const { isAuthenticated, user, login, logout } = useAuth();
//   ...
// }

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
        // Simulate checking local storage or API for existing token
        const token = localStorage.getItem('authToken');
        if (token) {
          // Simulate validating the token
          const userData = await validateToken(token);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err: any) {
        console.error("Authentication check failed:", err.message);
        setError("Failed to validate authentication.");
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
      const response = await fakeLogin(credentials);

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setError(response.message || "Login failed.");
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.error("Login failed:", err.message);
      setError("Login failed: " + err.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
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
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
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
const fakeLogin = async (credentials: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'user' && credentials.password === 'password') {
        resolve({ success: true, token: 'fakeToken', user: { id: 1, username: 'user' } });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
};

const validateToken = async (token: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === 'fakeToken') {
        resolve({ id: 1, username: 'user' });
      } else {
        reject(new Error('Invalid token'));
      }
    }, 300);
  });
};

// Example usage in a component:
// import { useAuth } from './AuthContext';
// const MyComponent = () => {
//   const { isAuthenticated, user, login, logout } = useAuth();
//   ...
// }