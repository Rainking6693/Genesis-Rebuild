// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with a more specific user type
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type

  const login = (userData: any) => { // Replace 'any' with a more specific user type
    try {
      // Simulate API call (replace with actual API call)
      // In a real application, you'd make an API call to authenticate the user
      // and receive user data.
      setUser(userData);
    } catch (error: any) {
      console.error("Login failed:", error);
      // Handle login error (e.g., display an error message to the user)
      alert("Login failed. Please try again.");
    }
  };

  const logout = () => {
    try {
      // Simulate API call (replace with actual API call)
      // In a real application, you might need to invalidate the user's session
      // on the server.
      setUser(null);
    } catch (error: any) {
      console.error("Logout failed:", error);
      // Handle logout error (e.g., display an error message to the user)
      alert("Logout failed. Please try again.");
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Example Usage (Login Form)
export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Basic validation (replace with more robust validation)
      if (!username || !password) {
        alert("Please enter both username and password.");
        return;
      }

      // Simulate user data (replace with actual API response)
      const userData = { username: username, id: 123 };
      login(userData);
    } catch (error: any) {
      console.error("Form submission error:", error);
      alert("An error occurred during form submission.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

// Error Boundary Example
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

export default ErrorBoundary;