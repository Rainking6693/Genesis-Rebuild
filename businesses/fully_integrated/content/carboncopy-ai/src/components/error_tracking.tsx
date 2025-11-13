import React, { ReactNode } from 'react';

type Props = {
  message: string;
  isErrorMessage?: boolean; // Add optional property to differentiate error messages
  children?: React.ReactNode; // Allow for additional content within the error message
};

const ErrorMessageClass = 'error-message';
const SuccessMessageClass = 'success-message';

const FunctionalComponent: React.FC<Props> = ({ message, isErrorMessage = false, children }) => {
  const messageClass = isErrorMessage ? ErrorMessageClass : SuccessMessageClass;

  if (!message && !children) {
    return null; // Return early if no message or children are provided
  }

  return (
    <div className={messageClass} role="alert">
      {children || message}
    </div>
  );
};

export default FunctionalComponent;

import React, { ReactNode } from 'react';

type Props = {
  message: string;
  isErrorMessage?: boolean; // Add optional property to differentiate error messages
  children?: React.ReactNode; // Allow for additional content within the error message
};

const ErrorMessageClass = 'error-message';
const SuccessMessageClass = 'success-message';

const FunctionalComponent: React.FC<Props> = ({ message, isErrorMessage = false, children }) => {
  const messageClass = isErrorMessage ? ErrorMessageClass : SuccessMessageClass;

  if (!message && !children) {
    return null; // Return early if no message or children are provided
  }

  return (
    <div className={messageClass} role="alert">
      {children || message}
    </div>
  );
};

export default FunctionalComponent;