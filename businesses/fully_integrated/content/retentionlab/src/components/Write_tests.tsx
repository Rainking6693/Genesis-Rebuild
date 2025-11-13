import React, { PropsWithChildren, forwardRef, ReactNode } from 'react';

// Interface for props, defining the required message property, children for edge cases, className, as, and testId for accessibility
interface Props extends PropsWithChildren {
  message: string;
  className?: string;
  as?: React.ElementType;
  testId?: string;
}

// Functional component with a type annotation for props
const MyComponent = forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
  const { children, message, className, as: Component = 'div', testId: componentTestId } = props;

  // Generate a unique testId for the message div
  const messageTestId = `my-component-message-${Math.random().toString(36).substring(7)}`;

  // Render the message within a div with a data-testid attribute for testing purposes
  return (
    <Component ref={ref} className={className} data-testid={componentTestId}>
      {children}
      <div data-testid={messageTestId}>{message}</div>
    </Component>
  );
});

// Add a defaultProps object to provide default values for props
MyComponent.defaultProps = {
  message: '',
};

// Add a displayName for easier debugging and identification in React DevTools
MyComponent.displayName = 'MyComponent';

// Export the component for use in other modules
export default MyComponent;

import React from 'react';
import MyComponent from './MyComponent';

const App: React.FC = () => {
  return (
    <div>
      <MyComponent message="Hello, World!" testId="app" />
      {/* Other components */}
    </div>
  );
};

export default App;

import React, { PropsWithChildren, forwardRef, ReactNode } from 'react';

// Interface for props, defining the required message property, children for edge cases, className, as, and testId for accessibility
interface Props extends PropsWithChildren {
  message: string;
  className?: string;
  as?: React.ElementType;
  testId?: string;
}

// Functional component with a type annotation for props
const MyComponent = forwardRef<HTMLDivElement, Props>((props: Props, ref) => {
  const { children, message, className, as: Component = 'div', testId: componentTestId } = props;

  // Generate a unique testId for the message div
  const messageTestId = `my-component-message-${Math.random().toString(36).substring(7)}`;

  // Render the message within a div with a data-testid attribute for testing purposes
  return (
    <Component ref={ref} className={className} data-testid={componentTestId}>
      {children}
      <div data-testid={messageTestId}>{message}</div>
    </Component>
  );
});

// Add a defaultProps object to provide default values for props
MyComponent.defaultProps = {
  message: '',
};

// Add a displayName for easier debugging and identification in React DevTools
MyComponent.displayName = 'MyComponent';

// Export the component for use in other modules
export default MyComponent;

import React from 'react';
import MyComponent from './MyComponent';

const App: React.FC = () => {
  return (
    <div>
      <MyComponent message="Hello, World!" testId="app" />
      {/* Other components */}
    </div>
  );
};

export default App;