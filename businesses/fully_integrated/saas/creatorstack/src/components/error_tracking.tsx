import React, { useState, useEffect, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren<{ message: string; error?: Error }> {
  // Add a unique component name for better debugging and accessibility
  componentName: string;
}

const ErrorTrackingComponent: React.FC<Props> = ({ message, error, componentName }) => {

  // Use a constant for the component name
  const COMPONENT_NAME = 'ErrorTrackingComponent';

  // Use a default value for the componentName prop
  const componentNameToUse = componentName || COMPONENT_NAME;

  // Add a role attribute for better accessibility
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    if (error) {
      setErrorDetails(error.message);
    }
  }, [error]);

  return (
    <div role="alert" data-testid={componentNameToUse}>
      {message}
      {errorDetails && (
        <div>
          <br />
          Error Details:
          <br />
          {errorDetails}
        </div>
      )}
    </div>
  );
};

// Add error handling for edge cases
ErrorTrackingComponent.defaultProps = {
  componentName: COMPONENT_NAME,
  error: new Error('No error provided'),
};

// Add export default for better module handling
export default ErrorTrackingComponent;

import React, { useState, useEffect, PropsWithChildren } from 'react';

interface Props extends PropsWithChildren<{ message: string; error?: Error }> {
  // Add a unique component name for better debugging and accessibility
  componentName: string;
}

const ErrorTrackingComponent: React.FC<Props> = ({ message, error, componentName }) => {

  // Use a constant for the component name
  const COMPONENT_NAME = 'ErrorTrackingComponent';

  // Use a default value for the componentName prop
  const componentNameToUse = componentName || COMPONENT_NAME;

  // Add a role attribute for better accessibility
  const [errorDetails, setErrorDetails] = useState('');

  useEffect(() => {
    if (error) {
      setErrorDetails(error.message);
    }
  }, [error]);

  return (
    <div role="alert" data-testid={componentNameToUse}>
      {message}
      {errorDetails && (
        <div>
          <br />
          Error Details:
          <br />
          {errorDetails}
        </div>
      )}
    </div>
  );
};

// Add error handling for edge cases
ErrorTrackingComponent.defaultProps = {
  componentName: COMPONENT_NAME,
  error: new Error('No error provided'),
};

// Add export default for better module handling
export default ErrorTrackingComponent;