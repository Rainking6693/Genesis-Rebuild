// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY') as User; // Replace with secure env variable
        return decoded;
      } catch (error) {
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

  const login = (token: string) => {
    try {
      const decoded = jwt.verify(token, 'YOUR_SECRET_KEY') as User; // Replace with secure env variable
      setUser(decoded);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error("Login failed: Invalid token", error);
      // Handle invalid token error (e.g., display an error message)
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
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

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      // Simulate API call
      const response = await fetch('/api/login', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoginError(errorData.message || 'Login failed');
        return;
      }

      const result = await response.json();
      login(result.token);

    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError("An unexpected error occurred during login.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" {...register("username", { required: "Username is required" })} />
      {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}

      <label htmlFor="password">Password:</label>
      <input type="password" id="password" {...register("password", { required: "Password is required" })} />
      {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

      <button type="submit">Login</button>
    </form>
  );
}

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>Logout</button>
  );
}

// Example Usage:
// <AuthProvider>
//   <LoginForm />
//   <LogoutButton />
// </AuthProvider>

// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwt.verify(token, 'YOUR_SECRET_KEY') as User; // Replace with secure env variable
        return decoded;
      } catch (error) {
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

  const login = (token: string) => {
    try {
      const decoded = jwt.verify(token, 'YOUR_SECRET_KEY') as User; // Replace with secure env variable
      setUser(decoded);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error("Login failed: Invalid token", error);
      // Handle invalid token error (e.g., display an error message)
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
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

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      // Simulate API call
      const response = await fetch('/api/login', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setLoginError(errorData.message || 'Login failed');
        return;
      }

      const result = await response.json();
      login(result.token);

    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError("An unexpected error occurred during login.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {loginError && <div style={{ color: 'red' }}>{loginError}</div>}
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" {...register("username", { required: "Username is required" })} />
      {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}

      <label htmlFor="password">Password:</label>
      <input type="password" id="password" {...register("password", { required: "Password is required" })} />
      {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}

      <button type="submit">Login</button>
    </form>
  );
}

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>Logout</button>
  );
}

// Example Usage:
// <AuthProvider>
//   <LoginForm />
//   <LogoutButton />
// </AuthProvider>