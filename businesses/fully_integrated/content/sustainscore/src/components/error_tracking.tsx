import React, { useState, useEffect, ReactNode } from 'react';

interface ErrorTrackingProps {
  title: string;
  content: string;
  onError?: (error: Error) => void;
  fallbackComponent?: ReactNode;
}

const ErrorTracking: React.FC<ErrorTrackingProps> = ({
  title,
  content,
  onError = () => {},
  fallbackComponent = (
    <div className="error-tracking">
      <h2 className="error-tracking__title">Error</h2>
      <p className="error-tracking__message">An unexpected error occurred.</p>
    </div>
  ),
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setHasError(false);
    setErrorMessage('');

    try {
      // Wrap the rendering of the MyComponent in a try-catch block
      // to handle any potential errors
      <MyComponent title={title} content={content} />;
    } catch (error) {
      // Set the error state and call the onError callback
      setHasError(true);
      setErrorMessage((error as Error).message);
      onError(error as Error);
    }
  }, [title, content, onError]);

  if (hasError) {
    return (
      <div className="error-tracking" role="alert" aria-live="assertive">
        <h2 className="error-tracking__title">Error</h2>
        <p className="error-tracking__message">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="error-tracking">
      <MyComponent title={title} content={content} />
    </div>
  );
};

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  return (
    <div className="my-component" aria-label={title}>
      <h2 className="my-component__title">{title}</h2>
      <p className="my-component__content">{content}</p>
    </div>
  );
};

export default ErrorTracking;

import React, { useState, useEffect, ReactNode } from 'react';

interface ErrorTrackingProps {
  title: string;
  content: string;
  onError?: (error: Error) => void;
  fallbackComponent?: ReactNode;
}

const ErrorTracking: React.FC<ErrorTrackingProps> = ({
  title,
  content,
  onError = () => {},
  fallbackComponent = (
    <div className="error-tracking">
      <h2 className="error-tracking__title">Error</h2>
      <p className="error-tracking__message">An unexpected error occurred.</p>
    </div>
  ),
}) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setHasError(false);
    setErrorMessage('');

    try {
      // Wrap the rendering of the MyComponent in a try-catch block
      // to handle any potential errors
      <MyComponent title={title} content={content} />;
    } catch (error) {
      // Set the error state and call the onError callback
      setHasError(true);
      setErrorMessage((error as Error).message);
      onError(error as Error);
    }
  }, [title, content, onError]);

  if (hasError) {
    return (
      <div className="error-tracking" role="alert" aria-live="assertive">
        <h2 className="error-tracking__title">Error</h2>
        <p className="error-tracking__message">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="error-tracking">
      <MyComponent title={title} content={content} />
    </div>
  );
};

interface MyComponentProps {
  title: string;
  content: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, content }) => {
  return (
    <div className="my-component" aria-label={title}>
      <h2 className="my-component__title">{title}</h2>
      <p className="my-component__content">{content}</p>
    </div>
  );
};

export default ErrorTracking;