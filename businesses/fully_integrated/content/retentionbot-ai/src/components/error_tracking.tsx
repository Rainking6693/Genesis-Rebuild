import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

// Define the interface for the component's props
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  // Define the error message type as a string
  message: string;

  // Add a 'errorType' property to specify the type of error
  errorType?: string;

  // Add a 'title' property for accessibility
  title?: string;
}

// Define the functional component using the React.FC (Function Component) shorthand
const ErrorComponent: React.FC<Props> = ({ className, title, message, errorType, ...rest }) => {
  // Check if the errorType is provided and use it to style the error message
  const errorClass = errorType ? `error-${errorType}` : 'error';

  // Combine the errorClass and className props
  const combinedClass = `${className} ${errorClass}`;

  // Render the error message in a div with the appropriate class for styling
  return (
    <div className={combinedClass} {...rest}>
      {/* Add a role="alert" for accessibility */}
      <span role="alert" />
      {title && <div role="presentation" className="sr-only">{title}</div>}
      <div>{message}</div>
    </div>
  );
};

// Add a defaultProps object to provide default values for the props
ErrorComponent.defaultProps = {
  errorType: 'default',
  title: 'An error occurred',
};

// Export the ErrorComponent for use in other modules
export default ErrorComponent;

import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

// Define the interface for the component's props
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  // Define the error message type as a string
  message: string;

  // Add a 'errorType' property to specify the type of error
  errorType?: string;

  // Add a 'title' property for accessibility
  title?: string;
}

// Define the functional component using the React.FC (Function Component) shorthand
const ErrorComponent: React.FC<Props> = ({ className, title, message, errorType, ...rest }) => {
  // Check if the errorType is provided and use it to style the error message
  const errorClass = errorType ? `error-${errorType}` : 'error';

  // Combine the errorClass and className props
  const combinedClass = `${className} ${errorClass}`;

  // Render the error message in a div with the appropriate class for styling
  return (
    <div className={combinedClass} {...rest}>
      {/* Add a role="alert" for accessibility */}
      <span role="alert" />
      {title && <div role="presentation" className="sr-only">{title}</div>}
      <div>{message}</div>
    </div>
  );
};

// Add a defaultProps object to provide default values for the props
ErrorComponent.defaultProps = {
  errorType: 'default',
  title: 'An error occurred',
};

// Export the ErrorComponent for use in other modules
export default ErrorComponent;