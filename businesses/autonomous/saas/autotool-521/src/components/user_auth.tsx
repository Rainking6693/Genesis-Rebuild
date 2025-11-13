// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
  register: (userData: any) => Promise<boolean>; // Added register function
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user in local storage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/dashboard'); // Redirect to dashboard after login
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login after logout
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      // Simulate API call for registration (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      console.log("Registered user:", userData);
      return true; // Indicate successful registration
    } catch (error) {
      console.error("Registration failed:", error);
      return false; // Indicate failed registration
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

// Example Login Component
export const LoginComponent: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    try {
      // Simulate API call (replace with actual API call)
      const userData = { username, password, id: '123' }; // Mock user data
      login(userData);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError('Invalid username or password.');
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

// Example Logout Component
export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>Logout</button>
  );
};

// Example Registration Component
export const RegistrationForm: React.FC = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError(null); // Clear previous errors

    if (!username || !password || !email) {
      setRegistrationError('Please fill in all fields.');
      return;
    }

    try {
      const success = await register({ username, password, email });
      if (success) {
        setRegistrationSuccess(true);
        // Optionally, redirect to login page or display a success message
      } else {
        setRegistrationError('Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationError('An unexpected error occurred during registration.');
    }
  };

  return (
    <div>
      {registrationError && <p style={{ color: 'red' }}>{registrationError}</p>}
      {registrationSuccess && <p style={{ color: 'green' }}>Registration successful!</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
  register: (userData: any) => Promise<boolean>; // Added register function
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user in local storage on component mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/dashboard'); // Redirect to dashboard after login
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login after logout
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      // Simulate API call for registration (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      console.log("Registered user:", userData);
      return true; // Indicate successful registration
    } catch (error) {
      console.error("Registration failed:", error);
      return false; // Indicate failed registration
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

// Example Login Component
export const LoginComponent: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    try {
      // Simulate API call (replace with actual API call)
      const userData = { username, password, id: '123' }; // Mock user data
      login(userData);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError('Invalid username or password.');
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

// Example Logout Component
export const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>Logout</button>
  );
};

// Example Registration Component
export const RegistrationForm: React.FC = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistrationError(null); // Clear previous errors

    if (!username || !password || !email) {
      setRegistrationError('Please fill in all fields.');
      return;
    }

    try {
      const success = await register({ username, password, email });
      if (success) {
        setRegistrationSuccess(true);
        // Optionally, redirect to login page or display a success message
      } else {
        setRegistrationError('Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setRegistrationError('An unexpected error occurred during registration.');
    }
  };

  return (
    <div>
      {registrationError && <p style={{ color: 'red' }}>{registrationError}</p>}
      {registrationSuccess && <p style={{ color: 'green' }}>Registration successful!</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};