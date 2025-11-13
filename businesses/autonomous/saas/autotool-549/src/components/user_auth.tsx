// src/components/UserAuth.tsx
import React, { useState, useCallback } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  error: string | null;
}

export const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  error: null,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      if (username === 'test' && password === 'password') {
        setIsAuthenticated(true);
        setError(null);
      } else {
        setError('Invalid credentials');
        setIsAuthenticated(false);
      }
    } catch (e: any) {
      setError(`Login failed: ${e.message}`);
      setIsAuthenticated(false);
    }
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setIsAuthenticated(true);
      setError(null);
    } catch (e: any) {
      setError(`Registration failed: ${e.message}`);
      setIsAuthenticated(false);
    }
  }, []);

  const value: AuthContextProps = {
    isAuthenticated,
    login,
    logout,
    register,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Caught an error: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export { ErrorBoundary };