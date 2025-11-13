import React, { FC, useEffect, useState, useRef, useImperativeHandle } from 'react';

interface Props {
  message?: string;
  ref?: React.RefObject<HTMLDivElement>;
}

interface ErrorInfo {
  message: string;
  stack: string;
}

interface BotInstance {
  logError: (error: Error) => void;
}

const CustomerSupportBot: FC<Props> = ({ message, ref }) => {
  const [error, setError] = useState<ErrorInfo | null>(null);
  const memoirRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isMounted = memoirRef.current !== null;

    if (error && isMounted) {
      // Log the error to a remote logging service like Sentry
      // ...
    }
  }, [error]);

  useImperativeHandle(ref, () => ({
    logError: handleError,
  }));

  const handleError = (error: Error) => {
    setError({ message: error.message, stack: error.stack });
  };

  return (
    <div
      ref={memoirRef}
      data-testid="customer-support-bot"
      role="application"
      aria-label="Customer Support Bot"
      className="customer-support-bot"
    >
      {message || 'No message provided'}
      {error && (
        <div role="alert">
          <p>Error:</p>
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
        </div>
      )}
    </div>
  );
};

CustomerSupportBot.displayName = 'CustomerSupportBot';
CustomerSupportBot.error = handleError;

const MemoizedCustomerSupportBot = React.memo(CustomerSupportBot, (prevProps, nextProps) => {
  if (prevProps.message === nextProps.message && prevProps.ref === nextProps.ref) {
    return true;
  }

  return false;
});

export default MemoizedCustomerSupportBot;

import React, { FC, useEffect, useState, useRef, useImperativeHandle } from 'react';

interface Props {
  message?: string;
  ref?: React.RefObject<HTMLDivElement>;
}

interface ErrorInfo {
  message: string;
  stack: string;
}

interface BotInstance {
  logError: (error: Error) => void;
}

const CustomerSupportBot: FC<Props> = ({ message, ref }) => {
  const [error, setError] = useState<ErrorInfo | null>(null);
  const memoirRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const isMounted = memoirRef.current !== null;

    if (error && isMounted) {
      // Log the error to a remote logging service like Sentry
      // ...
    }
  }, [error]);

  useImperativeHandle(ref, () => ({
    logError: handleError,
  }));

  const handleError = (error: Error) => {
    setError({ message: error.message, stack: error.stack });
  };

  return (
    <div
      ref={memoirRef}
      data-testid="customer-support-bot"
      role="application"
      aria-label="Customer Support Bot"
      className="customer-support-bot"
    >
      {message || 'No message provided'}
      {error && (
        <div role="alert">
          <p>Error:</p>
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
        </div>
      )}
    </div>
  );
};

CustomerSupportBot.displayName = 'CustomerSupportBot';
CustomerSupportBot.error = handleError;

const MemoizedCustomerSupportBot = React.memo(CustomerSupportBot, (prevProps, nextProps) => {
  if (prevProps.message === nextProps.message && prevProps.ref === nextProps.ref) {
    return true;
  }

  return false;
});

export default MemoizedCustomerSupportBot;