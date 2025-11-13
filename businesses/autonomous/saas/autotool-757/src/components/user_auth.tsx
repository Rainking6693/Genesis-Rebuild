// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify'; // Example: Using AWS Amplify for Auth

interface User {
  username: string | null;
  email: string | null;
}

interface AuthContextProps {
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = React.createContext<AuthContextProps>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  loading: true,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        setUser({
          username: authUser.username,
          email: authUser.attributes.email,
        });
      } catch (error) {
        console.warn("No current authenticated user:", error);
        setUser(null); // No user is signed in
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      await Auth.signIn(username, password);
      const authUser = await Auth.currentAuthenticatedUser();
      setUser({
        username: authUser.username,
        email: authUser.attributes.email,
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      // Implement user-friendly error display (e.g., using a state variable)
      alert(`Sign-in failed: ${error.message}`); // Example error handling
      throw error; // Re-throw for component-level handling if needed
    }
  };

  const signUp = async (username: string, password: string, email: string) => {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      // Optionally, automatically sign the user in after signup
      await signIn(username, password);
    } catch (error: any) {
      console.error("Sign up error:", error);
      // Implement user-friendly error display (e.g., using a state variable)
      alert(`Sign-up failed: ${error.message}`); // Example error handling
      throw error; // Re-throw for component-level handling if needed
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error: any) {
      console.error("Sign out error:", error);
      // Implement user-friendly error display (e.g., using a state variable)
      alert(`Sign-out failed: ${error.message}`); // Example error handling
      throw error; // Re-throw for component-level handling if needed
    }
  };

  const value: AuthContextProps = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Example usage in a component:
// import { AuthContext } from './UserAuth';
// const MyComponent = () => {
//   const { user, signIn, signOut } = useContext(AuthContext);
//   ...
// }

export default AuthProvider;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify'; // Example: Using AWS Amplify for Auth

interface User {
  username: string | null;
  email: string | null;
}

interface AuthContextProps {
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = React.createContext<AuthContextProps>({
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  loading: true,
});

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        setUser({
          username: authUser.username,
          email: authUser.attributes.email,
        });
      } catch (error) {
        console.warn("No current authenticated user:", error);
        setUser(null); // No user is signed in
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      await Auth.signIn(username, password);
      const authUser = await Auth.currentAuthenticatedUser();
      setUser({
        username: authUser.username,
        email: authUser.attributes.email,
      });
    } catch (error: any) {
      console.error("Sign in error:", error);
      // Implement user-friendly error display (e.g., using a state variable)
      alert(`Sign-in failed: ${error.message}`); // Example error handling
      throw error; // Re-throw for component-level handling if needed
    }
  };

  const signUp = async (username: string, password: string, email: string) => {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      // Optionally, automatically sign the user in after signup
      await signIn(username, password);
    } catch (error: any) {
      console.error("Sign up error:", error);
      // Implement user-friendly error display (e.g., using a state variable)
      alert(`Sign-up failed: ${error.message}`); // Example error handling
      throw error; // Re-throw for component-level handling if needed
    }
  };

  const signOut = async () => {
    try {
      await Auth.signOut();
      setUser(null);
    } catch (error: any) {
      console.error("Sign out error:", error);
      // Implement user-friendly error display (e.g., using a state variable)
      alert(`Sign-out failed: ${error.message}`); // Example error handling
      throw error; // Re-throw for component-level handling if needed
    }
  };

  const value: AuthContextProps = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Example usage in a component:
// import { AuthContext } from './UserAuth';
// const MyComponent = () => {
//   const { user, signIn, signOut } = useContext(AuthContext);
//   ...
// }

export default AuthProvider;