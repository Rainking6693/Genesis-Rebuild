// src/components/UserAuth.tsx
import React, { useState, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique user IDs
import bcrypt from 'bcryptjs'; // For password hashing

// Define types
interface User {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email: string) => Promise<boolean>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock user database (replace with actual database)
  const [users, setUsers] = useState<User[]>([]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const foundUser = users.find((u) => u.username === username);

      if (!foundUser) {
        console.error("User not found");
        return false;
      }

      const passwordMatch = await bcrypt.compare(password, foundUser.passwordHash);

      if (!passwordMatch) {
        console.error("Invalid password");
        return false;
      }

      setUser(foundUser);
      return true;

    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (username: string, password: string, email: string): Promise<boolean> => {
    try {
      // Check if username already exists
      if (users.find((u) => u.username === username)) {
        console.error("Username already exists");
        return false;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser: User = {
        id: uuidv4(),
        username,
        passwordHash: hashedPassword,
        email,
      };

      setUsers([...users, newUser]);
      setUser(newUser);
      return true;

    } catch (error) {
      console.error("Registration error:", error);
      return false;
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
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Example usage (can be moved to a separate component)
export const AuthStatus = () => {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div>
        Welcome, {user.username}!
        <button onClick={logout}>Logout</button>
      </div>
    );
  } else {
    return <div>Please login or register.</div>;
  }
};

// Example Login Form
export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) {
      alert('Login failed. Check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
};

// Example Registration Form
export const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(username, password, email);
    if (!success) {
      alert('Registration failed. Username may already exist.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button type="submit">Register</button>
    </form>
  );
};

// src/components/UserAuth.tsx
import React, { useState, createContext, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid'; // For generating unique user IDs
import bcrypt from 'bcryptjs'; // For password hashing

// Define types
interface User {
  id: string;
  username: string;
  passwordHash: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string, email: string) => Promise<boolean>;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock user database (replace with actual database)
  const [users, setUsers] = useState<User[]>([]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const foundUser = users.find((u) => u.username === username);

      if (!foundUser) {
        console.error("User not found");
        return false;
      }

      const passwordMatch = await bcrypt.compare(password, foundUser.passwordHash);

      if (!passwordMatch) {
        console.error("Invalid password");
        return false;
      }

      setUser(foundUser);
      return true;

    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (username: string, password: string, email: string): Promise<boolean> => {
    try {
      // Check if username already exists
      if (users.find((u) => u.username === username)) {
        console.error("Username already exists");
        return false;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser: User = {
        id: uuidv4(),
        username,
        passwordHash: hashedPassword,
        email,
      };

      setUsers([...users, newUser]);
      setUser(newUser);
      return true;

    } catch (error) {
      console.error("Registration error:", error);
      return false;
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
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Example usage (can be moved to a separate component)
export const AuthStatus = () => {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div>
        Welcome, {user.username}!
        <button onClick={logout}>Logout</button>
      </div>
    );
  } else {
    return <div>Please login or register.</div>;
  }
};

// Example Login Form
export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (!success) {
      alert('Login failed. Check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <button type="submit">Login</button>
    </form>
  );
};

// Example Registration Form
export const RegistrationForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await register(username, password, email);
    if (!success) {
      alert('Registration failed. Username may already exist.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <button type="submit">Register</button>
    </form>
  );
};