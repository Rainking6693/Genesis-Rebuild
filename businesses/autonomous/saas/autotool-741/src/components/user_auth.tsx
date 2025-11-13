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
        setError(response.message || "Login failed");
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
    return <div>Loading authentication...</div>;
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
// const { isAuthenticated, user, login, logout } = useAuth();

// src/components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from './UserAuth';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ username, password });
    } catch (err: any) {
      console.error("Login component error:", err.message);
      setError("Login failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;

// src/components/Logout.tsx
import React from 'react';
import { useAuth } from './UserAuth';

const Logout: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
    } catch (error: any) {
      console.error("Logout failed:", error.message);
      // Consider displaying an error message to the user
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;

// src/components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from './UserAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// src/types/auth.ts
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Assuming you have an AuthContext

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;

// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types/auth';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const defaultAuthContext: AuthContextProps = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextProps>(defaultAuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
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
      const response = await fakeLoginApi(credentials);

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setError(response.message || "Login failed");
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
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock API calls (replace with actual API calls)
const fakeLoginApi = async (credentials: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'test' && credentials.password === 'password') {
        resolve({ success: true, token: 'fake_token', user: { id: '1', username: 'test', email: 'test@example.com' } });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
};

const validateToken = async (token: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === 'fake_token') {
        resolve({ id: '1', username: 'test', email: 'test@example.com' });
      } else {
        reject(new Error('Invalid token'));
      }
    }, 300);
  });
};

// src/components/Register.tsx
import React, { useState } from 'react';
//import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  //const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulate registration API call
      const response = await fakeRegisterApi({ username, password, email });

      if (response.success) {
        // Optionally, automatically log the user in after registration
        // await login({ username, password });
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("Registration failed:", err.message);
      setError("Registration failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

// Mock API call (replace with actual API call)
const fakeRegisterApi = async (userData: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful registration
      resolve({ success: true, message: 'Registration successful' });
      // Simulate registration failure
      // resolve({ success: false, message: 'Username already exists' });
    }, 500);
  });
};

export default Register;

// src/utils/auth.ts

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// src/api/auth.ts
import { User } from '../types/auth';

export const loginApi = async (credentials: any): Promise<{ success: boolean; token?: string; user?: User; message?: string }> => {
  // Replace with your actual API endpoint
  const apiUrl = '/api/login';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, token: data.token, user: data.user };
    } else {
      return { success: false, message: data.message || 'Login failed' };
    }
  } catch (error: any) {
    console.error('Login API error:', error);
    return { success: false, message: 'Failed to connect to the server' };
  }
};

export const registerApi = async (userData: any): Promise<{ success: boolean; message?: string }> => {
  // Replace with your actual API endpoint
  const apiUrl = '/api/register';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message || 'Registration successful' };
    } else {
      return { success: false, message: data.message || 'Registration failed' };
    }
  } catch (error: any) {
    console.error('Registration API error:', error);
    return { success: false, message: 'Failed to connect to the server' };
  }
};

export const validateTokenApi = async (token: string): Promise<{ success: boolean; user?: User; message?: string }> => {
  // Replace with your actual API endpoint
  const apiUrl = '/api/validate-token';

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || 'Invalid token' };
    }
  } catch (error: any) {
    console.error('Validate token API error:', error);
    return { success: false, message: 'Failed to connect to the server' };
  }
};

// src/components/Profile.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;

// src/components/ForgotPassword.tsx
import React, { useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Simulate forgot password API call
      const response = await fakeForgotPasswordApi(email);

      if (response.success) {
        setMessage(response.message || "Password reset email sent.");
      } else {
        setError(response.message || "Failed to send reset email.");
      }
    } catch (err: any) {
      console.error("Forgot password failed:", err.message);
      setError("Failed to send reset email: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

// Mock API call (replace with actual API call)
const fakeForgotPasswordApi = async (email: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.includes('@')) {
        resolve({ success: true, message: 'Password reset email sent to ' + email });
      } else {
        resolve({ success: false, message: 'Invalid email address' });
      }
    }, 500);
  });
};

export default ForgotPassword;

// src/components/ResetPassword.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate reset password API call
      const response = await fakeResetPasswordApi(token, password);

      if (response.success) {
        setMessage(response.message || "Password reset successfully.");
        navigate('/login'); // Redirect to login after successful reset
      } else {
        setError(response.message || "Failed to reset password.");
      }
    } catch (err: any) {
      console.error("Reset password failed:", err.message);
      setError("Failed to reset password: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

// Mock API call (replace with actual API call)
const fakeResetPasswordApi = async (token: string | undefined, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token && password.length > 5) {
        resolve({ success: true, message: 'Password reset successfully' });
      } else {
        resolve({ success: false, message: 'Invalid token or password' });
      }
    }, 500);
  });
};

export default ResetPassword;

// src/components/RequireAuth.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  if (!isAuthenticated) {
    // Redirect to login page, preserving the current location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;

// src/hooks/useLogout.ts
import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  }, [logout, navigate]);

  return handleLogout;
};

export default useLogout;

// src/hooks/useRegister.ts
import { useState, useCallback } from 'react';
import { registerApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = useCallback(async (userData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerApi(userData);

      if (response.success) {
        // Registration successful, redirect to login or display success message
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError("Registration failed: " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return { register, isLoading, error };
};

export default useRegister;

// src/hooks/useLogin.ts
import { useState, useCallback } from 'react';
import { loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = useCallback(async (credentials: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginApi(credentials);

      if (response.success) {
        // Login successful, update auth context and redirect
        await login(credentials); // Use the login function from AuthContext
        navigate('/profile'); // Redirect to profile page or desired route
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("Login failed: " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [login, navigate]);

  return { handleLogin, isLoading, error };
};

export default useLogin;

// src/components/ChangePassword.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ChangePassword: React.FC = () => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate change password API call
      const response = await fakeChangePasswordApi(user?.id, oldPassword, newPassword);

      if (response.success) {
        setMessage(response.message || "Password changed successfully.");
      } else {
        setError(response.message || "Failed to change password.");
      }
    } catch (err: any) {
      console.error("Change password failed:", err.message);
      setError("Failed to change password: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

// Mock API call (replace with actual API call)
const fakeChangePasswordApi = async (userId: string | undefined, oldPassword: string, newPassword: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId && oldPassword === 'oldpassword' && newPassword.length > 5) {
        resolve({ success: true, message: 'Password changed successfully' });
      } else {
        resolve({ success: false, message: 'Invalid credentials or password' });
      }
    }, 500);
  });
};

export default ChangePassword;

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
        setError(response.message || "Login failed");
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
    return <div>Loading authentication...</div>;
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
// const { isAuthenticated, user, login, logout } = useAuth();

// src/components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from './UserAuth';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login({ username, password });
    } catch (err: any) {
      console.error("Login component error:", err.message);
      setError("Login failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;

// src/components/Logout.tsx
import React from 'react';
import { useAuth } from './UserAuth';

const Logout: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
    } catch (error: any) {
      console.error("Logout failed:", error.message);
      // Consider displaying an error message to the user
    }
  };

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;

// src/components/ProtectedRoute.tsx
import React from 'react';
import { useAuth } from './UserAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, redirectTo = '/login' }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// src/types/auth.ts
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Assuming you have an AuthContext

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;

// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import { User } from '../types/auth';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

const defaultAuthContext: AuthContextProps = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextProps>(defaultAuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
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
      const response = await fakeLoginApi(credentials);

      if (response.success) {
        localStorage.setItem('authToken', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setError(response.message || "Login failed");
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
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Mock API calls (replace with actual API calls)
const fakeLoginApi = async (credentials: any) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.username === 'test' && credentials.password === 'password') {
        resolve({ success: true, token: 'fake_token', user: { id: '1', username: 'test', email: 'test@example.com' } });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
};

const validateToken = async (token: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token === 'fake_token') {
        resolve({ id: '1', username: 'test', email: 'test@example.com' });
      } else {
        reject(new Error('Invalid token'));
      }
    }, 300);
  });
};

// src/components/Register.tsx
import React, { useState } from 'react';
//import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  //const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulate registration API call
      const response = await fakeRegisterApi({ username, password, email });

      if (response.success) {
        // Optionally, automatically log the user in after registration
        // await login({ username, password });
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("Registration failed:", err.message);
      setError("Registration failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

// Mock API call (replace with actual API call)
const fakeRegisterApi = async (userData: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful registration
      resolve({ success: true, message: 'Registration successful' });
      // Simulate registration failure
      // resolve({ success: false, message: 'Username already exists' });
    }, 500);
  });
};

export default Register;

// src/utils/auth.ts

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// src/api/auth.ts
import { User } from '../types/auth';

export const loginApi = async (credentials: any): Promise<{ success: boolean; token?: string; user?: User; message?: string }> => {
  // Replace with your actual API endpoint
  const apiUrl = '/api/login';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, token: data.token, user: data.user };
    } else {
      return { success: false, message: data.message || 'Login failed' };
    }
  } catch (error: any) {
    console.error('Login API error:', error);
    return { success: false, message: 'Failed to connect to the server' };
  }
};

export const registerApi = async (userData: any): Promise<{ success: boolean; message?: string }> => {
  // Replace with your actual API endpoint
  const apiUrl = '/api/register';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, message: data.message || 'Registration successful' };
    } else {
      return { success: false, message: data.message || 'Registration failed' };
    }
  } catch (error: any) {
    console.error('Registration API error:', error);
    return { success: false, message: 'Failed to connect to the server' };
  }
};

export const validateTokenApi = async (token: string): Promise<{ success: boolean; user?: User; message?: string }> => {
  // Replace with your actual API endpoint
  const apiUrl = '/api/validate-token';

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, user: data.user };
    } else {
      return { success: false, message: data.message || 'Invalid token' };
    }
  } catch (error: any) {
    console.error('Validate token API error:', error);
    return { success: false, message: 'Failed to connect to the server' };
  }
};

// src/components/Profile.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div>Please log in to view your profile.</div>;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;

// src/components/ForgotPassword.tsx
import React, { useState } from 'react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Simulate forgot password API call
      const response = await fakeForgotPasswordApi(email);

      if (response.success) {
        setMessage(response.message || "Password reset email sent.");
      } else {
        setError(response.message || "Failed to send reset email.");
      }
    } catch (err: any) {
      console.error("Forgot password failed:", err.message);
      setError("Failed to send reset email: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

// Mock API call (replace with actual API call)
const fakeForgotPasswordApi = async (email: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email.includes('@')) {
        resolve({ success: true, message: 'Password reset email sent to ' + email });
      } else {
        resolve({ success: false, message: 'Invalid email address' });
      }
    }, 500);
  });
};

export default ForgotPassword;

// src/components/ResetPassword.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate reset password API call
      const response = await fakeResetPasswordApi(token, password);

      if (response.success) {
        setMessage(response.message || "Password reset successfully.");
        navigate('/login'); // Redirect to login after successful reset
      } else {
        setError(response.message || "Failed to reset password.");
      }
    } catch (err: any) {
      console.error("Reset password failed:", err.message);
      setError("Failed to reset password: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
};

// Mock API call (replace with actual API call)
const fakeResetPasswordApi = async (token: string | undefined, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (token && password.length > 5) {
        resolve({ success: true, message: 'Password reset successfully' });
      } else {
        resolve({ success: false, message: 'Invalid token or password' });
      }
    }, 500);
  });
};

export default ResetPassword;

// src/components/RequireAuth.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  if (!isAuthenticated) {
    // Redirect to login page, preserving the current location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;

// src/hooks/useLogout.ts
import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  }, [logout, navigate]);

  return handleLogout;
};

export default useLogout;

// src/hooks/useRegister.ts
import { useState, useCallback } from 'react';
import { registerApi } from '../api/auth';
import { useNavigate } from 'react-router-dom';

const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const register = useCallback(async (userData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerApi(userData);

      if (response.success) {
        // Registration successful, redirect to login or display success message
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        setError(response.message || "Registration failed");
      }
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError("Registration failed: " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  return { register, isLoading, error };
};

export default useRegister;

// src/hooks/useLogin.ts
import { useState, useCallback } from 'react';
import { loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = useCallback(async (credentials: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loginApi(credentials);

      if (response.success) {
        // Login successful, update auth context and redirect
        await login(credentials); // Use the login function from AuthContext
        navigate('/profile'); // Redirect to profile page or desired route
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err: any) {
      console.error("Login failed:", err);
      setError("Login failed: " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [login, navigate]);

  return { handleLogin, isLoading, error };
};

export default useLogin;

// src/components/ChangePassword.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ChangePassword: React.FC = () => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate change password API call
      const response = await fakeChangePasswordApi(user?.id, oldPassword, newPassword);

      if (response.success) {
        setMessage(response.message || "Password changed successfully.");
      } else {
        setError(response.message || "Failed to change password.");
      }
    } catch (err: any) {
      console.error("Change password failed:", err.message);
      setError("Failed to change password: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="oldPassword">Old Password:</label>
          <input
            type="password"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm New Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Changing...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

// Mock API call (replace with actual API call)
const fakeChangePasswordApi = async (userId: string | undefined, oldPassword: string, newPassword: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId && oldPassword === 'oldpassword' && newPassword.length > 5) {
        resolve({ success: true, message: 'Password changed successfully' });
      } else {
        resolve({ success: false, message: 'Invalid credentials or password' });
      }
    }, 500);
  });
};

export default ChangePassword;