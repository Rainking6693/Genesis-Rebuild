import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  error?: Error | null;
  isLoading?: boolean;
}

const MyComponent: FC<Props> = ({ message, error, isLoading }) => {
  const [localMessage, setLocalMessage] = useState(message);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('');
    }
    setLocalMessage(message);
  }, [message, error]);

  const loadingClassName = isLoading ? 'loading' : '';
  const errorClassName = error ? 'error' : '';

  return (
    <div className={`MyComponent ${loadingClassName} ${errorClassName}`}>
      {isLoading && <div>Loading...</div>}
      {error && (
        <div role="alert" aria-live="polite">
          <p>An error occurred: {errorMessage}</p>
        </div>
      )}
      <div>{localMessage}</div>
      <div aria-hidden={!error} tabIndex={-1}>
        Read more about this feature here.
      </div>
    </div>
  );
};

export { MyComponent };

import React, { FC, useEffect, useState } from 'react';

interface Props {
  message: string;
  error?: Error | null;
  isLoading?: boolean;
}

const MyComponent: FC<Props> = ({ message, error, isLoading }) => {
  const [localMessage, setLocalMessage] = useState(message);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      setErrorMessage(error.message);
    } else {
      setErrorMessage('');
    }
    setLocalMessage(message);
  }, [message, error]);

  const loadingClassName = isLoading ? 'loading' : '';
  const errorClassName = error ? 'error' : '';

  return (
    <div className={`MyComponent ${loadingClassName} ${errorClassName}`}>
      {isLoading && <div>Loading...</div>}
      {error && (
        <div role="alert" aria-live="polite">
          <p>An error occurred: {errorMessage}</p>
        </div>
      )}
      <div>{localMessage}</div>
      <div aria-hidden={!error} tabIndex={-1}>
        Read more about this feature here.
      </div>
    </div>
  );
};

export { MyComponent };