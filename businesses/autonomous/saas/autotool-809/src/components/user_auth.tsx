// src/components/UserAuth.tsx
import React, { useState, createContext, useContext } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with a more specific user type
  logout: () => void;
  register: (userData: any) => void; // Replace 'any' with a more specific user type
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: any) => { // Replace 'any' with a more specific user type
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
      setUser(userData); // Assuming successful login returns user data
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: any) => { // Replace 'any' with a more specific user type
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
      setUser(userData); // Assuming successful registration returns user data
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Example usage (can be moved to a separate component)
const ExampleComponent = () => {
  const { user, login, logout, register, isLoading, error } = useAuth();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => login({ username: 'testuser' })}>Login</button>
          <button onClick={() => register({ username: 'newuser' })}>Register</button>
        </>
      )}
    </div>
  );
};

export default ExampleComponent;

// src/components/UserAuth.tsx
import React, { useState, createContext, useContext } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with a more specific user type
  logout: () => void;
  register: (userData: any) => void; // Replace 'any' with a more specific user type
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: any) => { // Replace 'any' with a more specific user type
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
      setUser(userData); // Assuming successful login returns user data
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const register = async (userData: any) => { // Replace 'any' with a more specific user type
    setIsLoading(true);
    setError(null);
    try {
      // Simulate API call (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network latency
      setUser(userData); // Assuming successful registration returns user data
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
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
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Example usage (can be moved to a separate component)
const ExampleComponent = () => {
  const { user, login, logout, register, isLoading, error } = useAuth();

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {user ? (
        <>
          <p>Welcome, {user.username}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <>
          <button onClick={() => login({ username: 'testuser' })}>Login</button>
          <button onClick={() => register({ username: 'newuser' })}>Register</button>
        </>
      )}
    </div>
  );
};

export default ExampleComponent;

Now, I will use the tools to write the code to a file and output the build report.