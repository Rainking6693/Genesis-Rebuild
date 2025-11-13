import React, { ReactNode, forwardRef, useState } from 'react';

interface AuditLogProps {
  timestamp?: Date;
  action?: string;
  user?: string;
  message?: string;
  error?: boolean;
  onErrorReset?: () => void;
}

const AuditLog: React.ForwardRefRenderFunction<HTMLDivElement, AuditLogProps> = (
  { timestamp, action, user, message, error, onErrorReset },
  ref
) => {
  const [hasError, setHasError] = useState(error);

  const handleErrorReset = () => {
    setHasError(false);
    onErrorReset?.();
  };

  if (hasError) {
    return (
      <div className="error" ref={ref}>
        <p>Error: An unexpected error occurred while processing this audit log.</p>
        {onErrorReset && (
          <button onClick={handleErrorReset}>Reset Error</button>
        )}
      </div>
    );
  }

  return (
    <div ref={ref}>
      <p>Timestamp: {timestamp ? timestamp.toLocaleString() : 'N/A'}</p>
      <p>Action: {action || 'N/A'}</p>
      <p>User: {user || 'N/A'}</p>
      <p>Message: {message || 'N/A'}</p>
    </div>
  );
};

// Added accessibility improvements by wrapping the component with a div and adding aria-labels
export const AccessibleAuditLog = (props: AuditLogProps) => (
  <div>
    <div role="region" aria-label="Audit Log">
      <AuditLog {...props} />
    </div>
  </div>
);

export default AccessibleAuditLog;

Now the component is more resilient, handles edge cases, is more accessible, and is more maintainable. The `onErrorReset` prop allows developers to provide a function to reset the error state, and the component now handles null or undefined values for the `timestamp`, `action`, `user`, and `message` properties by providing default values.