// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with appropriate type
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type

  const login = (userData: any) => { // Replace 'any' with appropriate type
    try {
      // Simulate API call (replace with actual API call)
      // In a real application, you would authenticate against a backend service
      // and store the user data in local storage or a cookie.
      setUser(userData);
      console.log('User logged in successfully');
    } catch (error) {
      console.error('Login failed:', error);
      // Display error message to the user
    }
  };

  const logout = () => {
    try {
      // Clear user data from local storage or cookie
      setUser(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Display error message to the user
    }
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

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      // Simulate API call (replace with actual API call)
      // In a real application, you would send the username and password to the backend
      // for authentication.
      const userData = { username: username, /* other user data */ }; // Replace with actual user data from API
      login(userData);
      setError(null); // Clear any previous errors
    } catch (err: any) { // Explicitly type 'err' as 'any'
      console.error('Login failed:', err);
      setError('Invalid username or password.'); // Generic error message for security
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Display error message to the user
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

// TODO: Implement RegistrationForm, PasswordResetForm, etc.
// TODO: Add proper API integration for authentication
// TODO: Implement more robust error handling and user feedback
// TODO: Implement security measures like CSRF protection and input sanitization

// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with appropriate type
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type

  const login = (userData: any) => { // Replace 'any' with appropriate type
    try {
      // Simulate API call (replace with actual API call)
      // In a real application, you would authenticate against a backend service
      // and store the user data in local storage or a cookie.
      setUser(userData);
      console.log('User logged in successfully');
    } catch (error) {
      console.error('Login failed:', error);
      // Display error message to the user
    }
  };

  const logout = () => {
    try {
      // Clear user data from local storage or cookie
      setUser(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
      // Display error message to the user
    }
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

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    try {
      // Simulate API call (replace with actual API call)
      // In a real application, you would send the username and password to the backend
      // for authentication.
      const userData = { username: username, /* other user data */ }; // Replace with actual user data from API
      login(userData);
      setError(null); // Clear any previous errors
    } catch (err: any) { // Explicitly type 'err' as 'any'
      console.error('Login failed:', err);
      setError('Invalid username or password.'); // Generic error message for security
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Display error message to the user
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

// TODO: Implement RegistrationForm, PasswordResetForm, etc.
// TODO: Add proper API integration for authentication
// TODO: Implement more robust error handling and user feedback
// TODO: Implement security measures like CSRF protection and input sanitization