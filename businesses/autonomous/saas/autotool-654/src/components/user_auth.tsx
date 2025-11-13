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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }
    setIsLoading(false);

    if (session) {
      setUser({ name: session.user?.name, email: session.user?.email, image: session.user?.image });
    } else {
      setUser({ name: null, email: null, image: null });
    }
  }, [session, status]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error: any) {
      console.error("Sign-in error:", error);
      alert(`Sign-in failed: ${error.message}`); // User-friendly error message
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error("Sign-out error:", error);
      alert(`Sign-out failed: ${error.message}`); // User-friendly error message
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user.name ? (
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

// Error Boundary Example (Can be implemented as a separate component)
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. {this.state.error?.message}</h1>;
    }

    return this.props.children;
  }
}

// Example usage:
// <ErrorBoundary>
//   <UserAuth />
// </ErrorBoundary>

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }
    setIsLoading(false);

    if (session) {
      setUser({ name: session.user?.name, email: session.user?.email, image: session.user?.image });
    } else {
      setUser({ name: null, email: null, image: null });
    }
  }, [session, status]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error: any) {
      console.error("Sign-in error:", error);
      alert(`Sign-in failed: ${error.message}`); // User-friendly error message
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error("Sign-out error:", error);
      alert(`Sign-out failed: ${error.message}`); // User-friendly error message
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user.name ? (
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

// Error Boundary Example (Can be implemented as a separate component)
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Caught error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong. {this.state.error?.message}</h1>;
    }

    return this.props.children;
  }
}

// Example usage:
// <ErrorBoundary>
//   <UserAuth />
// </ErrorBoundary>