import React, { FC, useEffect, useMemo, useState } from 'react';
import { logError } from './error-logging';
import { useTheme } from '@mui/material/styles';

// Custom hook for handling dark mode
function useDarkMode() {
  const theme = useTheme();
  return theme.palette.mode === 'dark';
}

// Custom hook for handling error state
function useError() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (navigator.onLine) {
      // Your component logic here
    } else {
      setError(new Error('No internet connection'));
      logError(error);
    }
  }, []);

  return error;
}

// Component for displaying a message with dark mode support
const MessageComponent: FC<{ message: string; error?: Error | null }> = ({ message, error }) => {
  const darkMode = useDarkMode();
  const className = `stresslens-message ${darkMode ? 'dark' : ''}`;

  const errorMessage = error ? <div className="error-message">{error.message}</div> : null;

  const memoizedComponent = useMemo(() => {
    return (
      <>
        {errorMessage}
        <div className={className}>{message}</div>
      </>
    );
  }, [message, error, darkMode]);

  return memoizedComponent;
};

// Main component for handling errors and business logic
const MyComponent: FC<{ message: string }> = ({ message }) => {
  const error = useError();

  return <MessageComponent message={message} error={error} />;
};

export default MyComponent;

import React, { FC, useEffect, useMemo, useState } from 'react';
import { logError } from './error-logging';
import { useTheme } from '@mui/material/styles';

// Custom hook for handling dark mode
function useDarkMode() {
  const theme = useTheme();
  return theme.palette.mode === 'dark';
}

// Custom hook for handling error state
function useError() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (navigator.onLine) {
      // Your component logic here
    } else {
      setError(new Error('No internet connection'));
      logError(error);
    }
  }, []);

  return error;
}

// Component for displaying a message with dark mode support
const MessageComponent: FC<{ message: string; error?: Error | null }> = ({ message, error }) => {
  const darkMode = useDarkMode();
  const className = `stresslens-message ${darkMode ? 'dark' : ''}`;

  const errorMessage = error ? <div className="error-message">{error.message}</div> : null;

  const memoizedComponent = useMemo(() => {
    return (
      <>
        {errorMessage}
        <div className={className}>{message}</div>
      </>
    );
  }, [message, error, darkMode]);

  return memoizedComponent;
};

// Main component for handling errors and business logic
const MyComponent: FC<{ message: string }> = ({ message }) => {
  const error = useError();

  return <MessageComponent message={message} error={error} />;
};

export default MyComponent;