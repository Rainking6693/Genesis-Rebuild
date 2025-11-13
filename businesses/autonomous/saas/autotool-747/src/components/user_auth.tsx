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
          console.error("Token validation failed:", err);
          localStorage.removeItem('token'); // Remove invalid token
          setError("Session expired. Please login again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: any) => { // Replace 'any' with a more specific type
    setLoading(true);
    setError(null);
    try {
      const response = await authenticateUser(credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        const userData = await validateToken(response.token);
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setError(response.message || "Login failed. Invalid credentials.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
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

// Mock API calls (replace with actual API calls)
const authenticateUser = async (credentials: any) => { // Replace 'any' with a more specific type
  // Simulate API call to authenticate user
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

const validateToken = async (token: string) => {
  // Simulate API call to validate token and fetch user data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === 'fake_token') {
        resolve({ id: 1, username: 'testuser', email: 'test@example.com' });
      } else {
        reject({ message: 'Invalid token' });
      }
    }, 300);
  });
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
    this.setState({ errorInfo: errorInfo });
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
          console.error("Token validation failed:", err);
          localStorage.removeItem('token'); // Remove invalid token
          setError("Session expired. Please login again.");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: any) => { // Replace 'any' with a more specific type
    setLoading(true);
    setError(null);
    try {
      const response = await authenticateUser(credentials);
      if (response.token) {
        localStorage.setItem('token', response.token);
        const userData = await validateToken(response.token);
        setIsAuthenticated(true);
        setUser(userData);
      } else {
        setError(response.message || "Login failed. Invalid credentials.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
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

// Mock API calls (replace with actual API calls)
const authenticateUser = async (credentials: any) => { // Replace 'any' with a more specific type
  // Simulate API call to authenticate user
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

const validateToken = async (token: string) => {
  // Simulate API call to validate token and fetch user data
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === 'fake_token') {
        resolve({ id: 1, username: 'testuser', email: 'test@example.com' });
      } else {
        reject({ message: 'Invalid token' });
      }
    }, 300);
  });
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
    this.setState({ errorInfo: errorInfo });
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