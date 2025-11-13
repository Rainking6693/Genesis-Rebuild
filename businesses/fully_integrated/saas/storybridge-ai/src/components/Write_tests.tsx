import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

// Define the interface for the component's props
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  // Define the message property as a required string
  message: string;

  // Add a className property to customize the component's CSS class
  className?: string;

  // Add a testId property for testing purposes
  testId?: string;
}

// Define the functional component using the React.FC (Function Component) utility type
const MyComponent: React.FC<Props> = ({ message, className, testId, ...rest }) => {
  // Render the message inside a div with the provided className, testId, and other HTML attributes
  return (
    <div data-testid={testId} className={className} {...rest}>
      {message}
    </div>
  );
};

// Add a defaultProps object to provide default values for optional props
MyComponent.defaultProps = {
  className: '',
  testId: 'my-component',
};

// Add a propTypes object to validate the props
MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

// Export the MyComponent for use in other modules
export default MyComponent;

import React, { PropsWithChildren, DetailedHTMLProps, HTMLAttributes } from 'react';

// Define the interface for the component's props
interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  // Define the message property as a required string
  message: string;

  // Add a className property to customize the component's CSS class
  className?: string;

  // Add a testId property for testing purposes
  testId?: string;
}

// Define the functional component using the React.FC (Function Component) utility type
const MyComponent: React.FC<Props> = ({ message, className, testId, ...rest }) => {
  // Render the message inside a div with the provided className, testId, and other HTML attributes
  return (
    <div data-testid={testId} className={className} {...rest}>
      {message}
    </div>
  );
};

// Add a defaultProps object to provide default values for optional props
MyComponent.defaultProps = {
  className: '',
  testId: 'my-component',
};

// Add a propTypes object to validate the props
MyComponent.propTypes = {
  message: PropTypes.string.isRequired,
};

// Export the MyComponent for use in other modules
export default MyComponent;