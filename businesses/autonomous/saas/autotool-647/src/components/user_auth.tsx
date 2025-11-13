// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextType {
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  const login = (userData: any) => {
    try {
      // Simulate API call (replace with actual API call)
      setTimeout(() => {
        setUser(userData);
      }, 500); // Simulate network latency
    } catch (error: any) {
      console.error("Login failed:", error);
      // Display user-friendly error message
      alert("Login failed. Please try again.");
    }
  };

  const logout = () => {
    try {
      // Simulate API call (replace with actual API call)
      setTimeout(() => {
        setUser(null);
      }, 500); // Simulate network latency
    } catch (error: any) {
      console.error("Logout failed:", error);
      // Display user-friendly error message
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
  return React.useContext(AuthContext);
};

// Example Login Form Component
export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Basic client-side validation
      if (!username || !password) {
        setError("Username and password are required.");
        return;
      }

      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'test' && password === 'password') {
            resolve({ id: 1, username: 'test' });
          } else {
            reject(new Error("Invalid credentials"));
          }
        }, 500);
      });

      login(response);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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

// Error Boundary Component (for demonstration)
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
    // You can also log the error to an error reporting service
    console.error("Caught an error:", error, errorInfo);
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
import React, { useState } from 'react';

interface AuthContextType {
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  const login = (userData: any) => {
    try {
      // Simulate API call (replace with actual API call)
      setTimeout(() => {
        setUser(userData);
      }, 500); // Simulate network latency
    } catch (error: any) {
      console.error("Login failed:", error);
      // Display user-friendly error message
      alert("Login failed. Please try again.");
    }
  };

  const logout = () => {
    try {
      // Simulate API call (replace with actual API call)
      setTimeout(() => {
        setUser(null);
      }, 500); // Simulate network latency
    } catch (error: any) {
      console.error("Logout failed:", error);
      // Display user-friendly error message
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
  return React.useContext(AuthContext);
};

// Example Login Form Component
export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Basic client-side validation
      if (!username || !password) {
        setError("Username and password are required.");
        return;
      }

      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'test' && password === 'password') {
            resolve({ id: 1, username: 'test' });
          } else {
            reject(new Error("Invalid credentials"));
          }
        }, 500);
      });

      login(response);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
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

// Error Boundary Component (for demonstration)
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
    // You can also log the error to an error reporting service
    console.error("Caught an error:", error, errorInfo);
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