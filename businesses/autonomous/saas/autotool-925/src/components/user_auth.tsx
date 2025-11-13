// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Simulate checking local storage or API for existing token
        const token = localStorage.getItem('authToken');
        if (token) {
          // Simulate validating the token
          const userData = await validateToken(token);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err: any) {
        console.error("Authentication check failed:", err.message);
        setError("Failed to validate authentication.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call for login
      const response = await fakeLoginApi(credentials);

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setError(response.message || "Login failed.");
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.error("Login failed:", err.message);
      setError("Login failed: " + err.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextProps = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
const fakeLoginApi = async (credentials: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'test' && credentials.password === 'password') {
        resolve({ success: true, token: 'fake_token', user: { id: 1, username: 'test' } });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
};

const validateToken = async (token: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === 'fake_token') {
        resolve({ id: 1, username: 'test' });
      } else {
        reject(new Error('Invalid token'));
      }
    }, 300);
  });
};

// Example usage:
// import { useAuth } from './components/UserAuth';
// const { isAuthenticated, user, login, logout } = useAuth();

// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from './UserAuth';

const LoginForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      await login({ username, password });
    } catch (err: any) {
      console.error("Login submission failed:", err.message);
      setError("Login failed: " + err.message);
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

export default LoginForm;

// src/components/LogoutButton.tsx
import React from 'react';
import { useAuth } from './UserAuth';

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;

// src/components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from './UserAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;

// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/UserAuth';
import LoginForm from './components/LoginForm';
import LogoutButton from './components/LogoutButton';
import ProtectedRoute from './components/ProtectedRoute';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <h2>Home</h2>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.username}!</p>
          <LogoutButton />
        </div>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Profile</h2>
      <p>User ID: {user?.id}</p>
      <p>Username: {user?.username}</p>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: any | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Simulate checking local storage or API for existing token
        const token = localStorage.getItem('authToken');
        if (token) {
          // Simulate validating the token
          const userData = await validateToken(token);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err: any) {
        console.error("Authentication check failed:", err.message);
        setError("Failed to validate authentication.");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call for login
      const response = await fakeLoginApi(credentials);

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setError(response.message || "Login failed.");
        setIsAuthenticated(false);
      }
    } catch (err: any) {
      console.error("Login failed:", err.message);
      setError("Login failed: " + err.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextProps = {
    isAuthenticated,
    user,
    login,
    logout,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
const fakeLoginApi = async (credentials: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'test' && credentials.password === 'password') {
        resolve({ success: true, token: 'fake_token', user: { id: 1, username: 'test' } });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
};

const validateToken = async (token: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === 'fake_token') {
        resolve({ id: 1, username: 'test' });
      } else {
        reject(new Error('Invalid token'));
      }
    }, 300);
  });
};

// Example usage:
// import { useAuth } from './components/UserAuth';
// const { isAuthenticated, user, login, logout } = useAuth();

// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from './UserAuth';

const LoginForm = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Username and password are required.");
      return;
    }

    try {
      await login({ username, password });
    } catch (err: any) {
      console.error("Login submission failed:", err.message);
      setError("Login failed: " + err.message);
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

export default LoginForm;

// src/components/LogoutButton.tsx
import React from 'react';
import { useAuth } from './UserAuth';

const LogoutButton = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;

// src/components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from './UserAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;

// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/UserAuth';
import LoginForm from './components/LoginForm';
import LogoutButton from './components/LogoutButton';
import ProtectedRoute from './components/ProtectedRoute';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <h2>Home</h2>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.username}!</p>
          <LogoutButton />
        </div>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
};

const Profile = () => {
  const { user } = useAuth();

  return (
    <div>
      <h2>Profile</h2>
      <p>User ID: {user?.id}</p>
      <p>Username: {user?.username}</p>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;