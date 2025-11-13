import React, { FC, useContext, useEffect, useState } from 'react';
import { UserAuthContext } from './UserAuthContext';
import classnames from 'classnames';
import styles from './UserAuth.module.css';

interface Props {
  errorMessage?: string;
}

const UserAuthComponent: FC<Props> = ({ errorMessage }) => {
  const { user, signIn, signOut, error } = useContext(UserAuthContext);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  const handleSignIn = () => {
    signIn();
    setShowError(false);
  };

  const handleSignOut = () => {
    signOut();
    setShowError(false);
  };

  const errorClasses = classnames(styles.error, {
    [styles.visible]: showError,
  });

  return (
    <div className={styles.userAuth}>
      {user ? (
        <button className={styles.signOut} onClick={handleSignOut}>
          Sign Out
        </button>
      ) : (
        <button className={styles.signIn} onClick={handleSignIn}>
          Sign In
        </button>
      )}
      {errorMessage && <p className={styles.customError}>{errorMessage}</p>}
      <div className={errorClasses}>{error?.message || 'An error occurred'}</div>
    </div>
  );
};

export default UserAuthComponent;

import React, { FC, useContext, useEffect, useState } from 'react';
import { UserAuthContext } from './UserAuthContext';
import classnames from 'classnames';
import styles from './UserAuth.module.css';

interface Props {
  errorMessage?: string;
}

const UserAuthComponent: FC<Props> = ({ errorMessage }) => {
  const { user, signIn, signOut, error } = useContext(UserAuthContext);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  const handleSignIn = () => {
    signIn();
    setShowError(false);
  };

  const handleSignOut = () => {
    signOut();
    setShowError(false);
  };

  const errorClasses = classnames(styles.error, {
    [styles.visible]: showError,
  });

  return (
    <div className={styles.userAuth}>
      {user ? (
        <button className={styles.signOut} onClick={handleSignOut}>
          Sign Out
        </button>
      ) : (
        <button className={styles.signIn} onClick={handleSignIn}>
          Sign In
        </button>
      )}
      {errorMessage && <p className={styles.customError}>{errorMessage}</p>}
      <div className={errorClasses}>{error?.message || 'An error occurred'}</div>
    </div>
  );
};

export default UserAuthComponent;