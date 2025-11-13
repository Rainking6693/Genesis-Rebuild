// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    // Simulate fetching user from local storage or API on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
    setIsLoading(false); // Set loading to false after initial check
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Simulate API call for login
      const response = await simulateLogin(username, password);

      if (response.success) {
        const newUser: User = { id: '123', username: username, email: 'test@example.com' }; // Replace with actual user data
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser)); // Store user in local storage
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || 'Login failed'); // Re-throw for component handling
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Simulate API call for registration
      const response = await simulateRegister(username, email, password);

      if (response.success) {
        // Registration successful - you might want to automatically log the user in
        console.log("Registration Successful");
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || 'Registration failed'); // Re-throw for component handling
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display loading indicator while checking for stored user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Simulate API calls (replace with actual API calls)
const simulateLogin = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === 'test' && password === 'password') {
        resolve({ success: true });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
};

const simulateRegister = async (username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate checking if username/email already exists
      resolve({ success: true }); // Simulate successful registration
    }, 500);
  });
};

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Add loading state

  useEffect(() => {
    // Simulate fetching user from local storage or API on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
    setIsLoading(false); // Set loading to false after initial check
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Simulate API call for login
      const response = await simulateLogin(username, password);

      if (response.success) {
        const newUser: User = { id: '123', username: username, email: 'test@example.com' }; // Replace with actual user data
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser)); // Store user in local storage
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error("Login error:", error);
      throw new Error(error.message || 'Login failed'); // Re-throw for component handling
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Simulate API call for registration
      const response = await simulateRegister(username, email, password);

      if (response.success) {
        // Registration successful - you might want to automatically log the user in
        console.log("Registration Successful");
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      throw new Error(error.message || 'Registration failed'); // Re-throw for component handling
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display loading indicator while checking for stored user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Simulate API calls (replace with actual API calls)
const simulateLogin = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === 'test' && password === 'password') {
        resolve({ success: true });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 500);
  });
};

const simulateRegister = async (username: string, email: string, password: string): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate checking if username/email already exists
      resolve({ success: true }); // Simulate successful registration
    }, 500);
  });
};