// src/components/UserAuth.tsx
import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used

// Define a context for user authentication
interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with the expected user data type
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (userData: any) => { // Replace 'any' with the expected user data type
    setIsLoading(true);
    setError(null);

    try {
      // Simulate an API call to authenticate the user
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user data in local storage
      navigate('/dashboard'); // Redirect to the dashboard after successful login
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error("Login Error:", err); // Log the error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user data from local storage
    navigate('/login'); // Redirect to the login page after logout
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
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Example Login Component (Illustrative)
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
      {error && <div style={{ color: 'red' }}>{error}</div>}
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

// Example Protected Route Component (Illustrative)
import { Route, Navigate } from 'react-router-dom'; // Assuming React Router is used

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo }) => {
  const { user } = useAuth();

  return user ? (
    children
  ) : (
    <Navigate to={redirectTo} replace />
  );
};

// src/components/UserAuth.tsx
import React, { useState, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used

// Define a context for user authentication
interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with the expected user data type
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (userData: any) => { // Replace 'any' with the expected user data type
    setIsLoading(true);
    setError(null);

    try {
      // Simulate an API call to authenticate the user
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user data in local storage
      navigate('/dashboard'); // Redirect to the dashboard after successful login
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error("Login Error:", err); // Log the error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user data from local storage
    navigate('/login'); // Redirect to the login page after logout
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
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Example Login Component (Illustrative)
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
      {error && <div style={{ color: 'red' }}>{error}</div>}
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

// Example Protected Route Component (Illustrative)
import { Route, Navigate } from 'react-router-dom'; // Assuming React Router is used

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo }) => {
  const { user } = useAuth();

  return user ? (
    children
  ) : (
    <Navigate to={redirectTo} replace />
  );
};