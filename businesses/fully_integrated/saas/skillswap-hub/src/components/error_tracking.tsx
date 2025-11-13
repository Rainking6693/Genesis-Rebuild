import React, { FC, useEffect, useState } from 'react';

interface Props {
  errorTitle: string; // Use a more descriptive name for the prop
  errorDescription: string; // Add a separate prop for error description
  errorId?: string; // Add optional errorId for better tracking
}

const ErrorTrackingComponent: FC<Props> = ({ errorTitle, errorDescription, errorId }) => {
  const [isCopied, setIsCopied] = useState(false);

  // Add a unique key for the div to improve performance
  const uniqueKey = useUniqueKey();

  // Function to generate a unique key
  const useUniqueKey = () => {
    const [key, setKey] = useState(0);
    useEffect(() => {
      setKey((prevKey) => prevKey + 1);
    }, []);
    return key;
  };

  // Function to copy the error message to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${errorTitle}: ${errorDescription}`);
    setIsCopied(true);
  };

  // Add a copy button for the error message
  return (
    <div className="error-tracking-component" aria-label="Error tracking component">
      <div className="error-message" id={errorId || uniqueKey}>
        <h2 className="error-title">{errorTitle}</h2>
        <p className="error-description">{errorDescription}</p>
      </div>
      <button className="copy-button" onClick={copyToClipboard} aria-label="Copy error" tabIndex={0}>
        {isCopied ? 'Copied!' : 'Copy Error'}
      </button>
    </div>
  );
};

export default ErrorTrackingComponent;

import React, { FC, useEffect, useState } from 'react';

interface Props {
  errorTitle: string; // Use a more descriptive name for the prop
  errorDescription: string; // Add a separate prop for error description
  errorId?: string; // Add optional errorId for better tracking
}

const ErrorTrackingComponent: FC<Props> = ({ errorTitle, errorDescription, errorId }) => {
  const [isCopied, setIsCopied] = useState(false);

  // Add a unique key for the div to improve performance
  const uniqueKey = useUniqueKey();

  // Function to generate a unique key
  const useUniqueKey = () => {
    const [key, setKey] = useState(0);
    useEffect(() => {
      setKey((prevKey) => prevKey + 1);
    }, []);
    return key;
  };

  // Function to copy the error message to the clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${errorTitle}: ${errorDescription}`);
    setIsCopied(true);
  };

  // Add a copy button for the error message
  return (
    <div className="error-tracking-component" aria-label="Error tracking component">
      <div className="error-message" id={errorId || uniqueKey}>
        <h2 className="error-title">{errorTitle}</h2>
        <p className="error-description">{errorDescription}</p>
      </div>
      <button className="copy-button" onClick={copyToClipboard} aria-label="Copy error" tabIndex={0}>
        {isCopied ? 'Copied!' : 'Copy Error'}
      </button>
    </div>
  );
};

export default ErrorTrackingComponent;