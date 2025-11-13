import React, { FC, ReactElement } from 'react';

interface Props {
  message: string;
  error?: Error | null;
  loading?: boolean;
}

const MyComponent: FC<Props> = ({ message, error, loading = false }): ReactElement => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>An error occurred:</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  return <div>{message}</div>;
};

MyComponent.defaultProps = {
  loading: false,
};

export default MyComponent;

import React, { FC, ReactElement } from 'react';

interface Props {
  message: string;
  error?: Error | null;
  loading?: boolean;
}

const MyComponent: FC<Props> = ({ message, error, loading = false }): ReactElement => {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div role="alert">
        <p>An error occurred:</p>
        <pre>{error.message}</pre>
      </div>
    );
  }

  return <div>{message}</div>;
};

MyComponent.defaultProps = {
  loading: false,
};

export default MyComponent;