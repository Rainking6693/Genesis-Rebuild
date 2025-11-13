import React, { FC, ReactNode, useState } from 'react';

interface Props {
  errorMessage: string; // Rename 'message' to 'errorMessage' for better semantics
  errorType?: string; // Add errorType to provide more context about the error
  isVisible?: boolean; // Add isVisible to control the visibility of the error component
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorType, isVisible = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(errorMessage);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (!isVisible) {
    return null; // Return null if the error component is not visible
  }

  return (
    <div className="error-message" role="alert">
      <div className="error-content">
        <p>{errorMessage}</p>
        {errorType && <span className="error-type"> ({errorType})</span>}
      </div>
      <button className="copy-button" onClick={handleCopy} aria-label="Copy error message">
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default ErrorComponent;

import React, { FC, ReactNode, useState } from 'react';

interface Props {
  errorMessage: string; // Rename 'message' to 'errorMessage' for better semantics
  errorType?: string; // Add errorType to provide more context about the error
  isVisible?: boolean; // Add isVisible to control the visibility of the error component
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorType, isVisible = true }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(errorMessage);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  if (!isVisible) {
    return null; // Return null if the error component is not visible
  }

  return (
    <div className="error-message" role="alert">
      <div className="error-content">
        <p>{errorMessage}</p>
        {errorType && <span className="error-type"> ({errorType})</span>}
      </div>
      <button className="copy-button" onClick={handleCopy} aria-label="Copy error message">
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default ErrorComponent;