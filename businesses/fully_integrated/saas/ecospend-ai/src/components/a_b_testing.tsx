import React, { useState, useEffect, useRef } from 'react';
import { useA/BTesting } from '@ecospend-ai/feature-flags';

interface Props {
  message: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'Default Message' }) => {
  const [version, setVersion] = useState<boolean | null>(null);
  const subscriptionRef = useRef<ReturnType<typeof useA/BTesting> | null>(null);

  useEffect(() => {
    if (!subscriptionRef.current) {
      subscriptionRef.current = useA/BTesting('expenseTrackingABTest', handleVersionChange);

      // Unsubscribe on component unmount
      return () => {
        subscriptionRef.current?.unsubscribe();
        subscriptionRef.current = null;
      };
    }
  }, []);

  const handleVersionChange = (isAVersion: boolean) => {
    setVersion(isAVersion);
  };

  if (version === null) {
    return <div>Loading...</div>;
  }

  return (
    <div data-testid="my-component" role="presentation">
      {version ? (
        <>
          <p>Version A: {message}</p>
          <span aria-hidden={true}>{message}</span>
          <span aria-label="Version">A</span>
        </>
      ) : (
        <>
          <p>Version B: {message}</p>
          <span aria-hidden={true}>{message}</span>
          <span aria-label="Version">B</span>
        </>
      )}
    </div>
  );
};

export default MyComponent;

import React, { useState, useEffect, useRef } from 'react';
import { useA/BTesting } from '@ecospend-ai/feature-flags';

interface Props {
  message: string;
  fallbackMessage?: string;
}

const MyComponent: React.FC<Props> = ({ message, fallbackMessage = 'Default Message' }) => {
  const [version, setVersion] = useState<boolean | null>(null);
  const subscriptionRef = useRef<ReturnType<typeof useA/BTesting> | null>(null);

  useEffect(() => {
    if (!subscriptionRef.current) {
      subscriptionRef.current = useA/BTesting('expenseTrackingABTest', handleVersionChange);

      // Unsubscribe on component unmount
      return () => {
        subscriptionRef.current?.unsubscribe();
        subscriptionRef.current = null;
      };
    }
  }, []);

  const handleVersionChange = (isAVersion: boolean) => {
    setVersion(isAVersion);
  };

  if (version === null) {
    return <div>Loading...</div>;
  }

  return (
    <div data-testid="my-component" role="presentation">
      {version ? (
        <>
          <p>Version A: {message}</p>
          <span aria-hidden={true}>{message}</span>
          <span aria-label="Version">A</span>
        </>
      ) : (
        <>
          <p>Version B: {message}</p>
          <span aria-hidden={true}>{message}</span>
          <span aria-label="Version">B</span>
        </>
      )}
    </div>
  );
};

export default MyComponent;