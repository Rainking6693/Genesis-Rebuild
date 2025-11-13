import React, { FC, ReactNode, useId } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
  errorType?: string; // Add errorType for better understanding of the error
  isVisible?: boolean; // Add isVisible to control the visibility of the error component
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorType, isVisible = true }) => {
  const id = useId(); // Generate a unique id for the error component for better accessibility

  if (!isVisible) return null; // Return null if the error component is hidden

  return (
    <div id={id} className="error-message" role="alert">
      <p>{errorMessage}</p>
      {errorType && <span className="error-type"> ({errorType})</span>}
      <button type="button" aria-label="Close error message" onClick={() => isVisible && setVisibility(false)}>X</button>
    </div>
  );

  // Add a state hook to control the visibility of the error component
  const [visibility, setVisibility] = React.useState(isVisible);
};

export default ErrorComponent;

import React, { FC, ReactNode, useId } from 'react';

interface Props {
  errorMessage: string; // Use errorMessage instead of message for better semantics
  errorType?: string; // Add errorType for better understanding of the error
  isVisible?: boolean; // Add isVisible to control the visibility of the error component
}

const ErrorComponent: FC<Props> = ({ errorMessage, errorType, isVisible = true }) => {
  const id = useId(); // Generate a unique id for the error component for better accessibility

  if (!isVisible) return null; // Return null if the error component is hidden

  return (
    <div id={id} className="error-message" role="alert">
      <p>{errorMessage}</p>
      {errorType && <span className="error-type"> ({errorType})</span>}
      <button type="button" aria-label="Close error message" onClick={() => isVisible && setVisibility(false)}>X</button>
    </div>
  );

  // Add a state hook to control the visibility of the error component
  const [visibility, setVisibility] = React.useState(isVisible);
};

export default ErrorComponent;