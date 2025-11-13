// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
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

const AuthContext = React.createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]); // Simulate a database

  const register = async (username: string, password: string, email: string): Promise<boolean> => {
    try {
      // Validate input
      if (!username || !password || !email) {
        console.error("Registration failed: Missing input");
        return false;
      }

      // Check if username already exists
      if (users.find(u => u.username === username)) {
        console.error("Registration failed: Username already exists");
        return false;
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser: User = {
        id: uuidv4(),
        username,
        passwordHash,
        email,
      };

      // Add the user to the "database"
      setUsers([...users, newUser]);
      console.log("User registered successfully:", newUser.username);
      return true;

    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const foundUser = users.find(u => u.username === username);

      if (!foundUser) {
        console.error("Login failed: User not found");
        return false;
      }

      const passwordMatch = await bcrypt.compare(password, foundUser.passwordHash);

      if (!passwordMatch) {
        console.error("Login failed: Incorrect password");
        return false;
      }

      setUser(foundUser);
      console.log("User logged in successfully:", foundUser.username);
      return true;

    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    console.log("User logged out");
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

export { AuthProvider, useAuth, AuthContext };

// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs
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

const AuthContext = React.createContext<AuthContextType | null>(null);

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]); // Simulate a database

  const register = async (username: string, password: string, email: string): Promise<boolean> => {
    try {
      // Validate input
      if (!username || !password || !email) {
        console.error("Registration failed: Missing input");
        return false;
      }

      // Check if username already exists
      if (users.find(u => u.username === username)) {
        console.error("Registration failed: Username already exists");
        return false;
      }

      // Hash the password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser: User = {
        id: uuidv4(),
        username,
        passwordHash,
        email,
      };

      // Add the user to the "database"
      setUsers([...users, newUser]);
      console.log("User registered successfully:", newUser.username);
      return true;

    } catch (error) {
      console.error("Registration failed:", error);
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const foundUser = users.find(u => u.username === username);

      if (!foundUser) {
        console.error("Login failed: User not found");
        return false;
      }

      const passwordMatch = await bcrypt.compare(password, foundUser.passwordHash);

      if (!passwordMatch) {
        console.error("Login failed: Incorrect password");
        return false;
      }

      setUser(foundUser);
      console.log("User logged in successfully:", foundUser.username);
      return true;

    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    console.log("User logged out");
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

export { AuthProvider, useAuth, AuthContext };

Now, I will use the `Write` tool to save the code to a file.