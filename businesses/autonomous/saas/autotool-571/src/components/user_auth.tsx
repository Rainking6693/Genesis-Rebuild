// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // For generating unique user IDs
import bcrypt from 'bcryptjs'; // For password hashing

interface User {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, email: string) => Promise<boolean>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user in local storage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        localStorage.removeItem('user'); // Remove invalid data
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call to fetch user (replace with actual API call)
      const response = await fetch(`/api/users?username=${username}`); // Example API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users: User[] = await response.json();
      const foundUser = users.find(u => u.username === username);

      if (foundUser) {
        const passwordMatch = await bcrypt.compare(password, foundUser.passwordHash);
        if (passwordMatch) {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          navigate('/dashboard'); // Redirect to dashboard after login
          return true;
        } else {
          console.error("Invalid password");
          return false;
        }
      } else {
        console.error("User not found");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page after logout
  };

  const register = async (username: string, password: string, email: string): Promise<boolean> => {
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create a new user object
      const newUser: User = {
        id: uuidv4(),
        username,
        passwordHash,
        email,
      };

      // Simulate API call to create user (replace with actual API call)
      const response = await fetch('/api/users', { // Example API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      navigate('/dashboard'); // Redirect to dashboard after registration
      return true;

    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const value: AuthContextType = {
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

// Example usage:
// Wrap your app with <AuthProvider>
// Use useAuth() hook in components to access user, login, logout, and register functions

export default AuthProvider;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // For generating unique user IDs
import bcrypt from 'bcryptjs'; // For password hashing

interface User {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (username: string, password: string, email: string) => Promise<boolean>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user in local storage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        localStorage.removeItem('user'); // Remove invalid data
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call to fetch user (replace with actual API call)
      const response = await fetch(`/api/users?username=${username}`); // Example API endpoint
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const users: User[] = await response.json();
      const foundUser = users.find(u => u.username === username);

      if (foundUser) {
        const passwordMatch = await bcrypt.compare(password, foundUser.passwordHash);
        if (passwordMatch) {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          navigate('/dashboard'); // Redirect to dashboard after login
          return true;
        } else {
          console.error("Invalid password");
          return false;
        }
      } else {
        console.error("User not found");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page after logout
  };

  const register = async (username: string, password: string, email: string): Promise<boolean> => {
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Create a new user object
      const newUser: User = {
        id: uuidv4(),
        username,
        passwordHash,
        email,
      };

      // Simulate API call to create user (replace with actual API call)
      const response = await fetch('/api/users', { // Example API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      navigate('/dashboard'); // Redirect to dashboard after registration
      return true;

    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  };

  const value: AuthContextType = {
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

// Example usage:
// Wrap your app with <AuthProvider>
// Use useAuth() hook in components to access user, login, logout, and register functions

export default AuthProvider;

Now, I will use the tools to write the code to a file and output the build report.