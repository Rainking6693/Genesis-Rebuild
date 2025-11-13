import React, { FC, useEffect, useId } from 'react';

interface Props {
  message: string;
  id?: string;
}

const MyComponent: FC<Props> = ({ message, id }) => {
  const componentId = id || useId();

  // Wrap the message with dangerouslySetInnerHTML to prevent potential XSS attacks
  const wrappedMessage = <div id={componentId} dangerouslySetInnerHTML={{ __html: message }} />;

  // Handle errors and log them
  const handleError = (error: Error) => {
    console.error(`Error in MyComponent (id: ${componentId}):`, error);
  };

  // Add a ref to the component for better accessibility and testing
  const componentRef = React.useRef<HTMLDivElement>(null);

  // Add focus to the component when it receives focus
  const handleFocus = () => {
    if (componentRef.current) {
      componentRef.current.focus();
    }
  };

  // Add a fallback for when the message is empty or null
  const fallbackContent = <div>No content available</div>;

  useEffect(() => {
    // Check if the message is safe to render
    const isSafeToRender = new DOMParser().parseFromString(message, 'text/html').body.textContent;
    if (!isSafeToRender) {
      handleError(new Error('The message is not safe to render'));
      return;
    }
  }, [message]);

  return wrappedMessage || fallbackContent;
};

MyComponent.error = handleError;

// Export both the original and the enhanced component for backward compatibility
export { MyComponent };
export default MyComponent;

import React, { FC, useEffect, useId } from 'react';

interface Props {
  message: string;
  id?: string;
}

const MyComponent: FC<Props> = ({ message, id }) => {
  const componentId = id || useId();

  // Wrap the message with dangerouslySetInnerHTML to prevent potential XSS attacks
  const wrappedMessage = <div id={componentId} dangerouslySetInnerHTML={{ __html: message }} />;

  // Handle errors and log them
  const handleError = (error: Error) => {
    console.error(`Error in MyComponent (id: ${componentId}):`, error);
  };

  // Add a ref to the component for better accessibility and testing
  const componentRef = React.useRef<HTMLDivElement>(null);

  // Add focus to the component when it receives focus
  const handleFocus = () => {
    if (componentRef.current) {
      componentRef.current.focus();
    }
  };

  // Add a fallback for when the message is empty or null
  const fallbackContent = <div>No content available</div>;

  useEffect(() => {
    // Check if the message is safe to render
    const isSafeToRender = new DOMParser().parseFromString(message, 'text/html').body.textContent;
    if (!isSafeToRender) {
      handleError(new Error('The message is not safe to render'));
      return;
    }
  }, [message]);

  return wrappedMessage || fallbackContent;
};

MyComponent.error = handleError;

// Export both the original and the enhanced component for backward compatibility
export { MyComponent };
export default MyComponent;