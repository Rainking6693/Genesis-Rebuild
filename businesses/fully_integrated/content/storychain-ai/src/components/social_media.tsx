import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = isError ? 'error-message' : 'normal-message';

  return (
    <div className={className}>
      {message}
      <a href="#" aria-label="Report an issue">
        🚨
      </a>
    </div>
  );
};

export default MyComponent;

// Add a custom CSS class for error messages
const errorMessageStyle = {
  color: 'red',
  fontWeight: 'bold',
};

// Update the component to use the custom CSS class for error messages
const MyComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = isError ? 'error-message' : 'normal-message';

  return (
    <div className={className} style={isError ? errorMessageStyle : undefined}>
      {message}
      <a href="#" aria-label="Report an issue">
        🚨
      </a>
    </div>
  );
};

export default MyComponent;

import React, { PropsWithChildren } from 'react';

interface Props {
  message: string;
  isError?: boolean;
}

const MyComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = isError ? 'error-message' : 'normal-message';

  return (
    <div className={className}>
      {message}
      <a href="#" aria-label="Report an issue">
        🚨
      </a>
    </div>
  );
};

export default MyComponent;

// Add a custom CSS class for error messages
const errorMessageStyle = {
  color: 'red',
  fontWeight: 'bold',
};

// Update the component to use the custom CSS class for error messages
const MyComponent: React.FC<Props> = ({ message, isError = false }) => {
  const className = isError ? 'error-message' : 'normal-message';

  return (
    <div className={className} style={isError ? errorMessageStyle : undefined}>
      {message}
      <a href="#" aria-label="Report an issue">
        🚨
      </a>
    </div>
  );
};

export default MyComponent;