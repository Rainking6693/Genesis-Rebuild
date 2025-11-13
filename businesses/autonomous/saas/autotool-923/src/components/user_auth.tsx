// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router for navigation

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with a more specific user type
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: false,
  error: null,
});

const UserAuth = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching user data from local storage or an API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (parseError) {
        console.error("Error parsing user data from local storage:", parseError);
        setError("Failed to load user data.");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: any) => { // Replace 'any' with a more specific user type
    try {
      // Simulate API call to authenticate user
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setError(null);
      navigate('/dashboard'); // Redirect to dashboard after login
    } catch (loginError) {
      console.error("Login failed:", loginError);
      setError("Invalid credentials. Please try again.");
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login'); // Redirect to login page after logout
    } catch (logoutError) {
      console.error("Logout failed:", logoutError);
      setError("Failed to logout. Please try again.");
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    error,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserAuth;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router for navigation

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with a more specific user type
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: false,
  error: null,
});

const UserAuth = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate fetching user data from local storage or an API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (parseError) {
        console.error("Error parsing user data from local storage:", parseError);
        setError("Failed to load user data.");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: any) => { // Replace 'any' with a more specific user type
    try {
      // Simulate API call to authenticate user
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setError(null);
      navigate('/dashboard'); // Redirect to dashboard after login
    } catch (loginError) {
      console.error("Login failed:", loginError);
      setError("Invalid credentials. Please try again.");
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login'); // Redirect to login page after logout
    } catch (logoutError) {
      console.error("Logout failed:", logoutError);
      setError("Failed to logout. Please try again.");
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    error,
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default UserAuth;