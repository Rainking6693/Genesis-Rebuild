import React, { FC, useContext, useState } from 'react';
import { UserAuthContext } from './UserAuthContext';
import classnames from 'classnames';
import styles from './UserAuth.module.css';

interface Props {
  id: string;
  label: string;
}

interface UserAuthContextData {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}

const UserAuthComponent: FC<Props> = ({ id, label }) => {
  const { isAuthenticated, signIn, signOut } = useContext(UserAuthContext);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (isAuthenticated) {
      signOut();
    } else {
      signIn().catch((error) => setError(error.message));
    }
  };

  const buttonClasses = classnames(styles.userAuthButton, {
    [styles.userAuthButtonError]: Boolean(error),
  });

  return (
    <div className={styles.userAuth}>
      <button className={buttonClasses} onClick={handleClick}>
        {label}
        {error && <span className={styles.userAuthError}>{error}</span>}
      </button>
    </div>
  );
};

export const UserAuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = () => {
    // Implement sign-in logic here
    // ...
    setIsAuthenticated(true);
  };

  const signOut = () => {
    // Implement sign-out logic here
    // ...
    setIsAuthenticated(false);
  };

  return (
    <UserAuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const UserAuthContext = React.createContext<UserAuthContextData>({} as UserAuthContextData);

import React from 'react';
import { UserAuthProvider } from './UserAuth';
import App from './App';

const AppWrapper = () => {
  return (
    <UserAuthProvider>
      <App />
    </UserAuthProvider>
  );
};

export default AppWrapper;

import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './AppWrapper';

ReactDOM.render(<AppWrapper />, document.getElementById('root'));

import React, { FC, useContext, useState } from 'react';
import { UserAuthContext } from './UserAuthContext';
import classnames from 'classnames';
import styles from './UserAuth.module.css';

interface Props {
  id: string;
  label: string;
}

interface UserAuthContextData {
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
}

const UserAuthComponent: FC<Props> = ({ id, label }) => {
  const { isAuthenticated, signIn, signOut } = useContext(UserAuthContext);
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    if (isAuthenticated) {
      signOut();
    } else {
      signIn().catch((error) => setError(error.message));
    }
  };

  const buttonClasses = classnames(styles.userAuthButton, {
    [styles.userAuthButtonError]: Boolean(error),
  });

  return (
    <div className={styles.userAuth}>
      <button className={buttonClasses} onClick={handleClick}>
        {label}
        {error && <span className={styles.userAuthError}>{error}</span>}
      </button>
    </div>
  );
};

export const UserAuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = () => {
    // Implement sign-in logic here
    // ...
    setIsAuthenticated(true);
  };

  const signOut = () => {
    // Implement sign-out logic here
    // ...
    setIsAuthenticated(false);
  };

  return (
    <UserAuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </UserAuthContext.Provider>
  );
};

export const UserAuthContext = React.createContext<UserAuthContextData>({} as UserAuthContextData);

import React from 'react';
import { UserAuthProvider } from './UserAuth';
import App from './App';

const AppWrapper = () => {
  return (
    <UserAuthProvider>
      <App />
    </UserAuthProvider>
  );
};

export default AppWrapper;

import React from 'react';
import ReactDOM from 'react-dom';
import AppWrapper from './AppWrapper';

ReactDOM.render(<AppWrapper />, document.getElementById('root'));

In this updated code, I've added a `UserAuthContext` to manage the authentication state and provided functions for signing in and out. The `UserAuthComponent` now uses the context to check the authentication state and handle sign-in and sign-out actions. I've also added error handling for the sign-in action and styled the component using CSS modules for better maintainability.

To use this updated component, you would need to wrap your application with the `UserAuthContextProvider`:

Then, in your main entry point, you can use the `AppWrapper` instead of the `App` component: