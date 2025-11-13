import React, { useState, useEffect } from 'react';

interface Props {
  errorDescription: string;
  errorType?: string;
}

const ErrorComponent: React.FC<Props> = ({ errorDescription, errorType }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyErrorAttempt, setCopyErrorAttempt] = useState(0);

  const copyToClipboard = () => {
    setCopyErrorAttempt(prevAttempt => prevAttempt + 1);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(errorDescription).then(
        () => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        },
        () => {
          // Handle error when copying to clipboard
          console.error('Error copying error message to clipboard');
        }
      );
    } else {
      // Handle case when clipboard API is not supported
      console.error('Clipboard API is not supported');
    }
  };

  useEffect(() => {
    if (copyErrorAttempt > 3) {
      // Prevent spamming the clipboard API
      setCopyErrorAttempt(0);
      console.error('Maximum clipboard copy attempts reached');
    }
  }, [copyErrorAttempt]);

  return (
    <div className="error-message" role="alert">
      <p className="error-description">{errorDescription}</p>
      {errorType && <p className="error-type">{errorType}</p>}
      <button onClick={copyToClipboard} aria-label="Copy error message">
        {isCopied ? 'Copied!' : 'Copy error message'}
      </button>
    </div>
  );
};

ErrorComponent.defaultProps = {
  errorType: '',
};

export default ErrorComponent;

import React, { useState, useEffect } from 'react';

interface Props {
  errorDescription: string;
  errorType?: string;
}

const ErrorComponent: React.FC<Props> = ({ errorDescription, errorType }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [copyErrorAttempt, setCopyErrorAttempt] = useState(0);

  const copyToClipboard = () => {
    setCopyErrorAttempt(prevAttempt => prevAttempt + 1);

    if (navigator.clipboard) {
      navigator.clipboard.writeText(errorDescription).then(
        () => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        },
        () => {
          // Handle error when copying to clipboard
          console.error('Error copying error message to clipboard');
        }
      );
    } else {
      // Handle case when clipboard API is not supported
      console.error('Clipboard API is not supported');
    }
  };

  useEffect(() => {
    if (copyErrorAttempt > 3) {
      // Prevent spamming the clipboard API
      setCopyErrorAttempt(0);
      console.error('Maximum clipboard copy attempts reached');
    }
  }, [copyErrorAttempt]);

  return (
    <div className="error-message" role="alert">
      <p className="error-description">{errorDescription}</p>
      {errorType && <p className="error-type">{errorType}</p>}
      <button onClick={copyToClipboard} aria-label="Copy error message">
        {isCopied ? 'Copied!' : 'Copy error message'}
      </button>
    </div>
  );
};

ErrorComponent.defaultProps = {
  errorType: '',
};

export default ErrorComponent;