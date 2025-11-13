import React, { useState } from 'react';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call for login
      const response = await simulateLogin(username, password);

      if (response.success) {
        setUser(response.user);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError("An unexpected error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call for registration
      const response = await simulateRegister(username, email, password);

      if (response.success) {
        setUser(response.user);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred during registration.");
    } finally {
      setIsLoading(false);
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
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
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

// Simulate API calls (replace with actual API calls)
const simulateLogin = async (username: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === "test" && password === "password") {
        resolve({ success: true, user: { id: "1", username: "test", email: "test@example.com" } });
      } else {
        resolve({ success: false, message: "Invalid credentials" });
      }
    }, 500);
  });
};

const simulateRegister = async (username: string, email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, user: { id: "2", username: username, email: email } });
    }, 500);
  });
};

// Example usage in a component:
// const { user, login, logout } = useAuth();
// ...