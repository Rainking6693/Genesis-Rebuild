// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific type if possible
  login: (userData: any) => void; // Replace 'any' with a more specific type if possible
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific type if possible

  const login = (userData: any) => { // Replace 'any' with a more specific type if possible
    try {
      // Simulate API call
      setTimeout(() => {
        setUser(userData);
      }, 500);
    } catch (error: any) { // Explicitly type 'error' as 'any'
      console.error("Login failed:", error);
      // Handle login error (e.g., display error message to the user)
    }
  };

  const logout = () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setUser(null);
      }, 500);
    } catch (error: any) { // Explicitly type 'error' as 'any'
      console.error("Logout failed:", error);
      // Handle logout error (e.g., display error message to the user)
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

// Example Login Form Component
export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Username and password are required.');
      return;
    }

    try {
      // Simulate API call
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'test' && password === 'password') {
            resolve({ username: 'test', email: 'test@example.com' });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 500);
      });

      login(response);
      setError('');
    } catch (err: any) { // Explicitly type 'err' as 'any'
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
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

// Example Usage:
// Wrap your app with <AuthProvider>
// Use <LoginForm> for login
// Use useAuth() hook to access user and auth functions