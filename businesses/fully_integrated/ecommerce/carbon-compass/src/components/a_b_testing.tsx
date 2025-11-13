import React, { useState, useEffect } from 'react';
import { useA/BTesting } from '@carbon-compass/feature-flags';

interface Props {
  messageA: string;
  messageB: string;
  fallbackMessage?: string;
  fallbackVariant?: string;
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, fallbackMessage = 'Loading...', fallbackVariant = 'Loading...' }) => {
  const [variant, setVariant] = useState(fallbackVariant);
  const { isLoading, error } = useA/BTesting('carbon-compass-abtest-1');

  useEffect(() => {
    if (!isLoading && !error) {
      setVariant(isLoading ? fallbackVariant : (is => is === 'A' ? messageA : messageB))
    }
  }, [isLoading, error, messageA, messageB]);

  if (isLoading) {
    return <div>{variant}</div>;
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div>
      {variant === 'A' ? (
        <>
          {messageA}
          <a href="#" aria-label={`Read more about message A`}>Read more</a>
        </>
      ) : (
        <>
          {messageB}
          <a href="#" aria-label={`Read more about message B`}>Read more</a>
        </>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect } from 'react';
import { useA/BTesting } from '@carbon-compass/feature-flags';

interface Props {
  messageA: string;
  messageB: string;
  fallbackMessage?: string;
  fallbackVariant?: string;
}

const MyComponent: React.FC<Props> = ({ messageA, messageB, fallbackMessage = 'Loading...', fallbackVariant = 'Loading...' }) => {
  const [variant, setVariant] = useState(fallbackVariant);
  const { isLoading, error } = useA/BTesting('carbon-compass-abtest-1');

  useEffect(() => {
    if (!isLoading && !error) {
      setVariant(isLoading ? fallbackVariant : (is => is === 'A' ? messageA : messageB))
    }
  }, [isLoading, error, messageA, messageB]);

  if (isLoading) {
    return <div>{variant}</div>;
  }

  if (error) {
    return <div>An error occurred: {error.message}</div>;
  }

  return (
    <div>
      {variant === 'A' ? (
        <>
          {messageA}
          <a href="#" aria-label={`Read more about message A`}>Read more</a>
        </>
      ) : (
        <>
          {messageB}
          <a href="#" aria-label={`Read more about message B`}>Read more</a>
        </>
      )}
    </div>
  );
};

export default MyComponent;