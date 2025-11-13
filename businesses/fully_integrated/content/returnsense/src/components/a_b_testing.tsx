import React, { FunctionComponent, ReactErrorProps, ReactNode, useEffect, useState } from 'react';

interface Props extends ReactErrorProps {
  message: string;
}

const MyComponent: FunctionComponent<Props> = ({ message, error }) => {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  }, [error]);

  return (
    <div>
      {/* Add aria-label for accessibility */}
      <div dangerouslySetInnerHTML={{ __html: message }} aria-label={message} />
      {errorMessage && <div>An error occurred: {errorMessage}</div>}
    </div>
  );
};

// Optimize performance by memoizing the component
import { memo } from 'react';
export default memo(MyComponent);

import React, { FunctionComponent, ReactErrorProps, ReactNode, useEffect, useState } from 'react';

interface Props extends ReactErrorProps {
  message: string;
}

const MyComponent: FunctionComponent<Props> = ({ message, error }) => {
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  }, [error]);

  return (
    <div>
      {/* Add aria-label for accessibility */}
      <div dangerouslySetInnerHTML={{ __html: message }} aria-label={message} />
      {errorMessage && <div>An error occurred: {errorMessage}</div>}
    </div>
  );
};

// Optimize performance by memoizing the component
import { memo } from 'react';
export default memo(MyComponent);