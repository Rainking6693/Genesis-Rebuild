import React, { FC, useEffect, useState } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
  errorId?: string; // Add optional errorId for better tracking
  onCopy?: () => void; // Add optional onCopy callback for custom handling
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorId, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(errorMessage);
    setCopied(true);
    onCopy && onCopy();
  };

  useEffect(() => {
    // Add a unique key for each error instance to prevent duplicate IDs
    const uniqueKey = errorId || Math.random().toString();
    document.body.setAttribute('data-error-id', uniqueKey);

    // Clean up the unique key when the component unmounts
    return () => {
      document.body.removeAttribute('data-error-id');
    };
  }, [errorId]);

  return (
    <div className="error-message" role="alert" aria-describedby={`error-id-${errorId || 'unknown'}`}>
      <div className="error-message-content">
        <p>{errorMessage}</p>
        {/* Add a copy button for easier error reporting */}
        <button onClick={handleCopyClick}>
          {copied ? 'Copied!' : 'Copy Error'}
        </button>
      </div>
      {/* Add a screen reader-only message with the error ID for better accessibility */}
      <div id={`error-id-${errorId || 'unknown'}`} className="error-message-sr-only">Error ID: {errorId || 'Unknown Error'}</div>
    </div>
  );
};

// Add a unique component name for better debugging and accessibility
ErrorComponent.displayName = 'ShopSageAIErrorComponent';

// Export the default and named export for better compatibility with different import styles
export { ErrorComponent as default };
export { ErrorComponent };

In this updated version, I've added an optional `onCopy` callback for custom handling when the error message is copied. Additionally, I've cleaned up the unique key when the component unmounts to prevent memory leaks. I've also added an `aria-describedby` attribute to the error message container to associate the screen reader-only error ID message with the error message.