// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with the type of user data
  logout: () => void;
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
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: any) => { // Replace 'any' with the type of user data
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          // Simulate successful login
          resolve({ success: true, user: { id: 1, username: userData.username } });
        }, 1000)
      );

      if (response && (response as any).success) { // Type assertion for response
        setUser((response as any).user); // Type assertion for response
      } else {
        setError("Invalid credentials");
      }
    } catch (e: any) { // Type assertion for e
      setError(e.message || "Login failed");
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

export default function UserAuth() {
  const { user, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });
  };

  if (user) {
    return (
      <div>
        <p>Welcome, {user.username}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

// Error Boundary Component (Optional - for more robust error handling)
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught an error: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Example usage in App.tsx or similar:
// <ErrorBoundary>
//   <AuthProvider>
//     <UserAuth />
//   </AuthProvider>
// </ErrorBoundary>

// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with the type of user data
  logout: () => void;
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
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userData: any) => { // Replace 'any' with the type of user data
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call (replace with actual API call)
      const response = await new Promise((resolve) =>
        setTimeout(() => {
          // Simulate successful login
          resolve({ success: true, user: { id: 1, username: userData.username } });
        }, 1000)
      );

      if (response && (response as any).success) { // Type assertion for response
        setUser((response as any).user); // Type assertion for response
      } else {
        setError("Invalid credentials");
      }
    } catch (e: any) { // Type assertion for e
      setError(e.message || "Login failed");
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

export default function UserAuth() {
  const { user, login, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });
  };

  if (user) {
    return (
      <div>
        <p>Welcome, {user.username}!</p>
        <button onClick={logout}>Logout</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleLogin}>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <br />
      <label>
        Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </label>
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

// Error Boundary Component (Optional - for more robust error handling)
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught an error: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// Example usage in App.tsx or similar:
// <ErrorBoundary>
//   <AuthProvider>
//     <UserAuth />
//   </AuthProvider>
// </ErrorBoundary>