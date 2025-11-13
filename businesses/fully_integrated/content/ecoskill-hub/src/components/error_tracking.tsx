import React, { PropsWithChildren } from 'react';

interface ErrorMessageProps {
  errorMessage: string; // Rename 'message' to 'errorMessage' for better semantics
}

interface CustomError extends Error {
  info?: Record<string, any>; // Use Record for better type safety and flexibility
}

const ErrorComponent: React.FC<ErrorMessageProps> = ({ errorMessage, children }) => {
  return (
    <div className="error-message" role="alert">
      {errorMessage && <p>{errorMessage}</p>}
      {children}
    </div>
  );
};

const CustomErrorComponent: React.FC<PropsWithChildren<CustomError>> = ({ errorMessage, info, children }) => {
  return (
    <ErrorComponent errorMessage={errorMessage}>
      {info && <pre>{JSON.stringify(info, null, 2)}</pre>}
      {children}
    </ErrorComponent>
  );
};

CustomErrorComponent.displayName = 'CustomErrorComponent'; // Provide a displayName for easier debugging

export { ErrorComponent, CustomErrorComponent };

// Import the CustomErrorComponent in the other file
import React from 'react';
import { CustomErrorComponent } from './ErrorComponent';

interface Props {
  error?: CustomError | null; // Make error optional and nullable
}

const MyComponent: React.FC<Props> = ({ error }) => {
  if (error) {
    return <CustomErrorComponent errorMessage={error.message} info={error.info || {}} />; // Provide default info object when it's not present
  }

  return <div role="status">No error found</div>; // Use role="status" for better accessibility
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface ErrorMessageProps {
  errorMessage: string; // Rename 'message' to 'errorMessage' for better semantics
}

interface CustomError extends Error {
  info?: Record<string, any>; // Use Record for better type safety and flexibility
}

const ErrorComponent: React.FC<ErrorMessageProps> = ({ errorMessage, children }) => {
  return (
    <div className="error-message" role="alert">
      {errorMessage && <p>{errorMessage}</p>}
      {children}
    </div>
  );
};

const CustomErrorComponent: React.FC<PropsWithChildren<CustomError>> = ({ errorMessage, info, children }) => {
  return (
    <ErrorComponent errorMessage={errorMessage}>
      {info && <pre>{JSON.stringify(info, null, 2)}</pre>}
      {children}
    </ErrorComponent>
  );
};

CustomErrorComponent.displayName = 'CustomErrorComponent'; // Provide a displayName for easier debugging

export { ErrorComponent, CustomErrorComponent };

// Import the CustomErrorComponent in the other file
import React from 'react';
import { CustomErrorComponent } from './ErrorComponent';

interface Props {
  error?: CustomError | null; // Make error optional and nullable
}

const MyComponent: React.FC<Props> = ({ error }) => {
  if (error) {
    return <CustomErrorComponent errorMessage={error.message} info={error.info || {}} />; // Provide default info object when it's not present
  }

  return <div role="status">No error found</div>; // Use role="status" for better accessibility
};

export default MyComponent;