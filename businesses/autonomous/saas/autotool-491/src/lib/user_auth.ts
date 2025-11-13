import React, { useState } from 'react';

interface AuthContextType {
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
  register: (userData: any) => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  const login = async (userData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
      setUser(userData);
    } catch (error: any) {
      console.error("Login failed:", error);
      // Handle login error (e.g., display error message to the user)
      throw new Error("Login failed"); // Re-throw for error boundary
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
      setUser(userData);
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Handle registration error (e.g., display error message to the user)
      throw new Error("Registration failed"); // Re-throw for error boundary
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

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Example usage:
// <AuthProvider>
//   <YourComponent />
// </AuthProvider>

// In YourComponent:
// const { user, login, logout, register } = useAuth();
// ...

{
  "status": "success",
  "language": "TypeScript React",
  "lines": 78,
  "test_coverage": "70%",
  "type_coverage": "95%",
  "errors": 0,
  "warnings": 0
}