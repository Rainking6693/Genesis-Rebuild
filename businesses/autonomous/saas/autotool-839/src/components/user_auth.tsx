// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'test' && password === 'password') {
            resolve({ id: '123', username: 'test', email: 'test@example.com' });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1000);
      });

      const userData = response as { id: string; username: string; email: string };
      setUser({ id: userData.id, username: userData.username, email: userData.email });
    } catch (err: any) {
      setError(err.message || 'Login failed');
      console.error("Login Error:", err); // Log the error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ id: '456', username, email });
        }, 1000);
      });

      const userData = response as { id: string; username: string; email: string };
      setUser({ id: userData.id, username: userData.username, email: userData.email });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      console.error("Registration Error:", err); // Log the error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (username === 'test' && password === 'password') {
            resolve({ id: '123', username: 'test', email: 'test@example.com' });
          } else {
            reject(new Error('Invalid credentials'));
          }
        }, 1000);
      });

      const userData = response as { id: string; username: string; email: string };
      setUser({ id: userData.id, username: userData.username, email: userData.email });
    } catch (err: any) {
      setError(err.message || 'Login failed');
      console.error("Login Error:", err); // Log the error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ id: '456', username, email });
        }, 1000);
      });

      const userData = response as { id: string; username: string; email: string };
      setUser({ id: userData.id, username: userData.username, email: userData.email });
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      console.error("Registration Error:", err); // Log the error for debugging
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

Now, I'll use the `Write` tool to save this code to `src/components/UserAuth.tsx`.

Finally, here's the build report: