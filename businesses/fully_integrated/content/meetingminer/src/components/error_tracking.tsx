import React, { FC, ReactNode, useState } from 'react';

interface Props {
  errorMessage: string; // Changed to errorMessage for better naming convention
  errorType?: string; // Added errorType to handle different error types
  isVisible?: boolean; // Added isVisible to control visibility of the error component
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorType, isVisible = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(errorMessage);
    setCopied(true);
  };

  if (!isVisible) return null; // Exit early if the error component is not visible

  const errorClassName = `error-message ${errorType ? `error-type-${errorType}` : ''}`; // Added errorType class for styling

  return (
    <div className={errorClassName} role="alert">
      <div>
        {errorMessage}
        <button onClick={handleCopyClick}>
          {copied ? 'Copied!' : 'Copy Error'}
        </button>
      </div>
      <span className="sr-only">Error occurred</span>
    </div>
  );
};

ErrorComponent.displayName = 'ErrorComponent'; // Added displayName for better debugging

export default ErrorComponent;

import React, { FC, ReactNode, useState } from 'react';

interface Props {
  errorMessage: string; // Changed to errorMessage for better naming convention
  errorType?: string; // Added errorType to handle different error types
  isVisible?: boolean; // Added isVisible to control visibility of the error component
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorType, isVisible = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(errorMessage);
    setCopied(true);
  };

  if (!isVisible) return null; // Exit early if the error component is not visible

  const errorClassName = `error-message ${errorType ? `error-type-${errorType}` : ''}`; // Added errorType class for styling

  return (
    <div className={errorClassName} role="alert">
      <div>
        {errorMessage}
        <button onClick={handleCopyClick}>
          {copied ? 'Copied!' : 'Copy Error'}
        </button>
      </div>
      <span className="sr-only">Error occurred</span>
    </div>
  );
};

ErrorComponent.displayName = 'ErrorComponent'; // Added displayName for better debugging

export default ErrorComponent;