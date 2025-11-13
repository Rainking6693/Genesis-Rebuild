// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token in local storage on component mount
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Validate token (e.g., by sending it to the server)
      validateToken(storedToken)
        .then(userData => {
          setUser(userData);
          navigate('/dashboard'); // Redirect to dashboard after successful validation
        })
        .catch(err => {
          console.error("Token validation failed:", err);
          localStorage.removeItem('authToken'); // Remove invalid token
        });
    }
  }, [navigate]);

  const validateToken = async (token: string): Promise<User> => {
    // Replace with your actual token validation logic (e.g., API call)
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (token === "valid_token") {
          resolve({ id: "123", email: "test@example.com" });
        } else {
          reject("Invalid token");
        }
      }, 500);
    });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      const response = await fakeLoginApiCall(email, password);

      if (response.success) {
        const userData: User = { id: 'user123', email: email }; // Replace with actual user data from API
        setUser(userData);
        localStorage.setItem('authToken', 'valid_token'); // Store token securely
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fakeLoginApiCall = (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@example.com" && password === "password") {
          resolve({ success: true });
        } else {
          resolve({ success: false, message: "Invalid credentials" });
        }
      }, 500);
    });
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      const response = await fakeRegisterApiCall(email, password);

      if (response.success) {
        // Registration successful, you might want to automatically log the user in
        login(email, password);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fakeRegisterApiCall = (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate checking if the email is already registered
        if (email === "existing@example.com") {
          resolve({ success: false, message: "Email already registered" });
        } else {
          resolve({ success: true });
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
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

// Example usage in a Login component:
// import { useAuth } from './UserAuth';
// const Login = () => {
//   const { login, isLoading, error } = useAuth();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await login('user@example.com', 'password');
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       {error && <p>{error}</p>}
//       <button type="submit" disabled={isLoading}>Login</button>
//     </form>
//   );
// };

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token in local storage on component mount
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Validate token (e.g., by sending it to the server)
      validateToken(storedToken)
        .then(userData => {
          setUser(userData);
          navigate('/dashboard'); // Redirect to dashboard after successful validation
        })
        .catch(err => {
          console.error("Token validation failed:", err);
          localStorage.removeItem('authToken'); // Remove invalid token
        });
    }
  }, [navigate]);

  const validateToken = async (token: string): Promise<User> => {
    // Replace with your actual token validation logic (e.g., API call)
    return new Promise((resolve, reject) => {
      // Simulate API call
      setTimeout(() => {
        if (token === "valid_token") {
          resolve({ id: "123", email: "test@example.com" });
        } else {
          reject("Invalid token");
        }
      }, 500);
    });
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      const response = await fakeLoginApiCall(email, password);

      if (response.success) {
        const userData: User = { id: 'user123', email: email }; // Replace with actual user data from API
        setUser(userData);
        localStorage.setItem('authToken', 'valid_token'); // Store token securely
        navigate('/dashboard');
      } else {
        setError(response.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fakeLoginApiCall = (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "test@example.com" && password === "password") {
          resolve({ success: true });
        } else {
          resolve({ success: false, message: "Invalid credentials" });
        }
      }, 500);
    });
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      const response = await fakeRegisterApiCall(email, password);

      if (response.success) {
        // Registration successful, you might want to automatically log the user in
        login(email, password);
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fakeRegisterApiCall = (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate checking if the email is already registered
        if (email === "existing@example.com") {
          resolve({ success: false, message: "Email already registered" });
        } else {
          resolve({ success: true });
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
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

// Example usage in a Login component:
// import { useAuth } from './UserAuth';
// const Login = () => {
//   const { login, isLoading, error } = useAuth();
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await login('user@example.com', 'password');
//   };
//   return (
//     <form onSubmit={handleSubmit}>
//       {error && <p>{error}</p>}
//       <button type="submit" disabled={isLoading}>Login</button>
//     </form>
//   );
// };