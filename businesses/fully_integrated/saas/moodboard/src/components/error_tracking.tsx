import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useErrorTracker } from './useErrorTracker';

interface Props {
  children: React.ReactNode;
}

const MyComponent: React.FC<Props> = ({ children }) => {
  const { trackError } = useErrorTracker();
  const [componentName, setComponentName] = useState('MyComponent');

  useEffect(() => {
    let componentNameToSet: string;

    if (typeof children === 'string') {
      componentNameToSet = children;
    } else {
      componentNameToSet = children.type.name || 'AnonymousComponent';
    }

    setComponentName(componentNameToSet);
    trackError(componentNameToSet);
  }, [children, trackError]);

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error) => {
        trackError(error.componentName || componentName);
        console.error(error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

const ErrorFallback = ({ error }: { error: { componentName: string; message: string } }) => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <h2>An error occurred in {error.componentName}:</h2>
      <pre>{error.message}</pre>
      <a href="#error-container" onClick={handleScrollToTop}>Back to top</a>
      <div id="error-container">{children}</div>
    </div>
  );
};

ErrorFallback.displayName = 'ErrorFallback';

export default MyComponent;

Changes made:

1. Added a check to determine the component name when the children are not a string. This allows for more flexibility when using the component with different child components.

2. Updated the `onError` function in the `ErrorBoundary` to store the component name if it's available. This helps with identifying the source of the error.

3. Added a unique `id` to the error container in the `ErrorFallback` component, which makes it easier to scroll to the error message.

4. Added an event listener to the back-to-top link to scroll the page to the top when clicked, using the `behavior: 'smooth'` option for a smoother scrolling experience.

5. Renamed the `ErrorFallback` component's displayName for better maintainability.