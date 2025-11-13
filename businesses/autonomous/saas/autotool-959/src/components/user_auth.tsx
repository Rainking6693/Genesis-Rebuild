// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any; // Replace 'any' with a more specific type if possible
  login: (credentials: any) => Promise<void>;
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
  const [user, setUser] = useState<any>(null); // Replace 'any' with a more specific type
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          setError("Session expired. Please login again.");
        });
    }
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
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
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
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

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
    this.setState({errorInfo: errorInfo});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };

// src/api/login.ts (Example API endpoint - needs to be implemented on the backend)
// This is just a placeholder.  A real implementation would handle
// authentication against a database or other authentication provider.

export async function login(credentials: any) {
  // Simulate successful login
  if (credentials.username === 'test' && credentials.password === 'password') {
    return {
      token: 'fake_jwt_token',
      user: {
        id: 1,
        username: 'test',
        email: 'test@example.com',
      },
    };
  } else {
    throw new Error('Invalid credentials');
  }
}

// src/api/validate-token.ts (Example API endpoint - needs to be implemented on the backend)
// This is just a placeholder.  A real implementation would validate
// the token against a secret key and retrieve user data.

export async function validateToken(token: string) {
  // Simulate token validation
  if (token === 'fake_jwt_token') {
    return {
      id: 1,
      username: 'test',
      email: 'test@example.com',
    };
  } else {
    throw new Error('Invalid token');
  }
}

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any; // Replace 'any' with a more specific type if possible
  login: (credentials: any) => Promise<void>;
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
  const [user, setUser] = useState<any>(null); // Replace 'any' with a more specific type
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
          setError("Session expired. Please login again.");
        });
    }
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
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
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
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

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

// Error Boundary Component
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
    this.setState({errorInfo: errorInfo});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };

// src/api/login.ts (Example API endpoint - needs to be implemented on the backend)
// This is just a placeholder.  A real implementation would handle
// authentication against a database or other authentication provider.

export async function login(credentials: any) {
  // Simulate successful login
  if (credentials.username === 'test' && credentials.password === 'password') {
    return {
      token: 'fake_jwt_token',
      user: {
        id: 1,
        username: 'test',
        email: 'test@example.com',
      },
    };
  } else {
    throw new Error('Invalid credentials');
  }
}

// src/api/validate-token.ts (Example API endpoint - needs to be implemented on the backend)
// This is just a placeholder.  A real implementation would validate
// the token against a secret key and retrieve user data.

export async function validateToken(token: string) {
  // Simulate token validation
  if (token === 'fake_jwt_token') {
    return {
      id: 1,
      username: 'test',
      email: 'test@example.com',
    };
  } else {
    throw new Error('Invalid token');
  }
}