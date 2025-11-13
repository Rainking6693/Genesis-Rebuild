// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthContextType {
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);

  const login = (userData: any) => {
    // Simulate login process (replace with actual API call)
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data in local storage
  };

  const logout = () => {
    // Simulate logout process
    setUser(null);
    localStorage.removeItem('user'); // Remove user data from local storage
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
  return React.useContext(AuthContext);
};

// Example Login Form Component
export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Simulate API call (replace with actual API call)
      if (email === 'test@example.com' && password === 'password') {
        login({ email: email, name: 'Test User' });
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

// Error handling example:  Wrapping the app with AuthProvider will catch any errors related to authentication
// <AuthProvider>
//   <App />
// </AuthProvider>

// Total lines: 105