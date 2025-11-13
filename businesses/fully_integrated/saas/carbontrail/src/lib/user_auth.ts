import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  FC,
  useCallback,
} from 'react';
import { jwtDecode } from 'jwt-decode';

// Define a type for the token payload (replace with your actual payload structure)
interface TokenPayload {
  userId: string;
  exp: number; // Expiration timestamp
  [key: string]: any; // Allow for other claims
}

interface AuthContextProps {
  isAuthenticated: boolean;
  userId: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null; // Add error state
}

// Create a context for authentication
const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  userId: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
  storageKey?: string; // Allow customization of the localStorage key
}

const defaultStorageKey = 'authToken';

// AuthProvider component to manage authentication state
const AuthProvider: FC<AuthProviderProps> = ({ children, storageKey = defaultStorageKey }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to securely decode a JWT token
  const safeDecodeToken = (token: string): TokenPayload | null => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded;
    } catch (err: any) {
      console.error('Error decoding token:', err);
      setError('Invalid token format.');
      return null;
    }
  };

  const validateTokenExpiration = (tokenPayload: TokenPayload | null): boolean => {
    if (!tokenPayload || !tokenPayload.exp) {
      console.warn('Token does not contain expiration claim.');
      return false; // Treat as invalid if no expiration
    }

    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    if (tokenPayload.exp < now) {
      console.warn('Token has expired.');
      return false;
    }

    return true;
  };

  const login = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
    try {
      localStorage.setItem(storageKey, token);
      const payload = safeDecodeToken(token);

      if (payload && payload.userId && validateTokenExpiration(payload)) {
        setUserId(payload.userId);
        setIsAuthenticated(true);
      } else {
        console.error('Invalid token payload or expired token.');
        localStorage.removeItem(storageKey);
        setIsAuthenticated(false);
        setUserId(null);
        setError('Invalid token.');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      localStorage.removeItem(storageKey);
      setIsAuthenticated(false);
      setUserId(null);
      setError('Login failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  const logout = useCallback(() => {
    localStorage.removeItem(storageKey);
    setIsAuthenticated(false);
    setUserId(null);
    setError(null);
  }, [storageKey]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(storageKey);
        if (token) {
          const payload = safeDecodeToken(token);
          if (payload && payload.userId && validateTokenExpiration(payload)) {
            setUserId(payload.userId);
            setIsAuthenticated(true);
          } else {
            console.warn('Invalid or expired token found in localStorage');
            localStorage.removeItem(storageKey);
            setIsAuthenticated(false);
            setUserId(null);
            setError('Invalid or expired token.');
          }
        }
      } catch (err: any) {
        console.error('Error during auth status check:', err);
        localStorage.removeItem(storageKey);
        setIsAuthenticated(false);
        setUserId(null);
        setError('Authentication check failed: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [storageKey]);

  const value: AuthContextProps = {
    isAuthenticated,
    userId,
    login,
    logout,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the authentication context
const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext };

import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
  FC,
  useCallback,
} from 'react';
import { jwtDecode } from 'jwt-decode';

// Define a type for the token payload (replace with your actual payload structure)
interface TokenPayload {
  userId: string;
  exp: number; // Expiration timestamp
  [key: string]: any; // Allow for other claims
}

interface AuthContextProps {
  isAuthenticated: boolean;
  userId: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null; // Add error state
}

// Create a context for authentication
const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  userId: null,
  login: async () => {},
  logout: () => {},
  isLoading: false,
  error: null,
});

interface AuthProviderProps {
  children: ReactNode;
  storageKey?: string; // Allow customization of the localStorage key
}

const defaultStorageKey = 'authToken';

// AuthProvider component to manage authentication state
const AuthProvider: FC<AuthProviderProps> = ({ children, storageKey = defaultStorageKey }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to securely decode a JWT token
  const safeDecodeToken = (token: string): TokenPayload | null => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return decoded;
    } catch (err: any) {
      console.error('Error decoding token:', err);
      setError('Invalid token format.');
      return null;
    }
  };

  const validateTokenExpiration = (tokenPayload: TokenPayload | null): boolean => {
    if (!tokenPayload || !tokenPayload.exp) {
      console.warn('Token does not contain expiration claim.');
      return false; // Treat as invalid if no expiration
    }

    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    if (tokenPayload.exp < now) {
      console.warn('Token has expired.');
      return false;
    }

    return true;
  };

  const login = useCallback(async (token: string) => {
    setIsLoading(true);
    setError(null); // Clear any previous errors
    try {
      localStorage.setItem(storageKey, token);
      const payload = safeDecodeToken(token);

      if (payload && payload.userId && validateTokenExpiration(payload)) {
        setUserId(payload.userId);
        setIsAuthenticated(true);
      } else {
        console.error('Invalid token payload or expired token.');
        localStorage.removeItem(storageKey);
        setIsAuthenticated(false);
        setUserId(null);
        setError('Invalid token.');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      localStorage.removeItem(storageKey);
      setIsAuthenticated(false);
      setUserId(null);
      setError('Login failed: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  const logout = useCallback(() => {
    localStorage.removeItem(storageKey);
    setIsAuthenticated(false);
    setUserId(null);
    setError(null);
  }, [storageKey]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem(storageKey);
        if (token) {
          const payload = safeDecodeToken(token);
          if (payload && payload.userId && validateTokenExpiration(payload)) {
            setUserId(payload.userId);
            setIsAuthenticated(true);
          } else {
            console.warn('Invalid or expired token found in localStorage');
            localStorage.removeItem(storageKey);
            setIsAuthenticated(false);
            setUserId(null);
            setError('Invalid or expired token.');
          }
        }
      } catch (err: any) {
        console.error('Error during auth status check:', err);
        localStorage.removeItem(storageKey);
        setIsAuthenticated(false);
        setUserId(null);
        setError('Authentication check failed: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [storageKey]);

  const value: AuthContextProps = {
    isAuthenticated,
    userId,
    login,
    logout,
    isLoading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the authentication context
const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth, AuthContext };