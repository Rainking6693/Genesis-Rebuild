// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface UserAuthProps {
  // Add any specific props needed for your component
}

const UserAuth: React.FC<UserAuthProps> = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading, error } = useAuth0();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      console.error("Authentication Error:", error);
      setErrorMessage("Authentication failed. Please try again later.");
    }
  }, [error]);

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  if (errorMessage) {
    return <div style={{ color: 'red' }}>Error: {errorMessage}</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
          </button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>Log In / Sign Up</button>
      )}
    </div>
  );
};

export default UserAuth;

// Example of an Error Boundary (can be in a separate file)
class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.error("Caught an error in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You could render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}