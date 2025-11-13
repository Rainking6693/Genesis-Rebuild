// src/components/UserAuth.tsx
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

export default function UserAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>({ name: null, email: null, image: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session) {
      setUser({
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
      });
      setLoading(false);
      setError(null);
    } else {
      setUser({ name: null, email: null, image: null });
      setLoading(false);
    }
  }, [session, status]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (e: any) {
      console.error("Sign-in error:", e);
      setError("Failed to sign in. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e: any) {
      console.error("Sign-out error:", e);
      setError("Failed to sign out. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {session ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </div>
  );
}

// Error Boundary Example (Wrap the component in a parent component)
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
    console.error("Caught an error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
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
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

interface User {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}

export default function UserAuth() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User>({ name: null, email: null, image: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }

    if (session) {
      setUser({
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
      });
      setLoading(false);
      setError(null);
    } else {
      setUser({ name: null, email: null, image: null });
      setLoading(false);
    }
  }, [session, status]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (e: any) {
      console.error("Sign-in error:", e);
      setError("Failed to sign in. Please try again.");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (e: any) {
      console.error("Sign-out error:", e);
      setError("Failed to sign out. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {session ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
    </div>
  );
}

// Error Boundary Example (Wrap the component in a parent component)
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
    console.error("Caught an error:", error, errorInfo);
    this.setState({ errorInfo: errorInfo });
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