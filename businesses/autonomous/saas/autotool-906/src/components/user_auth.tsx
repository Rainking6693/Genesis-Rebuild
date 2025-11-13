// src/components/UserAuth.tsx
import React, { useState, createContext, useContext, useEffect } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific type if possible
  login: (userData: any) => void; // Replace 'any' with a more specific type if possible
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific type if possible
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading user data from local storage or an API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from local storage:", error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: any) => { // Replace 'any' with a more specific type if possible
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error saving user data to local storage:", error);
      // Consider showing an error message to the user
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error("Error removing user data from local storage:", error);
      // Consider showing an error message to the user
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading...</div> : children}
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

// Example usage in a component:
// import { useAuth } from './UserAuth';
// const MyComponent = () => {
//   const { user, login, logout } = useAuth();
//   if (user) {
//     return (
//       <div>
//         Welcome, {user.username}!
//         <button onClick={logout}>Logout</button>
//       </div>
//     );
//   } else {
//     return (
//       <div>
//         Please login.
//         <button onClick={() => login({ username: 'testuser' })}>Login</button>
//       </div>
//     );
//   }
// };

export default AuthProvider;

// src/components/UserAuth.tsx
import React, { useState, createContext, useContext, useEffect } from 'react';

interface AuthContextType {
  user: any | null; // Replace 'any' with a more specific type if possible
  login: (userData: any) => void; // Replace 'any' with a more specific type if possible
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null); // Replace 'any' with a more specific type if possible
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading user data from local storage or an API
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from local storage:", error);
        localStorage.removeItem('user'); // Clear invalid data
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: any) => { // Replace 'any' with a more specific type if possible
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error saving user data to local storage:", error);
      // Consider showing an error message to the user
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error("Error removing user data from local storage:", error);
      // Consider showing an error message to the user
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading...</div> : children}
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

// Example usage in a component:
// import { useAuth } from './UserAuth';
// const MyComponent = () => {
//   const { user, login, logout } = useAuth();
//   if (user) {
//     return (
//       <div>
//         Welcome, {user.username}!
//         <button onClick={logout}>Logout</button>
//       </div>
//     );
//   } else {
//     return (
//       <div>
//         Please login.
//         <button onClick={() => login({ username: 'testuser' })}>Login</button>
//       </div>
//     );
//   }
// };

export default AuthProvider;