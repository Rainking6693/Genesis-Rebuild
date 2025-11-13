import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { sanitizeUserInput } from 'security-library';

interface Props {
  message?: string;
  className?: string;
}

const defaultClassName = 'carbon-cred-bot';

const CarbonCredBotErrorBoundary: FC<Props> = ({ children, className }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback((error: Error) => {
    setHasError(true);
    console.error(error);
  }, []);

  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      if (event.target.tagName === 'IMG') return; // Ignore image errors
      handleError(event.error);
    };

    window.addEventListener('error', errorHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, [handleError]);

  if (hasError) {
    return <div>An error occurred: {hasError.message}</div>;
  }

  return <div>{children}</div>;
};

const CarbonCredBot: FC<Props> = React.memo(({ message, className }) => {
  const sanitizedMessage = sanitizeUserInput(message || 'Welcome to CarbonCredBot!');
  const botRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (botRef.current) {
      botRef.current.focus();
    }
  }, [sanitizedMessage]); // Focus only when the message changes

  return (
    <CarbonCredBotErrorBoundary className={className}>
      <div ref={botRef} className="carbon-cred-bot" role="alert" aria-live="polite">
        {sanitizedMessage}
      </div>
    </CarbonCredBotErrorBoundary>
  );
});

CarbonCredBot.defaultProps = {
  className: defaultClassName,
};

export default CarbonCredBot;

Changes made:

1. Added an event check to ignore image errors in the error boundary, as images may throw errors without causing a problem.
2. Focus the component only when the message changes, improving performance.
3. Added a role and aria-live attributes for better accessibility.