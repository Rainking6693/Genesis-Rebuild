import React, { FC, ReactNode } from 'react';

interface Props {
  errorMessage?: string | null | undefined; // Add optional errorMessage for better error handling
  successMessage?: string | null | undefined; // Add optional successMessage for better success feedback
  children?: ReactNode; // Add optional children for more flexible content
}

const isString = (str: any): str is string => typeof str === 'string' || str instanceof String;

const UserAuthComponent: FC<Props> = ({ errorMessage, successMessage, children }) => {
  if (!isString(errorMessage) && errorMessage !== null && errorMessage !== undefined) {
    throw new Error('errorMessage must be a string, null or undefined');
  }

  if (!isString(successMessage) && successMessage !== null && successMessage !== undefined) {
    throw new Error('successMessage must be a string, null or undefined');
  }

  return (
    <div>
      {errorMessage && (
        <div className="error-message" aria-live="polite">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="success-message" aria-hidden="true">
          {successMessage}
        </div>
      )}
      {children}
    </div>
  );
};

export default UserAuthComponent;

import React, { FC, ReactNode } from 'react';

interface Props {
  errorMessage?: string | null | undefined; // Add optional errorMessage for better error handling
  successMessage?: string | null | undefined; // Add optional successMessage for better success feedback
  children?: ReactNode; // Add optional children for more flexible content
}

const isString = (str: any): str is string => typeof str === 'string' || str instanceof String;

const UserAuthComponent: FC<Props> = ({ errorMessage, successMessage, children }) => {
  if (!isString(errorMessage) && errorMessage !== null && errorMessage !== undefined) {
    throw new Error('errorMessage must be a string, null or undefined');
  }

  if (!isString(successMessage) && successMessage !== null && successMessage !== undefined) {
    throw new Error('successMessage must be a string, null or undefined');
  }

  return (
    <div>
      {errorMessage && (
        <div className="error-message" aria-live="polite">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="success-message" aria-hidden="true">
          {successMessage}
        </div>
      )}
      {children}
    </div>
  );
};

export default UserAuthComponent;