import React, { FC, useContext } from 'react';
import { UserAuthContext } from './UserAuthContext';
import classnames from 'classnames';

interface Props {
  className?: string;
}

interface UserAuthContextData {
  isAuthenticated: boolean;
  error?: string;
  loading: boolean;
}

const MyComponent: FC<Props> = ({ className }) => {
  const { isAuthenticated, error, loading } = useContext(UserAuthContext);

  const message = (
    <>
      {loading && <span>Loading...</span>}
      {isAuthenticated ? (
        <span>Welcome!</span>
      ) : (
        <>
          {error && <span className="error">{error}</span>}
          <span>Please log in to continue.</span>
        </>
      )}
    </>
  );

  return <div className={classnames('user-auth', className)}>{message}</div>;
};

export default MyComponent;

import React, { FC, useContext } from 'react';
import { UserAuthContext } from './UserAuthContext';
import classnames from 'classnames';

interface Props {
  className?: string;
}

interface UserAuthContextData {
  isAuthenticated: boolean;
  error?: string;
  loading: boolean;
}

const MyComponent: FC<Props> = ({ className }) => {
  const { isAuthenticated, error, loading } = useContext(UserAuthContext);

  const message = (
    <>
      {loading && <span>Loading...</span>}
      {isAuthenticated ? (
        <span>Welcome!</span>
      ) : (
        <>
          {error && <span className="error">{error}</span>}
          <span>Please log in to continue.</span>
        </>
      )}
    </>
  );

  return <div className={classnames('user-auth', className)}>{message}</div>;
};

export default MyComponent;