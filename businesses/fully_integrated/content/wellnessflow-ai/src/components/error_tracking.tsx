import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

interface ErrorProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  errorTitle?: string;
  errorMessage?: string;
}

const ErrorComponent: React.FC<ErrorProps> = ({ errorTitle = "Error", errorMessage = "An error occurred. Please contact the support team.", className, ...rest }) => {
  return (
    <div className={`error-message ${className}`} role="alert" {...rest}>
      <h2>{errorTitle}</h2>
      <p>{errorMessage}</p>
    </div>
  );
};

ErrorComponent.defaultProps = {
  errorTitle: "Error",
};

export default ErrorComponent;

import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

interface ErrorProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  errorTitle?: string;
  errorMessage?: string;
}

const ErrorComponent: React.FC<ErrorProps> = ({ errorTitle = "Error", errorMessage = "An error occurred. Please contact the support team.", className, ...rest }) => {
  return (
    <div className={`error-message ${className}`} role="alert" {...rest}>
      <h2>{errorTitle}</h2>
      <p>{errorMessage}</p>
    </div>
  );
};

ErrorComponent.defaultProps = {
  errorTitle: "Error",
};

export default ErrorComponent;