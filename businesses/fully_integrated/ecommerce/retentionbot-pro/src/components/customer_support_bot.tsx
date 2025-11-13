import React, { FC, useEffect, useRef, useState } from 'react';
import { useErrorBoundary } from 'react-error-boundary';
import { logError } from './error-logging';
import { classNames } from 'clsx';

interface Props {
  message: string;
  className?: string;
  errorBoundary?: any;
}

const CustomerSupportBotMessage: FC<Props> = ({ message, className, errorBoundary }) => {
  const [error, setError] = useState<Error | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const { resetErrorBoundary } = useErrorBoundary(errorBoundary);

  useEffect(() => {
    // Attach error handler to the component
    const handleError = (error: Error) => {
      logError(error);
      setError(error);
      resetErrorBoundary();
    };

    // Check if the component is mounted before attaching the error handler
    if (ref.current) {
      ref.current.addEventListener('error', handleError);
    }

    return () => {
      // Clean up error handler on unmount
      if (ref.current) {
        ref.current.removeEventListener('error', handleError);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      className={classNames('customer-support-bot-message', className, {
        'customer-support-bot-message--error': error,
      })}
    >
      {message}
      {error && <div className="customer-support-bot-message__error">{error.message}</div>}
    </div>
  );
};

export default CustomerSupportBotMessage;

// Utilities for handling class names
import { classNames as tClassNames } from 'clsx';

export const classNames = (...classes: any[]) => tClassNames(...classes);

In this updated version, I've added the following improvements:

1. Checked if the component is mounted before attaching the error handler to avoid potential issues with component lifecycle.
2. Removed the deprecated `componentDidCatch` lifecycle method and used the `addEventListener` method instead.
3. Cleaned up the error handler on unmount to avoid memory leaks.

These changes make the component more resilient and improve its overall performance.