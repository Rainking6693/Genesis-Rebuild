// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any; // Replace 'any' with a more specific user type
  login: (credentials: any) => Promise<void>; // Replace 'any' with a more specific type
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
  const [user, setUser] = useState<any>(null); // Replace 'any' with a more specific user type
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token in local storage on component mount
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and fetch user data
      validateToken(token)
        .then((userData) => {
          setIsAuthenticated(true);
          setUser(userData);
        })
        .catch((err) => {
          console.error("Token validation error:", err);
          localStorage.removeItem('token'); // Remove invalid token
          setError("Invalid session. Please log in again.");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: any) => { // Replace 'any' with a more specific type
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/login', { // Replace with your actual login API endpoint
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
      const response = await fetch('/api/validate-token', { // Replace with your actual token validation API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Token validation error:", error);
      throw error;
    }
  };

  const value: AuthContextProps = {
    isAuthenticated,
    user,
    login,
    logout,
    error,
  };

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
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

export default AuthContext;

// src/api/login.ts (Example API endpoint - adjust as needed)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Simulate authentication (replace with actual authentication logic)
    if (username === 'testuser' && password === 'password') {
      const token = 'fake-jwt-token'; // Replace with actual JWT generation
      const user = { id: 1, username: 'testuser', email: 'test@example.com' };

      return res.status(200).json({ token, user });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// src/api/validate-token.ts (Example API endpoint - adjust as needed)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = authHeader.split(' ')[1];

    // Simulate token validation (replace with actual JWT validation)
    if (token === 'fake-jwt-token') {
      const user = { id: 1, username: 'testuser', email: 'test@example.com' };
      return res.status(200).json({ user });
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any; // Replace 'any' with a more specific user type
  login: (credentials: any) => Promise<void>; // Replace 'any' with a more specific type
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
  const [user, setUser] = useState<any>(null); // Replace 'any' with a more specific user type
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token in local storage on component mount
    const token = localStorage.getItem('token');
    if (token) {
      // Validate token and fetch user data
      validateToken(token)
        .then((userData) => {
          setIsAuthenticated(true);
          setUser(userData);
        })
        .catch((err) => {
          console.error("Token validation error:", err);
          localStorage.removeItem('token'); // Remove invalid token
          setError("Invalid session. Please log in again.");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: any) => { // Replace 'any' with a more specific type
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/login', { // Replace with your actual login API endpoint
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
      const response = await fetch('/api/validate-token', { // Replace with your actual token validation API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Invalid token');
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Token validation error:", error);
      throw error;
    }
  };

  const value: AuthContextProps = {
    isAuthenticated,
    user,
    login,
    logout,
    error,
  };

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
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

export default AuthContext;

// src/api/login.ts (Example API endpoint - adjust as needed)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    // Simulate authentication (replace with actual authentication logic)
    if (username === 'testuser' && password === 'password') {
      const token = 'fake-jwt-token'; // Replace with actual JWT generation
      const user = { id: 1, username: 'testuser', email: 'test@example.com' };

      return res.status(200).json({ token, user });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// src/api/validate-token.ts (Example API endpoint - adjust as needed)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = authHeader.split(' ')[1];

    // Simulate token validation (replace with actual JWT validation)
    if (token === 'fake-jwt-token') {
      const user = { id: 1, username: 'testuser', email: 'test@example.com' };
      return res.status(200).json({ user });
    } else {
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}