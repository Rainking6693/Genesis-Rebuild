// src/components/UserAuth.tsx
import React, { useState, createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific type if possible
  login: (userData: any) => void; // Replace 'any' with a more specific type if possible
  logout: () => void;
  register: (userData: any) => void; // Replace 'any' with a more specific type if possible
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific type if possible
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: any) => { // Replace 'any' with a more specific type if possible
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      setUser(userData); // Assuming API returns user data on successful login
    } catch (err: any) { // Explicitly type 'err' as 'any'
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: any) => { // Replace 'any' with a more specific type if possible
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      setUser(userData); // Assuming API returns user data on successful registration
    } catch (err: any) { // Explicitly type 'err' as 'any'
      console.error("Registration error:", err);
      setError(err.message || "Registration failed");
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Error Boundary Component (Simple Example)
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) { // Explicitly type 'error' as 'any'
    // Update state so the next render will show the fallback UI.
    console.error("Error Boundary Caught:", error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) { // Explicitly type 'error' as 'any'
    // You can also log the error to an error reporting service
    console.error("Error Boundary ComponentDidCatch:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export { ErrorBoundary };

// src/components/UserAuth.tsx
import React, { useState, createContext, useContext, ReactNode } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific type if possible
  login: (userData: any) => void; // Replace 'any' with a more specific type if possible
  logout: () => void;
  register: (userData: any) => void; // Replace 'any' with a more specific type if possible
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific type if possible
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: any) => { // Replace 'any' with a more specific type if possible
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      setUser(userData); // Assuming API returns user data on successful login
    } catch (err: any) { // Explicitly type 'err' as 'any'
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: any) => { // Replace 'any' with a more specific type if possible
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      setUser(userData); // Assuming API returns user data on successful registration
    } catch (err: any) { // Explicitly type 'err' as 'any'
      console.error("Registration error:", err);
      setError(err.message || "Registration failed");
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Error Boundary Component (Simple Example)
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) { // Explicitly type 'error' as 'any'
    // Update state so the next render will show the fallback UI.
    console.error("Error Boundary Caught:", error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: React.ErrorInfo) { // Explicitly type 'error' as 'any'
    // You can also log the error to an error reporting service
    console.error("Error Boundary ComponentDidCatch:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export { ErrorBoundary };