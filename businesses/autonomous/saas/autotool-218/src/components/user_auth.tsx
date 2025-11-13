// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [session, status]);

  const signInWithGoogle = async () => {
    try {
      await signIn('google', { callbackUrl: router.pathname });
    } catch (error: any) {
      console.error('Google Sign-in Error:', error.message);
      // Handle sign-in error (e.g., display an error message to the user)
      alert(`Sign-in failed: ${error.message}`); // Basic error display
    }
  };

  const signOut = async () => {
    try {
      await signOut({ callbackUrl: router.pathname });
    } catch (error: any) {
      console.error('Sign-out Error:', error.message);
      // Handle sign-out error (e.g., display an error message to the user)
      alert(`Sign-out failed: ${error.message}`); // Basic error display
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };
};

export default function UserAuth() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      )}
    </div>
  );
}

// Error Boundary Example (Can be a separate component)
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error: ", error, errorInfo);
    this.setState({error: error, errorInfo: errorInfo})
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn, signOut } from 'next-auth/react';

interface AuthContextType {
  user: any | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuth = (): AuthContextType => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      setUser(session.user);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [session, status]);

  const signInWithGoogle = async () => {
    try {
      await signIn('google', { callbackUrl: router.pathname });
    } catch (error: any) {
      console.error('Google Sign-in Error:', error.message);
      // Handle sign-in error (e.g., display an error message to the user)
      alert(`Sign-in failed: ${error.message}`); // Basic error display
    }
  };

  const signOut = async () => {
    try {
      await signOut({ callbackUrl: router.pathname });
    } catch (error: any) {
      console.error('Sign-out Error:', error.message);
      // Handle sign-out error (e.g., display an error message to the user)
      alert(`Sign-out failed: ${error.message}`); // Basic error display
    }
  };

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
  };
};

export default function UserAuth() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={signOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      )}
    </div>
  );
}

// Error Boundary Example (Can be a separate component)
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught an error: ", error, errorInfo);
    this.setState({error: error, errorInfo: errorInfo})
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}