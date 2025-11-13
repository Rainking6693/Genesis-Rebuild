// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any; // Replace 'any' with a more specific type if possible
  login: (credentials: any) => Promise<void>; // Replace 'any' with a more specific type if possible
  logout: () => void;
  error: string | null;
}

const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  error: null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null); // Replace 'any' with a more specific type if possible
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for token in local storage on initial load
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and fetch user data
      validateToken(token)
        .then((userData) => {
          setIsAuthenticated(true);
          setUser(userData);
        })
        .catch((err) => {
          console.error("Token validation failed:", err);
          localStorage.removeItem('token'); // Remove invalid token
          setError("Session expired. Please log in again.");
        });
    }
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const response = await fetch('/api/login', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      setUser(data.user);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/validate-token', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      const data = await response.json();
      return data.user;
    } catch (err) {
      console.error("Token validation error:", err);
      throw err;
    }
  };

  const value: AuthContextProps = {
    isAuthenticated,
    user,
    login,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default AuthContext;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any; // Replace 'any' with a more specific type if possible
  login: (credentials: any) => Promise<void>; // Replace 'any' with a more specific type if possible
  logout: () => void;
  error: string | null;
}

const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
  error: null,
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null); // Replace 'any' with a more specific type if possible
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for token in local storage on initial load
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and fetch user data
      validateToken(token)
        .then((userData) => {
          setIsAuthenticated(true);
          setUser(userData);
        })
        .catch((err) => {
          console.error("Token validation failed:", err);
          localStorage.removeItem('token'); // Remove invalid token
          setError("Session expired. Please log in again.");
        });
    }
  }, []);

  const login = async (credentials: any) => {
    setLoading(true);
    setError(null); // Clear any previous errors
    try {
      const response = await fetch('/api/login', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
      setUser(data.user);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/validate-token', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token validation failed');
      }

      const data = await response.json();
      return data.user;
    } catch (err) {
      console.error("Token validation error:", err);
      throw err;
    }
  };

  const value: AuthContextProps = {
    isAuthenticated,
    user,
    login,
    logout,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default AuthContext;