// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Assuming React Router is used

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with a more specific user type
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const history = useHistory();

  const login = async (userData: any) => { // Replace 'any' with a more specific user type
    try {
      // Simulate API call to authenticate user (replace with actual API call)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();

      // Assuming the API returns user data upon successful login
      setUser(data.user);
      localStorage.setItem('token', data.token); // Store token for persistence
      history.push('/dashboard'); // Redirect to dashboard
    } catch (error: any) { // Explicitly type 'error' as 'any'
      console.error('Login error:', error.message);
      // Display error message to the user (e.g., using a state variable)
      alert(`Login failed: ${error.message}`);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    history.push('/login'); // Redirect to login page
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Example Login Component
export const LoginComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = React.useContext(AuthContext) || {login: () => {}}; // Provide a default value

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

// Example Usage: Wrap your app with AuthProvider
// <AuthProvider>
//   <App />
// </AuthProvider>

// Example Usage: Use LoginComponent in your Login page
// <LoginComponent />

// Error Boundary Component (for catching errors in child components)
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
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

export default ErrorBoundary;

// src/components/UserAuth.tsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Assuming React Router is used

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with a more specific user type
  logout: () => void;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const history = useHistory();

  const login = async (userData: any) => { // Replace 'any' with a more specific user type
    try {
      // Simulate API call to authenticate user (replace with actual API call)
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`);
      }

      const data = await response.json();

      // Assuming the API returns user data upon successful login
      setUser(data.user);
      localStorage.setItem('token', data.token); // Store token for persistence
      history.push('/dashboard'); // Redirect to dashboard
    } catch (error: any) { // Explicitly type 'error' as 'any'
      console.error('Login error:', error.message);
      // Display error message to the user (e.g., using a state variable)
      alert(`Login failed: ${error.message}`);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    history.push('/login'); // Redirect to login page
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Example Login Component
export const LoginComponent: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = React.useContext(AuthContext) || {login: () => {}}; // Provide a default value

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ username, password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="username">Username:</label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

// Example Usage: Wrap your app with AuthProvider
// <AuthProvider>
//   <App />
// </AuthProvider>

// Example Usage: Use LoginComponent in your Login page
// <LoginComponent />

// Error Boundary Component (for catching errors in child components)
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
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

export default ErrorBoundary;