// src/components/UserAuth.tsx
import React, { useState, createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with a more specific user type
  logout: () => void;
  register: (userData: any) => void; // Replace 'any' with a more specific user type
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: any) => { // Replace 'any' with a more specific user type
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          // Simulate successful login
          resolve({ success: true, user: { id: 1, username: userData.username } });
        }, 1000)
      );

      if (response && (response as any).success) { // Replace 'any' with a more specific user type
        setUser((response as any).user); // Replace 'any' with a more specific user type
      } else {
        setError('Invalid credentials.');
      }
    } catch (err: any) { // Explicitly type 'err' as 'any'
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: any) => { // Replace 'any' with a more specific user type
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          // Simulate successful registration
          resolve({ success: true, user: { id: 2, username: userData.username } });
        }, 1000)
      );

      if (response && (response as any).success) { // Replace 'any' with a more specific user type
        setUser((response as any).user); // Replace 'any' with a more specific user type
      } else {
        setError('Registration failed.');
      }
    } catch (err: any) { // Explicitly type 'err' as 'any'
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Error Boundary Component (Optional - for more robust error handling at the UI level)
interface ErrorBoundaryProps {
  children: ReactNode;
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
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
    this.setState({errorInfo: errorInfo})
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
import React, { useState, createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with a more specific user type
  logout: () => void;
  register: (userData: any) => void; // Replace 'any' with a more specific user type
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: any) => { // Replace 'any' with a more specific user type
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          // Simulate successful login
          resolve({ success: true, user: { id: 1, username: userData.username } });
        }, 1000)
      );

      if (response && (response as any).success) { // Replace 'any' with a more specific user type
        setUser((response as any).user); // Replace 'any' with a more specific user type
      } else {
        setError('Invalid credentials.');
      }
    } catch (err: any) { // Explicitly type 'err' as 'any'
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: any) => { // Replace 'any' with a more specific user type
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          // Simulate successful registration
          resolve({ success: true, user: { id: 2, username: userData.username } });
        }, 1000)
      );

      if (response && (response as any).success) { // Replace 'any' with a more specific user type
        setUser((response as any).user); // Replace 'any' with a more specific user type
      } else {
        setError('Registration failed.');
      }
    } catch (err: any) { // Explicitly type 'err' as 'any'
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Error Boundary Component (Optional - for more robust error handling at the UI level)
interface ErrorBoundaryProps {
  children: ReactNode;
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
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
    this.setState({errorInfo: errorInfo})
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