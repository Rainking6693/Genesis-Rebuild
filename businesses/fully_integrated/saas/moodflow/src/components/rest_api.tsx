import React, { createContext, useState } from 'react';

interface ErrorContextType {
  error: Error | null;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

export const ErrorContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {},
});

export const ErrorProvider: React.FC = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  const handleError = (error: Error) => {
    setError(error);
  };

  return (
    <ErrorContext.Provider value={{ error, setError: handleError }}>
      {children}
    </ErrorContext.Provider>
  );
};

// MoodFlowAPI.tsx
import React, { FC, useContext } from 'react';
import { ErrorContext } from './ErrorContext';
import { MoodFlowAPIProps } from './types';

interface MoodFlowAPIProps extends MoodFlowAPIProps {
  onError?: (error: Error) => void;
}

const MoodFlowAPI: FC<MoodFlowAPIProps> = ({ message, onError, error }) => {
  const { setError } = useContext(ErrorContext);

  const handleError = (error: Error) => {
    if (onError) onError(error);
    setError(error);
  };

  if (error) {
    // Display an error message if an error occurred
    return <div>An error occurred: {error.message}</div>;
  }

  // Display the API response if no error occurred
  return <div>{message}</div>;
};

MoodFlowAPI.defaultProps = {
  onError: () => {},
};

export default MoodFlowAPI;

// MoodFlowAPI.types.ts
export type MoodFlowAPIProps = {
  message: string;
  onError?: (error: Error) => void;
};

import React from 'react';
import ErrorProvider from './ErrorContext';
import MoodFlowAPI from './MoodFlowAPI';

const App: React.FC = () => {
  // ... your app code here ...

  const handleError = (error: Error) => {
    console.error(error);
    // Handle the error appropriately for your application
  };

  return (
    <ErrorProvider>
      <MoodFlowAPI message="Hello, world!" onError={handleError} error={new Error('An error occurred')} />
    </ErrorProvider>
  );
};

export default App;

In this updated code, I've added an `onError` prop to the `MoodFlowAPI` component, which allows you to customize the error handling behavior for your specific use case. I've also added a default implementation for the `onError` prop in case it's not provided. Additionally, I've moved the error handling logic for the `App` component to a separate function to make the code more maintainable.