// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { sha256 } from 'js-sha256'; // For password hashing (consider a more robust library)

interface AuthContextType {
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token in local storage on component mount
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token (e.g., against backend) and set user if valid
      // This is a simplified example; real-world validation is crucial
      setUser({ username: 'exampleUser' }); // Replace with actual user data
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Hash the password before sending it to the server
      const hashedPassword = sha256(password);

      // Make API call to authenticate user
      const response = await fetch('/api/login', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: hashedPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token); // Store token in local storage
      setUser({ username: username }); // Set user in state
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message); // Display error message to the user (replace with a better UI)
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login'); // Redirect to login page
  };

  const register = async (username: string, password: string) => {
    try {
      // Hash the password before sending it to the server
      const hashedPassword = sha256(password);

      // Make API call to register user
      const response = await fetch('/api/register', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: hashedPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      // Optionally, log the user in automatically after registration
      // login(username, password);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message); // Display error message to the user (replace with a better UI)
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

// Custom hook to use the auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Example usage in a component:
// const MyComponent = () => {
//   const { user, login, logout } = useAuth();
//   return (
//     <div>
//       {user ? (
//         <>
//           <p>Welcome, {user.username}!</p>
//           <button onClick={logout}>Logout</button>
//         </>
//       ) : (
//         <>
//           <button onClick={() => login('test', 'password')}>Login</button>
//         </>
//       )}
//     </div>
//   );
// };

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { sha256 } from 'js-sha256'; // For password hashing (consider a more robust library)

interface AuthContextType {
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for existing token in local storage on component mount
    const token = localStorage.getItem('authToken');
    if (token) {
      // Validate token (e.g., against backend) and set user if valid
      // This is a simplified example; real-world validation is crucial
      setUser({ username: 'exampleUser' }); // Replace with actual user data
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      // Hash the password before sending it to the server
      const hashedPassword = sha256(password);

      // Make API call to authenticate user
      const response = await fetch('/api/login', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: hashedPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token); // Store token in local storage
      setUser({ username: username }); // Set user in state
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error.message); // Display error message to the user (replace with a better UI)
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login'); // Redirect to login page
  };

  const register = async (username: string, password: string) => {
    try {
      // Hash the password before sending it to the server
      const hashedPassword = sha256(password);

      // Make API call to register user
      const response = await fetch('/api/register', { // Replace with your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password: hashedPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      // Optionally, log the user in automatically after registration
      // login(username, password);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      alert(error.message); // Display error message to the user (replace with a better UI)
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

// Custom hook to use the auth context
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Example usage in a component:
// const MyComponent = () => {
//   const { user, login, logout } = useAuth();
//   return (
//     <div>
//       {user ? (
//         <>
//           <p>Welcome, {user.username}!</p>
//           <button onClick={logout}>Logout</button>
//         </>
//       ) : (
//         <>
//           <button onClick={() => login('test', 'password')}>Login</button>
//         </>
//       )}
//     </div>
//   );
// };