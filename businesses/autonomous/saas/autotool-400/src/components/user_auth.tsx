// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { Auth } from 'aws-amplify'; // Assuming AWS Amplify for Auth

interface User {
  username: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        setUser({
          username: authUser.username,
          email: authUser.attributes.email,
        });
      } catch (error) {
        console.warn("No current user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      await Auth.signIn(username, password);
      const authUser = await Auth.currentAuthenticatedUser();
      setUser({
        username: authUser.username,
        email: authUser.attributes.email,
      });
      navigate('/dashboard'); // Redirect to dashboard after sign-in
    } catch (error: any) {
      console.error("Sign-in error:", error);
      alert(`Sign-in failed: ${error.message}`); // Display error to user
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (username: string, password: string, email: string) => {
    try {
      setIsLoading(true);
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      alert("Sign-up successful! Please confirm your account via email.");
      navigate('/confirm-signup'); // Redirect to confirmation page
    } catch (error: any) {
      console.error("Sign-up error:", error);
      alert(`Sign-up failed: ${error.message}`); // Display error to user
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await Auth.signOut();
      setUser(null);
      navigate('/login'); // Redirect to login after sign-out
    } catch (error: any) {
      console.error("Sign-out error:", error);
      alert(`Sign-out failed: ${error.message}`); // Display error to user
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextProps = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Example Error Boundary (can be used to wrap components that might throw errors)
class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    console.error("Caught an error in ErrorBoundary:", error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export { ErrorBoundary };

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { Auth } from 'aws-amplify'; // Assuming AWS Amplify for Auth

interface User {
  username: string;
  email: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string, email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        setUser({
          username: authUser.username,
          email: authUser.attributes.email,
        });
      } catch (error) {
        console.warn("No current user:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      await Auth.signIn(username, password);
      const authUser = await Auth.currentAuthenticatedUser();
      setUser({
        username: authUser.username,
        email: authUser.attributes.email,
      });
      navigate('/dashboard'); // Redirect to dashboard after sign-in
    } catch (error: any) {
      console.error("Sign-in error:", error);
      alert(`Sign-in failed: ${error.message}`); // Display error to user
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (username: string, password: string, email: string) => {
    try {
      setIsLoading(true);
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      alert("Sign-up successful! Please confirm your account via email.");
      navigate('/confirm-signup'); // Redirect to confirmation page
    } catch (error: any) {
      console.error("Sign-up error:", error);
      alert(`Sign-up failed: ${error.message}`); // Display error to user
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await Auth.signOut();
      setUser(null);
      navigate('/login'); // Redirect to login after sign-out
    } catch (error: any) {
      console.error("Sign-out error:", error);
      alert(`Sign-out failed: ${error.message}`); // Display error to user
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextProps = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Example Error Boundary (can be used to wrap components that might throw errors)
class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    console.error("Caught an error in ErrorBoundary:", error);
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error("Error Info:", errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export { ErrorBoundary };