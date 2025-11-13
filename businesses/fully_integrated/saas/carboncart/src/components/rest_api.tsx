import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

type AllowedProps = 'message';
type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message?: string;
  children?: ReactNode;
};

const MyComponent: React.FC<Props> = ({ message, children, ...rest }) => {
  // Check if 'message' prop is provided and set a default value if not
  const finalMessage = message || 'No message provided';

  // Add accessibility by wrapping the message with a <p> tag
  return (
    <div {...rest}>
      <p>{finalMessage}</p>
      {children}
    </div>
  );
};

// Add a displayName for easier debugging and identification
MyComponent.displayName = 'MyComponent';

// Handle edge cases by providing a fallback message when children are not provided
MyComponent.defaultProps = {
  children: <div>No children provided</div>,
};

export default MyComponent;

import React, { ReactNode, DetailedHTMLProps, HTMLAttributes } from 'react';

type AllowedProps = 'message';
type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  message?: string;
  children?: ReactNode;
};

const MyComponent: React.FC<Props> = ({ message, children, ...rest }) => {
  // Check if 'message' prop is provided and set a default value if not
  const finalMessage = message || 'No message provided';

  // Add accessibility by wrapping the message with a <p> tag
  return (
    <div {...rest}>
      <p>{finalMessage}</p>
      {children}
    </div>
  );
};

// Add a displayName for easier debugging and identification
MyComponent.displayName = 'MyComponent';

// Handle edge cases by providing a fallback message when children are not provided
MyComponent.defaultProps = {
  children: <div>No children provided</div>,
};

export default MyComponent;