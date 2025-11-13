import React, { FC, useContext, useState } from 'react';
import { ErrorContext } from './ErrorContext';

interface MyComponentProps {
  name: string;
}

const MyComponent: FC<MyComponentProps> = ({ name }) => {
  const { logError } = useContext(ErrorContext);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleError = (error: Error) => {
    logError(error);
    setErrorMessage(error.message);
    setHasError(true);
  };

  // Log the name for debugging purposes
  React.useEffect(() => {
    console.log(`Rendering MyComponent with name: ${name}`);
  }, [name]);

  // Check if the name is empty or null before rendering
  if (!name) {
    handleError(new Error('Name is required'));
    return <h1 data-testid="name-error">Error: Name is required</h1>;
  }

  return (
    <div>
      {hasError && <p data-testid="error-message">{errorMessage || 'An error occurred'}</p>}
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default MyComponent;

import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ErrorContextValue {
  logError: (error: Error) => void;
}

const ErrorContext = createContext<ErrorContextValue>({
  logError: () => {},
});

interface ErrorContextProviderProps {
  children: ReactNode;
}

const ErrorContextProvider: React.FC<ErrorContextProviderProps> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  const logError = (error: Error) => {
    setError(error);
    console.error(error);
  };

  return (
    <ErrorContext.Provider value={{ logError }}>
      {children}
      {error && <div data-testid="error-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <h1>An error occurred:</h1>
          <pre>{error.message}</pre>
        </div>
      </div>}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => useContext(ErrorContext);
export default ErrorContextProvider;

import React, { FC, useContext, useState } from 'react';
import { ErrorContext } from './ErrorContext';

interface MyComponentProps {
  name: string;
}

const MyComponent: FC<MyComponentProps> = ({ name }) => {
  const { logError } = useContext(ErrorContext);
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleError = (error: Error) => {
    logError(error);
    setErrorMessage(error.message);
    setHasError(true);
  };

  // Log the name for debugging purposes
  React.useEffect(() => {
    console.log(`Rendering MyComponent with name: ${name}`);
  }, [name]);

  // Check if the name is empty or null before rendering
  if (!name) {
    handleError(new Error('Name is required'));
    return <h1 data-testid="name-error">Error: Name is required</h1>;
  }

  return (
    <div>
      {hasError && <p data-testid="error-message">{errorMessage || 'An error occurred'}</p>}
      <h1>Hello, {name}!</h1>
    </div>
  );
};

export default MyComponent;

import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ErrorContextValue {
  logError: (error: Error) => void;
}

const ErrorContext = createContext<ErrorContextValue>({
  logError: () => {},
});

interface ErrorContextProviderProps {
  children: ReactNode;
}

const ErrorContextProvider: React.FC<ErrorContextProviderProps> = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  const logError = (error: Error) => {
    setError(error);
    console.error(error);
  };

  return (
    <ErrorContext.Provider value={{ logError }}>
      {children}
      {error && <div data-testid="error-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <h1>An error occurred:</h1>
          <pre>{error.message}</pre>
        </div>
      </div>}
    </ErrorContext.Provider>
  );
};

export const useErrorContext = () => useContext(ErrorContext);
export default ErrorContextProvider;

ErrorContext.ts: