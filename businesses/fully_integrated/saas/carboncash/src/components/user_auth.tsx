import React, { FC, useContext, useEffect, useState } from 'react';
import { UserAuthContext } from './UserAuthContext';
import classnames from 'classnames';
import styles from './UserAuth.module.css';

interface Props {
  errorMessage?: string;
}

const MyComponent: FC<Props> = ({ errorMessage }) => {
  const { user, signIn, signOut } = useContext(UserAuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    signIn()
      .then(() => {
        // Handle successful sign-in
      })
      .catch((error) => {
        // Handle sign-in error
      })
      .finally(() => setIsLoading(false));
  };

  const handleSignOut = () => {
    setIsLoading(true);
    signOut()
      .then(() => {
        // Handle successful sign-out
      })
      .catch((error) => {
        // Handle sign-out error
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (user) {
      // Perform any actions when user is signed in
    }
  }, [user]);

  return (
    <div className={classnames(styles.userAuth, { [styles.error]: errorMessage })}>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <>
          <p>Please sign in to continue.</p>
          <button onClick={handleSignIn} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
        </>
      )}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default MyComponent;

import React, { FC, useContext, useEffect, useState } from 'react';
import { UserAuthContext } from './UserAuthContext';
import classnames from 'classnames';
import styles from './UserAuth.module.css';

interface Props {
  errorMessage?: string;
}

const MyComponent: FC<Props> = ({ errorMessage }) => {
  const { user, signIn, signOut } = useContext(UserAuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    setIsLoading(true);
    signIn()
      .then(() => {
        // Handle successful sign-in
      })
      .catch((error) => {
        // Handle sign-in error
      })
      .finally(() => setIsLoading(false));
  };

  const handleSignOut = () => {
    setIsLoading(true);
    signOut()
      .then(() => {
        // Handle successful sign-out
      })
      .catch((error) => {
        // Handle sign-out error
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (user) {
      // Perform any actions when user is signed in
    }
  }, [user]);

  return (
    <div className={classnames(styles.userAuth, { [styles.error]: errorMessage })}>
      {user ? (
        <>
          <p>Welcome, {user.name}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <>
          <p>Please sign in to continue.</p>
          <button onClick={handleSignIn} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Sign In'}
          </button>
        </>
      )}
      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
    </div>
  );
};

export default MyComponent;