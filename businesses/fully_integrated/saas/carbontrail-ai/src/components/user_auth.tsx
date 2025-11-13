export type AuthState = {
  user: string | null;
};

export type AuthAction =
  | { type: 'LOGIN'; payload: string }
  | { type: 'LOGOUT'; payload: null };

import React, { createContext, useReducer } from 'react';
import { AuthState, AuthAction } from './AuthContext';

const initialState: AuthState = {
  user: null,
};

const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const AuthContext = createContext<AuthState>(initialState);

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user: string) => {
    // Perform login logic here, e.g., fetching user data from an API
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    // Perform logout logic here, e.g., clearing user data
    dispatch({ type: 'LOGOUT', payload: null });
  };

  // Add a default value for user to handle cases where AuthProvider is not used
  const value = { user: state.user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

interface Props {
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  // Check if user is null or undefined to handle edge cases
  if (!user) {
    // Redirect to login page or display a message to log in
    return (
      <div>
        Please log in to access this page.
        <button onClick={() => window.location.href = '/login'}>Log In</button>
      </div>
    );
  }

  // Add a logout button for user convenience
  return (
    <>
      {children}
      <button onClick={logout}>Logout</button>
    </>
  );
};

export default MyComponent;

export type AuthState = {
  user: string | null;
};

export type AuthAction =
  | { type: 'LOGIN'; payload: string }
  | { type: 'LOGOUT'; payload: null };

import React, { createContext, useReducer } from 'react';
import { AuthState, AuthAction } from './AuthContext';

const initialState: AuthState = {
  user: null,
};

const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

export const AuthContext = createContext<AuthState>(initialState);

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user: string) => {
    // Perform login logic here, e.g., fetching user data from an API
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    // Perform logout logic here, e.g., clearing user data
    dispatch({ type: 'LOGOUT', payload: null });
  };

  // Add a default value for user to handle cases where AuthProvider is not used
  const value = { user: state.user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

interface Props {
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ children }) => {
  const { user, logout } = useContext(AuthContext);

  // Check if user is null or undefined to handle edge cases
  if (!user) {
    // Redirect to login page or display a message to log in
    return (
      <div>
        Please log in to access this page.
        <button onClick={() => window.location.href = '/login'}>Log In</button>
      </div>
    );
  }

  // Add a logout button for user convenience
  return (
    <>
      {children}
      <button onClick={logout}>Logout</button>
    </>
  );
};

export default MyComponent;

**AuthProvider.tsx**

**MyComponent.tsx**