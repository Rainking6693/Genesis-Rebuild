// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router for navigation

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with the user data type
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// Create Auth Context
export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking for an existing token in local storage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Simulate fetching user data based on the token
      setTimeout(() => {
        setUser({ id: '123', username: 'exampleUser' }); // Replace with actual user data
        setIsLoading(false);
      }, 500); // Simulate API call delay
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (userData: any) => { // Replace 'any' with the user data type
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to login
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({ success: true, token: 'fakeToken', user: { id: '123', username: 'exampleUser' } });
        }, 1000)
      );

      const data: any = response; // Replace 'any' with the actual response type

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        navigate('/dashboard'); // Redirect to dashboard after login
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) { // Type assertion for err
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login'); // Redirect to login after logout
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Example Login Component
export const LoginComponent: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

// Example Logout Component
export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
};

// Error Boundary Component (Simplified)
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router for navigation

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with the user data type
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

// Create Auth Context
export const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking for an existing token in local storage
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Simulate fetching user data based on the token
      setTimeout(() => {
        setUser({ id: '123', username: 'exampleUser' }); // Replace with actual user data
        setIsLoading(false);
      }, 500); // Simulate API call delay
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (userData: any) => { // Replace 'any' with the user data type
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call to login
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          resolve({ success: true, token: 'fakeToken', user: { id: '123', username: 'exampleUser' } });
        }, 1000)
      );

      const data: any = response; // Replace 'any' with the actual response type

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        setUser(data.user);
        navigate('/dashboard'); // Redirect to dashboard after login
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) { // Type assertion for err
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login'); // Redirect to login after logout
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Example Login Component
export const LoginComponent: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

// Example Logout Component
export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return <button onClick={logout}>Logout</button>;
};

// Error Boundary Component (Simplified)
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;