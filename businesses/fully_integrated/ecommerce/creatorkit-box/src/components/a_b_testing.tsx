import React, { useEffect, useRef } from 'react';
import { useA/BTesting } from '../../../services/aBTesting';

interface Props {
  message: string;
  id: string;
  fallbackMessage?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, id, fallbackMessage = 'Default content', ariaLabel }) => {
  const { variant, isLoading, error } = useA/BTesting(id);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!variant && !isLoading && error) {
      console.error(`Error while fetching variant for test ${id}: ${error}`);
      if (errorRef.current) {
        errorRef.current.focus();
      }
    }
  }, [variant, isLoading, error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!variant && !isLoading && !!fallbackMessage) {
    return <div>{fallbackMessage}</div>;
  }

  if (!variant) {
    return (
      <div ref={errorRef}>
        <div>An error occurred while fetching the variant for test {id}</div>
      </div>
    );
  }

  return (
    <div aria-label={ariaLabel}>
      {variant === 'A' ? (
        message
      ) : (
        <div role="alert">
          Exclusive content for variant B: {message}
        </div>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useEffect, useRef } from 'react';
import { useA/BTesting } from '../../../services/aBTesting';

interface Props {
  message: string;
  id: string;
  fallbackMessage?: string;
  ariaLabel?: string;
}

const MyComponent: React.FC<Props> = ({ message, id, fallbackMessage = 'Default content', ariaLabel }) => {
  const { variant, isLoading, error } = useA/BTesting(id);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!variant && !isLoading && error) {
      console.error(`Error while fetching variant for test ${id}: ${error}`);
      if (errorRef.current) {
        errorRef.current.focus();
      }
    }
  }, [variant, isLoading, error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!variant && !isLoading && !!fallbackMessage) {
    return <div>{fallbackMessage}</div>;
  }

  if (!variant) {
    return (
      <div ref={errorRef}>
        <div>An error occurred while fetching the variant for test {id}</div>
      </div>
    );
  }

  return (
    <div aria-label={ariaLabel}>
      {variant === 'A' ? (
        message
      ) : (
        <div role="alert">
          Exclusive content for variant B: {message}
        </div>
      )}
    </div>
  );
};

export default MyComponent;