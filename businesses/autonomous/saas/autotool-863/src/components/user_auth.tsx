// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { Auth } from 'aws-amplify'; // Assuming AWS Amplify is used for authentication

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const UserAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setAuthState({
        isAuthenticated: true,
        user: user,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error.message,
      });
    }
  }

  async function signUp(username: string, password: string, email: string) {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log('Sign up successful!');
      // Redirect to confirmation page or login page
      navigate('/confirm-signup');
    } catch (error: any) {
      console.error('Error signing up:', error);
      setAuthState((prevState) => ({ ...prevState, error: error.message }));
    }
  }

  async function confirmSignUp(username: string, confirmationCode: string) {
    try {
      await Auth.confirmSignUp(username, confirmationCode);
      console.log('Confirm sign up successful!');
      navigate('/login');
    } catch (error: any) {
      console.error('Error confirming sign up:', error);
      setAuthState((prevState) => ({ ...prevState, error: error.message }));
    }
  }

  async function signIn(username: string, password: string) {
    try {
      await Auth.signIn(username, password);
      console.log('Sign in successful!');
      await checkUser(); // Update auth state after sign in
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      setAuthState((prevState) => ({ ...prevState, error: error.message }));
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
      console.log('Sign out successful!');
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      setAuthState((prevState) => ({ ...prevState, error: error.message }));
    }
  }

  // Error Boundary Component (Simplified)
  const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      const errorHandler = (error: any, errorInfo: any) => {
        console.error('Caught an error: ', error, errorInfo);
        setHasError(true);
      };

      window.addEventListener('error', errorHandler);

      return () => {
        window.removeEventListener('error', errorHandler);
      };
    }, []);

    if (hasError) {
      return <div>Something went wrong. Please try again later.</div>;
    }

    return children;
  };

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        {authState.error && <div style={{ color: 'red' }}>Error: {authState.error}</div>}
        {!authState.isAuthenticated ? (
          <div>
            <h2>Sign Up</h2>
            <button onClick={() => signUp('testuser', 'P@ssword123', 'test@example.com')}>Sign Up (Example)</button>
            <h2>Sign In</h2>
            <button onClick={() => signIn('testuser', 'P@ssword123')}>Sign In (Example)</button>
          </div>
        ) : (
          <div>
            <p>Welcome, {authState.user?.username}!</p>
            <button onClick={signOut}>Sign Out</button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default UserAuth;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import { Auth } from 'aws-amplify'; // Assuming AWS Amplify is used for authentication

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  error: string | null;
}

const UserAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setAuthState({
        isAuthenticated: true,
        user: user,
        loading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error.message,
      });
    }
  }

  async function signUp(username: string, password: string, email: string) {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,
        },
      });
      console.log('Sign up successful!');
      // Redirect to confirmation page or login page
      navigate('/confirm-signup');
    } catch (error: any) {
      console.error('Error signing up:', error);
      setAuthState((prevState) => ({ ...prevState, error: error.message }));
    }
  }

  async function confirmSignUp(username: string, confirmationCode: string) {
    try {
      await Auth.confirmSignUp(username, confirmationCode);
      console.log('Confirm sign up successful!');
      navigate('/login');
    } catch (error: any) {
      console.error('Error confirming sign up:', error);
      setAuthState((prevState) => ({ ...prevState, error: error.message }));
    }
  }

  async function signIn(username: string, password: string) {
    try {
      await Auth.signIn(username, password);
      console.log('Sign in successful!');
      await checkUser(); // Update auth state after sign in
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error signing in:', error);
      setAuthState((prevState) => ({ ...prevState, error: error.message }));
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
      console.log('Sign out successful!');
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
      navigate('/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      setAuthState((prevState) => ({ ...prevState, error: error.message }));
    }
  }

  // Error Boundary Component (Simplified)
  const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      const errorHandler = (error: any, errorInfo: any) => {
        console.error('Caught an error: ', error, errorInfo);
        setHasError(true);
      };

      window.addEventListener('error', errorHandler);

      return () => {
        window.removeEventListener('error', errorHandler);
      };
    }, []);

    if (hasError) {
      return <div>Something went wrong. Please try again later.</div>;
    }

    return children;
  };

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary>
      <div>
        {authState.error && <div style={{ color: 'red' }}>Error: {authState.error}</div>}
        {!authState.isAuthenticated ? (
          <div>
            <h2>Sign Up</h2>
            <button onClick={() => signUp('testuser', 'P@ssword123', 'test@example.com')}>Sign Up (Example)</button>
            <h2>Sign In</h2>
            <button onClick={() => signIn('testuser', 'P@ssword123')}>Sign In (Example)</button>
          </div>
        ) : (
          <div>
            <p>Welcome, {authState.user?.username}!</p>
            <button onClick={signOut}>Sign Out</button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default UserAuth;