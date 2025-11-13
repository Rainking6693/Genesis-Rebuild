// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router for navigation

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with a more specific user type
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking for an existing token in local storage or cookies
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (userData: any) => { // Replace 'any' with a more specific user type
    try {
      // Simulate API call to authenticate user
      // Replace with your actual API endpoint
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

      // Assuming the API returns user data and a token
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user in local storage
      navigate('/dashboard'); // Redirect to dashboard after login
    } catch (error: any) {
      console.error("Login error:", error);
      // Handle login error (e.g., display error message to the user)
      alert(`Login failed: ${error.message}`);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page after logout
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Example usage in a component:
// import { useContext } from 'react';
// import { AuthContext } from './UserAuth';

// function MyComponent() {
//   const { user, logout } = useContext(AuthContext);

//   if (!user) {
//     return <p>Please log in.</p>;
//   }

//   return (
//     <div>
//       <p>Welcome, {user.username}!</p>
//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// }

export default AuthProvider;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router for navigation

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific user type
  login: (userData: any) => void; // Replace 'any' with a more specific user type
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific user type
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate checking for an existing token in local storage or cookies
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user from local storage:", error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (userData: any) => { // Replace 'any' with a more specific user type
    try {
      // Simulate API call to authenticate user
      // Replace with your actual API endpoint
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

      // Assuming the API returns user data and a token
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user)); // Store user in local storage
      navigate('/dashboard'); // Redirect to dashboard after login
    } catch (error: any) {
      console.error("Login error:", error);
      // Handle login error (e.g., display error message to the user)
      alert(`Login failed: ${error.message}`);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login'); // Redirect to login page after logout
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Example usage in a component:
// import { useContext } from 'react';
// import { AuthContext } from './UserAuth';

// function MyComponent() {
//   const { user, logout } = useContext(AuthContext);

//   if (!user) {
//     return <p>Please log in.</p>;
//   }

//   return (
//     <div>
//       <p>Welcome, {user.username}!</p>
//       <button onClick={logout}>Logout</button>
//     </div>
//   );
// }

export default AuthProvider;