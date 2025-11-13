// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: any | null; // Replace 'any' with a more specific user type
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
  isAuthenticated: false,
  user: null,
};

const UserAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const handleLogin = async (email: string, password: string) => {
    setAuthState({ ...authState, isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network latency

      if (email === 'test@example.com' && password === 'password') {
        setAuthState({
          ...authState,
          isLoading: false,
          isAuthenticated: true,
          user: { email: email }, // Replace with actual user data
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
        user: null,
      });
    }
  };

  const handleLogout = () => {
    setAuthState({ ...initialState }); // Reset to initial state
  };

  const handleRegistration = async (email: string, password: string) => {
    setAuthState({ ...authState, isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate user already exists error
      if (email === 'test@example.com') {
        throw new Error('User already exists');
      }

      setAuthState({
        ...authState,
        isLoading: false,
        isAuthenticated: true,
        user: { email: email }, // Replace with actual user data
      });
    } catch (error: any) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
        user: null,
      });
    }
  };

  const handleErrorBoundary = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Error boundary caught an error:', error, errorInfo);
    // Log the error to a service like Sentry or Bugsnag
  };

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  if (authState.error) {
    return <div style={{ color: 'red' }}>Error: {authState.error}</div>;
  }

  if (authState.isAuthenticated) {
    return (
      <div>
        <p>Welcome, {authState.user.email}!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" id="login-email"/>
      <input type="password" placeholder="Password" id="login-password"/>
      <button onClick={() => handleLogin((document.getElementById("login-email") as HTMLInputElement).value, (document.getElementById("login-password") as HTMLInputElement).value)}>Login</button>

      <h2>Register</h2>
      <input type="email" placeholder="Email" id="register-email"/>
      <input type="password" placeholder="Password" id="register-password"/>
      <button onClick={() => handleRegistration((document.getElementById("register-email") as HTMLInputElement).value, (document.getElementById("register-password") as HTMLInputElement).value)}>Register</button>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const WrappedUserAuth = () => (
  <ErrorBoundary>
    <UserAuth />
  </ErrorBoundary>
);

export default WrappedUserAuth;

// src/components/UserAuth.tsx
import React, { useState } from 'react';

interface AuthState {
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: any | null; // Replace 'any' with a more specific user type
}

const initialState: AuthState = {
  isLoading: false,
  error: null,
  isAuthenticated: false,
  user: null,
};

const UserAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  const handleLogin = async (email: string, password: string) => {
    setAuthState({ ...authState, isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network latency

      if (email === 'test@example.com' && password === 'password') {
        setAuthState({
          ...authState,
          isLoading: false,
          isAuthenticated: true,
          user: { email: email }, // Replace with actual user data
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error: any) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
        user: null,
      });
    }
  };

  const handleLogout = () => {
    setAuthState({ ...initialState }); // Reset to initial state
  };

  const handleRegistration = async (email: string, password: string) => {
    setAuthState({ ...authState, isLoading: true, error: null });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate user already exists error
      if (email === 'test@example.com') {
        throw new Error('User already exists');
      }

      setAuthState({
        ...authState,
        isLoading: false,
        isAuthenticated: true,
        user: { email: email }, // Replace with actual user data
      });
    } catch (error: any) {
      setAuthState({
        ...authState,
        isLoading: false,
        error: error.message,
        isAuthenticated: false,
        user: null,
      });
    }
  };

  const handleErrorBoundary = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Error boundary caught an error:', error, errorInfo);
    // Log the error to a service like Sentry or Bugsnag
  };

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  if (authState.error) {
    return <div style={{ color: 'red' }}>Error: {authState.error}</div>;
  }

  if (authState.isAuthenticated) {
    return (
      <div>
        <p>Welcome, {authState.user.email}!</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" id="login-email"/>
      <input type="password" placeholder="Password" id="login-password"/>
      <button onClick={() => handleLogin((document.getElementById("login-email") as HTMLInputElement).value, (document.getElementById("login-password") as HTMLInputElement).value)}>Login</button>

      <h2>Register</h2>
      <input type="email" placeholder="Email" id="register-email"/>
      <input type="password" placeholder="Password" id="register-password"/>
      <button onClick={() => handleRegistration((document.getElementById("register-email") as HTMLInputElement).value, (document.getElementById("register-password") as HTMLInputElement).value)}>Register</button>
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const WrappedUserAuth = () => (
  <ErrorBoundary>
    <UserAuth />
  </ErrorBoundary>
);

export default WrappedUserAuth;