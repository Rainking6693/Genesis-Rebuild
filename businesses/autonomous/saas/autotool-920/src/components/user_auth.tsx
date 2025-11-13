// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

interface AuthContextType {
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const history = useHistory();

  const login = async (userData: any) => {
    try {
      // Simulate API call (replace with actual API call)
      const response = await fakeLogin(userData);

      if (response.success) {
        setUser(response.user);
        localStorage.setItem('token', response.token); // Store token securely
        history.push('/dashboard'); // Redirect to dashboard
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Display error message to user (e.g., using a toast notification)
      alert(error.message); // Replace with a better UI notification
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    history.push('/login');
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

// Placeholder for actual API call
const fakeLogin = async (userData: any) => {
  // Simulate authentication logic
  if (userData.username === 'test' && userData.password === 'password') {
    return {
      success: true,
      user: { id: 1, username: 'test' },
      token: 'fake_token',
    };
  } else {
    return { success: false, message: 'Invalid credentials' };
  }
};

// Example usage (Login Form Component)
export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = React.useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      await login({ username, password });
    } catch (error: any) {
      console.error('Form submission error:', error);
      alert(error.message); // Replace with a better UI notification
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

// Error Boundary Example (Wrap components that might fail)
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
    this.setState({error: error, errorInfo: errorInfo})
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. {this.state.error?.message}</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

interface AuthContextType {
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const history = useHistory();

  const login = async (userData: any) => {
    try {
      // Simulate API call (replace with actual API call)
      const response = await fakeLogin(userData);

      if (response.success) {
        setUser(response.user);
        localStorage.setItem('token', response.token); // Store token securely
        history.push('/dashboard'); // Redirect to dashboard
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      // Display error message to user (e.g., using a toast notification)
      alert(error.message); // Replace with a better UI notification
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    history.push('/login');
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

// Placeholder for actual API call
const fakeLogin = async (userData: any) => {
  // Simulate authentication logic
  if (userData.username === 'test' && userData.password === 'password') {
    return {
      success: true,
      user: { id: 1, username: 'test' },
      token: 'fake_token',
    };
  } else {
    return { success: false, message: 'Invalid credentials' };
  }
};

// Example usage (Login Form Component)
export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = React.useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      await login({ username, password });
    } catch (error: any) {
      console.error('Form submission error:', error);
      alert(error.message); // Replace with a better UI notification
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

// Error Boundary Example (Wrap components that might fail)
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
    this.setState({error: error, errorInfo: errorInfo})
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. {this.state.error?.message}</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;