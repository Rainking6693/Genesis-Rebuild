// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify'; // Example: Using AWS Amplify for Auth

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

const UserAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setAuthState({
        isAuthenticated: true,
        user: user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message || "Not signed in",
      });
    }
  }

  async function signUp(username: string, password: string, email: string) {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,          // optional - if you need to verify the email
        },
      });
      console.log('sign up success!');
      return true; // Indicate success
    } catch (error: any) {
      console.log('error signing up:', error);
      setAuthState(prevState => ({...prevState, error: error.message}));
      return false; // Indicate failure
    }
  }

  async function confirmSignUp(username: string, confirmationCode: string) {
    try {
      await Auth.confirmSignUp(username, confirmationCode);
      console.log('confirm sign up success!');
      return true;
    } catch (error: any) {
      console.log('error confirming sign up', error);
      setAuthState(prevState => ({...prevState, error: error.message}));
      return false;
    }
  }

  async function signIn(username: string, password: string) {
    try {
      await Auth.signIn(username, password);
      console.log('sign in success!');
      await checkUser(); // Update auth state after sign-in
      return true;
    } catch (error: any) {
      console.log('error signing in', error);
      setAuthState(prevState => ({...prevState, error: error.message}));
      return false;
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.log('error signing out: ', error);
      setAuthState(prevState => ({...prevState, error: error.message}));
    }
  }

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  if (authState.error) {
    return <div>Error: {authState.error}</div>;
  }

  return (
    <div>
      {authState.isAuthenticated ? (
        <div>
          <p>Welcome, {authState.user.username}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <p>Please sign in or sign up.</p>
          {/* Add sign-in and sign-up forms here */}
          {/* Example: */}
          {/* <SignInForm onSignIn={signIn} /> */}
          {/* <SignUpForm onSignUp={signUp} /> */}
        </div>
      )}
    </div>
  );
};

export default UserAuth;

// src/components/UserAuth.tsx
import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify'; // Example: Using AWS Amplify for Auth

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  isLoading: boolean;
  error: string | null;
}

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

const UserAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setAuthState({
        isAuthenticated: true,
        user: user,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: error.message || "Not signed in",
      });
    }
  }

  async function signUp(username: string, password: string, email: string) {
    try {
      await Auth.signUp({
        username,
        password,
        attributes: {
          email,          // optional - if you need to verify the email
        },
      });
      console.log('sign up success!');
      return true; // Indicate success
    } catch (error: any) {
      console.log('error signing up:', error);
      setAuthState(prevState => ({...prevState, error: error.message}));
      return false; // Indicate failure
    }
  }

  async function confirmSignUp(username: string, confirmationCode: string) {
    try {
      await Auth.confirmSignUp(username, confirmationCode);
      console.log('confirm sign up success!');
      return true;
    } catch (error: any) {
      console.log('error confirming sign up', error);
      setAuthState(prevState => ({...prevState, error: error.message}));
      return false;
    }
  }

  async function signIn(username: string, password: string) {
    try {
      await Auth.signIn(username, password);
      console.log('sign in success!');
      await checkUser(); // Update auth state after sign-in
      return true;
    } catch (error: any) {
      console.log('error signing in', error);
      setAuthState(prevState => ({...prevState, error: error.message}));
      return false;
    }
  }

  async function signOut() {
    try {
      await Auth.signOut();
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.log('error signing out: ', error);
      setAuthState(prevState => ({...prevState, error: error.message}));
    }
  }

  if (authState.isLoading) {
    return <div>Loading...</div>;
  }

  if (authState.error) {
    return <div>Error: {authState.error}</div>;
  }

  return (
    <div>
      {authState.isAuthenticated ? (
        <div>
          <p>Welcome, {authState.user.username}!</p>
          <button onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <div>
          <p>Please sign in or sign up.</p>
          {/* Add sign-in and sign-up forms here */}
          {/* Example: */}
          {/* <SignInForm onSignIn={signIn} /> */}
          {/* <SignUpForm onSignUp={signUp} /> */}
        </div>
      )}
    </div>
  );
};

export default UserAuth;