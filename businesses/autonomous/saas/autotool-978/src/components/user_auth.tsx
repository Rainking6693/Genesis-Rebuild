// src/components/UserAuth.tsx
import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// Define a context for user authentication
interface AuthContextProps {
  user: any | null;
  login: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  const login = async (userData: any) => {
    try {
      // Simulate API call (replace with actual API call)
      const response = await fakeLogin(userData);

      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user)); // Store user in local storage
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      alert(error.message); // Display error message to the user
    }
  };

  const logout = async () => {
    try {
      // Simulate API call (replace with actual API call)
      await fakeLogout();

      setUser(null);
      localStorage.removeItem('user'); // Remove user from local storage
      navigate('/login'); // Redirect to login page
    } catch (error: any) {
      console.error("Logout error:", error);
      alert(error.message); // Display error message to the user
    }
  };

  const register = async (userData: any) => {
    try {
      // Simulate API call (replace with actual API call)
      const response = await fakeRegister(userData);

      if (response.success) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user)); // Store user in local storage
        navigate('/dashboard'); // Redirect to dashboard
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.message); // Display error message to the user
    }
  };

  const value: AuthContextProps = {
    user,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Simulate API calls (replace with actual API calls)
const fakeLogin = async (userData: any) => {
  await delay(500); // Simulate network latency
  if (userData.username === 'test' && userData.password === 'password') {
    return { success: true, user: { id: 1, username: 'test' } };
  } else {
    return { success: false, message: 'Invalid credentials' };
  }
};

const fakeLogout = async () => {
  await delay(500); // Simulate network latency
  return { success: true };
};

const fakeRegister = async (userData: any) => {
  await delay(500); // Simulate network latency
  return { success: true, user: { id: 2, username: userData.username } };
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

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

export default ErrorBoundary;

// Usage Example (in App.tsx or similar)
// <AuthProvider>
//   <ErrorBoundary>
//     <AppRoutes /> {/* Your application routes */}
//   </ErrorBoundary>
// </AuthProvider>