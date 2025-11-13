import React, { forwardRef, useId } from 'react';
import DOMPurify from 'dompurify';

interface ReportingEngineMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  isError?: boolean;
  testID?: string;
  className?: string;
}

const ReportingEngineMessage = forwardRef<HTMLDivElement, ReportingEngineMessageProps>(({ message, isError = false, className = 'reporting-engine-message', testID, ...props }, ref) => {
  const id = useId();
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  if (!ref) {
    console.error('Ref is not provided for ReportingEngineMessage');
    return null;
  }

  if (!message || message.trim() === '') {
    return <div ref={ref} className={className} data-testid={testID} {...props} />;
  }

  return (
    <div id={id} ref={ref} className={`${className} ${isError ? 'error' : ''}`} data-testid={testID} data-is-error={isError} {...props}>
      {isError && (
        <span
          className="error-indicator"
          role="alert"
          aria-live="assertive"
          aria-hidden={false}
          tabIndex={0}
        >
          !
        </span>
      )}
      <span dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
});

export { ReportingEngineMessage };

import React, { forwardRef, useId } from 'react';
import DOMPurify from 'dompurify';

interface ReportingEngineMessageProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  isError?: boolean;
  testID?: string;
  className?: string;
}

const ReportingEngineMessage = forwardRef<HTMLDivElement, ReportingEngineMessageProps>(({ message, isError = false, className = 'reporting-engine-message', testID, ...props }, ref) => {
  const id = useId();
  const sanitizedMessage = DOMPurify.sanitize(message || '');

  if (!ref) {
    console.error('Ref is not provided for ReportingEngineMessage');
    return null;
  }

  if (!message || message.trim() === '') {
    return <div ref={ref} className={className} data-testid={testID} {...props} />;
  }

  return (
    <div id={id} ref={ref} className={`${className} ${isError ? 'error' : ''}`} data-testid={testID} data-is-error={isError} {...props}>
      {isError && (
        <span
          className="error-indicator"
          role="alert"
          aria-live="assertive"
          aria-hidden={false}
          tabIndex={0}
        >
          !
        </span>
      )}
      <span dangerouslySetInnerHTML={{ __html: sanitizedMessage }} />
    </div>
  );
});

export { ReportingEngineMessage };