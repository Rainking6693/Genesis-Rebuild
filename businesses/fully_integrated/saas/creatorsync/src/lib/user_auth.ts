import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  FC,
  useCallback,
  useMemo,
} from 'react';

// Define a more comprehensive User interface
interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  roles?: string[]; // Example: ['admin', 'editor', 'viewer']
  permissions?: string[]; // Example: ['read', 'write', 'delete']
  [key: string]: any; // Allow for extensibility
}

// Define a type for possible errors
type AuthError = Error | string | null;

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  isLoading: boolean; // Add loading state
  error: AuthError; // Add error state
  clearError: () => void; // Function to clear the error
  isInitialized: boolean; // Indicate if initial auth check is complete
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => {}, // Provide empty async function
  logout: () => {},
  user: null,
  isLoading: false,
  error: null,
  clearError: () => {},
  isInitialized: false,
});

interface AuthProviderProps {
  children: ReactNode;
  loginUrl?: string; // Allow customization of login endpoint
  verifyTokenUrl?: string; // Allow customization of verify token endpoint
  storageKey?: string; // Allow customization of local storage key
}

const defaultLoginUrl = '/api/login';
const defaultVerifyTokenUrl = '/api/verify-token';
const defaultStorageKey = 'authToken';

const AuthProvider: FC<AuthProviderProps> = ({
  children,
  loginUrl = defaultLoginUrl,
  verifyTokenUrl = defaultVerifyTokenUrl,
  storageKey = defaultStorageKey,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [error, setError] = useState<AuthError>(null);
  const [isInitialized, setIsInitialized] = useState(false); // Track if initial auth check is complete

  // Function to clear the error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Use useCallback to memoize the login function
  const login = useCallback(
    async (username, password) => {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        if (!username || !password) {
          throw new Error('Username and password are required.');
        }

        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          let errorMessage = 'Login failed';
          let errorData;
          try {
            errorData = await response.json();
            errorMessage = errorData.message || errorMessage; // Use API error message if available
          } catch (parseError) {
            console.error('Error parsing error response:', parseError);
            errorMessage = `Login failed: ${response.status} ${response.statusText}`; // Provide status code
          }
          // Include the status code in the error message
          const fullErrorMessage = `Login failed: ${response.status} ${response.statusText} - ${errorMessage}`;
          throw new Error(fullErrorMessage);
        }

        const data = await response.json();
        if (!data.token || !data.user) {
          throw new Error(
            'Invalid login response: missing token or user data'
          );
        }

        const token = data.token;
        const userData: User = data.user;

        localStorage.setItem(storageKey, token);
        setIsLoggedIn(true);
        setUser(userData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Login failed';
        console.error('Login error:', errorMessage);
        setError(errorMessage); // Set the error state
      } finally {
        setIsLoading(false);
      }
    },
    [loginUrl, storageKey]
  );

  // Use useCallback to memoize the logout function
  const logout = useCallback(() => {
    localStorage.removeItem(storageKey);
    setIsLoggedIn(false);
    setUser(null);
    setError(null); // Clear any errors on logout
  }, [storageKey]);

  // Use useCallback to memoize the verifyToken function
  const verifyToken = useCallback(
    async (token: string): Promise<User> => {
      try {
        if (!token) {
          throw new Error('Token is required for verification.');
        }

        const response = await fetch(verifyTokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          let errorMessage = 'Token verification failed';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            console.error('Error parsing error response:', parseError);
            errorMessage = `Token verification failed: ${response.status} ${response.statusText}`;
          }
          const fullErrorMessage = `Token verification failed: ${response.status} ${response.statusText} - ${errorMessage}`;
          throw new Error(fullErrorMessage);
        }

        const data = await response.json();
        if (!data.user) {
          throw new Error(
            'Invalid token verification response: missing user data'
          );
        }
        return data.user;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Token verification failed';
        console.error('Token verification error:', errorMessage);
        throw new Error(errorMessage); // Re-throw the error for handling in useEffect
      }
    },
    [verifyTokenUrl]
  );

  useEffect(() => {
    const attemptTokenVerification = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(storageKey);
        if (token) {
          try {
            const userData = await verifyToken(token);
            setIsLoggedIn(true);
            setUser(userData);
          } catch (verificationError: any) {
            // Token is invalid or expired
            console.warn(
              'Token verification failed, logging out:',
              verificationError.message
            );
            localStorage.removeItem(storageKey); // Remove invalid token
            setIsLoggedIn(false);
            setUser(null);
            setError(
              `Session expired or invalid. Please log in again. ${verificationError.message}`
            ); // User-friendly message
          }
        } else {
          setIsLoggedIn(false); // Explicitly set to false if no token
          setUser(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Token verification failed';
        console.error('Token verification failed:', errorMessage);
        localStorage.removeItem(storageKey);
        setIsLoggedIn(false);
        setUser(null);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsInitialized(true); // Mark initialization as complete
      }
    };

    attemptTokenVerification();
  }, [verifyToken, storageKey]); // Dependency array includes verifyToken and storageKey

  const contextValue: AuthContextType = useMemo(
    () => ({
      isLoggedIn,
      login,
      logout,
      user,
      isLoading,
      error,
      clearError,
      isInitialized,
    }),
    [isLoggedIn, login, logout, user, isLoading, error, clearError, isInitialized]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext, User };

import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  FC,
  useCallback,
  useMemo,
} from 'react';

// Define a more comprehensive User interface
interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  roles?: string[]; // Example: ['admin', 'editor', 'viewer']
  permissions?: string[]; // Example: ['read', 'write', 'delete']
  [key: string]: any; // Allow for extensibility
}

// Define a type for possible errors
type AuthError = Error | string | null;

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  user: User | null;
  isLoading: boolean; // Add loading state
  error: AuthError; // Add error state
  clearError: () => void; // Function to clear the error
  isInitialized: boolean; // Indicate if initial auth check is complete
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => {}, // Provide empty async function
  logout: () => {},
  user: null,
  isLoading: false,
  error: null,
  clearError: () => {},
  isInitialized: false,
});

interface AuthProviderProps {
  children: ReactNode;
  loginUrl?: string; // Allow customization of login endpoint
  verifyTokenUrl?: string; // Allow customization of verify token endpoint
  storageKey?: string; // Allow customization of local storage key
}

const defaultLoginUrl = '/api/login';
const defaultVerifyTokenUrl = '/api/verify-token';
const defaultStorageKey = 'authToken';

const AuthProvider: FC<AuthProviderProps> = ({
  children,
  loginUrl = defaultLoginUrl,
  verifyTokenUrl = defaultVerifyTokenUrl,
  storageKey = defaultStorageKey,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [error, setError] = useState<AuthError>(null);
  const [isInitialized, setIsInitialized] = useState(false); // Track if initial auth check is complete

  // Function to clear the error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Use useCallback to memoize the login function
  const login = useCallback(
    async (username, password) => {
      setIsLoading(true);
      setError(null); // Clear any previous errors

      try {
        if (!username || !password) {
          throw new Error('Username and password are required.');
        }

        const response = await fetch(loginUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          let errorMessage = 'Login failed';
          let errorData;
          try {
            errorData = await response.json();
            errorMessage = errorData.message || errorMessage; // Use API error message if available
          } catch (parseError) {
            console.error('Error parsing error response:', parseError);
            errorMessage = `Login failed: ${response.status} ${response.statusText}`; // Provide status code
          }
          // Include the status code in the error message
          const fullErrorMessage = `Login failed: ${response.status} ${response.statusText} - ${errorMessage}`;
          throw new Error(fullErrorMessage);
        }

        const data = await response.json();
        if (!data.token || !data.user) {
          throw new Error(
            'Invalid login response: missing token or user data'
          );
        }

        const token = data.token;
        const userData: User = data.user;

        localStorage.setItem(storageKey, token);
        setIsLoggedIn(true);
        setUser(userData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Login failed';
        console.error('Login error:', errorMessage);
        setError(errorMessage); // Set the error state
      } finally {
        setIsLoading(false);
      }
    },
    [loginUrl, storageKey]
  );

  // Use useCallback to memoize the logout function
  const logout = useCallback(() => {
    localStorage.removeItem(storageKey);
    setIsLoggedIn(false);
    setUser(null);
    setError(null); // Clear any errors on logout
  }, [storageKey]);

  // Use useCallback to memoize the verifyToken function
  const verifyToken = useCallback(
    async (token: string): Promise<User> => {
      try {
        if (!token) {
          throw new Error('Token is required for verification.');
        }

        const response = await fetch(verifyTokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          let errorMessage = 'Token verification failed';
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (parseError) {
            console.error('Error parsing error response:', parseError);
            errorMessage = `Token verification failed: ${response.status} ${response.statusText}`;
          }
          const fullErrorMessage = `Token verification failed: ${response.status} ${response.statusText} - ${errorMessage}`;
          throw new Error(fullErrorMessage);
        }

        const data = await response.json();
        if (!data.user) {
          throw new Error(
            'Invalid token verification response: missing user data'
          );
        }
        return data.user;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Token verification failed';
        console.error('Token verification error:', errorMessage);
        throw new Error(errorMessage); // Re-throw the error for handling in useEffect
      }
    },
    [verifyTokenUrl]
  );

  useEffect(() => {
    const attemptTokenVerification = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem(storageKey);
        if (token) {
          try {
            const userData = await verifyToken(token);
            setIsLoggedIn(true);
            setUser(userData);
          } catch (verificationError: any) {
            // Token is invalid or expired
            console.warn(
              'Token verification failed, logging out:',
              verificationError.message
            );
            localStorage.removeItem(storageKey); // Remove invalid token
            setIsLoggedIn(false);
            setUser(null);
            setError(
              `Session expired or invalid. Please log in again. ${verificationError.message}`
            ); // User-friendly message
          }
        } else {
          setIsLoggedIn(false); // Explicitly set to false if no token
          setUser(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Token verification failed';
        console.error('Token verification failed:', errorMessage);
        localStorage.removeItem(storageKey);
        setIsLoggedIn(false);
        setUser(null);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsInitialized(true); // Mark initialization as complete
      }
    };

    attemptTokenVerification();
  }, [verifyToken, storageKey]); // Dependency array includes verifyToken and storageKey

  const contextValue: AuthContextType = useMemo(
    () => ({
      isLoggedIn,
      login,
      logout,
      user,
      isLoading,
      error,
      clearError,
      isInitialized,
    }),
    [isLoggedIn, login, logout, user, isLoading, error, clearError, isInitialized]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext, User };