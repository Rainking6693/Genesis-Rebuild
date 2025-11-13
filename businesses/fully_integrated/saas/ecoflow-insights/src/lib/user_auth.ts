import React, { FC, useContext, useEffect, useState } from 'react';
import { UserAuthContext } from './UserAuthContext';
import classnames from 'classnames';
import styles from './UserAuth.module.css';

interface Props {
  id: string;
  label: string;
}

interface UserAuthContextData {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserAuthComponent: FC<Props> = ({ id, label }) => {
  const { isAuthenticated, signIn, signOut } = useContext(UserAuthContext);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      form.reportValidity();
      return;
    }

    const email = form.elements.email.value;
    const password = form.elements.password.value;

    try {
      await signIn(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(null), 5000);
    }
  }, [error]);

  return (
    <form onSubmit={handleSignIn} noValidate className={classnames(styles.userAuth, { [styles.error]: error })}>
      <h2>{label}</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <label htmlFor={id}>Email:</label>
      <input type="email" id={id} name="email" required />
      <label htmlFor={`${id}-password`}>Password:</label>
      <input type="password" id={`${id}-password`} name="password" required />
      <button type="submit">{label}</button>
      {isAuthenticated ? <p>You are signed in.</p> : <p>You are not signed in.</p>}
      {isAuthenticated ? (
        <button type="button" onClick={signOut}>
          Sign Out
        </button>
      ) : (
        <></>
      )}
    </form>
  );
};

export const UserAuth = () => {
  return (
    <UserAuthContext.Provider value={{ isAuthenticated: false, signIn: async () => {}, signOut: async () => {} }}>
      <UserAuthComponent id="signIn" label="Sign In" />
    </UserAuthContext.Provider>
  );
};

import React, { FC, useContext, useEffect, useState } from 'react';
import { UserAuthContext } from './UserAuthContext';
import classnames from 'classnames';
import styles from './UserAuth.module.css';

interface Props {
  id: string;
  label: string;
}

interface UserAuthContextData {
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const UserAuthComponent: FC<Props> = ({ id, label }) => {
  const { isAuthenticated, signIn, signOut } = useContext(UserAuthContext);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      form.reportValidity();
      return;
    }

    const email = form.elements.email.value;
    const password = form.elements.password.value;

    try {
      await signIn(email, password);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      setTimeout(() => setError(null), 5000);
    }
  }, [error]);

  return (
    <form onSubmit={handleSignIn} noValidate className={classnames(styles.userAuth, { [styles.error]: error })}>
      <h2>{label}</h2>
      {error && <p className={styles.errorMessage}>{error}</p>}
      <label htmlFor={id}>Email:</label>
      <input type="email" id={id} name="email" required />
      <label htmlFor={`${id}-password`}>Password:</label>
      <input type="password" id={`${id}-password`} name="password" required />
      <button type="submit">{label}</button>
      {isAuthenticated ? <p>You are signed in.</p> : <p>You are not signed in.</p>}
      {isAuthenticated ? (
        <button type="button" onClick={signOut}>
          Sign Out
        </button>
      ) : (
        <></>
      )}
    </form>
  );
};

export const UserAuth = () => {
  return (
    <UserAuthContext.Provider value={{ isAuthenticated: false, signIn: async () => {}, signOut: async () => {} }}>
      <UserAuthComponent id="signIn" label="Sign In" />
    </UserAuthContext.Provider>
  );
};