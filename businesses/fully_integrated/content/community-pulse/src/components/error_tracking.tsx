import React, { FC, ReactNode, Key } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
  errorType?: string; // Add errorType to provide more context about the error
  errorId?: string; // Add errorId for unique identification of each error
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorType, errorId }: Props) => {
  return (
    <div className="error-message" role="alert" aria-labelledby={`error-${errorId}`}>
      {errorType && <span className="error-type" id={`error-type-${errorId}`}>{errorType}</span>}
      {errorMessage}
    </div>
  );
};

// Add a unique key for each rendered element to improve performance
const MyComponent: FC<Props> = ({ errorMessage, errorType, errorId }) => {
  const key = errorId || `${errorMessage}-${errorType || 'unknown'}`; // Generate a key based on errorId, errorMessage, and errorType
  return <div key={key}>{errorMessage ? <ErrorComponent errorMessage={errorMessage} errorType={errorType} errorId={errorId} /> : null}</div>;
};

// Use TypeScript's built-in PropTypes for type checking
import PropTypes from 'prop-types';

ErrorComponent.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  errorType: PropTypes.string,
  errorId: PropTypes.string,
};

MyComponent.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  errorType: PropTypes.string,
  errorId: PropTypes.string,
};

export default MyComponent;

import React, { FC, ReactNode, Key } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
  errorType?: string; // Add errorType to provide more context about the error
  errorId?: string; // Add errorId for unique identification of each error
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorType, errorId }: Props) => {
  return (
    <div className="error-message" role="alert" aria-labelledby={`error-${errorId}`}>
      {errorType && <span className="error-type" id={`error-type-${errorId}`}>{errorType}</span>}
      {errorMessage}
    </div>
  );
};

// Add a unique key for each rendered element to improve performance
const MyComponent: FC<Props> = ({ errorMessage, errorType, errorId }) => {
  const key = errorId || `${errorMessage}-${errorType || 'unknown'}`; // Generate a key based on errorId, errorMessage, and errorType
  return <div key={key}>{errorMessage ? <ErrorComponent errorMessage={errorMessage} errorType={errorType} errorId={errorId} /> : null}</div>;
};

// Use TypeScript's built-in PropTypes for type checking
import PropTypes from 'prop-types';

ErrorComponent.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  errorType: PropTypes.string,
  errorId: PropTypes.string,
};

MyComponent.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  errorType: PropTypes.string,
  errorId: PropTypes.string,
};

export default MyComponent;